import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import like from "../assets/like.png";
import comment from "../assets/comment.png";
import Comment from "../components/Comment";
import dotIcon from "../assets/dot.png";
import redLike from "../assets/redLike.png"; // red version for liked state



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


// Build a full image URL if the user uploaded a custom image
const getImageUrl = (profileImage) => {
  if (!profileImage || profileImage === "default-avatar.png") {
    return "/default-avatar.png";
  }
  if (profileImage.startsWith("http")) {
    return profileImage;
  }
  return `http://localhost:3001/uploads/${profileImage}`;
};

const Recent = () => {
  const [posts, setPosts] = useState([]);
   const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [likes, setLikes] = useState({}); // state for like count & status per post
    const dropdownRef = useRef(null);
    const [openCommentId, setOpenCommentId] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setCurrentUser(storedUsername);
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/posts");
      const data = await res.json();
      // Filter out the current user's posts
      const otherPosts = data.filter(
        (post) => post.author !== localStorage.getItem("username")
      );
      setPosts(otherPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

    // --- Toggle dropdown for options ---
    const toggleDropdown = (postId) => {
      setActiveDropdown(activeDropdown === postId ? null : postId);
    };
 
 // --- Toggle comment section ---
 const toggleComments = (postId) => {
  setOpenCommentId(openCommentId === postId ? null : postId);
};

 // --- Handle like toggle ---
 const handleLike = (postId) => {
  setLikes((prevLikes) => {
    const postLike = prevLikes[postId] || { count: 0, liked: false };
    if (postLike.liked) {
      // Unlike: decrease count and set liked to false
      return { ...prevLikes, [postId]: { count: postLike.count - 1, liked: false } };
    } else {
      // Like: increase count and set liked to true
      return { ...prevLikes, [postId]: { count: postLike.count + 1, liked: true } };
    }
  });
};

  return (
    <div>
      {/* Header with Recent, Feed, and Topic */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-6">
          <button className="bg-[#EC993D] text-white px-6 py-2 rounded-xl">
            Recent
          </button>
          <NavLink to="/feed">
            <button className="border border-[#EC993D] px-6 py-2 rounded-xl">
              Feed
            </button>
          </NavLink>
        </div>
        <div className="mr-[255px]">
          <h2 className="text-lg font-semibold">Topic</h2>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Posts Section */}
        <div className="flex-1 space-y-4">
          {posts.map((post) => {
            const hashtags = extractHashtags(post.content);
            const uniqueHashtags = getUniqueHashtags(hashtags);
            const cleanedContent = post.content.replace(/#[a-zA-Z0-9_]+/g, "").trim();
            const postLike = likes[post._id] || { count: 0, liked: false };
            return (
              <div key={post._id} className="bg-gray-300 p-4 rounded-lg shadow-md">
                <div className="flex items-center space-x-3">
                  <img
                    src={getImageUrl(post.profileImage)}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
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
                    src={comment}
                    alt="Comment"
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => toggleComments(post._id)}
                  />
                  <p onClick={() => toggleComments(post._id)} className="cursor-pointer">
                    Comment
                  </p>
                </div>

                {openCommentId === post._id && (
                  <Comment
                    post={post}
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
     
 
        {/* Topics Section */}
        <div className="w-1/4 mb-12">
          <div className="bg-gray-300 p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-2 gap-2">
              {[
                "Relationships",
                "Family",
                "Self Harm",
                "Friends",
                "Hopes",
                "Bullying",
                "Health",
                "Work",
                "Music",
                "Parenting",
                "LGBTQ+",
                "Religion",
                "Education",
                "Pregnancy",
                "Mental Health",
                "Positive",
                "Meditation",
                "Self care",
                "OCD",
                "Psychosis",
                "Schizophrenia",
                "Paranoia",
              ].map((topic, index) => (
                <button
                  key={index}
                  className="bg-white px-3 py-2 rounded-lg text-sm"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recent;
