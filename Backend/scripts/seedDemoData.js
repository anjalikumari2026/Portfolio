require("dotenv").config();
const dbConnect = require("../config/dbconnect");
const Skill = require("../models/SkillModel");
const Experience = require("../models/ExperienceModel");
const Project = require("../models/ProjectModel");
const Certificate = require("../models/CertificateModel");
const Contact = require("../models/ContactModel");
const Education = require("../models/EducationModel");

// Command line arguments
const args = process.argv.slice(2);
const command = args[0]; // 'add' or 'clear'

const seedDemoData = async () => {
  try {
    // Connect to database
    await dbConnect();
    console.log("✓ Database connected");

    if (command === "clear") {
      await clearDemoData();
    } else if (command === "add") {
      await addDemoData();
    } else {
      console.log("\n❌ Invalid command. Use: node seedDemoData.js [add|clear]");
      console.log("  add  - Add demo data without deleting existing data");
      console.log("  clear - Remove only demo data (keeps your real data)");
      process.exit(1);
    }
  } catch (error) {
    console.error("\n✗ Error:", error.message);
    console.error(error);
    process.exit(1);
  }
};

const clearDemoData = async () => {
  console.log("\n🗑️  Clearing demo data only (keeping your real data)...");
  
  const result = await Promise.all([
    Skill.deleteMany({ isDemo: true }),
    Education.deleteMany({ isDemo: true }),
    Experience.deleteMany({ isDemo: true }),
    Project.deleteMany({ isDemo: true }),
    Certificate.deleteMany({ isDemo: true }),
    Contact.deleteMany({ isDemo: true }),
  ]);

  const [
    skillsDeleted,
    educationDeleted,
    experiencesDeleted,
    projectsDeleted,
    certificatesDeleted,
    messagesDeleted,
  ] = result;

  console.log(`✓ Cleared ${skillsDeleted.deletedCount} demo skills`);
  console.log(`✓ Cleared ${educationDeleted.deletedCount} demo education entries`);
  console.log(`✓ Cleared ${experiencesDeleted.deletedCount} demo experiences`);
  console.log(`✓ Cleared ${projectsDeleted.deletedCount} demo projects`);
  console.log(`✓ Cleared ${certificatesDeleted.deletedCount} demo certificates`);
  console.log(`✓ Cleared ${messagesDeleted.deletedCount} demo messages`);

  console.log("\n" + "=".repeat(50));
  console.log("✅ DEMO DATA CLEARED SUCCESSFULLY!");
  console.log("=".repeat(50));
  console.log("\n💡 Your real data is safe and intact.");

  process.exit(0);
};

const addDemoData = async () => {
  console.log("\n📝 Adding demo data (keeping your real data)...");

  // ==================== SKILLS ====================
  console.log("\n⚡ Adding demo skills...");
  
  const demoSkills = [
    // Frontend
    { name: "Vue.js", level: 75, category: "Frontend", icon: "💚", isDemo: true },
    { name: "Angular", level: 70, category: "Frontend", icon: "🅰️", isDemo: true },
    { name: "Svelte", level: 65, category: "Frontend", icon: "🔥", isDemo: true },
    { name: "Bootstrap", level: 85, category: "Frontend", icon: "🅱️", isDemo: true },
    { name: "jQuery", level: 60, category: "Frontend", icon: "💲", isDemo: true },
    { name: "Sass", level: 80, category: "Frontend", icon: "🎨", isDemo: true },
    { name: "Webpack", level: 70, category: "Frontend", icon: "📦", isDemo: true },
    { name: "GraphQL", level: 72, category: "Frontend", icon: "◈", isDemo: true },
    
    // Backend
    { name: "Django", level: 75, category: "Backend", icon: "🎸", isDemo: true },
    { name: "Spring Boot", level: 70, category: "Backend", icon: "🍃", isDemo: true },
    { name: "Laravel", level: 72, category: "Backend", icon: "🔴", isDemo: true },
    { name: "Flask", level: 68, category: "Backend", icon: "🌶️", isDemo: true },
    { name: "Ruby on Rails", level: 65, category: "Backend", icon: "💎", isDemo: true },
    { name: "FastAPI", level: 78, category: "Backend", icon: "⚡", isDemo: true },
    { name: "Go", level: 70, category: "Backend", icon: "🐹", isDemo: true },
    { name: "Rust", level: 60, category: "Backend", icon: "🦀", isDemo: true },
    
    // Database
    { name: "PostgreSQL", level: 80, category: "Database", icon: "🐘", isDemo: true },
    { name: "Firebase", level: 75, category: "Database", icon: "🔥", isDemo: true },
    { name: "Redis", level: 72, category: "Database", icon: "🔴", isDemo: true },
    { name: "SQLite", level: 78, category: "Database", icon: "📁", isDemo: true },
    { name: "Cassandra", level: 60, category: "Database", icon: "👁️", isDemo: true },
    { name: "Elasticsearch", level: 65, category: "Database", icon: "🔍", isDemo: true },
    
    // Mobile
    { name: "React Native", level: 75, category: "Mobile", icon: "📱", isDemo: true },
    { name: "Flutter", level: 70, category: "Mobile", icon: "🦋", isDemo: true },
    { name: "Swift", level: 65, category: "Mobile", icon: "🍎", isDemo: true },
    { name: "Kotlin", level: 68, category: "Mobile", icon: "🤖", isDemo: true },
    
    // Cloud
    { name: "AWS", level: 78, category: "Cloud", icon: "☁️", isDemo: true },
    { name: "Azure", level: 72, category: "Cloud", icon: "🔷", isDemo: true },
    { name: "GCP", level: 70, category: "Cloud", icon: "🌐", isDemo: true },
    { name: "Docker", level: 82, category: "Cloud", icon: "🐳", isDemo: true },
    { name: "Kubernetes", level: 70, category: "Cloud", icon: "☸️", isDemo: true },
    { name: "Terraform", level: 65, category: "Cloud", icon: "🏗️", isDemo: true },
  ];

  // Helper function to map numeric level to enum
  const getSkillLevel = (level) => {
    if (level >= 80) return "Advanced";
    if (level >= 50) return "Intermediate";
    return "Beginner";
  };

  const skills = await Skill.insertMany(
    demoSkills.map(skill => ({
      ...skill,
      level: getSkillLevel(skill.level),
    }))
  );
  console.log(`✓ Added ${skills.length} demo skills`);

  // ==================== EDUCATION ====================
  console.log("\n🎓 Adding demo education...");
  
  const demoEducation = [
    {
      degree: "B.Sc. in Computer Science",
      institution: "Stanford University",
      university: "Stanford University",
      location: "Stanford, CA",
      startYear: "2016",
      endYear: "2020",
      cgpaOrPercentage: "3.8/4.0",
      description: "Dean's List all semesters. Specialized in distributed systems and machine learning.",
      order: 0,
      isDemo: true,
    },
    {
      degree: "Higher Secondary Education",
      institution: "Montgomery High School",
      university: "California State Board",
      location: "San Diego, CA",
      startYear: "2014",
      endYear: "2016",
      cgpaOrPercentage: "95%",
      description: "Valedictorian. President of Computer Science Club.",
      order: 1,
      isDemo: true,
    },
  ];

  const education = await Education.insertMany(demoEducation);
  console.log(`✓ Added ${education.length} demo education entries`);

  // ==================== EXPERIENCE ====================
  console.log("\n💼 Adding demo experiences...");
  
  const demoExperiences = [
    {
      companyName: "Google",
      role: "Senior Software Engineer",
      location: "Mountain View, CA",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2024-12-31"),
      currentlyWorking: false,
      description: "Led development of core search infrastructure serving billions of queries daily. Implemented ML-powered ranking algorithms improving search relevance by 15%.",
      tags: ["Go", "Python", "ML", "BigQuery"],
      isDemo: true,
    },
    {
      companyName: "Microsoft",
      role: "Full Stack Developer",
      location: "Redmond, WA",
      startDate: new Date("2021-06-01"),
      endDate: new Date("2022-12-31"),
      currentlyWorking: false,
      description: "Developed features for Azure DevOps platform. Built CI/CD pipelines used by 50k+ developers. Reduced deployment time by 40%.",
      tags: ["C#", ".NET", "Azure", "TypeScript"],
      isDemo: true,
    },
    {
      companyName: "Amazon",
      role: "SDE II",
      location: "Seattle, WA",
      startDate: new Date("2020-01-01"),
      endDate: new Date("2021-05-31"),
      currentlyWorking: false,
      description: "Worked on AWS Lambda team. Implemented new monitoring features reducing debugging time by 50%. Contributed to serverless computing best practices.",
      tags: ["Java", "AWS", "Lambda", "Docker"],
      isDemo: true,
    },
    {
      companyName: "TechStart Inc.",
      role: "Lead Developer",
      location: "San Francisco, CA",
      startDate: new Date("2018-06-01"),
      endDate: new Date("2019-12-31"),
      currentlyWorking: false,
      description: "Led a team of 5 developers building a fintech platform from scratch. Architected microservices handling $10M+ in transactions.",
      tags: ["Node.js", "React", "PostgreSQL", "Kubernetes"],
      isDemo: true,
    },
    {
      companyName: "CodeCraft",
      role: "Junior Developer",
      location: "New York, NY",
      startDate: new Date("2017-01-01"),
      endDate: new Date("2018-05-31"),
      currentlyWorking: false,
      description: "Built responsive web applications for various clients. Gained experience in full-stack development and agile methodologies.",
      tags: ["JavaScript", "PHP", "MySQL", "jQuery"],
      isDemo: true,
    },
  ];

  const experiences = await Experience.insertMany(demoExperiences);
  console.log(`✓ Added ${experiences.length} demo experiences`);

  // ==================== PROJECTS ====================
  console.log("\n🚀 Adding demo projects...");
  
  const demoProjects = [
    {
      title: "ShopFlow - E-commerce Platform",
      description: "A full-featured e-commerce platform with multi-vendor support, real-time inventory management, and AI-powered product recommendations. Built with PERN stack and Stripe integration.",
      technologies: ["PostgreSQL", "Express", "React", "Node.js", "Stripe", "Redis"],
      githubLink: "https://github.com/demo/shopflow",
      liveLink: "https://shopflow-demo.vercel.app",
      image: "https://via.placeholder.com/800x600/4F46E5/ffffff?text=ShopFlow+E-commerce",
      featured: true,
      category: "E-commerce",
      isDemo: true,
    },
    {
      title: "ConnectHub - Social Network",
      description: "A LinkedIn-inspired social networking platform with real-time messaging, job posting, and professional networking features. Uses WebSockets for instant communication.",
      technologies: ["MongoDB", "Express", "React", "Node.js", "Socket.io", "Cloudinary"],
      githubLink: "https://github.com/demo/connecthub",
      liveLink: "https://connecthub-demo.vercel.app",
      image: "https://via.placeholder.com/800x600/0EA5E9/ffffff?text=ConnectHub+Social",
      featured: true,
      category: "Social Media",
      isDemo: true,
    },
    {
      title: "DevPortfolio - Portfolio Builder",
      description: "A drag-and-drop portfolio builder for developers. Features customizable templates, real-time preview, and one-click deployment to Vercel/Netlify.",
      technologies: ["Next.js", "TypeScript", "Tailwind", "Prisma", "Vercel"],
      githubLink: "https://github.com/demo/devportfolio",
      liveLink: "https://devportfolio-demo.vercel.app",
      image: "https://via.placeholder.com/800x600/10B981/ffffff?text=DevPortfolio+Builder",
      featured: true,
      category: "Portfolio",
      isDemo: true,
    },
    {
      title: "AdminPro - Dashboard Template",
      description: "A comprehensive admin dashboard template with 50+ components, charts, data tables, and authentication. Used by 10k+ developers worldwide.",
      technologies: ["Vue.js", "Vuetify", "Chart.js", "Firebase", "PWA"],
      githubLink: "https://github.com/demo/adminpro",
      liveLink: "https://adminpro-demo.vercel.app",
      image: "https://via.placeholder.com/800x600/F59E0B/ffffff?text=AdminPro+Dashboard",
      featured: false,
      category: "Admin Dashboard",
      isDemo: true,
    },
    {
      title: "FitTrack - Fitness App",
      description: "A cross-platform mobile fitness tracking app with workout plans, progress tracking, and social features. Syncs with Apple Health and Google Fit.",
      technologies: ["React Native", "Firebase", "Redux", "Expo", "HealthKit"],
      githubLink: "https://github.com/demo/fittrack",
      liveLink: "https://fittrack-demo.vercel.app",
      image: "https://via.placeholder.com/800x600/EC4899/ffffff?text=FitTrack+Mobile",
      featured: true,
      category: "Mobile App",
      isDemo: true,
    },
    {
      title: "CloudDeploy - CI/CD Tool",
      description: "A simplified CI/CD deployment tool for small teams. Features GitHub integration, automated testing, and one-click deployments to multiple cloud providers.",
      technologies: ["Go", "Docker", "Kubernetes", "GitHub API", "AWS"],
      githubLink: "https://github.com/demo/clouddeploy",
      liveLink: "https://clouddeploy-demo.vercel.app",
      image: "https://via.placeholder.com/800x600/8B5CF6/ffffff?text=CloudDeploy+CI/CD",
      featured: false,
      category: "DevOps",
      isDemo: true,
    },
  ];

  const projects = await Project.insertMany(demoProjects);
  console.log(`✓ Added ${projects.length} demo projects`);

  // ==================== CERTIFICATES ====================
  console.log("\n🏆 Adding demo certificates...");
  
  const demoCertificates = [
    {
      title: "Google Cloud Professional Cloud Architect",
      issuer: "Google Cloud",
      issueDate: new Date("2024-03-15"),
      certificateLink: "https://cloud.google.com/certification/cloud-architect",
      image: "https://via.placeholder.com/400x300/4285F4/ffffff?text=Google+Cloud+Architect",
      isDemo: true,
    },
    {
      title: "Microsoft Azure Solutions Architect Expert",
      issuer: "Microsoft",
      issueDate: new Date("2024-01-20"),
      certificateLink: "https://learn.microsoft.com/certifications/azure-solutions-architect",
      image: "https://via.placeholder.com/400x300/0078D4/ffffff?text=Azure+Solutions+Architect",
      isDemo: true,
    },
    {
      title: "AWS Certified Solutions Architect - Professional",
      issuer: "Amazon Web Services",
      issueDate: new Date("2023-11-10"),
      certificateLink: "https://aws.amazon.com/certification/certified-solutions-architect-professional",
      image: "https://via.placeholder.com/400x300/FF9900/ffffff?text=AWS+Solutions+Architect",
      isDemo: true,
    },
    {
      title: "Meta Front-End Developer Professional Certificate",
      issuer: "Meta / Coursera",
      issueDate: new Date("2023-08-05"),
      certificateLink: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
      image: "https://via.placeholder.com/400x300/0668E1/ffffff?text=Meta+Front-End",
      isDemo: true,
    },
    {
      title: "IBM Data Science Professional Certificate",
      issuer: "IBM / Coursera",
      issueDate: new Date("2023-05-15"),
      certificateLink: "https://www.coursera.org/professional-certificates/ibm-data-science",
      image: "https://via.placeholder.com/400x300/0F62FE/ffffff?text=IBM+Data+Science",
      isDemo: true,
    },
    {
      title: "TensorFlow Developer Certificate",
      issuer: "Google",
      issueDate: new Date("2023-02-28"),
      certificateLink: "https://www.tensorflow.org/certificate",
      image: "https://via.placeholder.com/400x300/FF6F00/ffffff?text=TensorFlow+Developer",
      isDemo: true,
    },
  ];

  const certificates = await Certificate.insertMany(demoCertificates);
  console.log(`✓ Added ${certificates.length} demo certificates`);

  // ==================== MESSAGES ====================
  console.log("\n💬 Adding demo contact messages...");
  
  const demoMessages = [
    {
      name: "Sarah Johnson",
      email: "sarah.johnson@techcorp.com",
      subject: "Job Opportunity - Senior Developer Position",
      message: "Hi there! I came across your portfolio and was impressed by your work. We have an opening for a Senior Developer position at TechCorp and would love to discuss this opportunity with you. Would you be available for a call next week?",
      isDemo: true,
    },
    {
      name: "Michael Chen",
      email: "michael.chen@startup.io",
      subject: "Collaboration on Open Source Project",
      message: "Hello! I'm working on an open-source project that aligns perfectly with your skills. We're looking for contributors and I think you'd be a great addition to our team. Let me know if you're interested!",
      isDemo: true,
    },
    {
      name: "Emily Rodriguez",
      email: "emily.rodriguez@designstudio.com",
      subject: "Freelance Project Inquiry",
      message: "Hi! I run a design studio and we're looking for a developer to help us build a client's e-commerce website. Your portfolio looks amazing. Would you be interested in taking on this project? Budget is flexible.",
      isDemo: true,
    },
    {
      name: "David Kim",
      email: "david.kim@university.edu",
      subject: "Mentorship Request",
      message: "Hello! I'm a computer science student and I've been following your work. I was wondering if you'd be open to mentoring me or providing some guidance on starting a career in full-stack development. I'd really appreciate any advice you could share!",
      isDemo: true,
    },
  ];

  const messages = await Contact.insertMany(demoMessages);
  console.log(`✓ Added ${messages.length} demo messages`);

  // ==================== SUMMARY ====================
  console.log("\n" + "=".repeat(50));
  console.log("✅ DEMO DATA ADDED SUCCESSFULLY!");
  console.log("=".repeat(50));
  console.log("\n📊 Summary:");
  console.log(`  • Skills: ${skills.length} (20+ new skills)`);
  console.log(`  • Education: ${education.length} (2 new entries)`);
  console.log(`  • Experiences: ${experiences.length} (5 new experiences)`);
  console.log(`  • Projects: ${projects.length} (6 new projects)`);
  console.log(`  • Certificates: ${certificates.length} (6 new certificates)`);
  console.log(`  • Messages: ${messages.length} (4 new messages)`);
  console.log("\n💡 Your real data is safe and intact.");
  console.log("💡 To remove demo data later, run: node seedDemoData.js clear");
  console.log("\n🎯 Demo data marked with isDemo: true flag for easy identification.");

  process.exit(0);
};

seedDemoData();
