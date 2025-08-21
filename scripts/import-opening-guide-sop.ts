import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Importing Station 1 and 2 Opening Guide SOP...')

  // Find or create Kitchen Operations category
  let category = await prisma.category.findFirst({
    where: { name: 'Kitchen Operations' }
  })

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Kitchen Operations',
        description: 'Standard operating procedures for kitchen staff',
        color: '#f59e0b' // Orange color for kitchen operations
      }
    })
  }

  // Find admin user to be the creator
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (!adminUser) {
    throw new Error('No admin user found. Please run the seed script first.')
  }

  // Create the comprehensive SOP content
  const sopContent = `
<h2>BEFORE STARTING WORK</h2>

<h3>Punctuality:</h3>
<ul>
  <li>Arrive on time and be ready to work.</li>
</ul>

<h3>Hygiene:</h3>
<ul>
  <li>Wash your hands with soap before starting work.</li>
  <li>Wear a hairnet before entering the kitchen.</li>
</ul>

<h3>Clean Uniform:</h3>
<ul>
  <li><strong>You must be in a clean uniform.</strong> Failure to wear a clean uniform will result in a warning.</li>
</ul>

<h2>Opening List</h2>
<h3>10:00 – 10:45 AM (45 Minutes)</h3>

<h4>1. First Person</h4>
<ul>
  <li>☐ Turn on the hood and fan.</li>
  <li>☐ Turn on the fryer (350 degrees Fahrenheit) and Unox (500 F) / MerryChef (525 F)</li>
  <li>☐ Wash and rinse rice x2. Boil water to cook rice; 4 x 1kg/1L container cups of rice and 3.5 1kg/1L cups of water</li>
  <li>☐ Confirm protein level, move the required amount of frozen protein from the freezer to the fridge to maintain your par level. Refer to par level.</li>
  <li>☐ If you need to defrost protein from the fridge for prep, start defrosting it under running water. Refer to par level. <em>(Average consumption is 4-6 bags of chicken and 1-2 bags of beef /day).</em></li>
  <li>☐ <strong>Note: The opening staff needs to do a taste, smell and visual check of all produce, sauces and ingredients before service. Remove any items that have gone bad or spoiled.</strong></li>
</ul>

<h4>2. Set Up the Appetizer Line (Station 1):</h4>
<ul>
  <li>☐ <strong>Sanitize Workstation</strong> (solution must be swapped out every 90 minutes)
    <ul>
      <li>☐ Wipe cutting boards with fresh sanitizer</li>
      <li>☐ Maintain a sanitizer bucket with clean cloths in the kitchen at all times</li>
    </ul>
  </li>
  <li>☐ Thermometer and meat probe with sanitizing bucket</li>
  <li>☐ 3 x transparent containers (2L) with cold water for ladles and knives - must change out water every 90 minutes</li>
  <li>☐ 5 x Curry ladles (0.5 cup)</li>
  <li>☐ 1 x Rice Serving Scoop</li>
  <li>☐ Fryer Station: Frying baskets + wire basket for transfer</li>
  <li>☐ 6 x big tongs + 1 x small tong (for mango salad)</li>
  <li>☐ Pots and Pans</li>
  <li>☐ Set up Panko Station (flour, eggs, and panko crumbs)</li>
  <li>☐ <strong>Do an inventory check on prepared protein;</strong> boiled chicken, beef, raw peeled shrimp, peanut chicken, chicken satay, ground meat, tofu, battered chicken for Chilli Chicken
    <ul>
      <li>☐ Do a quality check - <strong>taste</strong>, smell and visual check</li>
    </ul>
  </li>
  <li>☐ <strong>Do a frozen inventory check on frozen appetizers:</strong> Avo Moonshine, Spring Rolls, Crispy Wontons, Mango sticky rice and Grilled Coconut Rice</li>
  <li>☐ <strong>Confirm inventory levels:</strong> Curries, Avo Sauce, Sour Cream, Mango dressing (regular and vegan), Sesame dressing, Sweet Coconut Milk, Vegan Tom Yum Paste and any feature items if applicable. <em>(Refer to the Appetizer checklist)</em>
    <ul>
      <li>☐ Do a quality check - <strong>taste</strong>, smell and visual check</li>
    </ul>
  </li>
  <li>☐ Confirm inventory levels for all vegetables.
    <ul>
      <li>☐ Do a quality check - <strong>taste</strong>, smell and visual check</li>
    </ul>
  </li>
  <li>☐ Marinate chicken with chilli chicken mix for frying</li>
  <li>☐ Prep rice noodles for Fresh Rolls (refer to SOP)</li>
  <li>☐ Start rolling fresh rolls (15 orders/ 30 pieces)</li>
</ul>

<h4>3. Station 2 Setup (Wok)</h4>
<ul>
  <li>☐ Soak Pad Thai noodles for <strong>no longer than 45 minutes</strong> and flat noodles for <strong>no longer than 3 hours</strong> (set a timer for 45 minutes)</li>
  <li>☐ Turn on burners, start boiling water (for cooking protein)</li>
  <li>☐ While the water for the next protein is boiling, get the lines ready with chilli oil, chives, garlic, oil and eggs.</li>
  <li>☐ <strong>Prep sauce for the line</strong>
    <ul>
      <li>☐ Vegan Stir Fry (with 1.5 oz ladle)</li>
      <li>☐ Pad Thai Sauce and Street Style (with 4oz ladle)</li>
      <li>☐ Vegan Pad Thai (with 4 oz ladle)</li>
      <li>☐ Thai Basil Paste (with 1 tbsp)</li>
      <li>☐ Szechuan Sauce (with 1 tbsp)</li>
      <li>☐ Brown Sauce (with 4 oz ladle)</li>
      <li>☐ Pad Kra Pow (with 1 oz ladle)</li>
      <li>☐ Sweet Dark Soy Bottle (with 1/2 tsp)</li>
      <li>☐ Mango Sauce (with 4 oz ladle)</li>
      <li>☐ Chilli Oil (with 1/2 tsp)</li>
      <li>☐ Garlic (with 1 tbsp)</li>
      <li>☐ Cooking oil (with 1 oz)</li>
    </ul>
  </li>
  <li>☐ <strong>Peanut Sauce Prep</strong>
    <ul>
      <li>☐ Plug in and turn on the peanut sauce warmer.</li>
      <li>☐ Heat the peanut sauce in the Wok first (Make sure it doesn't burn) and consistently stir to prevent the sauce from sticking to the bottom. Aim for 110 C</li>
      <li>☐ Transfer to the peanut sauce to warmer once warmed up. Must maintain a minimum of 60C in warmer.</li>
    </ul>
  </li>
  <li>☐ <strong>Protein Cooking:</strong>
    <ul>
      <li>☐ Begin cooking proteins (70% cooked) and keep it under running cold water, making sure the <strong>tap is very low</strong>. Ensure protein is evenly spread apart, no clumps, and not sticking to the bottom.</li>
      <li>☐ Drain cooked proteins immediately, label with date and initials, and refrigerate as soon as possible.</li>
      <li>☐ Defrost 4 bags of shrimps in cold running water (2 bags per station) and have one backup of shrimp ready in the fridge.</li>
    </ul>
  </li>
  <li>☐ <strong>Vegetable Prep</strong>
    <ul>
      <li>☐ Fill out the Vegetable Prep Checklist</li>
      <li>☐ Employee prepping must initial and date each container before storing.</li>
    </ul>
  </li>
  <li>☐ <strong>Complete Daily Prep Checklist (need to add pdf)</strong></li>
</ul>

<h2>Mid-Shift Checklist (2:00 PM - 4:00 PM)</h2>

<h3>Restocking & Backup:</h3>
<ul>
  <li>☐ Refill the line sauces (Make sure to have backup sauces pre-filled in containers)</li>
  <li>☐ Refill garnishes (basil, cilantro, green onion, fried basil, chives, etc</li>
  <li>☐ Prep backup veggies</li>
  <li>☐ Refill bean sprouts</li>
  <li>☐ Reheat the peanut sauce if needed</li>
  <li>☐ Fry more tofu cubes if necessary.</li>
  <li>☐ Check Jasmine Rice levels</li>
  <li>☐ Replace sanitizer buckets with fresh solution</li>
</ul>

<div style="margin-top: 2rem; padding: 1rem; background-color: #f3f4f6; border-radius: 0.5rem;">
  <p><strong>Note:</strong> Please inform your supervisor if the previous shift has not done the closing tasks correctly. Communicate with your work partner and ask for help if needed.</p>
</div>

<div style="margin-top: 2rem; padding: 1rem; background-color: #fef3c7; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
  <p><strong>Equipment Lists:</strong> Refer to the attached Equipment Lists PDF for complete station setup requirements.</p>
</div>
  `

  // Create the SOP
  const sop = await prisma.standardOperatingProcedure.create({
    data: {
      title: 'Station 1 and 2: Opening Guide',
      content: sopContent,
      version: '1.0',
      categoryId: category.id,
      createdById: adminUser.id,
      isActive: true,
      attachments: [
        {
          name: 'Equipment Lists.pdf',
          url: '/uploads/files/equipment-lists.pdf', // Placeholder - would be uploaded in real usage
          type: 'application/pdf',
          size: 3682200, // 3682.2KB as shown in the image
          uploadedAt: new Date().toISOString()
        }
      ]
    },
    include: {
      category: true,
      createdBy: {
        select: { name: true }
      }
    }
  })

  console.log('✅ Successfully imported Station 1 and 2 Opening Guide SOP')
  console.log(`   ID: ${sop.id}`)
  console.log(`   Title: ${sop.title}`)
  console.log(`   Category: ${sop.category.name}`)
  console.log(`   Version: ${sop.version}`)
  console.log(`   Attachments: ${sop.attachments ? JSON.parse(JSON.stringify(sop.attachments)).length : 0} files`)
}

main()
  .catch((e) => {
    console.error('❌ Error importing SOP:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
