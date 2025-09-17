import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Onboarding category and course...')

  // Ensure an admin user exists (required for createdBy relation)
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
  if (!admin) {
    throw new Error('No ADMIN user found. Run scripts/seed.ts first to create demo users.')
  }

  // Upsert Onboarding category
  const category = await prisma.category.upsert({
    where: { name: 'Onboarding' },
    update: {},
    create: {
      name: 'Onboarding',
      description: 'Start here. Thaifoon culture, standards, and your first steps.',
      color: '#0ea5e9',
    },
  })

  // Upsert course
  const course = await prisma.course.upsert({
    where: { title: 'Welcome to Thaifoon' },
    update: { categoryId: category.id, isPublished: true },
    create: {
      title: 'Welcome to Thaifoon',
      description: 'Start your journey with Thaifoon Hospitality. Learn our story, values, and standards of excellence.',
      thumbnail: '/course-thumbnails/onboarding.jpg',
      isPublished: true,
      categoryId: category.id,
      createdById: admin.id,
    },
  })

  // Helper to create module with ordered lessons
  async function createModule(
    courseId: string,
    orderIndex: number,
    title: string,
    description: string,
    lessons: Array<{ title: string; html: string; duration?: number }>,
  ) {
    const mod = await prisma.module.upsert({
      where: { id: `${courseId}-${orderIndex}` },
      update: { title, description, orderIndex },
      create: { title, description, orderIndex, courseId },
    })

    // Ensure deterministic order
    for (let i = 0; i < lessons.length; i++) {
      const l = lessons[i]
      await prisma.lesson.create({
        data: {
          title: l.title,
          content: l.html,
          contentType: 'TEXT',
          duration: l.duration ?? 5,
          orderIndex: i + 1,
          moduleId: mod.id,
          isRequired: true,
        },
      })
    }
  }

  // Basic content blocks
  const welcomeHtml = `
  <h2>Welcome to Thaifoon</h2>
  <p>We are excited to have you on the team. This short course gives you a clear, friendly introduction to our culture and the habits that make great hospitality.</p>
  <ul>
    <li>Who we are and what we stand for</li>
    <li>How to show up prepared and professional</li>
    <li>Where to find answers and learn fast</li>
  </ul>`

  const valuesHtml = `
  <h2>The Thaifoon Vision & Values</h2>
  <p>We believe hospitality is a craft. Every guest should feel welcomed, cared for, and proud to be part of our story.</p>
  <ol>
    <li><strong>Warmth first.</strong> Smile, greet, make eye contact.</li>
    <li><strong>Own the moment.</strong> See something? Fix it.</li>
    <li><strong>Better every day.</strong> Ask, improve, share.</li>
  </ol>`

  const excellenceHtml = `
  <h2>Excellence — The Devil Is in the Details</h2>
  <p>Great teams sweat the small things: clean stations, sharp timing, consistent plating, accurate orders, and clean handoffs between roles.</p>
  <ul>
    <li>Uniform ready; hands washed; tools set</li>
    <li>Stations tidy; labels, dates, temps</li>
    <li>Guests never wait without acknowledgment</li>
  </ul>`

  const nextStepsHtml = `
  <h2>Next Steps</h2>
  <p>Finish this course, review your Station SOPs, and complete your first assessment. Your manager will help with shadowing and expectations for week one.</p>`

  // Create modules and lessons if not already present
  const existingModules = await prisma.module.findMany({ where: { courseId: course.id } })
  if (existingModules.length === 0) {
    await createModule(course.id, 1, 'Welcome', 'Start here', [
      { title: 'Welcome', html: welcomeHtml },
    ])

    await createModule(course.id, 2, 'Vision & Values', 'What great hospitality means at Thaifoon', [
      { title: 'Our Vision & Values', html: valuesHtml },
    ])

    await createModule(course.id, 3, 'Excellence', 'The small details that create big experiences', [
      { title: 'Excellence in the Details', html: excellenceHtml },
    ])

    await createModule(course.id, 4, 'Next Steps', 'What to do after onboarding', [
      { title: 'Your First Week', html: nextStepsHtml },
    ])
  }

  console.log('✅ Onboarding seeded:')
  console.log(`   Category: ${category.name}`)
  console.log(`   Course:   ${course.title}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


