import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { notify } from "../store/useNotificationStore";
import {
  Camera,
  Mail,
  User,
  AlertTriangle,
  Trash2,
  X,
  Loader2,
  ShieldCheck,
  Calendar,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  Key,
  Pencil,
  Check,
} from "lucide-react";

const ProfilePage = () => {
  const {
    authUser,
    isUpdatingProfile,
    updateProfile,
    isDeletingAccount,
    deleteAccount,
    isChangingPassword,
    changePassword,
  } = useAuthStore();

  const [selectedImg, setSelectedImg] = useState(null);

  // Full Name edit state
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(authUser?.fullName || "");
  const [nameError, setNameError] = useState("");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Danger zone modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. File size validation (Max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      notify.error("This image is too large. Please choose an image smaller than 5MB.", "File Too Large");
      e.target.value = "";
      return;
    }

    // 2. MIME type validation
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type.toLowerCase()) && !file.type.startsWith("image/")) {
      notify.error("This image format is not supported. Please choose a JPEG, PNG, GIF, or WebP file.", "Unsupported Format");
      e.target.value = "";
      return;
    }

    // 3. File reading with error handler
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      try {
        await updateProfile({ profilePic: base64Image });
      } catch (err) {
        setSelectedImg(null);
      }
    };
    reader.onerror = () => {
      notify.error("This image could not be opened. Please try another image.", "Invalid File");
      e.target.value = "";
    };
  };

  const handleStartEditName = () => {
    setIsEditingName(true);
    setNameInput(authUser?.fullName || "");
    setNameError("");
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setNameInput(authUser?.fullName || "");
    setNameError("");
  };

  const handleSaveName = async (e) => {
    if (e) e.preventDefault();
    setNameError("");

    const trimmed = nameInput.trim();
    if (!trimmed) {
      setNameError("Full name cannot be empty");
      return;
    }
    if (trimmed.length < 2) {
      setNameError("Full name must be at least 2 characters long");
      return;
    }
    if (trimmed.length > 50) {
      setNameError("Full name cannot exceed 50 characters");
      return;
    }
    if (trimmed === authUser?.fullName) {
      setIsEditingName(false);
      return;
    }

    try {
      await updateProfile({ fullName: trimmed });
      setIsEditingName(false);
      setNameError("");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update full name";
      setNameError(msg);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match");
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to change password";
      setPasswordError(msg);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setConfirmText("");
    setErrorMessage("");
  };

  const handleCloseModal = () => {
    if (isDeletingAccount) return;
    setIsModalOpen(false);
    setConfirmText("");
    setErrorMessage("");
  };

  const handleDeleteAccount = async () => {
    if (confirmText.trim().toUpperCase() !== "DELETE" || isDeletingAccount) return;
    setErrorMessage("");
    try {
      await deleteAccount();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete account. Please try again.";
      setErrorMessage(msg);
    }
  };

  const memberSinceDate = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Active User";

  const isGoogleUser = authUser?.authProvider === "google";

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 neu-bg select-none transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Main Card Wrapper */}
        <div className="neu-raised-lg rounded-3xl p-6 sm:p-8 lg:p-10 space-y-8">
          
          {/* Dashboard Header */}
          <div className="flex items-center gap-3.5 border-b border-[var(--border-color)] pb-6">
            <div className="size-12 rounded-2xl neu-inset flex items-center justify-center text-[var(--accent-color)] flex-shrink-0">
              <User className="size-6 text-[var(--accent-color)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Profile & Account Settings
              </h1>
              <p className="text-xs font-semibold text-[var(--text-secondary)]">
                Manage your identity, personal details, security credentials, and account preferences
              </p>
            </div>
          </div>

          {/* Main 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* =================================================================== */}
            {/* LEFT COLUMN: Profile Information (5 / 12 cols = ~42%) */}
            {/* =================================================================== */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* A. Profile Card (Avatar & Display Name) */}
              <div className="neu-inset rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center">
                <div className="relative">
                  <div className="size-32 rounded-full neu-raised-lg p-1.5 flex items-center justify-center">
                    <img
                      src={selectedImg || authUser?.profilePic || "/avatar.png"}
                      alt="Profile"
                      className="size-full rounded-full object-cover neu-inset-sm"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/avatar.png";
                      }}
                    />
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className={`
                      absolute bottom-1 right-1 
                      neu-btn p-2.5 rounded-full cursor-pointer 
                      text-[var(--accent-color)]
                      ${isUpdatingProfile ? "animate-pulse pointer-events-none" : "hover:scale-105"}
                    `}
                    title="Change profile picture"
                  >
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUpdatingProfile}
                    />
                  </label>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-[var(--text-primary)]">
                    {authUser?.fullName}
                  </h3>
                  <p className="text-xs font-medium text-[var(--text-muted)]">
                    {isUpdatingProfile
                      ? "Updating profile details..."
                      : "Click camera icon to upload a custom profile picture"}
                  </p>
                </div>
              </div>

              {/* B. Personal Details */}
              <div className="neu-inset rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                  <User className="size-4 text-[var(--accent-color)]" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    Personal Details
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Full Name Field (Editable) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                        Full Name
                      </label>
                      {!isEditingName && (
                        <button
                          type="button"
                          onClick={handleStartEditName}
                          disabled={isUpdatingProfile}
                          className="neu-btn px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-all cursor-pointer"
                          title="Edit Full Name"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>

                    {isEditingName ? (
                      <form onSubmit={handleSaveName} className="space-y-2 pt-1">
                        <input
                          type="text"
                          value={nameInput}
                          onChange={(e) => {
                            setNameInput(e.target.value);
                            setNameError("");
                          }}
                          placeholder="Enter full name"
                          disabled={isUpdatingProfile}
                          autoFocus
                          className="w-full neu-input rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[var(--text-primary)]"
                        />

                        {nameError && (
                          <div className="text-xs font-semibold text-[var(--error-color)] flex items-center gap-1.5 pl-1">
                            <AlertTriangle className="size-3.5 flex-shrink-0" />
                            <span>{nameError}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleCancelEditName}
                            disabled={isUpdatingProfile}
                            className="neu-btn px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer disabled:opacity-50"
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            disabled={isUpdatingProfile}
                            className="neu-btn-accent px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                          >
                            {isUpdatingProfile ? (
                              <>
                                <Loader2 className="size-3.5 animate-spin" />
                                <span>Saving...</span>
                              </>
                            ) : (
                              <>
                                <Check className="size-3.5" />
                                <span>Save</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="px-4 py-3 neu-inset-sm rounded-xl font-semibold text-[var(--text-primary)] text-sm w-full">
                        {authUser?.fullName}
                      </div>
                    )}
                  </div>

                  {/* Email Address Field (Read-Only) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                        Email Address
                      </label>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-2 py-0.5 rounded neu-inset-sm">
                        Read-Only
                      </span>
                    </div>
                    <div className="px-4 py-3 neu-inset-sm rounded-xl font-semibold text-[var(--text-primary)] text-sm break-all w-full opacity-90 select-text">
                      {authUser?.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* C. Account Overview */}
              <div className="neu-inset rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                  <ShieldCheck className="size-4 text-[var(--accent-color)]" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    Account Overview
                  </h2>
                </div>

                <div className="space-y-3.5 text-xs font-medium">
                  {/* Member Since */}
                  <div className="flex items-center justify-between py-1 border-b border-[var(--border-color)]/60">
                    <span className="text-[var(--text-secondary)] flex items-center gap-2">
                      <Calendar className="size-3.5 text-[var(--accent-color)]" />
                      Member Since
                    </span>
                    <span className="text-[var(--text-primary)] font-bold">
                      {memberSinceDate}
                    </span>
                  </div>

                  {/* Account Status */}
                  <div className="flex items-center justify-between py-1 border-b border-[var(--border-color)]/60">
                    <span className="text-[var(--text-secondary)] flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-[var(--success-color)]" />
                      Account Status
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full neu-inset-sm text-xs font-bold text-[var(--success-color)]">
                      Active
                    </span>
                  </div>

                  {/* Auth Provider */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[var(--text-secondary)] flex items-center gap-2">
                      <KeyRound className="size-3.5 text-[var(--accent-color)]" />
                      Authentication Method
                    </span>
                    <span className="text-[var(--text-primary)] font-bold capitalize">
                      {isGoogleUser ? "Google OAuth 2.0" : "Email & Password"}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* =================================================================== */}
            {/* RIGHT COLUMN: Account Actions & Security (7 / 12 cols = ~58%) */}
            {/* =================================================================== */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* A. Account Security Card */}
              <div className="neu-inset rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="size-4 text-[var(--accent-color)]" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                      Account Security
                    </h2>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md neu-inset-sm text-[var(--accent-color)]">
                    {isGoogleUser ? "OAuth Managed" : "Password Auth"}
                  </span>
                </div>

                {/* Conditional Rendering: Google OAuth vs Local Password Change */}
                {isGoogleUser ? (
                  <div className="p-5 neu-inset-sm rounded-xl space-y-3 border border-[var(--border-color)]/50">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-[var(--accent-color)]/10 flex items-center justify-center text-[var(--accent-color)] flex-shrink-0">
                        <Key className="size-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[var(--text-primary)]">
                          Google Single Sign-On Active
                        </h3>
                        <p className="text-xs font-medium text-[var(--text-secondary)]">
                          Password change handled by Google
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed pt-1">
                      Your Syncrona account is linked directly to your Google Account identity. Password changes, two-factor authentication, and account credentials are managed through Google Security settings.
                    </p>
                    <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[var(--success-color)]">
                      <CheckCircle2 className="size-4" />
                      <span>Google OAuth 2.0 Verification Enabled</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">
                        Change Password
                      </h3>
                      <p className="text-xs font-medium text-[var(--text-secondary)]">
                        Update your password to keep your Syncrona account secure
                      </p>
                    </div>

                    {/* Error message display */}
                    {passwordError && (
                      <div className="p-3 rounded-xl bg-[var(--error-color)]/15 border border-[var(--error-color)]/40 text-[var(--error-color)] text-xs font-semibold flex items-center gap-2">
                        <AlertTriangle className="size-4 flex-shrink-0" />
                        <span>{passwordError}</span>
                      </div>
                    )}

                    {/* Current Password Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[var(--text-secondary)]">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full neu-input rounded-xl px-3.5 py-2.5 pr-10 text-sm text-[var(--text-primary)]"
                          disabled={isChangingPassword}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 cursor-pointer"
                        >
                          {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password & Confirm Password Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* New Password */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[var(--text-secondary)]">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            className="w-full neu-input rounded-xl px-3.5 py-2.5 pr-10 text-sm text-[var(--text-primary)]"
                            disabled={isChangingPassword}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 cursor-pointer"
                          >
                            {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm New Password */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[var(--text-secondary)]">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            className="w-full neu-input rounded-xl px-3.5 py-2.5 pr-10 text-sm text-[var(--text-primary)]"
                            disabled={isChangingPassword}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Form Submit Button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="neu-btn-accent px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {isChangingPassword ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="size-4" />
                            <span>Update Password</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* B. Danger Zone — Delete Account */}
              <div className="neu-inset rounded-2xl p-6 space-y-4 border border-[var(--error-color)]/30">
                <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3 text-[var(--error-color)]">
                  <AlertTriangle className="size-4" />
                  <h2 className="text-xs font-bold uppercase tracking-wider">
                    Danger Zone
                  </h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">
                      Delete Account Permanently
                    </h3>
                    <p className="text-xs font-medium text-[var(--text-secondary)] leading-relaxed mt-1">
                      Permanently purge your profile, message history, uploaded file attachments, and access. This action is irreversible.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-start">
                    <button
                      type="button"
                      onClick={handleOpenModal}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[var(--error-color)] hover:opacity-90 transition-all neu-raised-sm flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Trash2 className="size-4" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[var(--surface-color)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-2xl rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-5 relative">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-[var(--surface-inset)] border border-[var(--border-color)]/70 flex items-center justify-center text-[var(--error-color)] flex-shrink-0">
                  <AlertTriangle className="size-6 text-[var(--error-color)]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[var(--text-primary)]">
                    Delete Account Permanently?
                  </h3>
                  <p className="text-xs font-semibold text-[var(--error-color)]">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isDeletingAccount}
                className="neu-btn p-1.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Warning Details */}
            <div className="p-3.5 bg-[var(--surface-inset)] border border-[var(--border-color)]/70 rounded-2xl text-xs space-y-2 text-[var(--text-secondary)] leading-relaxed">
              <p>
                Deleting your Syncrona account will permanently purge:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[var(--text-primary)] font-medium pl-1">
                <li>Your profile details and avatar image</li>
                <li>All message history & sent image attachments</li>
                <li>Your account access and active sessions</li>
              </ul>
            </div>

            {/* Error Banner if Deletion Fails */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-[var(--error-color)]/15 border border-[var(--error-color)]/40 text-[var(--error-color)] text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Confirmation Text Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-primary)] block">
                Type <span className="font-mono text-[var(--error-color)] font-bold">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                placeholder="DELETE"
                disabled={isDeletingAccount}
                className="w-full neu-input rounded-xl px-3.5 py-2.5 text-sm font-bold tracking-wider placeholder:font-normal placeholder:tracking-normal text-[var(--text-primary)] uppercase"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isDeletingAccount}
                className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider neu-btn text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={confirmText.trim().toUpperCase() !== "DELETE" || isDeletingAccount}
                className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[var(--error-color)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                {isDeletingAccount ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Deleting Account...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4" />
                    <span>Permanently Delete</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;