import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import { updateProfile } from "../lib/api";
import {
  CameraIcon,
  LoaderIcon,
  MapPinIcon,
  SaveIcon,
  ShuffleIcon,
  UserIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: updateMutation, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 1000) + 1;
    const randomAvatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${idx}`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random avatar generated!");
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFormState({ ...formState, profilePic: reader.result });
      toast.success("Photo uploaded successfully!");
    };
    reader.onerror = () => {
      toast.error("Error reading file");
    };
  };

  const inputClass = "glass-input w-full h-11 px-4 text-sm";
  const labelClass = "text-sm font-medium text-slate-300 mb-1.5 block";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-2xl">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Update your personal information</p>
        </div>

        <div
          className="glass rounded-2xl p-8"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar preview */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    boxShadow: "0 0 0 4px rgba(139,92,246,0.3)",
                  }}
                >
                  {formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-12 h-12 text-slate-600" />
                  )}
                </div>
                {/* Camera overlay -> Triggers Upload */}
                <label
                  className="absolute bottom-1 right-1 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}
                  title="Upload photo"
                >
                  <CameraIcon className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>

              {/* Avatar actions */}
              <div className="space-y-3 text-center sm:text-left">
                <p className="font-semibold text-white text-lg">{authUser?.fullName}</p>
                <p className="text-slate-400 text-sm">{authUser?.email}</p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                  <label
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2))",
                      border: "1px solid rgba(139,92,246,0.4)",
                      color: "#fff",
                    }}
                  >
                    <CameraIcon className="w-4 h-4" />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleRandomAvatar}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#c4b5fd",
                    }}
                  >
                    <ShuffleIcon className="w-4 h-4" />
                    Random Avatar
                  </button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />

            {/* Full Name */}
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                className={inputClass}
                placeholder="Your full name"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
              />
            </div>

            {/* Bio */}
            <div>
              <label className={labelClass}>Bio</label>
              <textarea
                className="glass-input w-full px-4 py-3 text-sm resize-none"
                rows={3}
                placeholder="Tell others about yourself and your language learning goals"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
              />
            </div>

            {/* Languages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Native Language</label>
                <select
                  className={inputClass}
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                >
                  <option value="">Select native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Learning Language</label>
                <select
                  className={inputClass}
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState({ ...formState, learningLanguage: e.target.value })
                  }
                >
                  <option value="">Select learning language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className={labelClass}>Location</label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  className="glass-input w-full h-11 pl-10 pr-4 text-sm"
                  placeholder="City, Country"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="grad-btn flex items-center justify-center gap-2 w-full h-12 rounded-xl"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <LoaderIcon className="w-4 h-4 animate-spin" />
                  Saving changes...
                </>
              ) : (
                <>
                  <SaveIcon className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
