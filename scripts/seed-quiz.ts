import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedQuiz() {
  try {
    console.log('Creating sample quiz with questions...')

    // First, get or create a category
    let category = await prisma.category.findFirst({
      where: { name: 'Food Safety' }
    })

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: 'Food Safety',
          description: 'Food safety and hygiene training'
        }
      })
    }

    // Get an admin user to create the quiz
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      throw new Error('No admin user found. Please run the main seed script first.')
    }

    // Create a sample quiz
    const quiz = await prisma.quiz.create({
      data: {
        title: 'Food Safety Basics Assessment',
        description: 'Test your knowledge of essential food safety practices in our restaurant.',
        passingScore: 85,
        isPublished: true,
        createdById: adminUser.id,
        questions: {
          create: [
            {
              question: 'What is the minimum internal temperature for cooking chicken?',
              type: 'MULTIPLE_CHOICE',
              orderIndex: 1,
              answers: {
                create: [
                  { text: '145°F (63°C)', isCorrect: false, orderIndex: 1 },
                  { text: '165°F (74°C)', isCorrect: true, orderIndex: 2 },
                  { text: '155°F (68°C)', isCorrect: false, orderIndex: 3 },
                  { text: '175°F (79°C)', isCorrect: false, orderIndex: 4 }
                ]
              }
            },
            {
              question: 'How long can prepared food be safely kept in the temperature danger zone?',
              type: 'MULTIPLE_CHOICE',
              orderIndex: 2,
              answers: {
                create: [
                  { text: '1 hour', isCorrect: false, orderIndex: 1 },
                  { text: '2 hours', isCorrect: true, orderIndex: 2 },
                  { text: '4 hours', isCorrect: false, orderIndex: 3 },
                  { text: '6 hours', isCorrect: false, orderIndex: 4 }
                ]
              }
            },
            {
              question: 'What is the temperature danger zone for food?',
              type: 'MULTIPLE_CHOICE',
              orderIndex: 3,
              answers: {
                create: [
                  { text: '32°F to 140°F (0°C to 60°C)', isCorrect: false, orderIndex: 1 },
                  { text: '40°F to 140°F (4°C to 60°C)', isCorrect: true, orderIndex: 2 },
                  { text: '45°F to 135°F (7°C to 57°C)', isCorrect: false, orderIndex: 3 },
                  { text: '50°F to 150°F (10°C to 66°C)', isCorrect: false, orderIndex: 4 }
                ]
              }
            },
            {
              question: 'How often should hands be washed during food preparation?',
              type: 'MULTIPLE_CHOICE',
              orderIndex: 4,
              answers: {
                create: [
                  { text: 'Once at the beginning of shift', isCorrect: false, orderIndex: 1 },
                  { text: 'Every 30 minutes', isCorrect: false, orderIndex: 2 },
                  { text: 'Before and after handling each ingredient', isCorrect: true, orderIndex: 3 },
                  { text: 'Only when visibly dirty', isCorrect: false, orderIndex: 4 }
                ]
              }
            },
            {
              question: 'What should you do if you notice a coworker handling food with an open wound?',
              type: 'MULTIPLE_CHOICE',
              orderIndex: 5,
              answers: {
                create: [
                  { text: 'Ignore it if they seem careful', isCorrect: false, orderIndex: 1 },
                  { text: 'Tell them to cover it with a bandage and glove', isCorrect: true, orderIndex: 2 },
                  { text: 'Report them to management immediately', isCorrect: false, orderIndex: 3 },
                  { text: 'Finish the task for them', isCorrect: false, orderIndex: 4 }
                ]
              }
            }
          ]
        }
      },
      include: {
        questions: {
          include: {
            answers: true
          }
        }
      }
    })

    console.log('✅ Sample quiz created successfully!')
    console.log(`Quiz ID: ${quiz.id}`)
    console.log(`Quiz Title: ${quiz.title}`)
    console.log(`Questions: ${quiz.questions.length}`)
    console.log(`\nYou can test it at: http://localhost:8000/quizzes/${quiz.id}`)

  } catch (error) {
    console.error('Error creating sample quiz:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedQuiz()