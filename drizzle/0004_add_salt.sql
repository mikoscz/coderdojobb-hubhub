ALTER TABLE `users` RENAME COLUMN `hashedPassword` TO `hashed_password`;--> statement-breakpoint
ALTER TABLE users ADD `salt_password` text NOT NULL;