require("dotenv").config();
const dbConnect = require("../config/dbconnect");
const Profile = require("../models/ProfileModel");
const Skill = require("../models/SkillModel");
const Experience = require("../models/ExperienceModel");
const Project = require("../models/ProjectModel");
const Certificate = require("../models/CertificateModel");
const Education = require("../models/EducationModel");

const seedData = async () => {
  try {
    // Connect to database
    await dbConnect();
    console.log("✓ Database connected");

    // Clear existing data
    console.log("\n🗑️  Clearing existing data...");
    await Profile.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({});
    await Project.deleteMany({});
    await Education.deleteMany({});
    await Certificate.deleteMany({});
    console.log("✓ Existing data cleared");

    // ==================== PROFILE ====================
    console.log("\n📝 Seeding Profile...");
    const profile = await Profile.create({
      name: "Alok Patel",
      title: "MERN Stack Developer",
      bio: "Motivated MERN Stack Developer with hands-on experience building full-stack web applications using React.js, Node.js, Express.js, and MongoDB. Proficient in REST API development, JWT authentication, and delivering responsive, scalable web solutions.",
      email: "alokpatel0808@gmail.com",
      phone: "",
      location: "Raipur, Chhattisgarh, India",
      website: "",
      github: "https://github.com/alokpatel",
      linkedin: "https://linkedin.com/in/alokpatel",
      twitter: "https://twitter.com/alokpatel",
      instagram: "",
      profileImage: "",
      profilePublicId: "",
    });
    console.log("✓ Profile created");

    // ==================== EDUCATION ====================
    console.log("\n🎓 Seeding Education...");
    
    const educationData = [
      {
        degree: "B.Tech in Computer Science & Engineering",
        institution: "Centurion University of Technology and Management",
        university: "Centurion University",
        location: "Gunupur, Odisha, India",
        startYear: "2022",
        endYear: "2026",
        cgpaOrPercentage: "8.5/10.0",
        description: "Pursuing Bachelor's degree with focus on full-stack web development, data structures, and algorithms.",
        order: 0,
      },
      {
        degree: "Higher Secondary (12th)",
        institution: "Kendriya Vidyalaya No.2",
        university: "CBSE",
        location: "Raipur, Chhattisgarh, India",
        startYear: "2021",
        endYear: "2022",
        cgpaOrPercentage: "80%",
        description: "Science stream with Computer Science as elective.",
        order: 1,
      },
    ];

    const education = await Education.insertMany(educationData);
    console.log(`✓ ${education.length} education entries created`);

    // ==================== SKILLS ====================
    console.log("\n⚡ Seeding Skills...");
    
    // Helper function to map numeric level to enum
    const getSkillLevel = (level) => {
      if (level >= 80) return "Advanced";
      if (level >= 50) return "Intermediate";
      return "Beginner";
    };

    const skillsData = [
      // Frontend
      { name: "React.js", level: 90, category: "Frontend", icon: "⚛️" },
      { name: "Next.js", level: 85, category: "Frontend", icon: "▲" },
      { name: "TypeScript", level: 80, category: "Frontend", icon: "📘" },
      { name: "JavaScript", level: 90, category: "Frontend", icon: "📜" },
      { name: "Redux", level: 75, category: "Frontend", icon: "🔄" },
      { name: "HTML5", level: 95, category: "Frontend", icon: "🌐" },
      { name: "CSS3", level: 90, category: "Frontend", icon: "🎨" },
      { name: "Tailwind CSS", level: 95, category: "Frontend", icon: "🌊" },
      
      // Backend
      { name: "Node.js", level: 88, category: "Backend", icon: "🟢" },
      { name: "Express.js", level: 88, category: "Backend", icon: "🚂" },
      { name: "RESTful APIs", level: 85, category: "Backend", icon: "🔌" },
      
      // Databases
      { name: "MongoDB", level: 85, category: "Database", icon: "🍃" },
      { name: "MySQL", level: 75, category: "Database", icon: "🐬" },
      
      // Tools & DevOps
      { name: "Git", level: 85, category: "Tools", icon: "📦" },
      { name: "Postman", level: 90, category: "Tools", icon: "📮" },
      { name: "VS Code", level: 95, category: "Tools", icon: "💻" },
    ];

    const skills = await Skill.insertMany(
      skillsData.map(skill => ({
        ...skill,
        level: getSkillLevel(skill.level),
      }))
    );
    console.log(`✓ ${skills.length} skills created`);

    // ==================== EXPERIENCE ====================
    console.log("\n💼 Seeding Experience...");
    
    const experiencesData = [
      {
        companyName: "Learnify — Full-Stack EdTech Platform Project",
        role: "MERN Stack Development Training",
        location: "Gunupur, India",
        startDate: new Date("2025-06-01"),
        endDate: new Date("2025-06-30"),
        currentlyWorking: false,
        description: "Built full-stack web applications using MongoDB, Express.js, React.js, and Node.js",
      },
      {
        companyName: "Hebbale Academy",
        role: "Industry Exposure Program Intern (Python & AWS)",
        location: "Remote, India",
        startDate: new Date("2025-05-01"),
        endDate: new Date("2025-07-31"),
        currentlyWorking: false,
        description: "Developed online voting platform handling election data using AWS services",
      },
      {
        companyName: "KnackTech Pvt. Ltd.",
        role: "Web Development Intern",
        location: "Remote, India",
        startDate: new Date("2024-11-01"),
        endDate: new Date("2025-01-31"),
        currentlyWorking: false,
        description: "Developed Portfolio Website using HTML, CSS, JavaScript",
      },
    ];

    const experiences = await Experience.insertMany(experiencesData);
    console.log(`✓ ${experiences.length} experiences created`);

    // ==================== PROJECTS ====================
    console.log("\n🚀 Seeding Projects...");
    
    const projectsData = [
      {
        title: "LinkedIn-Inspired Social Media Platform",
        description: "Built a full-stack social networking app featuring JWT authentication, real-time notifications, and live messaging via Socket.io. Implemented user profiles, connection management, and Cloudinary-powered image uploads with a responsive UI",
        technologies: ["MERN", "Socket.io", "Cloudinary", "JWT"],
        githubLink: "https://github.com/alokpatel/social-media-platform",
        liveLink: "",
        image: "",
        featured: true,
      },
      {
        title: "Multivendor eCommerce Platform",
        description: "Architected a scalable multivendor marketplace with role-based access for admins, sellers, and buyers using TypeScript and MERN stack. Integrated Razorpay and Stripe payment gateways with end-to-end product management and order workflows",
        technologies: ["MERN", "TypeScript", "Tailwind CSS", "MUI", "Razorpay", "Stripe"],
        githubLink: "https://github.com/alokpatel/ecommerce-platform",
        liveLink: "",
        image: "",
        featured: true,
      },
      {
        title: "Full-Stack Movie Ticket Booking Platform",
        description: "Developed a feature-rich ticket booking platform with Clerk authentication, interactive seat selection, and an admin dashboard. Implemented automated seat reservation with auto-release logic using Inngest background jobs",
        technologies: ["MERN", "Clerk", "Inngest"],
        githubLink: "https://github.com/alokpatel/movie-booking-platform",
        liveLink: "",
        image: "",
        featured: true,
      },
    ];

    const projects = await Project.insertMany(projectsData);
    console.log(`✓ ${projects.length} projects created`);

    // ==================== CERTIFICATES ====================
    console.log("\n🏆 Seeding Certificates...");
    
    const certificatesData = [
      {
        title: "Namaste Node.js (Backend Development)",
        issuer: "NamasteDev.com",
        issueDate: new Date("2024-01-01"),
        certificateLink: "",
        image: "",
      },
      {
        title: "Namaste React (React.js)",
        issuer: "NamasteDev.com",
        issueDate: new Date("2024-02-01"),
        certificateLink: "",
        image: "",
      },
      {
        title: "Data Structures & Algorithms in Java",
        issuer: "PW Skills",
        issueDate: new Date("2023-06-01"),
        certificateLink: "",
        image: "",
      },
    ];

    const certificates = await Certificate.insertMany(certificatesData);
    console.log(`✓ ${certificates.length} certificates created`);

    // ==================== SUMMARY ====================
    console.log("\n" + "=".repeat(50));
    console.log("✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log("\n📊 Summary:");
    console.log(`  • Profile: 1`);
    console.log(`  • Education: ${education.length}`);
    console.log(`  • Skills: ${skills.length}`);
    console.log(`  • Experiences: ${experiences.length}`);
    console.log(`  • Projects: ${projects.length}`);
    console.log(`  • Certificates: ${certificates.length}`);
    console.log("\n💡 Note: You can now add images, GitHub links, and live demo URLs through the admin panel.");
    console.log("\n🎯 Your portfolio website will now display all your real data!");

    process.exit(0);
  } catch (error) {
    console.error("\n✗ Error seeding database:", error.message);
    console.error(error);
    process.exit(1);
  }
};

seedData();
