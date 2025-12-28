import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Lab from "../models/Lab";

// Load env vars
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function seedLab() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const sampleLab = {
      title: "SQL Injection Basics",
      slug: "sql-injection-basics",
      description: "Learn the fundamentals of SQL Injection (SQLi) and how to exploit a simple login bypass vulnerability.",
      category: "Web Security",
      difficulty: "Beginner",
      status: "published",
      tags: ["sqli", "web", "owasp-top-10"],
      challengePath: "/challenges/sqli-basics",
      solutionMDX: `
### Solution
1. Navigate to the login page.
2. In the username field, enter: \`admin' --\`
3. Enter anything in the password field (e.g., \`123\`).
4. Click Login.
5. You should be logged in as the administrator.
      `,
      contentMDX: `
# SQL Injection Basics

## Introduction
SQL Injection (SQLi) is a web security vulnerability that allows an attacker to interfere with the queries that an application makes to its database. It generally allows an attacker to view data that they are not normally able to retrieve.

## The Vulnerability
Consider a simple login form that takes a username and password. The backend code might look like this:

\`\`\`sql
SELECT * FROM users WHERE username = '$username' AND password = '$password'
\`\`\`

If the application doesn't properly sanitize the input, an attacker can input a malicious string to alter the query logic.

## Exploitation
If we input \`admin' --\` as the username, the query becomes:

\`\`\`sql
SELECT * FROM users WHERE username = 'admin' --' AND password = '...'
\`\`\`

The \`--\` sequence signifies a comment in SQL, causing the rest of the query (the password check) to be ignored. This allows the attacker to log in as the admin without knowing the password.

## Remediation
The most effective way to prevent SQL injection is to use **Prepared Statements** (also known as Parameterized Queries).

\`\`\`javascript
// Vulnerable
const query = "SELECT * FROM users WHERE username = '" + username + "'";

// Secure (using Prepared Statements)
const query = "SELECT * FROM users WHERE username = ?";
db.execute(query, [username]);
\`\`\`
      `
    };

    // Check if lab exists
    const existingLab = await Lab.findOne({ slug: sampleLab.slug });
    if (existingLab) {
      console.log("Lab already exists, updating...");
      await Lab.findOneAndUpdate({ slug: sampleLab.slug }, sampleLab);
    } else {
      console.log("Creating new lab...");
      await Lab.create(sampleLab);
    }

    console.log("Lab seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding lab:", error);
    process.exit(1);
  }
}

seedLab();
