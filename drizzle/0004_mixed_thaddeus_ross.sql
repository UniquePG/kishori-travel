CREATE TABLE "package_itinerary" (
	"id" serial PRIMARY KEY NOT NULL,
	"package_id" integer NOT NULL,
	"day_number" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "package_itinerary" ADD CONSTRAINT "package_itinerary_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "package_itinerary_package_id_idx" ON "package_itinerary" USING btree ("package_id");