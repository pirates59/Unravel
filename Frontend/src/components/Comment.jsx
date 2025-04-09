// components/Comment.js
import React, { useState, useEffect, useRef } from "react";
import sendIcon from "../assets/send.png";
import hand from "../assets/hand.png";
import dotIcon from "../assets/dot.png";
import like from "../assets/like.png";
import redLike from "../assets/redLike.png";
import commentIcon from "../assets/comment.png";

// Hashtag helpers
function extractHashtags(text) {
  const regex = /#[a-zA-Z0-9_]+/g;
  return text.match(regex) || [];
}
function getUniqueHashtags(hashtags) {
  return [...new Set(hashtags)];
}

// Date formatting helper
function formatDate(date) {
  const postDate = new Date(date);
  const now = new Date();
  const diff = now - postDate;
  const diffMinutes = Math.floor(diff / (1000 * 60));
  const diffHours = Math.floor(diff / (1000 * 60 * 60));

  if (diffHours < 24) {
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffMinutes > 0)
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    return "Just now";
  } else {
    return postDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  }
}

// Helper to build full image URL
const getImageUrl = (profileImage) => {
  if (!profileImage || profileImage === "default-avatar.png") {
    return "default-avatar.png";
  }
  if (profileImage.startsWith("http")) {
    return profileImage;
  }
  return `http://localhost:3001/uploads/${profileImage}`;
};

const Comment = ({ post, postId, closeComments, likeData, syncLikes }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const [postLikes, setPostLikes] = useState(likeData ? likeData.count : 0);
  const [liked, setLiked] = useState(likeData ? likeData.liked : false);

  useEffect(() => {
    if (likeData) {
      setPostLikes(likeData.count);
      setLiked(likeData.liked);
    }
  }, [likeData]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setCurrentUser(storedUsername);
    }
    fetchComments();

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

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/api/posts/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    const currentUserLocal = localStorage.getItem("username");
    const storedProfile = localStorage.getItem("profileImage") || "default-avatar.png";
    try {
      const res = await fetch(`http://localhost:3001/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentUser: currentUserLocal,
          author: currentUserLocal,
          profileImage: storedProfile,
        }),
      });
      if (res.ok) {
        const updatedLike = await res.json();
        setPostLikes(updatedLike.count);
        setLiked(updatedLike.liked);
        if (syncLikes) {
          syncLikes(updatedLike);
        }
      } else {
        console.error("Failed to update like");
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    const token = localStorage.getItem("token");

    if (editingCommentId) {
      try {
        const res = await fetch(
          `http://localhost:3001/api/posts/${postId}/comments/${editingCommentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text: newComment, currentUser }),
          }
        );
        if (res.ok) {
          setEditingCommentId(null);
          setNewComment("");
          fetchComments();
        } else {
          console.error("Failed to update comment.");
        }
      } catch (error) {
        console.error("Error updating comment:", error);
      }
    } else {
      try {
        const storedProfile = localStorage.getItem("profileImage") || "default-avatar.png";
        const res = await fetch(`http://localhost:3001/api/posts/${postId}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: newComment,
            author: currentUser,
            profileImage: storedProfile,
            currentUser: currentUser,
          }),
        });
        if (res.ok) {
          setNewComment("");
          fetchComments();
        } else {
          console.error("Failed to add comment.");
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const toggleDropdown = (commentId) => {
    setActiveDropdown(activeDropdown === commentId ? null : commentId);
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setNewComment(comment.text);
    setActiveDropdown(null);
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3001/api/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentUser }),
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

  const handleReportComment = async (commentId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:3001/api/posts/${postId}/comments/${commentId}/report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentUser }),
        }
      );
      if (res.ok) {
        setActiveDropdown(null);
        fetchComments();
      } else {
        console.error("Failed to report comment.");
      }
    } catch (error) {
      console.error("Error reporting comment:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmitComment();
    }
  };

  // Determine display values for the post author (same logic as Feed)
  const displayPostAuthor =
    String(post.authorId) === localStorage.getItem("userId")
      ? localStorage.getItem("username")
      : post.author;
  const displayPostProfileImage =
    String(post.authorId) === localStorage.getItem("userId")
      ? (localStorage.getItem("profileImage")?.startsWith("http")
          ? localStorage.getItem("profileImage")
          : `http://localhost:3001/uploads/${localStorage.getItem("profileImage")}`)
      : post.profileImage && post.profileImage !== "default-avatar.png"
      ? `http://localhost:3001/uploads/${post.profileImage}`
      : "default-avatar.png";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white w-full max-w-2xl rounded-lg relative flex flex-col">
        <button
          onClick={closeComments}
          className="absolute top-3 right-3 text-gray-600 hover:text-black font-bold text-lg"
        >
          ✕
        </button>
        <div className="p-4 border-b border-gray-300">
          <div className="flex items-center space-x-2 mb-2">
            <img
              src={displayPostProfileImage}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{displayPostAuthor}</p>
              <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          <p>{post.content.replace(/#[a-zA-Z0-9_]+/g, "").trim()}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {getUniqueHashtags(extractHashtags(post.content)).map((tag, idx) => (
              <span key={idx} className="text-blue-500 text-sm cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
          {post.image && (
            <div className="mt-2 flex">
              <img
                src={`http://localhost:3001/uploads/${post.image}`}
                alt="Post"
                className="max-w-full h-auto object-contain rounded-lg"
              />
            </div>
          )}
          <div className="flex items-center gap-3 text-gray-500 text-sm mt-2">
            <img
              src={liked ? redLike : like}
              alt="Like"
              className="w-5 h-5 cursor-pointer"
              onClick={handleLike}
            />
            <p onClick={handleLike} className="cursor-pointer">
              {postLikes > 0
                ? postLikes === 1
                  ? "1 like"
                  : `${postLikes} likes`
                : "Like"}
            </p>
            <img src={commentIcon} alt="Comment" className="w-5 h-5 cursor-pointer" />
            <p className="cursor-pointer">
              {comments.length > 0
                ? comments.length === 1
                  ? "1 comment"
                  : `${comments.length} comments`
                : "Comment"}
            </p>
          </div>
        </div>
        <div className="p-4">
          {comments.length > 0 ? (
            <div className="w-full space-y-3">
              {comments.map((comment) => {
                // Use the new authorId property to decide if the comment is by the logged-in user.
                const displayCommentAuthor =
  comment.authorId && String(comment.authorId) === localStorage.getItem("userId")
    ? localStorage.getItem("username")
    : comment.author;

const displayCommentProfileImage =
  comment.authorId && String(comment.authorId) === localStorage.getItem("userId")
    ? (localStorage.getItem("profileImage")?.startsWith("http")
        ? localStorage.getItem("profileImage")
        : `http://localhost:3001/uploads/${localStorage.getItem("profileImage")}`)
    : comment.profileImage && comment.profileImage !== "default-avatar.png"
      ? `http://localhost:3001/uploads/${comment.profileImage}`
      : "default-avatar.png";

                const hashtags = getUniqueHashtags(extractHashtags(comment.text));
                const textWithoutTags = comment.text.replace(/#[a-zA-Z0-9_]+/g, "").trim();

                return (
                  <div key={comment._id} className="bg-gray-100 p-3 rounded-md relative">
                    <div className="flex items-center space-x-2 mb-1">
                      <img
                        src={displayCommentProfileImage}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="text-sm font-semibold">{displayCommentAuthor}</span>
                      <span className="text-xs" style={{ color: comment.reported ? "red" : "inherit" }}>
                        {comment.reported ? "Reported" : formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm">{textWithoutTags}</p>
                    {hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {hashtags.map((tag, idx) => (
                          <span key={idx} className="text-blue-500 text-sm cursor-pointer">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="absolute top-3 right-3" ref={dropdownRef}>
                      <img
                        src={dotIcon}
                        alt="Options"
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => toggleDropdown(comment._id)}
                      />
                      {activeDropdown === comment._id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg z-10">
                          {comment.authorId && String(comment.authorId) === localStorage.getItem("userId") ? (
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
            <div className="flex flex-col items-center mt-4">
              <p className="text-gray-500 mt-14">No comments yet. Be the first to comment!</p>
              <img src={hand} alt="Hand" className="w-10 h-10 mt-2" />
            </div>
          )}
        </div>
        <div className="p-3 border-t border-gray-300">
          <div className="flex items-center space-x-2">
            <img
              src={
                localStorage.getItem("profileImage")?.startsWith("http")
                  ? localStorage.getItem("profileImage")
                  : `http://localhost:3001/uploads/${localStorage.getItem("profileImage")}`
              }
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none"
            />
            <button
              onClick={handleSubmitComment}
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
