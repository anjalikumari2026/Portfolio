require("dotenv").config();
const dbConnect = require("../config/dbconnect");
const Admin = require("../models/AdminModel");
const bcryptjs = require("bcryptjs");

const createAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "Admin";

    if (!adminEmail || !adminPassword) {
      console.error("✗ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
      process.exit(1);
    }

    if (adminPassword.length < 8) {
      console.error("✗ ADMIN_PASSWORD must be at least 8 characters");
      process.exit(1);
    }

    await dbConnect();
    console.log("✓ Database connected");

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`⚠ Admin already exists with email: ${adminEmail}`);
      console.log("If you want to recreate, delete the existing admin first.");
      process.exit(0);
    }

    const hashedPassword = await bcryptjs.hash(adminPassword, 10);
    console.log("✓ Password hashed");

    const admin = await Admin.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✓ Admin user created successfully:");
    console.log(`  Email: ${admin.email}`);
    console.log(`  Name: ${admin.name}`);
    console.log(`  Role: ${admin.role}`);

    process.exit(0);
  } catch (error) {
    console.error("✗ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
