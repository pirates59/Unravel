import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);

  // Replace with real token from your auth flow
  const token = localStorage.getItem("token"); 

  useEffect(() => {
    // Fetch users on component mount
    axios
      .get("http://localhost:3001/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data); // This should be an array of user objects
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [token]);

  return (
    <div style={{ padding: "20px" }}>
      
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "10px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#EC993D", color: "#fff" }}>
            <th style={{ padding: "8px", textAlign: "left" }}>Image</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Email</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Password (Hashed)</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              style={{ borderBottom: "1px solid #ccc" }}
            >
              <td style={{ padding: "8px" }}>
                <img
                  src={`http://localhost:3001/uploads/${user.profileImage}`}
                  alt="Profile"
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
              </td>
              <td style={{ padding: "8px" }}>{user.email}</td>
              <td style={{ padding: "8px" }}>{user.password}</td>
              <td style={{ padding: "8px" }}>
                {/* Live three dots in the Action column */}
                <span style={{ cursor: "pointer", fontSize: "20px" }}>...</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
