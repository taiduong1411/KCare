const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Import Account model
const Account = require("../model/account.model");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI_COMPASS);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Function to check if a password is already hashed
const isPasswordHashed = (password) => {
  // Bcrypt hashes always start with $2a$, $2b$, or $2y$ and are 60 characters long
  return password.startsWith("$2") && password.length === 60;
};

// Function to hash plain text passwords
const hashOldPasswords = async () => {
  try {
    console.log("🔍 Searching for accounts with plain text passwords...");

    // Find all accounts
    const accounts = await Account.find({});
    console.log(`📊 Found ${accounts.length} total accounts`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const account of accounts) {
      // Check if password is already hashed
      if (isPasswordHashed(account.password)) {
        console.log(`⏭️  Skipping ${account.email} - password already hashed`);
        skippedCount++;
        continue;
      }

      console.log(`🔐 Hashing password for ${account.email}...`);

      // Hash the plain text password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(account.password, salt);

      // Update directly in database (bypass pre-save middleware)
      await Account.findByIdAndUpdate(
        account._id,
        { password: hashedPassword },
        { new: true }
      );

      updatedCount++;
      console.log(`✅ Updated password for ${account.email}`);
    }

    console.log("\n🎉 Migration completed!");
    console.log(`📈 Updated: ${updatedCount} accounts`);
    console.log(`📋 Skipped: ${skippedCount} accounts (already hashed)`);
    console.log(`📊 Total: ${accounts.length} accounts`);
  } catch (error) {
    console.error("❌ Error during password hashing:", error);
  }
};

// Main execution
const runMigration = async () => {
  console.log("🚀 Starting password hashing migration...");
  console.log("=".repeat(50));

  await connectDB();
  await hashOldPasswords();

  console.log("=".repeat(50));
  console.log("✅ Migration finished successfully!");

  // Close connection
  await mongoose.connection.close();
  console.log("🔌 Database connection closed");
  process.exit(0);
};

// Run the migration
runMigration().catch((error) => {
  console.error("💥 Migration failed:", error);
  process.exit(1);
});
