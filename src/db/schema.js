import { pgTable, pgEnum, serial, varchar, text, boolean, timestamp, integer, decimal, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────────────────────

export const roleEnum = pgEnum('role', ['admin', 'manager', 'member']);
export const leadSourceEnum = pgEnum('lead_source', ['website', 'referral', 'instagram', "facebook", "whatsapp", 'walk_in', 'phone', 'email', 'other']);
export const leadStatusEnum = pgEnum('lead_status', ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost', 'dropped']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'cancelled']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'partial', 'paid']);
export const packageInclusionTypeEnum = pgEnum("package_inclusion_type", [
  "included",
  "excluded",
]);
// ─────────────────────────────────────────────────────────────────────────────
// TABLES
// ─────────────────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  passwordHash: text('password_hash').notNull(),
  role: roleEnum('role').default('member').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const packages = pgTable('packages', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  shortDescription: text('short_description'),
  description: text('description').notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  durationDays: integer('duration_days').notNull(),
  currentPrice: decimal('current_price', { precision: 12, scale: 2 }).notNull(),
  oldPrice: decimal('old_price', { precision: 12, scale: 2 }),
  thumbnail: text('thumbnail'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdBy: integer('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const packageInclusions = pgTable(
  "package_inclusions",
  {
    id: serial("id").primaryKey(),
    packageId: integer("package_id")
      .references(() => packages.id, { onDelete: "cascade" })
      .notNull(),
    type: packageInclusionTypeEnum("type").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    packageIdx: index("package_inclusions_package_id_idx").on(table.packageId),
    typeIdx: index("package_inclusions_type_idx").on(
      table.packageId,
      table.type
    ),
  })
);

export const packageItinerary = pgTable(
  "package_itinerary",
  {
    id: serial("id").primaryKey(),
    packageId: integer("package_id")
      .references(() => packages.id, { onDelete: "cascade" })
      .notNull(),
    dayNumber: integer("day_number").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    packageIdx: index("package_itinerary_package_id_idx").on(table.packageId),
  })
);


export const packageImages = pgTable('package_images', {
  id: serial('id').primaryKey(),
  packageId: integer('package_id').references(() => packages.id, { onDelete: 'cascade' }).notNull(),
  imageUrl: text('image_url').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    packageIdx: index('package_images_package_id_idx').on(table.packageId),
    sortIdx: index('package_images_sort_order_idx').on(table.sortOrder),
  };
});

export const gallery = pgTable('gallery', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 1024 }),
  mediaUrl: text('media_url').notNull(),
  mediaType: varchar('media_type', { length: 20 }).notNull(),
  thumbnailUrl: text('thumbnail_url'),
  category: varchar('category', { length: 100 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});


export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  review: text('review').notNull(),
  rating: integer('rating').default(5).notNull(),
  imageUrl: text('image_url'),
  location: varchar('location', { length: 255 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const faqs = pgTable('faqs', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }),
  destinationInterest: integer('destination_interest').references(() => packages.id),
  travelDate: timestamp('travel_date'),
  numberOfPeople: integer('number_of_people'),
  budget: decimal('budget', { precision: 12, scale: 2 }),
  message: text('message'),
  source: leadSourceEnum('source').default('website').notNull(),
  status: leadStatusEnum('status').default('new').notNull(),
  assignedTo: integer('assigned_to').references(() => users.id),
  utmSource: varchar('utm_source', { length: 255 }),
  utmMedium: varchar('utm_medium', { length: 255 }),
  utmCampaign: varchar('utm_campaign', { length: 255 }),
  utmContent: varchar('utm_content', { length: 255 }),
  utmTerm: varchar('utm_term', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => {
  return {
    statusIdx: index('leads_status_idx').on(table.status),
    assigneeIdx: index('leads_assigned_to_idx').on(table.assignedTo),
    createdAtIdx: index('leads_created_at_idx').on(table.createdAt),
  };
});

export const leadStatusHistory = pgTable('lead_status_history', {
  id: serial('id').primaryKey(),
  leadId: integer('lead_id').references(() => leads.id, { onDelete: 'cascade' }).notNull(),
  oldStatus: varchar('old_status', { length: 100 }),
  newStatus: varchar('new_status', { length: 100 }).notNull(),
  note: text('note'),
  changedBy: integer('changed_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    leadIdx: index('lead_status_history_lead_id_idx').on(table.leadId),
  };
});

export const leadAssignments = pgTable('lead_assignments', {
  id: serial('id').primaryKey(),
  leadId: integer('lead_id').references(() => leads.id, { onDelete: 'cascade' }).notNull(),
  assignedFrom: integer('assigned_from').references(() => users.id),
  assignedTo: integer('assigned_to').references(() => users.id).notNull(),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    leadIdx: index('lead_assignments_lead_id_idx').on(table.leadId),
  };
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    userReadIdx: index('notifications_user_id_is_read_idx').on(table.userId, table.isRead),
  };
});

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  leadId: integer('lead_id').references(() => leads.id),
  packageId: integer('package_id').references(() => packages.id).notNull(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 20 }),
  customerEmail: varchar('customer_email', { length: 255 }),
  travelStartDate: timestamp('travel_start_date').notNull(),
  travelersCount: integer('travelers_count').notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  bookingStatus: bookingStatusEnum('booking_status').default('pending').notNull(),
  paymentStatus: paymentStatusEnum('payment_status').default('pending').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => {
  return {
    bookingStatusIdx: index('bookings_booking_status_idx').on(table.bookingStatus),
    paymentStatusIdx: index('bookings_payment_status_idx').on(table.paymentStatus),
    createdAtIdx: index('bookings_created_at_idx').on(table.createdAt),
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  packagesCreated: many(packages, { relationName: 'createdBy' }),
  leadsAssigned: many(leads, { relationName: 'assignedTo' }),
  notifications: many(notifications),
  leadStatusChanges: many(leadStatusHistory),
  leadAssignmentsFrom: many(leadAssignments, { relationName: 'assignedFrom' }),
  leadAssignmentsTo: many(leadAssignments, { relationName: 'assignedTo' }),
}));

export const packagesRelations = relations(packages, ({ one, many }) => ({
  creator: one(users, {
    fields: [packages.createdBy],
    references: [users.id],
    relationName: 'createdBy',
  }),
  images: many(packageImages),
  bookings: many(bookings),
  inclusions: many(packageInclusions),
  itinerary: many(packageItinerary),
}));

export const packageItineraryRelations = relations(packageItinerary, ({ one }) => ({
  package: one(packages, {
    fields: [packageItinerary.packageId],
    references: [packages.id],
  }),
}));

export const packageInclusionsRelations = relations(packageInclusions, ({ one }) => ({
  package: one(packages, {
    fields: [packageInclusions.packageId],
    references: [packages.id],
  }),
}));

export const packageImagesRelations = relations(packageImages, ({ one }) => ({
  package: one(packages, {
    fields: [packageImages.packageId],
    references: [packages.id],
  }),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  assignee: one(users, {
    fields: [leads.assignedTo],
    references: [users.id],
    relationName: 'assignedTo',
  }),
  destinationInterest: one(packages, {
    fields: [leads.destinationInterest],
    references: [packages.id],
  }),
  statusHistory: many(leadStatusHistory),
  assignments: many(leadAssignments),
  bookings: many(bookings),
}));


export const leadStatusHistoryRelations = relations(leadStatusHistory, ({ one }) => ({
  lead: one(leads, {
    fields: [leadStatusHistory.leadId],
    references: [leads.id],
  }),
  changer: one(users, {
    fields: [leadStatusHistory.changedBy],
    references: [users.id],
  }),
}));

export const leadAssignmentsRelations = relations(leadAssignments, ({ one }) => ({
  lead: one(leads, {
    fields: [leadAssignments.leadId],
    references: [leads.id],
  }),
  fromUser: one(users, {
    fields: [leadAssignments.assignedFrom],
    references: [users.id],
    relationName: 'assignedFrom',
  }),
  toUser: one(users, {
    fields: [leadAssignments.assignedTo],
    references: [users.id],
    relationName: 'assignedTo',
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  lead: one(leads, {
    fields: [bookings.leadId],
    references: [leads.id],
  }),
  package: one(packages, {
    fields: [bookings.packageId],
    references: [packages.id],
  }),
}));
