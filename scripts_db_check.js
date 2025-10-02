const fs = require('fs');
const path = require('path');
const which = process.argv[2] || 'production';
const envPath = which === 'preview' ? '.vercel/.env.preview.local' : '.vercel/.env.production.local';
const envText = fs.readFileSync(envPath, 'utf8').split('\n').filter(l => l && !l.startsWith('#'));
for (const line of envText) {
  const i = line.indexOf('=');
  if (i > 0) process.env[line.slice(0, i)] = line.slice(i + 1);
}
(async () => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const courses = await prisma.course.findMany({ select: { id: true, title: true, isPublished: true }, take: 50 });
    console.log('courses:', courses.map(c => ({ title: c.title, published: c.isPublished })));
    const categories = await prisma.category.findMany({ select: { id: true, name: true } });
    console.log('categories:', categories.map(c => c.name));
  } catch (e) {
    console.error('db-check error:', e?.message || e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
