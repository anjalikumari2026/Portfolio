import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";

const Home = lazy(() => import("@/pages/public/HomePage"));
const About = lazy(() => import("@/pages/public/AboutPage"));
const Contact = lazy(() => import("@/pages/public/ContactPage"));
const Projects = lazy(() => import("@/pages/public/ProjectsPage"));
const Certificates = lazy(() => import("@/pages/public/CertificatesPage"));
const NotFound = lazy(() => import("@/pages/public/NotFound"));

const Login = lazy(() => import("@/pages/admin/Login"));
const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const ManageProjects = lazy(() => import("@/pages/admin/projects/ManageProjects"));
const AddProject = lazy(() => import("@/pages/admin/projects/AddProject"));
const EditProject = lazy(() => import("@/pages/admin/projects/EditProject"));
const ManageSkills = lazy(() => import("@/pages/admin/skills/ManageSkills"));
const ManageExperience = lazy(() => import("@/pages/admin/experience/ManageExperience"));
const ManageEducation = lazy(() => import("@/pages/admin/education/ManageEducation"));
const ManageCertificates = lazy(() => import("@/pages/admin/certificates/ManageCertificates"));
const ManageResume = lazy(() => import("@/pages/admin/resume/ManageResume"));
const ManageProfile = lazy(() => import("@/pages/admin/profile/ManageProfile"));
const ContactMessages = lazy(() => import("@/pages/admin/messages/ContactMessages"));

function PageFallback() {
  return (
    <div className="min-h-screen bg-[#07070e] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}

function LazyPage({ Component }) {
  return (
    <Suspense fallback={<PageFallback />}>
      <Component />
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <LazyPage Component={Home} /> },
      { path: "/about", element: <LazyPage Component={About} /> },
      { path: "/projects", element: <LazyPage Component={Projects} /> },
      { path: "/certificates", element: <LazyPage Component={Certificates} /> },
      { path: "/contact", element: <LazyPage Component={Contact} /> },
      { path: "*", element: <LazyPage Component={NotFound} /> },
    ],
  },
  {
    path: "/admin/login",
    element: <LazyPage Component={Login} />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute>
        <LazyPage Component={AdminLayout} />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <LazyPage Component={Dashboard} /> },
      { path: "projects", element: <LazyPage Component={ManageProjects} /> },
      { path: "projects/add", element: <LazyPage Component={AddProject} /> },
      { path: "projects/edit/:id", element: <LazyPage Component={EditProject} /> },
      { path: "skills", element: <LazyPage Component={ManageSkills} /> },
      { path: "experience", element: <LazyPage Component={ManageExperience} /> },
      { path: "education", element: <LazyPage Component={ManageEducation} /> },
      { path: "certificates", element: <LazyPage Component={ManageCertificates} /> },
      { path: "resume", element: <LazyPage Component={ManageResume} /> },
      { path: "profile", element: <LazyPage Component={ManageProfile} /> },
      { path: "messages", element: <LazyPage Component={ContactMessages} /> },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
