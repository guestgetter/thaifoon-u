# Thaifoon University - Restaurant Training Portal

A comprehensive, mobile-first learning management system designed specifically for restaurant staff training. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **🎓 Interactive Training Courses** - Structured learning modules with progress tracking
- **📋 Standard Operating Procedures** - Searchable, categorized SOPs with version control
- **🧪 Quizzes & Assessments** - Comprehensive testing with scoring and attempt tracking
- **👨‍💼 Admin Panel** - Full content management system for admins and managers
- **📱 Mobile-First Design** - Fully responsive, optimized for phone usage
- **🔐 Role-Based Access** - Admin, Manager, and Staff user roles
- **📊 Progress Tracking** - Individual and system-wide analytics
- **🎨 Intuitive UI** - Clean, restaurant-focused design

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS with custom theming
- **Database**: Prisma ORM with SQLite (easily upgradeable to PostgreSQL)
- **Authentication**: NextAuth.js with credentials provider
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up the database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Seed the database with demo data**:
   ```bash
   npx tsx scripts/seed.ts
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** to [http://localhost:3000](http://localhost:3000)

## Demo Accounts

The seed script creates the following demo accounts:

- **Admin**: `admin@thaifoon.com` / `admin123`
- **Manager**: `manager@thaifoon.com` / `manager123`
- **Staff**: `staff@thaifoon.com` / `staff123`

## Project Structure

```
thaifoon-university/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── admin/             # Admin panel pages
│   │   ├── courses/           # Training courses
│   │   ├── dashboard/         # User dashboard
│   │   ├── login/             # Authentication
│   │   ├── quizzes/           # Assessments
│   │   └── sops/              # Standard Operating Procedures
│   ├── components/            # Reusable React components
│   │   ├── layout/            # Layout components
│   │   ├── providers/         # Context providers
│   │   └── ui/                # UI component library
│   ├── lib/                   # Utility functions
│   ├── types/                 # TypeScript type definitions
│   └── generated/             # Generated Prisma client
├── prisma/                    # Database schema and migrations
├── scripts/                   # Database seeding and utilities
└── public/                    # Static assets
```

## Database Schema

The application uses a comprehensive database schema including:

- **Users** with role-based permissions (Admin, Manager, Staff)
- **Categories** for organizing content
- **Courses** with nested **Modules** and **Lessons**
- **Quizzes** with **Questions** and **Answers**
- **Standard Operating Procedures** with versioning
- **Progress Tracking** for courses and lessons
- **Quiz Attempts** with scoring and history

## Key Features Explained

### 🎓 Course Management
- Hierarchical structure: Course → Module → Lesson
- Support for text, video, and file content
- Progress tracking at both course and lesson level
- Category-based organization

### 📋 SOP Management
- Version control for procedures
- Category-based organization
- Rich text content support
- Search and filtering capabilities

### 🧪 Quiz System
- Multiple question types (Multiple Choice, True/False, Short Answer)
- Configurable passing scores and attempt limits
- Time limits and scoring
- Detailed attempt history

### 👨‍💼 Admin Features
- User management with role assignment
- Content creation and editing
- System analytics and reporting
- Category management

### 📱 Mobile Optimization
- Touch-friendly interface
- Responsive design for all screen sizes
- Optimized for restaurant environments
- Fast loading and offline-capable design

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Development

### Adding New Features

1. **Database Changes**: Update `prisma/schema.prisma` and run migrations
2. **API Routes**: Add new API endpoints in `src/app/api/`
3. **Pages**: Create new pages in the appropriate `src/app/` directory
4. **Components**: Build reusable components in `src/components/`

### Code Quality

- **TypeScript**: Full type safety throughout the application
- **ESLint**: Configured for Next.js and React best practices
- **Prettier**: Code formatting (when configured)
- **Prisma**: Type-safe database operations

## Deployment

### Production Database

For production, update your environment variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/thaifoon_university"
```

### Deployment Platforms

The application is ready to deploy on:

- **Vercel** (recommended for Next.js)
- **Railway**
- **Heroku**
- **Digital Ocean**
- **AWS/Google Cloud/Azure**

### Pre-deployment Checklist

1. Set up production database
2. Update environment variables
3. Run database migrations
4. Build and test the application
5. Set up monitoring and analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

Copyright © 2024 Thaifoon Restaurants. All rights reserved.

---

Built with ❤️ for restaurant teams everywhere.
# Latest build: Thu Aug  7 14:54:21 EDT 2025
