// Users Page 
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import swal from "sweetalert";
import dotIcon from "../assets/dot.png";
import empty from "../assets/empty.png";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [dropdownUserId, setDropdownUserId] = useState(null);
  const token = localStorage.getItem("token");
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside the dropdown container
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownUserId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://localhost:3001/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const handleDelete = (userId) => {
    swal({
      title: "Are you sure?",
      text: "Do you want to delete this user?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`http://localhost:3001/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            swal("User deleted successfully.", { icon: "success" });
            setUsers(users.filter((user) => user._id !== userId));
          })
          .catch((error) => {
            console.error("Error deleting user:", error);
            swal("Error deleting user", { icon: "error" });
          });
      }
    });
  };

  const handleFreeze = (userId) => {
    swal({
      title: "Are you sure?",
      text: "Do you want to freeze this user?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willFreeze) => {
      if (willFreeze) {
        axios
          .put(
            `http://localhost:3001/api/users/freeze/${userId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then(() => {
            swal("User has been frozen.", { icon: "success" });
            setUsers(
              users.map((user) =>
                user._id === userId ? { ...user, isFrozen: true } : user
              )
            );
          })
          .catch((error) => {
            console.error("Error freezing user:", error);
            swal("Error freezing user", { icon: "error" });
          });
      }
    });
  };

  const toggleDropdown = (userId) => {
    setDropdownUserId(dropdownUserId === userId ? null : userId);
  };

  return (
    <div className="p-6 w-full">
      {/* Top bar with the 'Users' button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-6">
          <button className="bg-[#EC993D] px-6 py-2 text-white rounded-lg">
            Users
          </button>
        </div>
      </div>

      {/* Table of users */}
      <div className="relative">
        <table className="w-full border-collapse">
          <thead className="bg-white text-black border-[2px] border-gray-200">
            <tr>
              <th className="p-3 font-medium text-left">Image</th>
              <th className="p-3 font-medium text-left">Email</th>
              <th className="p-3 font-medium text-left">User</th>
              <th className="p-3 font-medium text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border-[1px] border-gray-200 relative">
                  <td className="p-3">
                    <img
                      src={`http://localhost:3001/uploads/${user.profileImage}`}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="p-3 text-[#6C757D]">{user.email}</td>
                  <td className="p-3 text-[#6C757D]">
                    {user.name} {user.isFrozen && "(Frozen)"}
                  </td>
                  <td className="p-3 relative">
                    <img
                      src={dotIcon}
                      alt="Options"
                      className="w-4 h-4 ml-3 cursor-pointer"
                      onClick={() => toggleDropdown(user._id)}
                    />
                    {dropdownUserId === user._id && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10"
                      >
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => {
                            handleFreeze(user._id);
                            setDropdownUserId(null);
                          }}
                        >
                          Freeze
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => {
                            handleDelete(user._id);
                            setDropdownUserId(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">
                  <div className="flex flex-col justify-center items-center mt-[100px] mr-[9px]">
                    <img src={empty} alt="No users available" className="w-[180px] h-[180px]" />
                    <p>No users found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
