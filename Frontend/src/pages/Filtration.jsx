import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import swal from "sweetalert";
import dotIcon from "../assets/dot.png";

const Filtration = () => {
  const [reportedComments, setReportedComments] = useState([]);
  const [dropdownUserId, setDropdownUserId] = useState(null);
  const token = localStorage.getItem("token");
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchReportedComments();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownUserId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchReportedComments = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/reported-comments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReportedComments(res.data);
    } catch (error) {
      console.error("Error fetching reported comments:", error);
    }
  };

  const toggleDropdown = (userId) => {
    setDropdownUserId(dropdownUserId === userId ? null : userId);
  };

  const handleFreezeUser = async (userId) => {
    swal({
      title: "Are you sure?",
      text: "Do you want to freeze this user's account?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willFreeze) => {
      if (willFreeze) {
        try {
          await axios.put(
            `http://localhost:3001/api/users/freeze/${userId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          swal("User account has been frozen.", { icon: "success" });
          fetchReportedComments();
        } catch (error) {
          console.error("Error freezing user:", error);
          swal("Error freezing user", { icon: "error" });
        }
      }
    });
  };

  const handleDeleteUser = async (userId) => {
    swal({
      title: "Are you sure?",
      text: "Do you want to delete this user?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axios.delete(`http://localhost:3001/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          swal("User deleted successfully.", { icon: "success" });
          fetchReportedComments();
        } catch (error) {
          console.error("Error deleting user:", error);
          swal("Error deleting user", { icon: "error" });
        }
      }
    });
  };

  return (
    <div className="p-6 w-full">
      {/* Top bar with the 'Filtration' button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-6">
          <button className="bg-[#EC993D] px-6 py-2 text-white rounded-lg">
            Filtration
          </button>
        </div>
      </div>
      <div className="relative">
        <table className="w-full border-collapse">
          <thead className="bg-white text-black border-[2px] border-gray-200">
            <tr>
              <th className="p-3 font-medium text-left">Image</th>
              <th className="p-3 font-medium text-left">Email</th>
              <th className="p-3 font-medium text-left">User</th>
              <th className="p-3 font-medium text-left">Content</th>
              <th className="p-3 font-medium text-left">Date and Time</th>
              <th className="p-3 font-medium text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {reportedComments.map((item) => (
              <tr key={item._id} className="border-[1px] border-gray-200 relative">
                <td className="p-3 text-[#6C757D]">
                  <img
                    src={`http://localhost:3001/uploads/${item.user.profileImage}`}
                    alt="Profile"
                    className="w-10 h-10 rounded-full mx-auto"
                  />
                </td>
                <td className="p-3 text-[#6C757D]">{item.user.email}</td>
                <td className="p-3 text-gray-600">
                  {item.user.name} {item.user.isFrozen ? "(Frozen)" : ""}
                </td>
                <td className="p-3 text-gray-600">{item.commentContent}</td>
                <td className="p-3 text-gray-600">
                  {new Date(item.createdAt).toISOString().replace("T", " ").slice(0, 19)}
                </td>
                <td className="p-3 relative">
                  <img
                    src={dotIcon}
                    alt="Options"
                    className="w-4 h-4 ml-3 cursor-pointer"
                    onClick={() => toggleDropdown(item.user._id)}
                  />
                  {dropdownUserId === item.user._id && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10"
                    >
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          handleFreezeUser(item.user._id);
                          setDropdownUserId(null);
                        }}
                      >
                        Freeze
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          handleDeleteUser(item.user._id);
                          setDropdownUserId(null);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {reportedComments.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No reported comments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Filtration;
