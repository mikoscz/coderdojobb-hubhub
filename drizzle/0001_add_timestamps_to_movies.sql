ALTER TABLE movies ADD `created_at` text DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE movies ADD `updated_at` text DEFAULT (CURRENT_TIMESTAMP);