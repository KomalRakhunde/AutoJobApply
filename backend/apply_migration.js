require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function applyMigration() {
  console.log('Applying non-destructive database migration...');

  const sqlStatements = [
    `ALTER TABLE "candidate_scores" ADD COLUMN IF NOT EXISTS "matchingSkills" JSONB`,
    `ALTER TABLE "candidate_scores" ADD COLUMN IF NOT EXISTS "missingCriticalSkills" JSONB`,
    `ALTER TABLE "candidate_scores" ADD COLUMN IF NOT EXISTS "experienceRequirementMet" BOOLEAN`,
    `ALTER TABLE "candidate_scores" ADD COLUMN IF NOT EXISTS "shortFinalVerdict" TEXT`,
    `ALTER TABLE "candidate_scores" ADD COLUMN IF NOT EXISTS "evaluationStatus" TEXT`,
    
    `ALTER TABLE "resume_uploads" ADD COLUMN IF NOT EXISTS "parsedResumeJson" JSONB`,
    `ALTER TABLE "resume_uploads" ADD COLUMN IF NOT EXISTS "parsingStatus" TEXT`,

    `ALTER TABLE "job_postings" ADD COLUMN IF NOT EXISTS "parsedJobJson" JSONB`,
    `ALTER TABLE "job_postings" ADD COLUMN IF NOT EXISTS "targetHeadcount" INTEGER DEFAULT 10`,
    `ALTER TABLE "job_postings" ADD COLUMN IF NOT EXISTS "autoOfferEnabled" BOOLEAN DEFAULT false`
  ];

  for (const sql of sqlStatements) {
    console.log(`Executing: ${sql}`);
    await prisma.$executeRawUnsafe(sql);
  }

  console.log('Migration executed successfully without dropping any tables or data!');
  process.exit(0);
}

applyMigration().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
