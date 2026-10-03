import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 neu-bg select-none">
      <div className="max-w-xl mx-auto">
        <div className="neu-raised-lg rounded-3xl p-6 sm:p-8 space-y-7">
          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Profile
            </h1>
            <p className="text-xs font-semibold text-[var(--text-secondary)]">
              Manage your personal account information
            </p>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="size-28 rounded-full neu-raised-lg p-1.5 flex items-center justify-center">
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
                  absolute bottom-0 right-0 
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
            <p className="text-xs font-semibold text-[var(--text-muted)]">
              {isUpdatingProfile ? "Uploading image to Cloudinary..." : "Click camera icon to update profile picture"}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2 pl-1">
                <User className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                Full Name
              </div>
              <div className="px-4 py-2.5 neu-inset rounded-2xl font-semibold text-[var(--text-primary)] text-sm">
                {authUser?.fullName}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2 pl-1">
                <Mail className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                Email Address
              </div>
              <div className="px-4 py-2.5 neu-inset rounded-2xl font-semibold text-[var(--text-primary)] text-sm">
                {authUser?.email}
              </div>
            </div>
          </div>

          {/* Account Overview Box */}
          <div className="neu-inset rounded-2xl p-5 space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Account Overview
            </h2>
            <div className="space-y-2 text-xs font-medium">
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-color)]">
                <span className="text-[var(--text-secondary)]">Member Since</span>
                <span className="text-[var(--text-primary)] font-bold">
                  {authUser?.createdAt?.split("T")[0] || "Active"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[var(--text-secondary)]">Account Status</span>
                <span className="px-2.5 py-0.5 rounded-full neu-inset-sm text-xs font-bold text-[var(--success-color)]">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;