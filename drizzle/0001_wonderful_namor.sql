CREATE TABLE "leaderboard_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"run_id" text NOT NULL,
	"client_id" text NOT NULL,
	"handle" text NOT NULL,
	"streak" integer NOT NULL,
	"duration_ms" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "leaderboard_entries_run_id_unique" UNIQUE("run_id")
);
