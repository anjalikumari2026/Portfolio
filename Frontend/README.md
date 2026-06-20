# Folder Structure
# Root Level
Alok-Portfolio/
├── .env
├── .env.example
├── .env.local
├── .git/
├── .gitignore
├── ARCHITECTURE_AND_FIXES.md
├── QUICKSTART.md
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── dist/
├── node_modules/
├── public/
├── Portfolio-backend/
└── src/

# src/ Directory Structure
src/
├── App.jsx
├── api/
│   ├── axios.js
│   └── endpoints.js
├── assets/
│   ├── animations/
│   ├── icons/
│   └── logos/
├── components/
│   ├── about/
│   │   ├── About.jsx
│   │   ├── AboutCard.jsx
│   │   ├── Education.jsx
│   │   └── ResumeDownload.jsx
│   ├── certificates/
│   │   ├── CertificateCard.jsx
│   │   └── Certificates.jsx
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── EmptyState.jsx
│   │   ├── Footer.jsx
│   │   ├── Loader.jsx
│   │   ├── Navbar.jsx
│   │   ├── ScrollToTop.jsx
│   │   └── SectionHeading.jsx
│   ├── contact/
│   │   ├── Contact.jsx
│   │   ├── ContactForm.jsx
│   │   └── SocialLinks.jsx
│   ├── dashboard/
│   │   ├── DashboardLayout.jsx
│   │   ├── DashboardStats.jsx
│   │   ├── Sidebar.jsx
│   │   └── Topbar.jsx
│   ├── experience/
│   │   ├── Experience.jsx
│   │   ├── ExperienceCard.jsx
│   │   └── Timeline.jsx
│   ├── home/
│   │   ├── CTAButtons.jsx
│   │   ├── HeroSection.jsx
│   │   └── Intro.jsx
│   ├── projects/
│   │   ├── ProjectCard.jsx
│   │   ├── ProjectFilter.jsx
│   │   ├── ProjectModal.jsx
│   │   └── Projects.jsx
│   └── skills/
│       ├── SkillCard.jsx
│       └── SkillCategory.jsx
└── pages/
    ├── admin/
    │   ├── Dashboard.jsx
    │   ├── Login.jsx
    │   ├── certificates/
    │   │   └── ManageCertificates.jsx
    │   ├── experience/
    │   │   └── ManageExperience.jsx
    │   ├── messages/
    │   │   └── ContactMessages.jsx
    │   ├── profile/
    │   │   └── ManageProfile.jsx
    │   ├── projects/
    │   │   ├── AddProject.jsx
    │   │   ├── EditProject.jsx
    │   │   └── ManageProjects.jsx
    │   ├── resume/
    │   │   └── ManageResume.jsx
    │   └── skills/
    │       └── ManageSkills.jsx
    └── public/
        ├── AboutPage.jsx
        ├── CertificatesPage.jsx
        ├── ContactPage.jsx
        ├── HomePage.jsx
        ├── NotFound.jsx
        └── ProjectsPage.jsx
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
