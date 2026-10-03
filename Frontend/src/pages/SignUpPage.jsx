import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import { notify } from "../store/useNotificationStore";
import AuthImagePattern from "../components/AuthImagePattern";
import GoogleAuthButton from "../components/GoogleAuthButton";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      notify.error("Please enter your full name.", "Validation Error");
      return false;
    }
    if (!formData.email.trim()) {
      notify.error("Please enter a valid email address.", "Validation Error");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      notify.error("Please enter a valid email format.", "Validation Error");
      return false;
    }
    if (!formData.password) {
      notify.error("Please enter a password.", "Validation Error");
      return false;
    }
    if (formData.password.length < 6) {
      notify.error("Password must be at least 6 characters long.", "Validation Error");
      return false;
    }
    if (!acceptedTerms) {
      notify.error("You must agree to the Terms of Service and Privacy Policy to create an account.", "Agreement Required");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 items-center pt-16 p-4 sm:p-8 neu-bg overflow-y-auto">
      {/* Left Side Visual */}
      <AuthImagePattern />

      {/* Right Side Form */}
      <div className="flex flex-col justify-center items-center p-4 sm:p-6">
        <div className="w-full max-w-md neu-raised-lg rounded-3xl p-6 sm:p-8 space-y-5">
          {/* Logo & Header */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-2xl neu-inset flex items-center justify-center text-[var(--accent-color)]">
                <MessageSquare className="size-6 text-[var(--accent-color)]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight mt-2 text-[var(--text-primary)]">
                Create Account
              </h1>
              <p className="text-xs font-semibold text-[var(--text-secondary)]">
                Get started with your free Syncrona account
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] pl-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <User className="size-4" />
                </div>
                <input
                  type="text"
                  className="w-full neu-input rounded-2xl pl-10 pr-4 py-2.5 text-sm placeholder:text-[var(--placeholder-color)]"
                  placeholder="John Paul"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
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
                />
              </div>
            </div>

            {/* Password */}
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

            {/* Terms Acceptance Checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 size-4 rounded border-[var(--border-color)] accent-[var(--accent-color)] cursor-pointer"
              />
              <label htmlFor="acceptTerms" className="text-xs font-medium text-[var(--text-secondary)] leading-tight select-none cursor-pointer">
                I agree to the{" "}
                <Link to="/terms" target="_blank" className="text-[var(--accent-color)] font-bold hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy-policy" target="_blank" className="text-[var(--accent-color)] font-bold hover:underline">
                  Privacy Policy
                </Link>.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full neu-btn-accent py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 mt-2"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                "Create Account"
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
              Already have an account?{" "}
              <Link to="/login" className="text-[var(--accent-color)] font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;