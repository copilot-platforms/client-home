-- Script to enable tasks notifications in settings for all that have defaulted to false
UPDATE "Setting"
SET "notifications" = (
  SELECT jsonb_agg(
    CASE
      WHEN notif->>'key' = 'tasks' AND notif->>'show' = 'false'
      THEN jsonb_set(notif, '{show}', 'true'::jsonb)
      ELSE notif
    END
  )
  FROM jsonb_array_elements("notifications"::jsonb) AS notif
)
WHERE EXISTS (
  SELECT 1
  FROM jsonb_array_elements("notifications"::jsonb) AS notif
  WHERE notif->>'key' = 'tasks' AND notif->>'show' = 'false'
);
