import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "@/services/authService";
import toast from "react-hot-toast";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  const validate = () => {
    const e = {};
    if (!form.currentPassword.trim()) e.currentPassword = "Current password is required";
    if (!form.newPassword.trim()) e.newPassword = "New password is required";
    else if (form.newPassword.length < 8) e.newPassword = "Minimum 8 characters";
    if (!form.confirmPassword.trim()) e.confirmPassword = "Confirm password is required";
    else if (form.confirmPassword !== form.newPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const clearForm = () => {
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setErrors({});
    setShowPw({ current: false, new: false, confirm: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      if (response.success) {
        toast.success("Password changed successfully!");
        clearForm();
        setTimeout(() => navigate("/admin/dashboard"), 1500);
      }
    } catch (error) {
      const errorMsg = error.message || "Failed to change password.";
      setErrors({ submit: errorMsg });
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const inp = (err) =>
    `w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border ${err ? "border-red-500/40" : "border-white/[0.08]"} text-slate-300 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all duration-300`;

  const pwIcon = (field) => (
    <button
      type="button"
      onClick={() => setShowPw((s) => ({ ...s, [field]: !s[field] }))}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {showPw[field] ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
          />
        ) : (
          <>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </>
        )}
      </svg>
    </button>
  );

  const lockIcon = () => (
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none"
      viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Change Password</h1>
        <p className="text-slate-500 text-sm mt-1">Update your admin account password</p>
      </div>

      {/* Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
        {errors.submit && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Current Password</label>
            <div className="relative">
              {lockIcon()}
              <input
                type={showPw.current ? "text" : "password"}
                placeholder="Enter current password"
                value={form.currentPassword}
                onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
                disabled={loading}
                className={`${inp(errors.currentPassword)} pr-10`}
              />
              {pwIcon("current")}
            </div>
            {errors.currentPassword && <p className="text-xs text-red-400 mt-1">{errors.currentPassword}</p>}
          </div>

          {/* New Password */}
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">New Password</label>
            <div className="relative">
              {lockIcon()}
              <input
                type={showPw.new ? "text" : "password"}
                placeholder="Minimum 8 characters"
                value={form.newPassword}
                onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
                disabled={loading}
                className={`${inp(errors.newPassword)} pr-10`}
              />
              {pwIcon("new")}
            </div>
            {errors.newPassword && <p className="text-xs text-red-400 mt-1">{errors.newPassword}</p>}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Confirm New Password</label>
            <div className="relative">
              {lockIcon()}
              <input
                type={showPw.confirm ? "text" : "password"}
                placeholder="Re-enter new password"
                value={form.confirmPassword}
                onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                disabled={loading}
                className={`${inp(errors.confirmPassword)} pr-10`}
              />
              {pwIcon("confirm")}
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="px-5 py-3 rounded-xl border border-white/[0.08] text-slate-400 font-medium text-sm hover:bg-white/[0.04] hover:text-white transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}