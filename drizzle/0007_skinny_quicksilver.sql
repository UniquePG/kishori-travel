CREATE TABLE "package_terms" (
	"id" serial PRIMARY KEY NOT NULL,
	"package_id" integer NOT NULL,
	"content" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "package_terms" ADD CONSTRAINT "package_terms_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "package_terms_package_id_idx" ON "package_terms" USING btree ("package_id");