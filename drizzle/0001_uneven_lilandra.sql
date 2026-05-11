ALTER TABLE "bookings" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "lead_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "package_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "faqs" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "faqs" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "gallery" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "gallery" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "lead_assignments" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "lead_assignments" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "lead_assignments" ALTER COLUMN "lead_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "lead_assignments" ALTER COLUMN "assigned_from" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "lead_assignments" ALTER COLUMN "assigned_to" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "lead_status_history" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "lead_status_history" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "lead_status_history" ALTER COLUMN "lead_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "lead_status_history" ALTER COLUMN "changed_by" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "assigned_to" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "package_images" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "package_images" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "package_images" ALTER COLUMN "package_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "packages" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "packages" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "packages" ALTER COLUMN "created_by" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "testimonials" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "testimonials" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;