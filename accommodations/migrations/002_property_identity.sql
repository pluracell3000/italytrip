CREATE TABLE property_groups(id text PRIMARY KEY,name text NOT NULL);
ALTER TABLE properties ADD COLUMN group_id text REFERENCES property_groups(id);
CREATE TABLE property_associations(id text PRIMARY KEY,source_id text NOT NULL REFERENCES properties(id),target_id text NOT NULL REFERENCES properties(id),attribution text NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),CHECK(source_id<>target_id));
CREATE TRIGGER immutable_property_associations BEFORE UPDATE OR DELETE ON property_associations FOR EACH ROW EXECUTE FUNCTION immutable_observation();
