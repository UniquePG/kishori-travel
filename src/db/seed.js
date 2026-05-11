import 'dotenv/config';
import { db } from './index.js';
import * as schema from './schema.js';
import bcrypt from 'bcryptjs';

async function hashPassword(plain) {
  return await bcrypt.hash(plain, 10);
}

async function main() {
  console.log('🌱  Starting Drizzle seed...');

  try {
    // ── Admin user ─────────────────────────────────────────────────────────────
    const adminEmail = 'admin@kishoritravels.com';
    const adminPassword = await hashPassword('Admin@123');

    // Check if admin exists
    let admin = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, adminEmail),
    });

    if (!admin) {
      const [newAdmin] = await db.insert(schema.users).values({
        name: 'Admin User',
        email: adminEmail,
        phone: '+91 9999999999',
        passwordHash: adminPassword,
        role: 'admin',
        isActive: true,
      }).returning();
      admin = newAdmin;
      console.log(`✅  Created admin user: ${admin.email}`);
    } else {
      console.log(`ℹ️  Admin user already exists: ${admin.email}`);
    }

    // ── Sample package ─────────────────────────────────────────────────────────
    const packageSlug = 'rajasthan-royal-tour';
    let pkg = await db.query.packages.findFirst({
      where: (packages, { eq }) => eq(packages.slug, packageSlug),
    });

    if (!pkg) {
      const [newPkg] = await db.insert(schema.packages).values({
        title: 'Rajasthan Royal Tour',
        slug: packageSlug,
        shortDescription: 'Experience the royal heritage of Rajasthan in 7 nights.',
        description: 'A curated 8-day journey covering Jaipur, Jodhpur, Udaipur, and Jaisalmer with premium stays and guided cultural experiences.',
        location: 'Rajasthan, India',
        durationDays: 8,
        currentPrice: '45000.00',
        oldPrice: "60000.00",
        thumbnail: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
        isFeatured: true,
        isActive: true,
        createdBy: admin.id,
      }).returning();
      pkg = newPkg;
      console.log(`✅  Created package: ${pkg.title}`);
    } else {
      console.log(`ℹ️  Package already exists: ${pkg.title}`);
    }

    // ── Sample FAQ entries ─────────────────────────────────────────────────────
    const faqsData = [
      {
        question: 'What is included in the package price?',
        answer: 'All packages include accommodation, breakfast, guided sightseeing, and airport transfers unless stated otherwise.',
        sortOrder: 1,
      },
      {
        question: 'Can I customise my itinerary?',
        answer: 'Yes! Contact our team and we will tailor any package to your preferences and budget.',
        sortOrder: 2,
      },
      {
        question: 'What is the cancellation policy?',
        answer: 'Full refund up to 14 days before departure, 50% refund 7–14 days before, no refund within 7 days.',
        sortOrder: 3,
      },
    ];

    for (const faq of faqsData) {
      const existing = await db.query.faqs.findFirst({
        where: (faqs, { eq }) => eq(faqs.question, faq.question),
      });
      if (!existing) {
        await db.insert(schema.faqs).values(faq);
        console.log(`✅  Created FAQ: ${faq.question}`);
      }
    }

    console.log('\n🎉  Drizzle seed complete!');
  } catch (error) {
    console.error('❌  Seed failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
