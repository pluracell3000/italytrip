import dns from "node:dns/promises";
import { isIP } from "node:net";
import { setTimeout as delay } from "node:timers/promises";
import https from "node:https";
import ipaddr from "ipaddr.js";
import robotsParser from "robots-parser";
export const userAgent = "ItalyFamilyStaysBot/1.0";
export function publicAddress(address: string) {
  try {
    const ip = ipaddr.process(address);
    return ip.range() === "unicast";
  } catch {
    return false;
  }
}
export function validateUrl(raw: string) {
  const u = new URL(raw);
  if (
    u.protocol !== "https:" ||
    u.username ||
    u.password ||
    u.port ||
    u.hostname.endsWith(".local") ||
    !u.hostname.includes(".") ||
    u.hostname === "localhost"
  )
    throw new Error("UNSAFE_URL");
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (isIP(host) && !publicAddress(host)) throw new Error("UNSAFE_ADDRESS");
  return u;
}
export async function safePage(
  raw: string,
  signal: AbortSignal,
  redirects = 0,
): Promise<{ status: number; text: string; url: string }> {
  const u = validateUrl(raw);
  const hostname = u.hostname.replace(/^\[|\]$/g, "");
  const resolver = new dns.Resolver({ timeout: 2000, tries: 1 });
  const cancel = () => resolver.cancel();
  signal.addEventListener("abort", cancel, { once: true });
  let addresses: { address: string; family: number }[] = [];
  try {
    if (signal.aborted) throw new Error("REQUEST_TIMEOUT");
    if (isIP(hostname))
      addresses = [{ address: hostname, family: isIP(hostname) }];
    else {
      const resolved = await Promise.allSettled([
        resolver.resolve4(hostname),
        resolver.resolve6(hostname),
      ]);
      addresses = resolved.flatMap((result, i) =>
        result.status === "fulfilled"
          ? result.value.map((address) => ({
              address,
              family: i === 0 ? 4 : 6,
            }))
          : [],
      );
    }
  } finally {
    signal.removeEventListener("abort", cancel);
  }
  if (!addresses.length || addresses.some((a) => !publicAddress(a.address)))
    throw new Error("UNSAFE_ADDRESS");
  const a = addresses[0];
  return new Promise((resolve, reject) => {
    const req = https.request(
      u,
      {
        method: "GET",
        signal,
        headers: {
          "User-Agent": userAgent,
          Accept: "text/html,text/plain;q=0.9",
        },
        lookup: ((_host: any, _options: any, cb: any) =>
          _options.all ? cb(null, [a]) : cb(null, a.address, a.family)) as any,
      },
      (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode!)) {
          res.resume();
          if (redirects >= 3 || !res.headers.location)
            return reject(new Error("REDIRECT_LIMIT"));
          const target = new URL(res.headers.location, u);
          if (target.origin !== u.origin)
            return reject(new Error("CROSS_ORIGIN_REDIRECT_REQUIRES_REVIEW"));
          safePage(target.toString(), signal, redirects + 1).then(
            resolve,
            reject,
          );
          return;
        }
        const chunks: Buffer[] = [];
        let size = 0;
        res.on("data", (chunk) => {
          size += chunk.length;
          if (size > 1500000) {
            req.destroy(new Error("PAGE_TOO_LARGE"));
            return;
          }
          chunks.push(chunk);
        });
        res.on("end", () =>
          resolve({
            status: res.statusCode || 500,
            text: Buffer.concat(chunks).toString("utf8"),
            url: u.toString(),
          }),
        );
        res.on("error", reject);
      },
    );
    req.on("error", reject);
    req.end();
  });
}
export async function permittedPage(raw: string) {
  const signal = AbortSignal.timeout(12000);
  const u = validateUrl(raw);
  const robots = await safePage(u.origin + "/robots.txt", signal);
  if (robots.status !== 404 && robots.status !== 200)
    throw new Error("ROBOTS_UNAVAILABLE");
  if (robots.status === 200) {
    const r = robotsParser(u.origin + "/robots.txt", robots.text);
    if (r.isAllowed(raw, userAgent) === false)
      throw new Error("ROBOTS_DISALLOWED");
    const delay = r.getCrawlDelay(userAgent);
    if (delay && delay > 0) throw new Error("CRAWL_DELAY_REQUIRES_REVIEW");
  }
  let page = await safePage(raw, signal);
  if ([502, 503, 504].includes(page.status) && !signal.aborted) {
    await delay(250, undefined, { signal });
    page = await safePage(raw, signal);
  }
  return page;
}
