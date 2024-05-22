CREATE TABLE `likes` (
	`user_id` text NOT NULL,
	`movie_id` text NOT NULL,
	PRIMARY KEY(`movie_id`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE no action
);
