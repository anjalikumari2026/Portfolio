import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, useRouteError, Link } from "react-router-dom";
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

function RouteErrorBoundary() {
  const error = useRouteError();
  const isChunkError =
    error?.message?.includes("dynamically imported module") ||
    error?.message?.includes("Failed to fetch") ||
    error?.message?.includes("Loading chunk");

  return (
    <div className="min-h-screen bg-[#07070e] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Page Load Failed</h2>
        <p className="text-slate-400 text-sm mb-6">
          {isChunkError
            ? "A module failed to load — this can happen after a new deployment. Please try again."
            : "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
          >
            Try Again
          </button>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-slate-300 font-medium text-sm hover:bg-white/[0.04] transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <RouteErrorBoundary />,
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
    errorElement: <RouteErrorBoundary />,
    element: <LazyPage Component={Login} />,
  },
  {
    path: "/admin/dashboard",
    errorElement: <RouteErrorBoundary />,
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
