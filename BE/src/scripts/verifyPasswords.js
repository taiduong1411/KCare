const mongoose = require("mongoose");
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

// Function to verify all passwords are hashed
const verifyAllPasswords = async () => {
  try {
    console.log("🔍 Verifying all passwords are properly hashed...");

    // Find all accounts
    const accounts = await Account.find({});
    console.log(`📊 Found ${accounts.length} total accounts`);

    let hashedCount = 0;
    let plainTextCount = 0;
    const plainTextAccounts = [];

    console.log("\n📋 Password Status Report:");
    console.log("=".repeat(60));

    for (const account of accounts) {
      const isHashed = isPasswordHashed(account.password);

      if (isHashed) {
        console.log(`✅ ${account.email} - Password properly hashed`);
        hashedCount++;
      } else {
        console.log(
          `❌ ${account.email} - Password is PLAIN TEXT: "${account.password}"`
        );
        plainTextCount++;
        plainTextAccounts.push({
          email: account.email,
          password: account.password,
        });
      }
    }

    console.log("=".repeat(60));
    console.log("\n📈 Summary:");
    console.log(`✅ Properly hashed: ${hashedCount} accounts`);
    console.log(`❌ Plain text: ${plainTextCount} accounts`);
    console.log(`📊 Total: ${accounts.length} accounts`);

    if (plainTextCount > 0) {
      console.log("\n⚠️  WARNING: Found accounts with plain text passwords!");
      console.log(
        "🔧 Run 'npm run hash-passwords' to fix this security issue."
      );
      console.log("\nPlain text accounts:");
      plainTextAccounts.forEach((acc) => {
        console.log(`   - ${acc.email}: "${acc.password}"`);
      });
    } else {
      console.log("\n🎉 All passwords are properly secured!");
    }
  } catch (error) {
    console.error("❌ Error during password verification:", error);
  }
};

// Main execution
const runVerification = async () => {
  console.log("🔐 Starting password verification...");
  console.log("=".repeat(50));

  await connectDB();
  await verifyAllPasswords();

  console.log("=".repeat(50));
  console.log("✅ Verification completed!");

  // Close connection
  await mongoose.connection.close();
  console.log("🔌 Database connection closed");
  process.exit(0);
};

// Run the verification
runVerification().catch((error) => {
  console.error("💥 Verification failed:", error);
  process.exit(1);
});
