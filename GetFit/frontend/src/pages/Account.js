import { Box, Typography, Avatar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Account = () => {
  // Navigation hook
  const navigate = useNavigate();

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
        {["Overview", "Account", "Calendar", "Progress"].map((item, idx) => (
          <Box
            key={idx}
            onClick={() => {
              if (item === "Overview") {
                navigate("/overview");
              }
              if (item === "Calendar") {
                navigate("/calendar");
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
            margin: 3
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
              User Name
            </Typography>
            <Typography sx={{ color: "#B0B0B0" }}>user@email.com</Typography>
            <Button
              variant="contained"
              sx={{
                mt: 1,
                bgcolor: "#FF6F00",
                "&:hover": { bgcolor: "#e65c00" },
              }}
            >
              Edit Profile
            </Button>
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
            Last login: 24 Nov 2025, Plymouth UK
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
