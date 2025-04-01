// src/components/Wellness.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import leftarrow from "../assets/leftarrow.png";
import anxietyImg from "../assets/anxiety.png";

const Wellness = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const topic = queryParams.get("topic");

  const [videos, setVideos] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Decide what to fetch based on topic availability
  useEffect(() => {
    setLoading(true);
    if (topic) {
      fetchVideos(topic);
    } else {
      fetchCenters();
    }
  }, [topic]);

  // Fetch top videos for a given topic
  const fetchVideos = async (topic) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/recommend_videos?topic=${encodeURIComponent(topic)}`
      );
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the admin-created rooms (centers)
  const fetchCenters = async () => {
    try {
      const response = await axios.get("http://localhost:3001/centers");
      setCenters(response.data);
    } catch (error) {
      console.error("Error fetching centers:", error);
    } finally {
      setLoading(false);
    }
  };

  // When a user clicks Play, navigate to the same page with the topic parameter
  const handlePlay = (centerName) => {
    navigate(`/wellness?topic=${encodeURIComponent(centerName)}`);
  };

  return (
    <div className="p-4">
      <button className="mb-4" onClick={() => window.history.back()}>
        <img src={leftarrow} alt="Back" className="w-6 h-6" />
      </button>

      {topic ? (
        <>
          <h2 className="text-xl text-[#EC993D] font-bold mb-4">{topic} results</h2>
          {loading ? (
            <p>Loading videos...</p>
          ) : videos.length > 0 ? (
            <div>
             
              <div className="grid grid-cols-2 gap-4">
                {videos.map((video, index) => (
                  <div key={index} className="p-4 bg-gray-200 rounded-lg">
                    <video controls className="w-full h-auto">
                      <source src={video.URL} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <p className="mt-2 text-sm">Title: {video.Title}</p>
                    <p className="mt-1 text-sm">Views: {video.Views}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>No videos found for this topic.</p>
          )}
        </>
      ) : (
        <>

          {loading ? (
            <p>Loading rooms...</p>
          ) : centers.length > 0 ? (
            <div className="grid grid-cols-4 gap-6">
              {centers.map((center) => (
                <div
                  key={center._id}
                  className="bg-gray-100 rounded-lg shadow p-4 flex flex-col items-end"
                >
                  <h2 className="font-semibold text-[#EC993D] mb-2">{center.name}</h2>
                  {center.image ? (
                    <img
                      src={`http://localhost:3001/${center.image}`}
                      alt={center.name}
                      className="w-56 h-52 object-cover rounded mb-3"
                    />
                  ) : (
                    <img
                      src={anxietyImg}
                      alt={center.name}
                      className="w-56 h-52 object-cover rounded mb-3"
                    />
                  )}
                  <div className="w-full flex items-center justify-end gap-4">
                    <button
                      onClick={() => handlePlay(center.name)}
                      className="bg-[#EC993D] text-white px-4 py-1 rounded hover:bg-orange-400"
                    >
                      Play
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No rooms available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Wellness;
