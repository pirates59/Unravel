import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import leftarrow from "../assets/leftarrow.png";
import gallery from "../assets/gallery.png";
import location from "../assets/location.png";

const Post = () => {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setAuthor(storedUsername);
    }
  }, []);

  // Retrieve profile image filename from localStorage, default if not set
  const profileImageName =
    localStorage.getItem("profileImage") || "default-avatar.png";
  const profileImageUrl =
    profileImageName !== "default-avatar.png"
      ? `http://localhost:3001/uploads/${profileImageName}`
      : "default-avatar.png";

  // Handle file selection, set the file and create a preview URL
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Remove the selected image, clear preview, and reset file input
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit the post using FormData to include both text and image
  const handleSubmit = async () => {
    // Require at least text or an image to post
    if (!content.trim() && !selectedImage) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("author", author);
      formData.append("content", content);
      formData.append("profileImage", profileImageName);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // Retrieve the JWT token from localStorage
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        navigate("/feed");
      } else {
        console.error("Failed to post content", await res.text());
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

        {/* Container with relative positioning */}
        <div className="bg-gray-300 rounded-lg p-4 text-black font-semibold w-full min-h-[350px] relative">
          {/* Hidden file input for image selection */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          {/* TEXTAREA: "What's Happening?" at the top */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's Happening?"
            className="bg-transparent w-full h-8 resize-none outline-none mb-2"
          />

          {/* If an image is selected, show preview + close button in a row */}
          {imagePreview && (
            <div className="flex items-center space-x-3 mb-[80px]">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-[200px] object-contain rounded-lg"
              />
              <button
                onClick={removeImage}
                className="text-white rounded-full w-8 h-8 flex items-center ml-[80px] mb-[180px]"
              >
                ×
              </button>
            </div>
          )}

          {/* Add to your post bar */}
          <div
            className="
              bg-white
              flex
              items-center
              justify-between
              p-4
              rounded-lg
              absolute
              bottom-0
              left-0
              right-0
              m-4
              shadow-md
            "
          >
            <p className="text-gray-700 font-normal">Add to your post</p>

            {/* Icons on the right */}
            <div className="flex items-center space-x-3 text-gray-600">
              <img
                src={gallery}
                alt="Gallery"
                className="w-7 h-7 cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              />
              <img src={location} alt="Location" className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Post Button */}
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
