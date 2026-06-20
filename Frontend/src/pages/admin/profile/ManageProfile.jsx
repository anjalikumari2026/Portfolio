import { useState, useEffect, useRef } from "react";
import profileService from "@/services/profileService";
import { useProfile } from "@/context/ProfileContext";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";

const inp =
  "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all duration-300";
const label = "text-xs text-slate-400 mb-1.5 block";

const ALLOWED_TYPES = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function ManageProfile() {
  const { refetch: refetchProfile } = useProfile();
  const [profile, setProfile] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    github: "",
    linkedin: "",
    twitter: "",
    website: "",
    profileImage: "",
    profilePublicId: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      console.log("[ManageProfile] Fetched profile data:", data);
      const p = data?.profile || data || {
        name: "",
        title: "",
        email: "",
        phone: "",
        location: "",
        bio: "",
        github: "",
        linkedin: "",
        twitter: "",
        website: "",
        profileImage: "",
        profilePublicId: "",
      };
      setProfile(p);
      if (p.profileImage) {
        setPreview(p.profileImage);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Allowed: PNG, JPG, JPEG, WEBP");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error("File too large. Maximum size is 10MB");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    setUploading(true);
    try {
      const data = await profileService.uploadProfileImage(selectedFile);
      console.log("[ManageProfile] Upload response:", data);
      setProfile((p) => ({
        ...p,
        profileImage: data.profile.profileImage,
      }));
      setPreview(data.profile.profileImage);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      refetchProfile();
      toast.success("Profile photo uploaded successfully");
    } catch (error) {
      toast.error(error.message || "Failed to upload image");
      setPreview(profile?.profileImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!profile?.profileImage) return;
    setUploading(true);
    try {
      const data = await profileService.deleteProfileImage();
      console.log("[ManageProfile] Delete image response:", data);
      setProfile((p) => ({ ...p, profileImage: "", profilePublicId: "" }));
      setPreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      refetchProfile();
      toast.success("Profile photo removed");
    } catch (error) {
      toast.error(error.message || "Failed to remove image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (selectedFile) {
      toast.error("You have a file selected but not uploaded. Click 'Upload' first.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...profile };
      delete payload.profilePublicId;
      console.log("[ManageProfile] Saving profile payload:", payload);
      const response = await profileService.updateProfile(payload);
      console.log("[ManageProfile] Save response:", response);
      refetchProfile();
      toast.success("Profile updated successfully");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070e] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10">
        <p className="text-xs text-cyan-400 tracking-[0.3em] uppercase mb-2">
          Admin
        </p>
        <h1 className="text-3xl font-bold text-white mb-8">Manage Profile</h1>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        )}

        {!loading && (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Profile Photo */}
            <div className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
              <h2 className="text-sm font-bold text-white mb-5">Profile Photo</h2>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile preview"
                      className="w-20 h-20 rounded-2xl object-cover border border-white/[0.08]"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-cyan-900/20 border border-white/[0.08] flex items-center justify-center text-4xl">
                      👨‍💻
                    </div>
                  )}
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 blur-md -z-10" />
                  {uploading && (
                    <div className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center">
                      <svg className="w-6 h-6 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="profile-image-input"
                  />
                  <div className="flex flex-wrap gap-2">
                    <label
                      htmlFor="profile-image-input"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-300 text-sm hover:bg-white/[0.07] transition-all duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Choose Photo
                    </label>
                    {selectedFile && !uploading && (
                      <button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploading}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 disabled:opacity-60"
                      >
                        Upload
                      </button>
                    )}
                    {profile?.profileImage && !selectedFile && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={uploading}
                        className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-all duration-300 disabled:opacity-60"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    PNG, JPG, JPEG, WEBP up to 10MB
                  </p>
                  {selectedFile && (
                    <p className="text-xs text-cyan-400 mt-1">
                      {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(1)}MB) — click Upload
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
              <h2 className="text-sm font-bold text-white mb-5">
                Basic Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={label}>Full Name</label>
                  <input
                    className={inp}
                    value={profile?.name || ""}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className={label}>Professional Title</label>
                  <input
                    className={inp}
                    value={profile?.title || ""}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, title: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className={label}>Email</label>
                  <input
                    type="email"
                    className={inp}
                    value={profile?.email || ""}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className={label}>Phone</label>
                  <input
                    className={inp}
                    value={profile?.phone || ""}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, phone: e.target.value }))
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>Location</label>
                  <input
                    className={inp}
                    value={profile?.location || ""}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, location: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
              <h2 className="text-sm font-bold text-white mb-5">Bio</h2>
              <textarea
                rows={4}
                className={`${inp} resize-none`}
                value={profile?.bio || ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, bio: e.target.value }))
                }
              />
              <p className="text-xs text-slate-600 mt-2">
                {profile?.bio?.length || 0} / 500 characters
              </p>
            </div>

            {/* Social Links */}
            <div className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
              <h2 className="text-sm font-bold text-white mb-5">Social Links</h2>
              <div className="space-y-3">
                {[
                  {
                    key: "github",
                    icon: "GH",
                    placeholder: "https://github.com/username",
                  },
                  {
                    key: "linkedin",
                    icon: "in",
                    placeholder: "https://linkedin.com/in/username",
                  },
                  {
                    key: "twitter",
                    icon: "𝕏",
                    placeholder: "https://twitter.com/username",
                  },
                  {
                    key: "website",
                    icon: "🌐",
                    placeholder: "https://yoursite.com",
                  },
                ].map((s) => (
                  <div key={s.key} className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold w-6 text-center">
                      {s.icon}
                    </span>
                    <input
                      className={`${inp} pl-10`}
                      placeholder={s.placeholder}
                      value={profile?.[s.key] || ""}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, [s.key]: e.target.value }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Save */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : saved ? (
                <>
                  <svg
                    className="w-4 h-4 text-emerald-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Saved!
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
