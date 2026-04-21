import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import moment from "moment";
import StoryModal from "./StoryModal";
import StoryViewer from "./StoryViewer";
import { useAuth } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import api from "../api/axios";
import toast from "react-hot-toast";

const StoriesBar = () => {
  const { getToken } = useAuth();
  const currentUser = useSelector((state) => state.user.value);

  const [stories, setStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewStory, setViewStory] = useState(null);

  const fetchStories = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get('/api/story/get', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setStories(data.stories);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteStory = async (e, storyId) => {
    e.stopPropagation();
    try {
      const token = await getToken();
      const { data } = await api.delete('/api/story/delete', {
        headers: { Authorization: `Bearer ${token}` },
        data: { storyId }
      });
      if (data.success) {
        toast.success("Story deleted successfully!");
        setStories(prev => prev.filter(s => s._id !== storyId));
        if (viewStory?._id === storyId) setViewStory(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4">
      <div className="flex gap-4 pb-5">

        {/* Add Story Card */}
        <div
          onClick={() => setShowModal(true)}
          className="relative rounded-lg shadow min-w-32 max-w-32 h-48 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white"
        >
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="size-12 bg-indigo-500 rounded-full flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-slate-700 text-center">Create Story</p>
          </div>
        </div>

        {/* Stories */}
        {stories.map((story, index) => {
          const isOwner = story.user?._id === currentUser?._id;

          return (
            <div
              onClick={() => setViewStory(story)}
              key={index}
              // FIX: added "group" class so hover works on children
              className="group relative rounded-lg shadow min-w-32 max-w-32 h-48 cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden bg-gradient-to-b from-indigo-500 to-purple-600"
            >
              {/* Media background — FIX: use z-0 instead of invalid z-1 */}
              {story.media_type !== "text" && (
                <div className="absolute inset-0 z-0 rounded-lg bg-black overflow-hidden">
                  {story.media_type === "image" ? (
                    <img
                      src={story.media_url}
                      alt=""
                      className="h-full w-full object-cover group-hover:scale-110 transition duration-500 opacity-70 group-hover:opacity-80"
                    />
                  ) : (
                    <video
                      src={story.media_url}
                      className="h-full w-full object-cover opacity-70"
                    />
                  )}
                </div>
              )}

              {/* Overlay for text readability */}
              <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/40 to-transparent rounded-lg" />

              {/* Profile picture */}
              <img
                src={story.user.profile_picture}
                alt=""
                className="absolute size-8 top-3 left-3 z-[2] rounded-full ring-2 ring-white shadow"
              />

              {/* Delete button — only for owner, visible on hover */}
              {isOwner && (
                <button
                  onClick={(e) => handleDeleteStory(e, story._id)}
                  className="absolute top-2 right-2 z-[3] bg-black/50 hover:bg-red-500 text-white rounded-full p-1.5 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  title="Delete story"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}

              {/* Story text content */}
              {story.content && (
                <p className="absolute top-14 left-3 right-3 text-white/80 text-xs truncate z-[2]">
                  {story.content}
                </p>
              )}

              {/* Time */}
              <p className="text-white absolute bottom-2 right-2 z-[2] text-[10px]">
                {moment(story.createdAt).fromNow()}
              </p>
            </div>
          );
        })}
      </div>

      {showModal && <StoryModal setShowModal={setShowModal} fetchStories={fetchStories} />}
      {viewStory && (
        <StoryViewer
          viewStory={viewStory}
          setViewStory={setViewStory}
          onDelete={handleDeleteStory}
          isOwner={viewStory?.user?._id === currentUser?._id}
        />
      )}
    </div>
  );
};

export default StoriesBar;