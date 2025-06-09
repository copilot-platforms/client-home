-- Check the total count of tasks notifications disabled in settings
SELECT count(*)
FROM "Setting"
WHERE EXISTS (
    SELECT 1
    FROM jsonb_array_elements("notifications"::jsonb) AS n
    WHERE n->>'key' = 'tasks' AND n->>'show' = 'false'
);
