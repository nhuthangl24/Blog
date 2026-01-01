
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import connectDB from "../lib/db";
import PersonalInfo from "../models/PersonalInfo";

// Load env vars
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const seedAds = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    // 1. Sidebar Ad (Telegram)
    const sidebarScript = `
<div style="width:100%; background:#f0f9ff; border:1px solid #bae6fd; border-radius:8px; padding:16px; text-align:center;">
  <h3 style="margin:0 0 8px 0; color:#0284c7; font-weight:bold;">Join Our Telegram</h3>
  <p style="font-size:14px; color:#334155; margin-bottom:12px;">Get the latest security updates and discussions.</p>
  <a href="https://t.me/cybersec_discuss" target="_blank" style="display:inline-block; background:#0ea5e9; color:white; padding:8px 16px; text-decoration:none; border-radius:4px; font-weight:500;">Join Now</a>
</div>
`;

    // 2. Footer Ad (Course)
    const footerScript = `
<div style="width:100%; background:#1e293b; color:white; border-radius:8px; padding:24px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
  <h3 style="margin:0 0 8px 0; font-size:1.25rem; font-weight:bold; color:#38bdf8;">Master Web Security</h3>
  <p style="color:#94a3b8; margin-bottom:16px; max-width:600px;">Learn advanced penetration testing techniques with our comprehensive course.</p>
  <a href="#" style="background:#38bdf8; color:#0f172a; padding:10px 24px; border-radius:6px; text-decoration:none; font-weight:bold; transition: background 0.2s;">Enroll Today - 50% OFF</a>
</div>
`;

    // 3. Floating Left (Spigen Case) - Vertical
    const floatingLeftScript = `
<div style="width:160px; height:600px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; display:flex; flex-direction:column;">
  <div style="height:400px; background:#f8fafc; display:flex; align-items:center; justify-content:center;">
    <img src="https://via.placeholder.com/140x380?text=Spigen+Case" alt="Spigen" style="max-width:100%; height:auto;" />
  </div>
  <div style="padding:12px; text-align:center; flex:1; display:flex; flex-direction:column; justify-content:center;">
    <h4 style="margin:0 0 4px 0; font-size:14px; font-weight:bold; color:#0f172a;">Spigen Ultra Hybrid</h4>
    <p style="font-size:12px; color:#64748b; margin:0 0 8px 0;">Best protection for iPhone 15</p>
    <a href="#" style="display:block; background:#0f172a; color:white; padding:6px; border-radius:4px; text-decoration:none; font-size:12px;">Buy Now</a>
  </div>
</div>
`;

    // 4. Floating Right (Innostyle) - Vertical
    const floatingRightScript = `
<div style="width:160px; height:600px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; display:flex; flex-direction:column;">
  <div style="height:400px; background:#f8fafc; display:flex; align-items:center; justify-content:center;">
    <img src="https://via.placeholder.com/140x380?text=Innostyle" alt="Innostyle" style="max-width:100%; height:auto;" />
  </div>
  <div style="padding:12px; text-align:center; flex:1; display:flex; flex-direction:column; justify-content:center;">
    <h4 style="margin:0 0 4px 0; font-size:14px; font-weight:bold; color:#0f172a;">Innostyle PowerGo</h4>
    <p style="font-size:12px; color:#64748b; margin:0 0 8px 0;">Fast Charging Power Bank</p>
    <a href="#" style="display:block; background:#0f172a; color:white; padding:6px; border-radius:4px; text-decoration:none; font-size:12px;">Shop Now</a>
  </div>
</div>
`;

    // Update PersonalInfo with these ads
    const settings = await PersonalInfo.findOne();
    if (settings) {
      settings.ads = {
        enabled: true,
        sidebar: { enabled: true, script: sidebarScript },
        footer: { enabled: true, script: footerScript },
        floatingLeft: { enabled: true, script: floatingLeftScript },
        floatingRight: { enabled: true, script: floatingRightScript },
      };
      await settings.save();
      console.log("Ads updated successfully");
    } else {
      console.log("Settings not found, creating new...");
      await PersonalInfo.create({
        name: "Admin",
        email: "admin@example.com",
        ads: {
            enabled: true,
            sidebar: { enabled: true, script: sidebarScript },
            footer: { enabled: true, script: footerScript },
            floatingLeft: { enabled: true, script: floatingLeftScript },
            floatingRight: { enabled: true, script: floatingRightScript },
        }
      });
    }

    console.log("Done!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding ads:", error);
    process.exit(1);
  }
};

seedAds();
