import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import like from "../assets/like.png";
import redLike from "../assets/redLike.png";
import commentIcon from "../assets/comment.png";
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

const Recent = () => {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [likes, setLikes] = useState({});
  const [openCommentId, setOpenCommentId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if (!storedUsername || !token) {
      navigate("/login");
    } else {
      setCurrentUser(storedUsername);
    }
    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3001/api/posts", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();

      // Check if the API returned an error instead of an array
      if (data.error) {
        console.error("API Error:", data.error);
        return;
      }
      if (!Array.isArray(data)) {
        console.error("Data is not an array:", data);
        return;
      }

      // Filter posts to exclude those by the logged-in user
      const otherPosts = data.filter(
        (post) => post.author !== localStorage.getItem("username")
      );
      setPosts(otherPosts);

      // Initialize likes for these posts
      const initialLikes = {};
      otherPosts.forEach((post) => {
        const count = post.likes ? post.likes.length : 0;
        const liked = post.likes && post.likes.includes(localStorage.getItem("username"));
        initialLikes[post._id] = { count, liked };
      });
      setLikes(initialLikes);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const toggleComments = (postId) => {
    setOpenCommentId(openCommentId === postId ? null : postId);
  };

  const handleLike = async (postId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3001/api/posts/${postId}/like`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentUser }),
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
      {/* Navigation and header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-6">
          <button className="bg-[#EC993D] text-white px-6 py-2 rounded-xl">Recent</button>
          <NavLink to="/feed">
            <button className="border border-[#EC993D] px-6 py-2 rounded-xl">Feed</button>
          </NavLink>
        </div>
        <div className="mr-[255px]">
          <h2 className="text-lg font-semibold">Topic</h2>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          {posts.map((post) => {
            const hashtags = extractHashtags(post.content);
            const uniqueHashtags = getUniqueHashtags(hashtags);
            const cleanedContent = post.content.replace(/#[a-zA-Z0-9_]+/g, "").trim();
            const postLike = likes[post._id] || { count: 0, liked: false };

            return (
              <div key={post._id} className="bg-gray-300 p-4 rounded-lg shadow-md relative">
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      post.profileImage
                        ? `http://localhost:3001/uploads/${post.profileImage}`
                        : "/default-avatar.png"
                    }
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{post.author}</p>
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
                  <Comment post={post} postId={post._id} closeComments={() => setOpenCommentId(null)} />
                )}
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
                <button key={index} className="bg-white px-3 py-2 rounded-lg text-sm">
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