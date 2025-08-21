#!/bin/bash
# Switch to production PostgreSQL database for deployment

echo "Switching to production PostgreSQL database..."

# Update schema to PostgreSQL
sed -i.bak 's/provider = "sqlite"/provider = "postgresql"/g' prisma/schema.prisma

# Regenerate Prisma client
npx prisma generate

echo "✅ Switched to production PostgreSQL database"
echo "🔧 Prisma client regenerated"
echo "🚀 Ready for production deployment"
echo ""
echo "Next steps:"
echo "  1. git add ."
echo "  2. git commit -m 'Switch to PostgreSQL for production'"
echo "  3. git push origin main"