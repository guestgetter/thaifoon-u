const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function checkUsers() {
  try {
    console.log("Checking users in database...")
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true
      }
    })
    
    console.log("Found users:", users.length)
    
    for (const user of users) {
      console.log(`\n${user.role}: ${user.email}`)
      console.log(`Name: ${user.name}`)
      console.log(`Password hash: ${user.password.substring(0, 20)}...`)
      
      // Test password verification
      const testPasswords = ['admin123', 'manager123', 'staff123']
      for (const testPassword of testPasswords) {
        const isValid = await bcrypt.compare(testPassword, user.password)
        if (isValid) {
          console.log(`✅ Password "${testPassword}" works for ${user.email}`)
        }
      }
    }
    
  } catch (error) {
    console.error("Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()