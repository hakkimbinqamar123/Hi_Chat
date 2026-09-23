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

  const inputClass = "w-full h-12 px-4 text-sm font-bold text-black bg-white border-[3px] border-black neo-shadow focus:outline-none focus:translate-y-[-2px] transition-transform";
  const labelClass = "text-sm font-bold text-black mb-2 block uppercase neo-heading";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-5xl">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-black neo-heading uppercase tracking-tighter">Edit Profile</h1>
          <p className="text-black font-bold uppercase text-sm mt-2 border-2 border-black inline-block px-3 py-1 bg-[var(--neo-yellow)]">
            Update your personal information
          </p>
        </div>

        <div className="bg-white border-[3px] border-black neo-shadow p-8">
          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Left Column: Avatar Section */}
            <div className="flex flex-col items-center text-center lg:w-1/3">
              <div className="relative flex-shrink-0 mb-6">
                <div className="w-32 h-32 lg:w-40 lg:h-40 border-[3px] border-black neo-shadow overflow-hidden flex items-center justify-center bg-[var(--neo-pink)]">
                  {formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-16 h-16 text-black stroke-[3]" />
                  )}
                </div>
                {/* Camera overlay -> Triggers Upload */}
                <label
                  className="absolute -bottom-2 -right-2 w-12 h-12 border-[3px] border-black bg-[var(--neo-yellow)] flex items-center justify-center cursor-pointer neo-shadow-hover transition-transform"
                  title="Upload photo"
                >
                  <CameraIcon className="w-6 h-6 text-black stroke-[3]" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>

              <p className="text-3xl font-bold text-black neo-heading uppercase tracking-tighter mb-2">{authUser?.fullName}</p>
              <p className="text-black font-bold uppercase text-sm bg-[var(--neo-blue)] border-2 border-black px-2 py-1 inline-block mb-8 w-max max-w-full truncate">{authUser?.email}</p>
              
              <div className="flex flex-col w-full gap-4">
                <label
                  className="flex justify-center items-center gap-2 w-full px-4 py-3 border-[3px] border-black bg-[var(--neo-pink)] text-black text-sm font-bold uppercase neo-shadow-hover transition-transform cursor-pointer"
                >
                  <CameraIcon className="w-5 h-5 stroke-[3]" />
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
                  className="flex justify-center items-center gap-2 w-full px-4 py-3 border-[3px] border-black bg-white text-black text-sm font-bold uppercase neo-shadow-hover transition-transform"
                >
                  <ShuffleIcon className="w-5 h-5 stroke-[3]" />
                  Random Avatar
                </button>
              </div>
            </div>

            {/* Divider for Mobile */}
            <div className="border-t-[3px] border-black lg:hidden" />

            {/* Vertical Divider for Desktop */}
            <div className="hidden lg:block border-l-[3px] border-black" />

            {/* Right Column: Form Fields */}
            <div className="flex-1 space-y-6">
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
                  className="w-full px-4 py-3 text-sm font-bold text-black bg-white border-[3px] border-black neo-shadow focus:outline-none focus:translate-y-[-2px] transition-transform resize-none"
                  rows={3}
                  placeholder="Tell others about yourself and your language learning goals"
                  value={formState.bio}
                  onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                />
              </div>

              {/* Languages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black stroke-[3]" />
                  <input
                    type="text"
                    className="w-full h-12 pl-10 pr-4 text-sm font-bold text-black bg-white border-[3px] border-black neo-shadow focus:outline-none focus:translate-y-[-2px] transition-transform"
                    placeholder="City, Country"
                    value={formState.location}
                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full h-14 border-[3px] border-black bg-[var(--neo-green)] text-black font-bold uppercase text-lg neo-shadow-hover transition-transform"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <LoaderIcon className="w-5 h-5 animate-spin stroke-[3]" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="w-5 h-5 stroke-[3]" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
