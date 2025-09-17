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

  // Find or create course (title is not unique in schema)
  let course = await prisma.course.findFirst({ where: { title: 'Welcome to Thaifoon' } })
  if (!course) {
    course = await prisma.course.create({
      data: {
        title: 'Welcome to Thaifoon',
        description: 'Start your journey with Thaifoon Hospitality. Learn our story, values, and standards of excellence.',
        thumbnail: '/course-thumbnails/onboarding.jpg',
        isPublished: true,
        categoryId: category.id,
        createdById: admin.id,
      },
    })
  } else if (course.categoryId !== category.id || !course.isPublished) {
    course = await prisma.course.update({
      where: { id: course.id },
      data: { categoryId: category.id, isPublished: true },
    })
  }

  // Helper to create module with ordered lessons
  async function createModule(
    courseId: string,
    orderIndex: number,
    title: string,
    description: string,
    lessons: Array<{ title: string; html: string; duration?: number; contentType?: 'TEXT' | 'VIDEO' | 'MIXED'; videoUrl?: string }>,
  ) {
    const mod = await prisma.module.create({
      data: { title, description, orderIndex, courseId },
    })

    // Ensure deterministic order
    for (let i = 0; i < lessons.length; i++) {
      const l = lessons[i]
      await prisma.lesson.create({
        data: {
          title: l.title,
          content: l.html,
          contentType: l.contentType ?? 'TEXT',
          videoUrl: l.videoUrl ?? null,
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
      { title: 'Welcome to Thaifoon (Video)', html: welcomeHtml + '<p>Upload the welcome video here.</p>', contentType: 'VIDEO' },
      { title: 'Our Story (Video)', html: '<h2>Our Story</h2><p>A quick intro to how Thaifoon began.</p><p>Upload the story video here.</p>', contentType: 'VIDEO' },
      { title: 'Week One Overview', html: '<h2>Your First Week</h2><p>Shifts, expectations, and who to ask for help.</p>' },
    ])

    await createModule(course.id, 2, 'Vision & Values', 'What great hospitality means at Thaifoon', [
      { title: 'Our Vision (Video)', html: valuesHtml + '<p>Upload the vision video here.</p>', contentType: 'VIDEO' },
      { title: 'Our Values', html: '<h2>Values in Action</h2><p>Examples of how we live our values daily.</p>' },
      { title: 'Hospitality Standards (Video)', html: '<h2>Standards</h2><p>Warm greetings, timing, accuracy, and recovery.</p><p>Upload standards video here.</p>', contentType: 'VIDEO' },
    ])

    await createModule(course.id, 3, 'Excellence', 'The small details that create big experiences', [
      { title: 'Uniform & Appearance (Video)', html: '<h2>Uniform & Appearance</h2><p>Look sharp, feel sharp.</p><p>Upload uniform video here.</p>', contentType: 'VIDEO' },
      { title: 'Station Readiness (Video)', html: '<h2>Station Ready</h2><p>Setup, labels, temps, and sanitation.</p><p>Upload station readiness video here.</p>', contentType: 'VIDEO' },
      { title: 'Guest Greeting Basics (Video)', html: '<h2>Greeting Basics</h2><p>Smile, eye contact, and ownership.</p><p>Upload greeting video here.</p>', contentType: 'VIDEO' },
    ])

    await createModule(course.id, 4, 'Next Steps', 'What to do after onboarding', [
      { title: 'Your Training Path', html: nextStepsHtml },
      { title: 'Where to Find SOPs', html: '<h2>SOPs</h2><p>Find procedures under the SOPs section and your station category.</p>' },
      { title: 'First Assessment', html: '<h2>Assessment</h2><p>Complete the Food Safety basics assessment this week.</p>' },
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


