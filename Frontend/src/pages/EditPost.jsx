// EditPost Page
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import leftarrow from "../assets/leftarrow.png";
import gallery from "../assets/gallery.png";
import location from "../assets/location.png";

const EditPost = () => {
  const navigate = useNavigate();
  const locationObj = useLocation();
  const { postId, content: initialContent, image: initialImage } = locationObj.state || {};
  const [content, setContent] = useState(initialContent || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    initialImage ? `http://localhost:3001/uploads/${initialImage}` : null
  );
  const [author, setAuthor] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const fileInputRef = useRef(null);

  // Set author and profile image from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setAuthor(storedUsername);
    const profileImageName = localStorage.getItem("profileImage") || "default-avatar.png";
    const url =
      profileImageName !== "default-avatar.png"
        ? `http://localhost:3001/uploads/${profileImageName}`
        : "default-avatar.png";
    setProfileImageUrl(url);
  }, []);

  // Fetch post details (including image) using the Authorization header
  useEffect(() => {
    if (postId) {
      const token = localStorage.getItem("token");
      const fetchPostDetails = async () => {
        try {
          const res = await fetch(`http://localhost:3001/api/posts/${postId}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setContent(data.content);
            if (data.image) {
              setImagePreview(`http://localhost:3001/uploads/${data.image}`);
            } else {
              setImagePreview(null);
            }
          } else {
            console.error("Failed to fetch post details, status:", res.status);
          }
        } catch (error) {
          console.error("Error fetching post details:", error);
        }
      };
      fetchPostDetails();
    }
  }, [postId]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    // Ensure there is either some text or an image
    if (!content.trim() && !selectedImage && !imagePreview) return;
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      // If no image is selected and the preview is removed, signal backend to remove image
      if (!selectedImage && !imagePreview) {
        formData.append("removeImage", "true");
      }
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });
      if (res.ok) {
        navigate("/feed");
      } else {
        console.error("Failed to update post, status:", res.status);
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
          <img src={profileImageUrl} alt="User Avatar" className="w-10 h-10 rounded-full mr-3" />
          <span className="font-semibold">{author}</span>
        </div>

        <div className="bg-gray-300 rounded-lg p-4 text-black font-semibold w-full min-h-[350px] relative">
          {/* Hidden file input for image selection */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Textarea to edit content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Edit your post..."
            className="bg-transparent w-full h-8 resize-none outline-none mb-2"
          />

          {/* Image preview section */}
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

          {/* Edit Options */}
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
            <p className="text-gray-700 font-normal">Edit your post</p>
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

        {/* Save Button */}
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
