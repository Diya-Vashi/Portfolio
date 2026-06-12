const { createClient } = require('@libsql/client');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient({});
const sqlite = createClient({ url: `file:${path.join(__dirname, 'dev.db')}` });

async function migrate() {
  console.log('Starting data migration...');

  const tables = [
    'GeneralInfo',
    'Project',
    'Experience',
    'Education',
    'Certification',
    'Publication',
    'ContactMessage',
    'VisitorStat',
    'ActivityLog',
    'AdminUser'
  ];

  for (const table of tables) {
    try {
      const { rows } = await sqlite.execute(`SELECT * FROM ${table}`);
      if (rows.length === 0) {
        console.log(`Table ${table} is empty, skipping.`);
        continue;
      }
      console.log(`Migrating ${rows.length} rows for ${table}...`);
      
      const modelName = table.charAt(0).toLowerCase() + table.slice(1);
      
      // Clear target table first
      await prisma[modelName].deleteMany({});

      // Format dates and boolean correctly for Prisma if needed, but Prisma createMany is pretty smart.
      const formattedRows = rows.map(row => {
        const formatted = { ...row };
        
        // Handle dates and booleans correctly
        for (const [key, value] of Object.entries(formatted)) {
          if (key === 'createdAt' || key === 'updatedAt' || key === 'startDate' || key === 'endDate' || key === 'lastLogin') {
            if (value) formatted[key] = new Date(value);
          }
          if (key === 'current') {
            formatted[key] = Boolean(value);
          }
        }
        return formatted;
      });

      // Split into batches to avoid limits
      for (const row of formattedRows) {
        await prisma[modelName].create({ data: row });
      }
      console.log(`Successfully migrated ${table}.`);
    } catch (e) {
      console.error(`Error migrating ${table}:`, e.message);
    }
  }

  console.log('Migration Complete!');
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
