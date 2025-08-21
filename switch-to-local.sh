#!/bin/bash
# Switch to local SQLite database for development

echo "Switching to local SQLite database..."

# Update schema to SQLite
sed -i.bak 's/provider = "postgresql"/provider = "sqlite"/g' prisma/schema.prisma

# Regenerate Prisma client
npx prisma generate

echo "✅ Switched to local SQLite database"
echo "🔧 Prisma client regenerated"
echo "🚀 You can now run: npm run dev"
echo ""
echo "Demo accounts:"
echo "  Admin: admin@thaifoon.com / admin123"
echo "  Manager: manager@thaifoon.com / manager123"
echo "  Staff: staff@thaifoon.com / staff123"