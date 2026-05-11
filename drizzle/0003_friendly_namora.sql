CREATE TYPE "public"."package_inclusion_type" AS ENUM('included', 'excluded');--> statement-breakpoint
CREATE TABLE "package_inclusions" (
	"id" serial PRIMARY KEY NOT NULL,
	"package_id" integer NOT NULL,
	"type" "package_inclusion_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gallery" ADD COLUMN "description" varchar(1024);--> statement-breakpoint
ALTER TABLE "gallery" ADD COLUMN "media_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "gallery" ADD COLUMN "media_type" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "current_price" numeric(12, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "old_price" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "package_inclusions" ADD CONSTRAINT "package_inclusions_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "package_inclusions_package_id_idx" ON "package_inclusions" USING btree ("package_id");--> statement-breakpoint
CREATE INDEX "package_inclusions_type_idx" ON "package_inclusions" USING btree ("package_id","type");--> statement-breakpoint
ALTER TABLE "gallery" DROP COLUMN "image_url";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN "price_starting_from";