import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import leftarrow from "../assets/leftarrow.png";
import icon from "../assets/icon.png";

const EditPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
    const [author, setAuthor] = useState("");
  // Retrieve postId and the initial content passed via state from Feed
  const { postId, content: initialContent } = location.state || {};
  const [content, setContent] = useState(initialContent || "");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setAuthor(storedUsername);
    }
  }, []);

  const handleSubmit = async () => {
    if (!content) return;
    try {
      const res = await fetch(`http://localhost:3001/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content, author })
      });
      if (res.ok) {
        // After successful update, redirect to the Feed page
        navigate("/feed");
      } else {
        console.error("Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div>
      {/* Back Button */}
      <button className="mb-[30px]" onClick={() => navigate(-1)}>
        <img src={leftarrow} alt="Back" className="w-6 h-6" />
      </button>

      {/* Edit Post Box */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md w-[80%] h-[65%]">
        <div className="flex items-center mb-3">
          <img src={icon} alt="User Avatar" className="w-10 h-10 rounded-full mr-3" />
          <span className="font-semibold">{author}</span>
        </div>

        {/* Textarea pre-filled with the current content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Edit your post..."
          className="bg-gray-300 rounded-lg p-4 min-h-[300px] text-white font-semibold w-full resize-none"
        ></textarea>

        <div className="flex justify-end mt-3">
          <button 
            className="bg-[#EC993D] text-white px-8 py-2 rounded-lg" 
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
