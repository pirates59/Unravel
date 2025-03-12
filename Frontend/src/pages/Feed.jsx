import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import dotIcon from "../assets/dot.png";
import like from "../assets/like.png";
import comment from "../assets/comment.png";
import Swal from "sweetalert2";
import Comment from "../components/Comment";

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
    return postDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short"
    });
  }
}

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [profileImage, setProfileImage] = useState("default-avatar.png");
  const dropdownRef = useRef(null);

  // ADDED: State to track which post's comments are open
  const [openCommentId, setOpenCommentId] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setCurrentUser(storedUsername);
    }

    const storedProfileImage = localStorage.getItem("profileImage");
    if (storedProfileImage) {
      setProfileImage(`http://localhost:3001/uploads/${storedProfileImage}`);
    }

    fetchPosts();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/posts");
      const data = await res.json();
      const userPosts = data.filter((post) => post.author === localStorage.getItem("username"));
      setPosts(userPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const toggleDropdown = (postId) => {
    setActiveDropdown(activeDropdown === postId ? null : postId);
  };

  const handleDelete = async (postId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) {
        fetchPosts();
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const confirmDelete = (postId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(postId);
        Swal.fire("Deleted!", "Your post has been deleted.", "success");
      }
    });
  };

  // ADDED: Toggle which post's comments are open
  const toggleComments = (postId) => {
    setOpenCommentId(openCommentId === postId ? null : postId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-6">
          <NavLink to="/recent">
            <button className="border border-[#EC993D] px-6 py-2 rounded-xl">Recent</button>
          </NavLink>
          <button className="bg-[#EC993D] text-white px-6 py-2 rounded-xl">Feed</button>
        </div>
      </div>

      <div className="flex gap-6 w-[1028px]">
        <div className="flex-1 space-y-4">
          {posts.map((post) => {
            const hashtags = extractHashtags(post.content);
            const uniqueHashtags = getUniqueHashtags(hashtags);
            const cleanedContent = post.content.replace(/#[a-zA-Z0-9_]+/g, "").trim();

            return (
              <div key={post._id} className="bg-gray-300 p-4 rounded-lg shadow-md relative">
                <div className="flex items-center space-x-3">
                  <img
                    src={profileImage}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full mr-3"
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
                <div className="flex items-center gap-3 text-gray-500 text-sm mt-4">
                  <img src={like} alt="Like" className="w-5 h-5 cursor-pointer" /> 
                  <p className="" >Like</p>
                  {/* ADDED onClick to toggle comment section */}
                 
                  <img
                    src={comment}
                    alt="Comment"
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => toggleComments(post._id)}
                  /> 
                   <p className=""   onClick={() => toggleComments(post._id)}>Comment</p>
                </div>

                {openCommentId === post._id && (
  <Comment
    post={post}                // pass the full post object
    postId={post._id}
    closeComments={() => setOpenCommentId(null)}
  />
)}

                <div className="absolute top-4 right-4">
                  <img
                    src={dotIcon}
                    alt="Options"
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => toggleDropdown(post._id)}
                  />
                  {activeDropdown === post._id && (
                    <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg z-10">
                      <NavLink to="/editpost" state={{ postId: post._id, content: post.content }}>
                        <button
                          onClick={() => setActiveDropdown(null)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                      </NavLink>
                      <button
                        onClick={() => confirmDelete(post._id)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Feed;
