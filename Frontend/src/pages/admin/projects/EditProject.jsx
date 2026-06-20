import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import projectService from "@/services/projectService";
import { ProjectForm } from "@/pages/admin/projects/AddProject";
import Loader from "@/components/common/Loader";
import toast from "react-hot-toast";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectService.getProjectById(id);
        if (!data?.project) throw new Error("Project not found");
        setProject(data.project);
      } catch (error) {
        toast.error(error.message || "Failed to load project");
        navigate("/admin/dashboard/projects", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, navigate]);

  return (
    <div className="min-h-screen bg-[#07070e] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-violet-600/4 rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10">
        <p className="text-xs text-cyan-400 tracking-[0.3em] uppercase mb-2">
          Admin · Projects
        </p>
        <h1 className="text-3xl font-bold text-white mb-8">Edit Project</h1>

        {loading ? (
          <Loader />
        ) : (
          <ProjectForm initial={project} mode="edit" />
        )}
      </div>
    </div>
  );
}
