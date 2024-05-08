CREATE TABLE `movies` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`yearOfRelease` integer,
	`added_at` text DEFAULT (CURRENT_TIMESTAMP)
);
