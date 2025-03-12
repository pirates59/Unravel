import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import leftarrow from "../assets/leftarrow.png";

const Post = () => {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setAuthor(storedUsername);
    }
  }, []);

  // Retrieve profile image filename from localStorage, default if not set
  const profileImageName = localStorage.getItem("profileImage") || "default-avatar.png";
  const profileImageUrl = profileImageName !== "default-avatar.png"
    ? `http://localhost:3001/uploads/${profileImageName}`
    : "default-avatar.png";

  const handleSubmit = async () => {
    if (!content) return;
    try {
      const res = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        // Include profileImage so that posts are saved with the user's profile image filename
        body: JSON.stringify({ content, author, profileImage: profileImageName })
      });
      if (res.ok) {
        navigate("/feed");
      } else {
        console.error("Failed to post content");
      }
    } catch (error) {
      console.error("Error posting content:", error);
    }
  };

  return (
    <div>
      {/* Back Button */}
      <button className="mb-[30px]" onClick={() => navigate(-1)}>
        <img src={leftarrow} alt="Back" className="w-6 h-6" />
      </button>

      {/* Post Box */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md w-[80%] h-[65%]">
        <div className="flex items-center mb-3">
          <img
            src={profileImageUrl}
            alt="User Avatar"
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="font-semibold">{author}</span>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's Happening?"
          className="bg-gray-300 rounded-lg p-4 min-h-[300px] text-black font-semibold w-full resize-none"
        ></textarea>

        <div className="flex justify-end mt-3">
          <button
            className="bg-[#EC993D] text-white px-8 py-2 rounded-lg"
            onClick={handleSubmit}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
