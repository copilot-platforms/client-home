-- Script to replace ALL OCCURANCES of {{client.custom-field-name}} with {{__client__.custom-field-name}}
-- __client__ is used as a dynamic placeholder for custom terminologies
UPDATE "Setting"
SET content = REPLACE(content, '{{client.', '{{__client__.')
WHERE content LIKE '%{{client.%';
