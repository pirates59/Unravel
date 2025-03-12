import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import like from "../assets/like.png";
import comment from "../assets/comment.png";

function extractHashtags(text) {
  const regex = /#[a-zA-Z0-9_]+/g;
  return text.match(regex) || [];
}

function getUniqueHashtags(hashtags) {
  const uniqueHashtags = [];
  for (let i = hashtags.length - 1; i >= 0; i--) {
    if (!uniqueHashtags.includes(hashtags[i])) {
      uniqueHashtags.unshift(hashtags[i]);
    }
  }
  return uniqueHashtags;
}

function formatDate(date) {
  const postDate = new Date(date);
  const now = new Date();
  const diff = now - postDate;
  const diffSeconds = Math.floor(diff / 1000);
  const diffMinutes = Math.floor(diff / (1000 * 60));
  const diffHours = Math.floor(diff / (1000 * 60 * 60));

  if (diffHours < 24) {
    if (diffHours > 0) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    } else if (diffMinutes > 0) {
      return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
    } else {
      return diffSeconds <= 1 ? "1 second ago" : `${diffSeconds} seconds ago`;
    }
  } else {
    return postDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }
}

// Build a full image URL if the user uploaded a custom image
const getImageUrl = (profileImage) => {
  if (!profileImage || profileImage === "default-avatar.png") {
    return "/default-avatar.png";
  }
  if (profileImage.startsWith("http")) {
    return profileImage;
  }
  return `http://localhost:3001/uploads/${profileImage}`;
};

const Recent = () => {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setCurrentUser(storedUsername);
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/posts");
      const data = await res.json();
      // Filter out the current user's posts
      const otherPosts = data.filter(
        (post) => post.author !== localStorage.getItem("username")
      );
      setPosts(otherPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  return (
    <div>
      {/* Header with Recent, Feed, and Topic */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-6">
          <button className="bg-[#EC993D] text-white px-6 py-2 rounded-xl">
            Recent
          </button>
          <NavLink to="/feed">
            <button className="border border-[#EC993D] px-6 py-2 rounded-xl">
              Feed
            </button>
          </NavLink>
        </div>
        <div className="mr-[255px]">
          <h2 className="text-lg font-semibold">Topic</h2>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Posts Section */}
        <div className="flex-1 space-y-4">
          {posts.map((post) => {
            const hashtags = extractHashtags(post.content);
            const uniqueHashtags = getUniqueHashtags(hashtags);
            const cleanedContent = post.content.replace(/#[a-zA-Z0-9_]+/g, "").trim();

            return (
              <div key={post._id} className="bg-gray-300 p-4 rounded-lg shadow-md">
                <div className="flex items-center space-x-3">
                  <img
                    src={getImageUrl(post.profileImage)}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{post.author}</p>
                    <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
                <p className="mt-2">{cleanedContent}</p>
                {uniqueHashtags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {uniqueHashtags.map((tag, index) => (
                      <p key={index} className="text-blue-500 text-sm cursor-pointer">
                        {tag}
                      </p>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-10 text-gray-500 text-sm mt-4">
                  <img src={like} alt="Like" className="w-5 h-5 cursor-pointer" />
                  <img src={comment} alt="Comment" className="w-5 h-5 cursor-pointer" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Topics Section */}
        <div className="w-1/4 mb-12">
          <div className="bg-gray-300 p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-2 gap-2">
              {[
                "Relationships",
                "Family",
                "Self Harm",
                "Friends",
                "Hopes",
                "Bullying",
                "Health",
                "Work",
                "Music",
                "Parenting",
                "LGBTQ+",
                "Religion",
                "Education",
                "Pregnancy",
                "Mental Health",
                "Positive",
                "Meditation",
                "Self care",
                "OCD",
                "Psychosis",
                "Schizophrenia",
                "Paranoia",
              ].map((topic, index) => (
                <button
                  key={index}
                  className="bg-white px-3 py-2 rounded-lg text-sm"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recent;
