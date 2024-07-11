DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('user', 'mod', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_tokens" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "email_tokens_id_token_pk" PRIMARY KEY("id","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "password_reset_tokens_id_token_pk" PRIMARY KEY("id","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "two_factor_tokens" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"email" text NOT NULL,
	"userID" text,
	CONSTRAINT "two_factor_tokens_id_token_pk" PRIMARY KEY("id","token")
);
--> statement-breakpoint
DROP TABLE "authenticator";--> statement-breakpoint
DROP TABLE "session";--> statement-breakpoint
DROP TABLE "verificationToken";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "twoFactorEnabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "roles" "role" DEFAULT 'user';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "two_factor_tokens" ADD CONSTRAINT "two_factor_tokens_userID_user_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
