import { PrismaClient } from "@prisma/client";
import { products } from "../data/products.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding started...");

  const admin = await prisma.user.upsert({
    where: { email: "admin@inventory.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@inventory.com",
      password: "admin123",
      role: "ADMIN",
    },
  });

  await prisma.product.deleteMany();
  console.log("🧹 Old products cleared");

  await prisma.product.createMany({
    data: products.map((p) => ({
      ...p,
      createdById: admin.id,
    })),
  });

  console.log(`✅ ${products.length} products inserted`);
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
