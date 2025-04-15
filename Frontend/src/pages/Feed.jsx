// Feed Page
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import dotIcon from "../assets/dot.png";
import like from "../assets/like.png";
import redLike from "../assets/redLike.png";
import commentIcon from "../assets/comment.png";
import NoPost from "../assets/NoPost.png";
import Swal from "sweetalert2";
import Comment from "../components/Comment";

// Helper functions
function extractHashtags(text) {
  const regex = /#[a-zA-Z0-9_]+/g;
  return text.match(regex) || [];
}

function getUniqueHashtags(hashtags) {
  const unique = [];
  hashtags.forEach((tag) => {
    if (!unique.includes(tag)) unique.push(tag);
  });
  return unique;
}

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

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [likes, setLikes] = useState({});
  const [openCommentId, setOpenCommentId] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!storedUsername || !token) {
      navigate("/login");
    } else {
      setCurrentUser(storedUsername);
      setCurrentUserId(storedUserId);
    }
    fetchPosts();

    // Close dropdown if user clicks outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navigate]);

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3001/api/posts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      // Only show posts authored by the logged-in user for Feed
      const userPosts = data.filter(
        (post) => String(post.authorId) === localStorage.getItem("userId")
      );
      setPosts(userPosts);
      // Initialize like state for each post
      const initialLikes = {};
      userPosts.forEach((post) => {
        const count = post.likes ? post.likes.length : 0;
        // Use currentUser from localStorage instead of post.likes.includes(currentUser) for consistency
        const liked = post.likes && post.likes.includes(localStorage.getItem("username"));
        initialLikes[post._id] = { count, liked };
      });
      setLikes(initialLikes);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const toggleDropdown = (postId) => {
    setActiveDropdown(activeDropdown === postId ? null : postId);
  };

  const handleDelete = async (postId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3001/api/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
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
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(postId);
        Swal.fire("Deleted!", "Your post has been deleted.", "success");
      }
    });
  };

  const toggleComments = (postId) => {
    setOpenCommentId(openCommentId === postId ? null : postId);
  };

  const handleLike = async (postId) => {
    const token = localStorage.getItem("token");
    const storedProfile = localStorage.getItem("profileImage") || "default-avatar.png";
    try {
      const res = await fetch(`http://localhost:3001/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentUser: localStorage.getItem("username"),
          profileImage: storedProfile,
        }),
      });
      if (res.ok) {
        const updatedLike = await res.json();
        setLikes((prevLikes) => ({ ...prevLikes, [postId]: updatedLike }));
      } else {
        console.error("Failed to update like");
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  return (
    <div>
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-6">
          <NavLink to="/recent">
            <button className="border border-[#EC993D] px-6 py-2 rounded-xl">Recent</button>
          </NavLink>
          <button className="bg-[#EC993D] text-white px-6 py-2 rounded-xl">Feed</button>
        </div>
      </div>

      <div className="flex gap-6 w-[890px]">
        <div className="flex-1 space-y-4">
          {posts.length === 0 ? (
            <div className="flex flex-col justify-center items-center mt-[120px] ml-[320px]">
              <img src={NoPost} alt="No posts available" className="w-[180px] h-[180px]" />
              <p className="mt-4 mr-8 text-gray-700 font-medium">No posts available</p>
            </div>
          ) : (
            posts.map((post) => {
              const hashtags = extractHashtags(post.content);
              const uniqueHashtags = getUniqueHashtags(hashtags);
              const cleanedContent = post.content.replace(/#[a-zA-Z0-9_]+/g, "").trim();
              const postLike = likes[post._id] || { count: 0, liked: false };

              // Override author and profile image if the logged-in user is the post author
              const displayAuthor =
                String(post.authorId) === localStorage.getItem("userId")
                  ? localStorage.getItem("username")
                  : post.author;
              const displayProfileImage =
                String(post.authorId) === localStorage.getItem("userId")
                  ? (localStorage.getItem("profileImage")?.startsWith("http")
                      ? localStorage.getItem("profileImage")
                      : `http://localhost:3001/uploads/${localStorage.getItem("profileImage")}`)
                  : post.profileImage && post.profileImage !== "default-avatar.png"
                    ? `http://localhost:3001/uploads/${post.profileImage}`
                    : "/default-avatar.png";

              return (
                <div key={post._id} className="bg-gray-100 p-4 rounded-lg shadow-md relative">
                  <div className="flex items-center space-x-3">
                    <img
                      src={displayProfileImage}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold">{displayAuthor}</p>
                      <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                  {cleanedContent && <p className="mt-2">{cleanedContent}</p>}
                  {uniqueHashtags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {uniqueHashtags.map((tag, index) => (
                        <p key={index} className="text-blue-500 text-sm cursor-pointer">
                          {tag}
                        </p>
                      ))}
                    </div>
                  )}
                  {post.image && (
                    <div className="mt-2 flex">
                      <img
                        src={`http://localhost:3001/uploads/${post.image}`}
                        alt="Post"
                        className="max-w-full h-auto object-contain rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-gray-500 text-sm mt-4">
                    <img
                      src={postLike.liked ? redLike : like}
                      alt="Like"
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => handleLike(post._id)}
                    />
                    <p onClick={() => handleLike(post._id)} className="cursor-pointer">
                      {postLike.count > 0
                        ? postLike.count === 1
                          ? "1 like"
                          : `${postLike.count} likes`
                        : "Like"}
                    </p>
                    <img
                      src={commentIcon}
                      alt="Comment"
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => toggleComments(post._id)}
                    />
                    <p onClick={() => toggleComments(post._id)} className="cursor-pointer">
                      {post.commentCount > 0
                        ? post.commentCount === 1
                          ? "1 comment"
                          : `${post.commentCount} comments`
                        : "Comment"}
                    </p>
                  </div>
                  {openCommentId === post._id && (
                    <Comment
                      post={post}
                      postId={post._id}
                      likeData={postLike}
                      syncLikes={(updatedLike) =>
                        setLikes((prev) => ({ ...prev, [post._id]: updatedLike }))
                      }
                      closeComments={() => {
                        setOpenCommentId(null);
                        fetchPosts();
                      }}
                    />
                  )}
                  {/* Edit/Delete dropdown */}
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
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;