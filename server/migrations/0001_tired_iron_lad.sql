DO $$ BEGIN
 CREATE TYPE "public"."AccessLevel" AS ENUM('PUBLIC', 'PRIVATE', 'CLASSIFIED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."Role" AS ENUM('USER', 'MOD', 'ADMIN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
