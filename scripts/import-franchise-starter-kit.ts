import { PrismaClient } from '@prisma/client'
import { promises as fs } from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  // Ensure Admin exists to attribute content
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
  if (!admin) throw new Error('No ADMIN user found. Please seed users first.')

  // Ensure Category exists
  const category = await prisma.category.upsert({
    where: { name: 'Onboarding' },
    update: {},
    create: { name: 'Onboarding', description: 'Franchise onboarding', color: '#0ea5e9' }
  })

  // Upsert Course
  let course = await prisma.course.findFirst({ where: { title: 'Franchise Starter Kit' } })
  if (!course) {
    course = await prisma.course.create({
      data: {
        title: 'Franchise Starter Kit',
        description: 'Everything you need to get started as a Thaifoon franchise partner.',
        isPublished: true,
        categoryId: category.id,
        createdById: admin.id,
      }
    })
  }

  // Sections -> Modules
  const sections = [
    'Personal Note',
    'Introduction',
    'Organizational Structure',
    'Company Directory',
    'Preferred Vendor List',
    'Standard Operating Procedures',
    'Employee Training Guide',
    'Venue Setup',
    'Policies & Compliance',
    'Marketing Playbook',
    'Post-Opening Support & Directory'
  ]

  // Create modules in order if missing
  for (let i = 0; i < sections.length; i++) {
    const title = sections[i]
    const existing = await prisma.module.findFirst({ where: { courseId: course.id, title } })
    if (!existing) {
      await prisma.module.create({ data: { title, orderIndex: i + 1, courseId: course.id } })
    }
  }

  // Attempt to populate each section from imports/franchise/<Section>.html
  const importDir = path.join(process.cwd(), 'imports', 'franchise')
  for (const title of sections) {
    try {
      const filePath = path.join(importDir, `${title}.html`)
      const html = await fs.readFile(filePath, 'utf8')

      const mod = await prisma.module.findFirst({ where: { courseId: course.id, title } })
      if (!mod) continue

      // find existing lesson with same title, else create at next orderIndex
      const existingLesson = await prisma.lesson.findFirst({ where: { moduleId: mod.id, title } })
      if (existingLesson) {
        await prisma.lesson.update({ where: { id: existingLesson.id }, data: { content: html, contentType: 'TEXT' } })
      } else {
        const last = await prisma.lesson.findFirst({ where: { moduleId: mod.id }, orderBy: { orderIndex: 'desc' } })
        await prisma.lesson.create({
          data: {
            title,
            content: html,
            contentType: 'TEXT',
            orderIndex: (last?.orderIndex || 0) + 1,
            isRequired: true,
            moduleId: mod.id,
            duration: 10,
          }
        })
      }
      console.log(`✓ Imported content for section: ${title}`)
    } catch (e) {
      // No file found—skip silently (outline remains)
      console.log(`↷ No HTML found for section: ${title} (expected imports/franchise/${title}.html)`) 
    }
  }

  console.log('Imported: Franchise Starter Kit (outline ensured; content populated when HTML files provided).')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})


