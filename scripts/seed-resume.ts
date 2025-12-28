import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import PersonalInfo from "../models/PersonalInfo";
import Resume from "../models/Resume";

// Load env vars
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function seedResume() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // 1. Update Personal Info
    console.log("Updating Personal Info...");
    await PersonalInfo.deleteMany({}); // Clear existing
    await PersonalInfo.create({
      fullName: "Luu Nhu Thang",
      title: "Network and Information Security Engineer",
      bio: "Aim to enhance my skills and knowledge for certification exams, contributing to the growth of the company. Strive to acquire new skills and apply learned knowledge to support company projects.",
      email: "luunhuthang2402@gmail.com",
      phone: "0387591248",
      location: "Da Nang, Vietnam",
      socialLinks: [
        {
          platform: "LinkedIn",
          url: "https://linkedin.com/in/nhuthangluu",
          icon: "linkedin",
        },
        {
          platform: "GitHub",
          url: "https://github.com/nhuthangl24",
          icon: "github",
        },
        {
          platform: "Website",
          url: "https://nhuthangluu.id.vn",
          icon: "globe",
        },
      ],
      resumeUrl: "/NhuThang_CV.pdf",
    });

    // 2. Update Resume Items
    console.log("Updating Resume Items...");
    await Resume.deleteMany({}); // Clear existing

    const resumeItems = [
      // Education
      {
        section: "Education",
        title: "Network and Information Security Engineer",
        company: "Vietnam-Korea University of Information and Communication Technology",
        startDate: "Oct 2022",
        endDate: "Jan 2027",
        order: 1,
      },
      // Experience
      {
        section: "Experience",
        title: "ZK Developer Lab Intern",
        company: "ZKP Core Program – Da Nang, Vietnam",
        startDate: "Jul 2025",
        endDate: "Aug 2025",
        description: `• Participated in the ZK Core Program led by Ethereum Foundation and ZKP Labs, focusing on advanced cryptographic systems.
• Built real-world projects involving Zero-Knowledge Proofs (ZKP), secure identity protocols, and on-chain/off-chain proof verifications.
• Learned and applied zk-SNARKs, Poseidon Hash, Merkle Trees, and Circuit design using tools like Circom and SnarkJS.
• Contributed to a group project combining frontend dApp, smart contract, and ZK circuit to demonstrate privacy-preserving logic.`,
        order: 1,
      },
      // Awards
      {
        section: "Awards",
        title: "First Prize – Demo day ZK Core Program",
        startDate: "Jun 2025",
        description: "Award Certificate Link",
        order: 1,
      },
      // Projects
      {
        section: "Projects",
        title: "Simple Exchange Simulation with ZKP for Proof of Reserves",
        startDate: "Jun 2025",
        description: `• Developed a mini exchange platform (see GitHub repository) supporting deposit, withdrawal, and transaction tracking, integrated with zero-knowledge proof generation for Proof of Reserves
• Designed RESTful APIs and real-time proof updates using Express.js and Next.js
• Implemented Merkle tree construction and zk-SNARK verification to ensure cryptographic integrity of user balances
• Utilized JavaScript, Express.js, Next.js, Circom, and TailwindCSS for full-stack development`,
        order: 1,
      },
      {
        section: "Projects",
        title: "Anti-Scam Platform – Website for Reporting Scam Websites",
        startDate: "Dec 2024",
        description: `• Built a full-stack web platform (GitHub) allowing users to report and track scam websites, featuring real-time notifications and admin moderation
• Developed the frontend using React.js, TailwindCSS, and Vite for fast rendering and modern UI/UX
• Implemented RESTful API backend with Node.js and Express.js, using MongoDB as the main database
• Created modular route handlers for users, scam reports, news posts, and system notifications
• Enabled user authentication, admin approval system, and secure data validation
• Deployed frontend and backend using Vercel and Render
• Technologies: React, Vite, TailwindCSS, Node.js, Express.js, MongoDB, Vercel`,
        order: 2,
      },
      {
        section: "Projects",
        title: "Noazmovie – Movie Streaming Web App",
        startDate: "Apr 2025",
        description: `• Developed a responsive movie streaming platform (GitHub) with a modern UI using React.js and TailwindCSS
• Integrated third-party TMDB API to dynamically fetch movie data, including posters, genres, and trailers
• Implemented client-side search, category filtering, and detailed movie views
• Optimized performance with Vite for fast development and hot module replacement (HMR)
• Deployed on Vercel with production-ready CI/CD and environment management
• Technologies: React.js, Vite, TailwindCSS, TMDB API, Vercel`,
        order: 3,
      },
      {
        section: "Projects",
        title: "Noazlearn – Online Learning Platform",
        startDate: "Apr 2024",
        description: `• Developed a scalable online learning platform (GitHub) with a modern UI using React.js and TailwindCSS
• Designed RESTful API backend with Node.js, Express, and MongoDB for user authentication, course management, and notifications
• Implemented secure authentication flows with JWT, refresh tokens, and email verification
• Enabled dynamic course enrollment, progress tracking, and interactive comments
• Optimized performance and security with middleware, input validation, and rate limiting
• Technologies: Next.js, MongoDB, TailwindCSS, Vercel`,
        order: 4,
      },
      // Skills
      {
        section: "Skills",
        title: "Languages",
        description: "JavaScript, TypeScript, Python, HTML/CSS, C++, SQL",
        order: 1,
      },
      {
        section: "Skills",
        title: "Technologies",
        description: "Node.js, Express, MongoDB, React.js, TailwindCSS, Vercel, JWT, REST API",
        order: 2,
      },
    ];

    await Resume.insertMany(resumeItems);

    console.log("Resume seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding resume:", error);
    process.exit(1);
  }
}

seedResume();
