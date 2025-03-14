import React, { useState, useEffect, useRef } from "react";
import sendIcon from "../assets/send.png";
import hand from "../assets/hand.png";
import dotIcon from "../assets/dot.png";

// --- Hashtag helpers (optional) ---
function extractHashtags(text) {
  const regex = /#[a-zA-Z0-9_]+/g;
  return text.match(regex) || [];
}
function getUniqueHashtags(hashtags) {
  return [...new Set(hashtags)];
}

// --- Date formatting helper ---
function formatDate(date) {
  const postDate = new Date(date);
  const now = new Date();
  const diff = now - postDate;
  const diffMinutes = Math.floor(diff / (1000 * 60));
  const diffHours = Math.floor(diff / (1000 * 60 * 60));

  if (diffHours < 24) {
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    return "Just now";
  } else {
    return postDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }
}

const Comment = ({ post, postId, closeComments }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [profileImage, setProfileImage] = useState("default-avatar.png");
  const [currentUser, setCurrentUser] = useState("");

  // For controlling 3-dot dropdown menus on comments
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // For inline editing
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    const storedProfileImage = localStorage.getItem("profileImage");
    if (storedProfileImage) {
      setProfileImage(`http://localhost:3001/uploads/${storedProfileImage}`);
    }
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setCurrentUser(storedUsername);
    }

    fetchComments();

    // Close dropdown if clicked outside
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Fetch Comments ---
  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/posts/${postId}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // --- Add Comment ---
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      // Send "author" as currentUser
      const res = await fetch(`http://localhost:3001/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment, author: currentUser }),
      });

      if (res.ok) {
        setNewComment("");
        fetchComments(); // Refresh comments list
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // --- Toggle the 3-dot dropdown for a specific comment ---
  const toggleDropdown = (commentId) => {
    setActiveDropdown(activeDropdown === commentId ? null : commentId);
  };

  // --- Handle Edit (enter edit mode) ---
  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.text);
    setActiveDropdown(null); // close the dropdown
  };

  // --- Save edited comment to server ---
  const handleSaveEdit = async (commentId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/posts/${postId}/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editingText, currentUser }), // pass the current user for ownership check
      });

      if (res.ok) {
        setEditingCommentId(null);
        setEditingText("");
        fetchComments();
      } else {
        console.error("Failed to update comment.");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  // --- Cancel edit mode ---
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  // --- Delete comment ---
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUser }), // pass current user for ownership check
      });

      if (res.ok) {
        setActiveDropdown(null);
        fetchComments();
      } else {
        console.error("Failed to delete comment.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // --- Report comment ---
  const handleReportComment = async (commentId) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/posts/${postId}/comments/${commentId}/report`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentUser }),
        }
      );

      if (res.ok) {
        setActiveDropdown(null);
        alert("Comment reported successfully!");
      } else {
        console.error("Failed to report comment.");
      }
    } catch (error) {
      console.error("Error reporting comment:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white w-full max-w-2xl h-[400px] overflow-hidden rounded-lg relative flex flex-col">
        {/* Close button */}
        <button
          onClick={closeComments}
          className="absolute top-3 right-3 text-gray-600 hover:text-black font-bold text-lg"
        >
          ✕
        </button>

        {/* Post section */}
        <div className="p-4 border-b border-gray-300">
          <div className="flex items-center space-x-2 mb-2">
            <img
              src={profileImage}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{post.author}</p>
              <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          {/* Post content & hashtags */}
          <p>{post.content.replace(/#[a-zA-Z0-9_]+/g, "").trim()}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {getUniqueHashtags(extractHashtags(post.content)).map((tag, idx) => (
              <span key={idx} className="text-blue-500 text-sm cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        {/** 
          We REMOVED "flex items-center justify-center" here so the comments align at the start. 
          Instead, only the "no comments" state is centered below.
        */}
        <div className="flex-1 overflow-y-auto p-4">
          {comments.length > 0 ? (
            <div className="w-full space-y-3">
              {comments.map((comment) => {
                const isOwner = comment.author === currentUser;
                const hashtags = getUniqueHashtags(extractHashtags(comment.text));
                const textWithoutTags = comment.text.replace(/#[a-zA-Z0-9_]+/g, "").trim();

                return (
                  <div key={comment._id} className="bg-gray-100 p-3 rounded-md relative">
                    <div className="flex items-center space-x-2 mb-1">
                      <img
                        src={profileImage}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-semibold">
                        {comment.author || "User"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>

                    {/* If editing this comment, show input; otherwise, show text */}
                    {editingCommentId === comment._id ? (
                      <div>
                        <input
                          className="w-full border p-1 rounded"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                        />
                        <div className="mt-1 space-x-2">
                          <button
                            onClick={() => handleSaveEdit(comment._id)}
                            className="px-3 py-1 bg-[#161F36] text-white rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-gray-400 text-white rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm">{textWithoutTags}</p>
                        {hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {hashtags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-blue-500 text-sm cursor-pointer"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {/* Three-dot menu */}
                    <div className="absolute top-3 right-3" ref={dropdownRef}>
                      <img
                        src={dotIcon}
                        alt="Options"
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => toggleDropdown(comment._id)}
                      />
                      {activeDropdown === comment._id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg z-10">
                          {isOwner ? (
                            <>
                              <button
                                onClick={() => handleEditComment(comment)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleReportComment(comment._id)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Report
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Center only the "No comments yet" message
            <div className="flex flex-col items-center mt-4">
              <p className="text-gray-500 mt-14">
                No comments yet. Be the first to comment!
              </p>
              <img src={hand} alt="Hand" className="w-10 h-10 mt-2" />
            </div>
          )}
        </div>

        {/* Comment Input Box */}
        <div className="p-3 border-t border-gray-300">
          <div className="flex items-center space-x-2">
            <img
              src={profileImage}
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none"
            />
            <button
              onClick={handleAddComment}
              className="bg-[#161F36] text-white px-4 py-1 rounded-full text-sm"
            >
              <img src={sendIcon} alt="Send" className="w-4 h-4 inline-block" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
