// prisma/seed.ts – Tạo admin user và dữ liệu mẫu ban đầu
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Tạo Admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      name: "Quản trị viên",
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user: ${admin.username} (password: admin123)`);

  // Tạo danh mục mẫu
  const categories = [
    { name: "Ống nước", slug: "ong-nuoc", description: "Ống nước các loại, phụ kiện đường nước" },
    { name: "Điện dân dụng", slug: "dien-dan-dung", description: "Thiết bị điện gia dụng, dây điện, công tắc" },
    { name: "Đồ biển", slug: "do-bien", description: "Dụng cụ, thiết bị phục vụ nghề biển" },
    { name: "Đồ nuôi tôm cá", slug: "do-nuoi-tom-ca", description: "Thiết bị, vật tư nuôi trồng thủy sản" },
    { name: "Dụng cụ xây dựng", slug: "dung-cu-xay-dung", description: "Dụng cụ và vật tư xây dựng" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ Created ${categories.length} categories`);

  console.log("✅ Seeding completed!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
