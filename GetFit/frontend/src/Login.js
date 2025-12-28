import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Slide,
  Collapse,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

// LoginPage component
const LoginPage = () => {
  
  // State to toggle between login and registration forms
  const [formMode, setFormMode] = useState("login");

  // State to hold form data
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Navigation hook
  const navigate = useNavigate();
  // Render the component
  return (
    
    // Background Box
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ background: "#2b2d2eff" }}
    >
      {/* Paper container for the forms */}
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: 350,
          bgcolor: "#3A3A3C",
          color: "#ffffff",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* Login Form */}
        <Collapse in={formMode === "login"} timeout={500} unmountOnExit>
          <Slide direction="right" in={formMode === "login"} mountOnEnter unmountOnExit timeout={500}>
            <Box>
              <Typography variant="h4" align="center" fontWeight="bold">
                Login
              </Typography>
              <br />
              <Typography fontSize="20px" align="center" color="#AAAAAA">
                Work for a better you
              </Typography>
              <br />
              <TextField
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  bgcolor: "#606060",
                  input: { color: "#AAAAAA" },
                  label: { color: "#AAAAAA" },
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#000000ff" },
                  },
                  "& label.Mui-focused": { color: "#000000ff" },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  bgcolor: "#606060",
                  input: { color: "#AAAAAA" },
                  label: { color: "#AAAAAA" },
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#000000ff" },
                  },
                  "& label.Mui-focused": { color: "#000000ff" },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2, bgcolor: "#b84d00ff" }}
                onClick={async () => {
                  // Prepare user data
                  const userData = { username, password }; 

                  console.log("Sending login data:", userData);
                  try {
                    const response = await fetch("http://localhost:5000/api/users/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(userData),
                    });

                    if (!response.ok) throw new Error(`Server error: ${response.status}`);

                    const result = await response.json();

                    // Save token for protected routes
                    localStorage.setItem("token", result.token);

                    // Redirect to /overview
                    navigate("/overview");
                    alert("Login successful");
                    setFormMode("login");
                  } catch (err) {
                    console.error("Error fetching data:", err);
                  }
                }}
              >
                <Typography fontSize="20px" fontWeight="bold">
                  Login
                </Typography>
              </Button>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                margin="10px 0"
              >
                <Typography fontSize="15px" color="#AAAAAA">
                  Forgot Password
                </Typography>
                <Typography
                  fontSize="15px"
                  color="#AAAAAA"
                  sx={{ cursor: "pointer" }}
                  onClick={() => setFormMode("register")}
                >
                  Sign Up
                </Typography>
              </Box>
            </Box>
          </Slide>
        </Collapse>

        {/* Registration Form */ }
        <Collapse in={formMode === "register"} timeout={500} unmountOnExit>
          <Slide direction="left" in={formMode === "register"} mountOnEnter unmountOnExit timeout={500}>
            <Box>
              <Typography variant="h4" align="center" fontWeight="bold">
                Sign Up
              </Typography>
              <br />
              <Typography fontSize="20px" align="center" color="#AAAAAA">
                Start your journey today!
              </Typography>
              <br />
              <TextField
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  bgcolor: "#606060",
                  input: { color: "#AAAAAA" },
                  label: { color: "#AAAAAA" },
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#000000ff" },
                  },
                  "& label.Mui-focused": { color: "#000000ff" },
                }}
              />
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                variant="outlined"
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  bgcolor: "#606060",
                  input: { color: "#AAAAAA" },
                  label: { color: "#AAAAAA" },
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#000000ff" },
                  },
                  "& label.Mui-focused": { color: "#000000ff" },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  bgcolor: "#606060",
                  input: { color: "#AAAAAA" },
                  label: { color: "#AAAAAA" },
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#000000ff" },
                  },
                  "& label.Mui-focused": { color: "#000000ff" },
                }}
              />
              {/* Submit registration data to backend */}
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2, bgcolor: "#b84d00ff" }}
                onClick={async () => {
                  // Prepare user data
                  const userData = {
                    username: username,
                    email: email,
                    password: password
                  }
                  
                  // Send data to backend
                  try {
                    // Send user data to the backend
                    const response = await fetch("http://localhost:5000/api/users/register", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(userData),
                    });
                    // Check for server errors
                    if (!response.ok) {
                      throw new Error(`Server error: ${response.status}`);
                    }
                    
                    alert("registration successful"); 
                    setFormMode("login"); 
                  } catch (err) {
                    console.error("Error sending data:", err);
                  }
                                  
                }}
              >
                <Typography fontSize="20px" fontWeight="bold">
                  Sign Up
                </Typography>
              </Button>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                margin="10px 0"
              >
                <Typography fontSize="15px" color="#AAAAAA">
                  Forgot Password
                </Typography>
                <Typography
                  fontSize="15px"
                  color="#AAAAAA"
                  sx={{ cursor: "pointer" }}
                  onClick={() => setFormMode("login")}
                >
                  Login
                </Typography>
              </Box>
            </Box>
          </Slide>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default LoginPage;
