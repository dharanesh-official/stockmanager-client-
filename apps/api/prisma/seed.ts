import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Common Password for all demo users
    const password = 'StockPro@123';
    const passwordHash = await argon2.hash(password);

    // 1. Create a Brand
    const brand = await prisma.brand.upsert({
        where: { slug: 'stockpro-global' },
        update: {},
        create: {
            name: 'StockPro Global',
            slug: 'stockpro-global',
            status: 'ACTIVE',
        },
    });

    // 2. Create a Warehouse
    const warehouse = await prisma.warehouse.create({
        data: {
            name: 'Main Distribution Center',
            location: 'New York, USA',
            brandId: brand.id,
        }
    });

    console.log(`🏭 Created Warehouse: ${warehouse.name}`);

    // 3. Create Super Admin
    const superAdmin = await prisma.user.upsert({
        where: { email: 'admin@stockpro.com' },
        update: { passwordHash }, // Reset password just in case
        create: {
            email: 'admin@stockpro.com',
            fullName: 'Super Admin',
            passwordHash,
            role: 'SUPER_ADMIN',
            isActive: true,
        },
    });

    // 4. Create Brand Admin
    const brandAdmin = await prisma.user.upsert({
        where: { email: 'brand@stockpro.com' },
        update: { passwordHash, brandId: brand.id },
        create: {
            email: 'brand@stockpro.com',
            fullName: 'Brand Admin',
            passwordHash,
            role: 'BRAND_ADMIN',
            brandId: brand.id,
            isActive: true,
        },
    });

    // 5. Create Warehouse Manager
    const warehouseManager = await prisma.user.upsert({
        where: { email: 'manager@stockpro.com' },
        update: { passwordHash, brandId: brand.id, assignedWarehouseId: warehouse.id },
        create: {
            email: 'manager@stockpro.com',
            fullName: 'Warehouse Manager',
            passwordHash,
            role: 'WAREHOUSE_MANAGER',
            brandId: brand.id,
            assignedWarehouseId: warehouse.id,
            isActive: true,
        },
    });

    // 6. Create Finance Manager
    const financeManager = await prisma.user.upsert({
        where: { email: 'finance@stockpro.com' },
        update: { passwordHash, brandId: brand.id },
        create: {
            email: 'finance@stockpro.com',
            fullName: 'Priya Das',
            passwordHash,
            role: 'FINANCE_MANAGER',
            brandId: brand.id,
            isActive: true,
        },
    });

    // 7. Create Sales Person
    const salesPerson = await prisma.user.upsert({
        where: { email: 'sales@stockpro.com' },
        update: { passwordHash, brandId: brand.id },
        create: {
            email: 'sales@stockpro.com',
            fullName: 'Amit Singhania',
            passwordHash,
            role: 'SALES_PERSON',
            brandId: brand.id,
            isActive: true,
        },
    });

    console.log(`✅ Seeded Successfully!`);
    console.log('------------------------------------------------');
    console.log(`🔐 Password for all users: ${password}`);
    console.log(`1️⃣  Super Admin:      ${superAdmin.email}`);
    console.log(`2️⃣  Brand Admin:      ${brandAdmin.email}`);
    console.log(`3️⃣  Finance Manager:  ${financeManager.email}`);
    console.log(`4️⃣  Sales Person:     ${salesPerson.email}`);
    console.log(`5️⃣  Warehouse Manager: ${warehouseManager.email}`);
    console.log('------------------------------------------------');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
