import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Food Safety',
        description: 'Essential food safety protocols and procedures',
        color: '#ef4444'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Customer Service',
        description: 'Excellence in customer experience and service',
        color: '#3b82f6'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Kitchen Operations',
        description: 'Kitchen procedures and culinary techniques',
        color: '#f97316'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Front of House',
        description: 'Restaurant operations and guest interaction',
        color: '#10b981'
      }
    })
  ])

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 12)
  const staffPassword = await bcrypt.hash('staff123', 12)
  const managerPassword = await bcrypt.hash('manager123', 12)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@thaifoon.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN'
    }
  })

  const manager = await prisma.user.create({
    data: {
      email: 'manager@thaifoon.com',
      name: 'Manager User',
      password: managerPassword,
      role: 'MANAGER'
    }
  })

  const staff = await prisma.user.create({
    data: {
      email: 'staff@thaifoon.com',
      name: 'Staff User',
      password: staffPassword,
      role: 'STAFF'
    }
  })

  // Create sample courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Food Safety Fundamentals',
      description: 'Essential food safety protocols every team member must know',
      thumbnail: '/course-thumbnails/food-safety.jpg',
      isPublished: true,
      categoryId: categories[0].id,
      createdById: admin.id
    }
  })

  const course2 = await prisma.course.create({
    data: {
      title: 'Customer Service Excellence',
      description: 'Delivering exceptional customer experiences',
      thumbnail: '/course-thumbnails/customer-service.jpg',
      isPublished: true,
      categoryId: categories[1].id,
      createdById: admin.id
    }
  })

  // Create modules for course 1
  const module1 = await prisma.module.create({
    data: {
      title: 'Personal Hygiene',
      description: 'Understanding proper personal hygiene in food service',
      orderIndex: 1,
      courseId: course1.id
    }
  })

  const module2 = await prisma.module.create({
    data: {
      title: 'Temperature Control',
      description: 'Safe food temperature guidelines and monitoring',
      orderIndex: 2,
      courseId: course1.id
    }
  })

  // Create lessons for module 1
  await prisma.lesson.create({
    data: {
      title: 'Handwashing Procedures',
      content: '<h2>Proper Handwashing Technique</h2><p>Handwashing is the most important step in preventing foodborne illness. Follow these steps:</p><ol><li>Wet hands with warm water</li><li>Apply soap and scrub for at least 20 seconds</li><li>Rinse thoroughly</li><li>Dry with clean towel or air dry</li></ol><p><strong>When to wash hands:</strong></p><ul><li>Before handling food</li><li>After using the restroom</li><li>After touching raw meat</li><li>After coughing or sneezing</li></ul>',
      contentType: 'TEXT',
      duration: 15,
      orderIndex: 1,
      moduleId: module1.id
    }
  })

  await prisma.lesson.create({
    data: {
      title: 'Proper Uniform and Appearance',
      content: '<h2>Uniform Standards</h2><p>Maintaining proper appearance is crucial for food safety and professionalism:</p><h3>Required Uniform Items:</h3><ul><li>Clean apron or uniform shirt</li><li>Hair restraint (hat, hairnet, or ponytail)</li><li>Non-slip shoes</li><li>Clean pants (no rips or stains)</li></ul><h3>Personal Grooming:</h3><ul><li>Short, clean fingernails</li><li>Minimal jewelry</li><li>No perfume or strong scents</li><li>Clean shave or well-groomed facial hair</li></ul>',
      contentType: 'TEXT',
      duration: 10,
      orderIndex: 2,
      moduleId: module1.id
    }
  })

  // Create lessons for module 2
  await prisma.lesson.create({
    data: {
      title: 'Safe Food Temperatures',
      content: '<h2>Temperature Safety Guidelines</h2><p>Maintaining proper food temperatures prevents bacterial growth:</p><h3>Hot Foods:</h3><ul><li>Keep hot foods at 140°F (60°C) or above</li><li>Use food thermometers to check temperatures</li><li>Reheat foods to 165°F (74°C)</li></ul><h3>Cold Foods:</h3><ul><li>Keep cold foods at 40°F (4°C) or below</li><li>Refrigerate within 2 hours of cooking</li><li>Use ice baths for rapid cooling</li></ul><h3>Danger Zone:</h3><p>40°F - 140°F (4°C - 60°C) is the temperature danger zone where bacteria multiply rapidly.</p>',
      contentType: 'TEXT',
      duration: 20,
      orderIndex: 1,
      moduleId: module2.id
    }
  })

  // Create Standard Operating Procedures
  await prisma.standardOperatingProcedure.create({
    data: {
      title: 'Opening Procedures - Kitchen',
      content: '<h2>Daily Kitchen Opening Checklist</h2><h3>Before Service (30 minutes before opening):</h3><ol><li><strong>Temperature Checks</strong><ul><li>Check all refrigerator and freezer temperatures</li><li>Record temperatures on log sheet</li><li>Verify hot holding equipment reaches proper temperature</li></ul></li><li><strong>Equipment Setup</strong><ul><li>Turn on all cooking equipment</li><li>Fill hand wash stations</li><li>Check chemical sanitizer concentration</li></ul></li><li><strong>Food Preparation</strong><ul><li>Check all prepared foods for freshness</li><li>Prepare daily specials according to recipes</li><li>Stock prep stations with necessary ingredients</li></ul></li><li><strong>Sanitation</strong><ul><li>Sanitize all work surfaces</li><li>Replace sanitizer buckets</li><li>Check that soap dispensers are filled</li></ul></li></ol>',
      version: '2.1',
      isActive: true,
      categoryId: categories[2].id,
      createdById: admin.id
    }
  })

  await prisma.standardOperatingProcedure.create({
    data: {
      title: 'Closing Procedures - Front of House',
      content: '<h2>End of Shift Closing Procedures</h2><h3>Final Hour of Service:</h3><ol><li><strong>Dining Room</strong><ul><li>Begin cleaning empty tables and chairs</li><li>Sweep under tables and booths</li><li>Wipe down menus and condiment containers</li></ul></li><li><strong>Service Station</strong><ul><li>Clean and sanitize drink station</li><li>Restock napkins, utensils, and straws</li><li>Empty and clean ice bins</li></ul></li><li><strong>Cash Handling</strong><ul><li>Count cash drawer</li><li>Complete daily sales report</li><li>Secure cash in safe</li></ul></li><li><strong>Final Walkthrough</strong><ul><li>Turn off music and lights</li><li>Lock all doors and windows</li><li>Set alarm system</li></ul></li></ol>',
      version: '1.8',
      isActive: true,
      categoryId: categories[3].id,
      createdById: admin.id
    }
  })

  // Create a sample quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: 'Food Safety Assessment',
      description: 'Test your knowledge of basic food safety principles',
      passingScore: 80,
      maxAttempts: 3,
      timeLimit: 30,
      isPublished: true,
      createdById: admin.id
    }
  })

  // Create questions for the quiz
  const question1 = await prisma.question.create({
    data: {
      question: 'What is the minimum temperature for hot food holding?',
      type: 'MULTIPLE_CHOICE',
      points: 1,
      orderIndex: 1,
      explanation: 'Hot foods must be kept at 140°F (60°C) or above to prevent bacterial growth.',
      quizId: quiz.id
    }
  })

  // Create answers for question 1
  await prisma.answer.createMany({
    data: [
      { text: '120°F (49°C)', isCorrect: false, orderIndex: 1, questionId: question1.id },
      { text: '130°F (54°C)', isCorrect: false, orderIndex: 2, questionId: question1.id },
      { text: '140°F (60°C)', isCorrect: true, orderIndex: 3, questionId: question1.id },
      { text: '150°F (66°C)', isCorrect: false, orderIndex: 4, questionId: question1.id }
    ]
  })

  const question2 = await prisma.question.create({
    data: {
      question: 'How long should you wash your hands?',
      type: 'MULTIPLE_CHOICE',
      points: 1,
      orderIndex: 2,
      explanation: 'Proper handwashing requires at least 20 seconds of scrubbing with soap.',
      quizId: quiz.id
    }
  })

  await prisma.answer.createMany({
    data: [
      { text: '10 seconds', isCorrect: false, orderIndex: 1, questionId: question2.id },
      { text: '15 seconds', isCorrect: false, orderIndex: 2, questionId: question2.id },
      { text: '20 seconds', isCorrect: true, orderIndex: 3, questionId: question2.id },
      { text: '30 seconds', isCorrect: false, orderIndex: 4, questionId: question2.id }
    ]
  })

  const question3 = await prisma.question.create({
    data: {
      question: 'Hair restraints are required in food service areas.',
      type: 'TRUE_FALSE',
      points: 1,
      orderIndex: 3,
      explanation: 'Hair restraints prevent hair from falling into food and are required by food safety regulations.',
      quizId: quiz.id
    }
  })

  await prisma.answer.createMany({
    data: [
      { text: 'True', isCorrect: true, orderIndex: 1, questionId: question3.id },
      { text: 'False', isCorrect: false, orderIndex: 2, questionId: question3.id }
    ]
  })

  console.log('Database seeded successfully!')
  console.log('Demo accounts created:')
  console.log('Admin: admin@thaifoon.com / admin123')
  console.log('Manager: manager@thaifoon.com / manager123')
  console.log('Staff: staff@thaifoon.com / staff123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })