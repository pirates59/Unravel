// Post Page
import React, { useState, useEffect, useRef } from "react"; 
import { useNavigate } from "react-router-dom"; 
import leftarrow from "../assets/leftarrow.png"; 
import gallery from "../assets/gallery.png"; 
import location from "../assets/location.png"; 

const Post = () => {
  // Declare state variables for content, author, selected image, and image preview.
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  // Hook for navigation actions.
  const navigate = useNavigate();
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setAuthor(storedUsername);
    }
  }, []);

  // Retrieve profile image filename from localStorage
  const profileImageName =
    localStorage.getItem("profileImage") || "default-avatar.png";
  const profileImageUrl =
    profileImageName !== "default-avatar.png"
      ? `http://localhost:3001/uploads/${profileImageName}`
      : "default-avatar.png"; 

  // Handler function for file selection.
   const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };


  // Clears the preview and resets the file input.
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Async function to handle form submission.
  const handleSubmit = async () => {
    // Validate that there's either text content or an image before posting.
    if (!content.trim() && !selectedImage) {
      return;
    }
    try {
      // Create a FormData object to package author, content, and optional image.
      const formData = new FormData();
      formData.append("author", author);
      formData.append("content", content);
      formData.append("profileImage", profileImageName);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // Retrieve JWT token for authentication from localStorage
      const token = localStorage.getItem("token");

      // Send POST request to backend with the post data
      const res = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, 
        },
        body: formData,
      });

      // On success, navigate the user to the feed page
      if (res.ok) {
        navigate("/feed");
      } else {
        console.error("Failed to post content", await res.text());
      }
    } catch (error) {
      console.error("Error posting content:", error);
    }
  };
   // Determine if Post button should be enabled
   const canPost = content.trim() !== "" || selectedImage;


  return (
    <div>
      {/* Back Button to navigate to the previous page */}
      <button className="mb-[30px]" onClick={() => navigate(-1)}>
        <img src={leftarrow} alt="Back" className="w-6 h-6" />
      </button>

      {/* Container for the post box */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md w-[80%] h-[65%]">
        <div className="flex items-center mb-3">
          <img
            src={profileImageUrl}
            alt="User Avatar"
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="font-semibold">{author}</span>
        </div>

        {/* Main post container  */}
        <div className="bg-gray-300 rounded-lg p-4 text-black font-semibold w-full min-h-[350px] relative">
          {/* Hidden file input for image selection, triggered when clicking gallery icon */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Textarea for user to input post content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's Happening?"
            className="bg-transparent w-full h-8 resize-none outline-none mb-2"
          />

          {/* Display image preview if an image has been selected */}
          {imagePreview && (
            <div className="flex items-center space-x-3 mb-[80px]">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-[200px] object-contain rounded-lg"
              />
              {/* Button to remove selected image */}
              <button
                onClick={removeImage}
                className="text-white rounded-full w-8 h-8 flex items-center ml-[80px] mb-[180px]"
              >
                ×
              </button>
            </div>
          )}

          <div
            className="
              bg-white flex items-center justify-between p-4 rounded-lg absolute bottom-0 left-0  right-0 m-4 shadow-md"
          >
            <p className="text-gray-700 font-normal">Add to your post</p>
            <div className="flex items-center space-x-3 text-gray-600">
              {/* Gallery icon triggers the file input click */}
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

        {/* Post button */}
        <div className="flex justify-end mt-3">
        <button
            onClick={handleSubmit}
            disabled={!canPost}
            className={`px-8 py-2 rounded-lg text-white  transition-colors duration-200 ${
              canPost ? 'bg-[#EC993D] hover:bg-[#d78829]' : 'bg-gray-300 cursor-none'
            }`}
          >
            Post
          </button>

        </div>
      </div>
    </div>
  );
};

export default Post;