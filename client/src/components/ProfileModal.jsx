import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { updateUser } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const ProfileModal = ({ setShowEdit }) => {
  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const user = useSelector((state) => state.user.value);

  const [editForm, setEditForm] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    location: user?.location || "",
    profile_picture: null,
    cover_photo: null,
    full_name: user?.full_name || "",
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      const userData = new FormData();

      userData.append("username", editForm.username);
      userData.append("bio", editForm.bio);
      userData.append("location", editForm.location);
      userData.append("full_name", editForm.full_name);

      if (editForm.profile_picture) {
        userData.append("profile", editForm.profile_picture);
      }

      if (editForm.cover_photo) {
        userData.append("cover", editForm.cover_photo);
      }

      const token = await getToken();

      // ✅ IMPORTANT FIX
      await dispatch(updateUser({ userData, token }));

      setShowEdit(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 h-screen overflow-y-scroll bg-black/50">
      <div className="max-w-2xl mx-auto py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Edit Profile
          </h1>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              toast.promise(handleSaveProfile(e), {
                loading: "Saving...",
                error: "Error updating profile",
              });
            }}
          >
            {/* ✅ PROFILE PIC FIXED */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>

              <label htmlFor="profile_picture" className="cursor-pointer">
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  id="profile_picture"
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      profile_picture: e.target.files[0],
                    })
                  }
                />

                <div className="relative group w-fit">
                  {/* 🔥 PERFECT CIRCLE FIX */}
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                    <img
                      src={
                        editForm.profile_picture
                          ? URL.createObjectURL(editForm.profile_picture)
                          : user?.profile_picture
                      }
                      alt="profile"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="absolute inset-0 hidden group-hover:flex bg-black/30 rounded-full items-center justify-center">
                    <Pencil className="w-5 h-5 text-white" />
                  </div>
                </div>
              </label>
            </div>

            {/* Cover Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Photo
              </label>

              <label htmlFor="cover_photo" className="cursor-pointer">
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  id="cover_photo"
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      cover_photo: e.target.files[0],
                    })
                  }
                />

                <div className="relative group w-fit">
                  <div className="w-80 h-40 rounded-lg overflow-hidden">
                    <img
                      src={
                        editForm.cover_photo
                          ? URL.createObjectURL(editForm.cover_photo)
                          : user?.cover_photo
                      }
                      alt="cover"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="absolute inset-0 hidden group-hover:flex bg-black/30 rounded-lg items-center justify-center">
                    <Pencil className="w-5 h-5 text-white" />
                  </div>
                </div>
              </label>
            </div>

            {/* Inputs */}
            <input
              type="text"
              placeholder="Full name"
              value={editForm.full_name}
              onChange={(e) =>
                setEditForm({ ...editForm, full_name: e.target.value })
              }
              className="w-full p-3 border border-gray-200 rounded-lg"
            />

            <input
              type="text"
              placeholder="Username"
              value={editForm.username}
              onChange={(e) =>
                setEditForm({ ...editForm, username: e.target.value })
              }
              className="w-full p-3 border border-gray-200 rounded-lg"
            />

            <textarea
              rows={3}
              placeholder="Bio"
              value={editForm.bio}
              onChange={(e) =>
                setEditForm({ ...editForm, bio: e.target.value })
              }
              className="w-full p-3 border border-gray-200 rounded-lg"
            />

            <input
              type="text"
              placeholder="Location"
              value={editForm.location}
              onChange={(e) =>
                setEditForm({ ...editForm, location: e.target.value })
              }
              className="w-full p-3 border border-gray-200 rounded-lg"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;