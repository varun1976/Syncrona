import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import GoogleAuthButton from "../components/GoogleAuthButton";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 items-center pt-16 p-4 sm:p-8 neu-bg overflow-y-auto">
      {/* Form Container */}
      <div className="flex flex-col justify-center items-center p-4 sm:p-6">
        <div className="w-full max-w-md neu-raised-lg rounded-3xl p-6 sm:p-8 space-y-6">
          {/* Logo & Header */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-2xl neu-inset flex items-center justify-center text-[var(--accent-color)]">
                <MessageSquare className="size-6 text-[var(--accent-color)]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight mt-2 text-[var(--text-primary)]">
                Welcome Back
              </h1>
              <p className="text-xs font-semibold text-[var(--text-secondary)]">
                Sign in to your Syncrona account
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] pl-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <Mail className="size-4" />
                </div>
                <input
                  type="email"
                  className="w-full neu-input rounded-2xl pl-10 pr-4 py-2.5 text-sm placeholder:text-[var(--placeholder-color)]"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] pl-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <Lock className="size-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full neu-input rounded-2xl pl-10 pr-10 py-2.5 text-sm placeholder:text-[var(--placeholder-color)]"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full neu-btn-accent py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 mt-2"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="w-full border-t border-[var(--border-color)]"></div>
            <span className="absolute px-3 py-0.5 neu-inset-sm rounded-full text-[10px] font-bold uppercase text-[var(--text-muted)] tracking-wider">
              Or
            </span>
          </div>

          <GoogleAuthButton />

          <div className="text-center pt-1">
            <p className="text-xs font-medium text-[var(--text-secondary)]">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-[var(--accent-color)] font-bold hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side Pattern */}
      <AuthImagePattern />
    </div>
  );
};

export default LoginPage;