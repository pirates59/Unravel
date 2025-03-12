import React, { useState, useEffect } from "react";

// Helper functions from Feed
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

const Comment = ({ post, postId, closeComments }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [profileImage, setProfileImage] = useState("default-avatar.png");

  useEffect(() => {
    const storedProfileImage = localStorage.getItem("profileImage");
    if (storedProfileImage) {
      setProfileImage(`http://localhost:3001/uploads/${storedProfileImage}`);
    }
    fetchComments();
    // eslint-disable-next-line
  }, []);

  const fetchComments = async () => {
    try {
      // Fetch comments for this specific post
      const res = await fetch(`http://localhost:3001/api/posts/${postId}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`http://localhost:3001/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment }),
      });

      if (res.ok) {
        setNewComment("");
        fetchComments(); // Refresh comments list
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    // Fullscreen overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      {/* White container that holds post + comments */}
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg relative flex flex-col">
        
        {/* Close button (X) in top-right */}
        <button
          onClick={closeComments}
          className="absolute top-3 right-3 text-gray-600 hover:text-black font-bold text-lg"
        >
          ✕
        </button>

        {/* The Post section at the top */}
        <div className="p-4 border-b border-gray-300">
          {/* Post author info */}
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
          {/* Post content */}
          <p>{post.content}</p>
          {/* Display hashtags if present */}
          {(() => {
            const hashtags = extractHashtags(post.content);
            const uniqueHashtags = getUniqueHashtags(hashtags);
            if (uniqueHashtags.length > 0) {
              return (
                <div className="mt-2 flex flex-wrap gap-2">
                  {uniqueHashtags.map((tag, idx) => (
                    <span key={idx} className="text-blue-500 text-sm cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              );
            }
            return null;
          })()}
        </div>

        {/* Scrollable comments area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {comments.length > 0 ? (
            comments.map((comment, index) => {
              // Process hashtags for comment text
              const hashtags = extractHashtags(comment.text);
              const uniqueHashtags = getUniqueHashtags(hashtags);
              const cleanedComment = comment.text.replace(/#[a-zA-Z0-9_]+/g, "").trim();
              return (
                <div key={index} className="bg-gray-100 p-3 rounded-md">
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
                  <p className="text-sm">{cleanedComment}</p>
                  {uniqueHashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {uniqueHashtags.map((tag, idx) => (
                        <span key={idx} className="text-blue-500 text-sm cursor-pointer">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          )}
        </div>

        {/* Comment input box at the bottom */}
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
              className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
