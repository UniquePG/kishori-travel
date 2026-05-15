CREATE TABLE "package_room_sharing_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"package_id" integer NOT NULL,
	"label" varchar(255) NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "is_upcoming" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "upcoming_label" varchar(255);--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "expected_launch_at" timestamp;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "offer_title" varchar(255);--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "offer_description" text;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "offer_valid_until" timestamp;--> statement-breakpoint
ALTER TABLE "package_room_sharing_options" ADD CONSTRAINT "package_room_sharing_options_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "package_room_sharing_options_package_id_idx" ON "package_room_sharing_options" USING btree ("package_id");