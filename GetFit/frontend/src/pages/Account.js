import { Box, Typography, Avatar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { io } from "socket.io-client";
import dayjs from "dayjs";

const Account = () => {
  
  // Navigation hook
  const navigate = useNavigate();

  // Date for last login display
  const date = new Date();

  // Edit account details
  const [showFields, setShowFields] = React.useState(false);

  // User data
  const [userData, setUserData] = React.useState({
    username: "",
    email: "",
  });

  // Get user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        setUserData({
          _id: data._id,
          username: data.username,
          email: data.email,
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserData();
  }, []);

  // Update username or email
  const updateProfile = async (newUsername, newEmail) => {
    // Ensure no empty updates are sent to the database
    if (!newUsername && !newEmail) return;
    if (newUsername === "") newUsername = userData.username;
    if (newEmail === "") newEmail = userData.email;

    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: newUsername,
          email: newEmail,
        }),
      });
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  // Handle websocket profile updates
  useEffect(() => {
    const socket = io("http://localhost:5000", {
      auth: { token: localStorage.getItem("token") },
    });

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("profileUpdated", (data) => {
      if (data.userId === userData._id) {
        setUserData((prev) => ({
          ...prev,
          username: data.username,
          email: data.email,
        }));
      }
    });

    return () => socket.disconnect();
  }, [userData._id]);

  return (
    <Box display="flex" minHeight="100vh" sx={{ bgcolor: "#1E1E1C" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: "18%",
          minHeight: "100vh",
          bgcolor: "linear-gradient(to bottom, #2A2A2A, #1E1E1C)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Box margin={2}>
          <Typography
            sx={{
              color: "#f9f9f9",
              fontWeight: "bold",
              fontSize: "26px",
              letterSpacing: "1px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            GetFit
          </Typography>
        </Box>

        {/* Sidebar Items */}
        {["Overview", "Account", "Progress"].map((item, idx) => (
          <Box
            key={idx}
            onClick={() => {
              if (item === "Overview") {
                navigate("/overview");
              }
              if (item === "Progress") {
                navigate("/progress");
              }
            }}
            sx={{
              mt: 1,
              width: "100%",
              height: "55px",
              cursor: "pointer",
              background:
                item === "Account"
                  ? "linear-gradient(to right, #2C2C29 95%, #FF6F00 95%)"
                  : "transparent",
              "&:hover": {
                background:
                  "linear-gradient(to right, #2C2C29 95%, #FF6F00 95%)",
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.3s ease",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
                color: "#F5F5F5",
              }}
            >
              {item}
            </Typography>
          </Box>
        ))}

        {/* Log out */}
        <Box
          sx={{
            mt: "auto",
            width: "100%",
            height: "55px",
            "&:hover": {
              background: "linear-gradient(to right, #2C2C29 95%, #FF6F00 95%)",
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontFamily: "Arial, sans-serif",
              color: "#F5F5F5",
            }}
            onClick={() =>{
              navigate("/")
          }}
          >
            Log out
          </Typography>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          minHeight: "100vh",
          bgcolor: "#1E1E1C",
          overflow: "hidden",
        }}
      >
        <Typography
          sx={{
            color: "#F5F5F5",
            margin: 2,
            fontSize: "20px",
            fontWeight: "600",
            fontFamily: "Arial, sans-serif",
            margin: 3,
          }}
        >
          Account Settings
        </Typography>

        {/* Profile Card */}
        <Box
          sx={{
            p: 3,
            bgcolor: "#2C2C29",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 3,
            margin: 3,
          }}
        >
          <Avatar sx={{ width: 80, height: 80, bgcolor: "#FF6F00" }}>U</Avatar>
          <Box>
            <Typography sx={{ color: "#F5F5F5", fontWeight: "600" }}>
              {userData.username}
            </Typography>
            <Typography sx={{ color: "#B0B0B0" }}>{userData.email}</Typography>
            <Button
              variant="contained"
              sx={{
                mt: 1,
                bgcolor: "#FF6F00",
                "&:hover": { bgcolor: "#e65c00" },
              }}
              onClick={() => {
                setShowFields((prev) => !prev);
              }}
            >
              Edit Profile
            </Button>

            {showFields && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ color: "#F5F5F5", mb: 1 }}>
                  Edit Account Details
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <input
                    type="text"
                    placeholder="New Username"
                    style={{
                      padding: "8px",
                      borderRadius: "4px",
                      border: "none",
                      background: "#333",
                      color: "#fff",
                    }}
                  ></input>
                  <input
                    type="email"
                    placeholder="New Email"
                    style={{
                      padding: "8px",
                      borderRadius: "4px",
                      border: "none",
                      background: "#333",
                      color: "#fff",
                    }}
                  />
                  <Button
                    variant="contained"
                    sx={{
                      mt: 1,
                      bgcolor: "#FF6F00",
                      "&:hover": { bgcolor: "#e65c00" },
                    }}
                    onClick={() => {
                      updateProfile(
                        document.querySelector(
                          'input[placeholder="New Username"]'
                        ).value,
                        document.querySelector('input[placeholder="New Email"]')
                          .value
                      );

                      setShowFields(false);
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* Security Card */}
        <Box
          sx={{
            p: 3,
            bgcolor: "#2C2C29",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            margin: 3,
          }}
        >
          <Typography sx={{ color: "#F5F5F5", fontWeight: "600", mb: 2 }}>
            Security
          </Typography>
          <Typography sx={{ color: "#B0B0B0", mb: 1 }}>
            {`Change your password regularly to keep your account secure. Last Login:`} {dayjs(date).format("DD/MM/YYYY HH:mm")}
            
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#FF6F00",
              "&:hover": { bgcolor: "#e65c00" },
            }}
          >
            Change Password
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default Account;
