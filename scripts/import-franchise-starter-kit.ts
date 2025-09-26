import { PrismaClient } from '@prisma/client'

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

  // Populate Introduction lesson content
  const introModule = await prisma.module.findFirst({ where: { courseId: course.id, title: 'Introduction' } })
  if (!introModule) throw new Error('Introduction module not found')

  const introHtml = `
  <h2>Introduction</h2>
  <p>Welcome to the official training program for future franchise owners! At Soi Thaifoon, we believe that success starts with preparation. That’s why we’ve designed a hands-on, one-month onboarding experience that ensures every franchise partner is confident, capable, and fully equipped to Good Food + Good Vibes:</p>
  <blockquote>
    <p>Our mission Good Food + Good Vibes: Deliver a dining experience where hospitality stands on three unwavering pillars: exceptional food, outstanding service, and an inviting environment. We believe that each element is equally vital in crafting a wholesome and memorable experience for our guests. Through our dedication to quality and attention to detail, we aim to create a space where every visit enriches your day and satisfies your senses.</p>
  </blockquote>
  <h3>Good Food</h3>
  <ul>
    <li><strong>Everything is made in-house.</strong> From our sauces to our dressings, our food is prepared fresh using quality ingredients we’re proud to serve.</li>
    <li><strong>We source with care.</strong> Only the best ingredients make it into our kitchen—chosen for flavor, consistency, and authenticity.</li>
    <li><strong>We’re here to feed people—not impress critics.</strong> We’re not chasing Michelin stars. Our mission is to serve delicious, soulful food that people crave and come back for.</li>
  </ul>
  <h3>Good Vibes</h3>
  <ul>
    <li><strong>Energy is real.</strong> The frequency we emit affects everyone around us—guests, coworkers, and ourselves.</li>
    <li><strong>Intention matters.</strong> When you walk into work, walk in with a positive mindset. What you bring into the space is contagious.</li>
    <li><strong>Protect the vibe.</strong> Our restaurant is a sacred space—free from outside drama and distraction. The tone you set impacts the entire environment.</li>
    <li><strong>Be present, be kind, be uplifting.</strong> Whether it’s a team huddle or a guest interaction, your energy shapes the experience.</li>
  </ul>
  <h3>Vision</h3>
  <p>Our vision is to transform dining into a harmonious experience that elevates the spirit. We are dedicated to creating an atmosphere where good food and positive vibrations merge, ensuring every guest leaves happier and more uplifted than when they arrived. We aspire to set a new standard for dining globally, where the law of vibration governs the essence of our hospitality.</p>
  <h3>Program Overview</h3>
  <h4>Week 1: Orientation &amp; Setup</h4>
  <p>Orientation to brand values, culture, and business model. Set-Up covers kitchen/POS, FOH layout, and equipment overview.</p>
  <h4>Week 2–3: Now the real learning starts!</h4>
  <p>Hands-on training across FOH, BOH, food prep, customer service, inventory, and more—side-by-side with experienced staff.</p>
  <h4>Week 4: Pre-Opening &amp; Post-Opening Support</h4>
  <p>Pre-Opening checklist, Opening/Closing duties, payroll, team organization. Directory of resources. Post-opening support and audit.</p>
  <h3>Ongoing Success</h3>
  <p>Our support doesn’t stop after 30 days. You’ll continue to have access to our team, resources, and franchise community. We’re invested in your long-term success—because when you win, we all win.</p>
  `

  const existingIntro = await prisma.lesson.findFirst({ where: { moduleId: introModule.id, title: 'Introduction' } })
  if (!existingIntro) {
    // create first position in Introduction module
    const last = await prisma.lesson.findFirst({ where: { moduleId: introModule.id }, orderBy: { orderIndex: 'desc' } })
    await prisma.lesson.create({
      data: {
        title: 'Introduction',
        content: introHtml,
        contentType: 'TEXT',
        orderIndex: (last?.orderIndex || 0) + 1,
        isRequired: true,
        moduleId: introModule.id,
        duration: 10,
      }
    })
  } else {
    await prisma.lesson.update({
      where: { id: existingIntro.id },
      data: { content: introHtml }
    })
  }

  console.log('Imported: Franchise Starter Kit (Introduction populated).')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})


