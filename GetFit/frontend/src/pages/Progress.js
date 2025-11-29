import { Box, Typography, Avatar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LineChart } from "@mui/x-charts/LineChart";

const Progress = () => {
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
              if (item === "Account") {
                navigate("/account");
              }
            }}
            sx={{
              mt: 1,
              width: "100%",
              height: "55px",
              cursor: "pointer",
              background:
                item === "Progress"
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
            margin: 3,
          }}
        >
          Progress
        </Typography>
        {/* Body Weight and PR Progress Sections */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Box
            sx={{
              bgcolor: "#2A2A2A",
              margin: 3,
              borderRadius: "12px",
              padding: 3,
              height: "80vh",
              width: "40vw",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Section Title */}
            <Typography
              sx={{
                color: "#F5F5F5",
                fontSize: "18px",
                fontWeight: "600",
                fontFamily: "Arial, sans-serif",
                mb: 2,
              }}
            >
              Body Weight Progress
            </Typography>

            {/* Line Chart */}
            <LineChart
              width={700}
              height={600}
              series={[
                {
                  data: [69, 69.2, 69.3, 69.5, 69.9, 70, 70.2],
                  label: "Weight (kg)",
                  color: "#FF6F00",
                  lineSmoothing: 0.3, // smooth line
                },
              ]}
              xAxis={[
                {
                  scaleType: "band",
                  data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                  label: "Days",
                  labelProps: { sx: { fill: "#F5F5F5", fontWeight: 500 } },
                  tickLabelProps: {
                    sx: { fill: "#F5F5F5", fontSize: "0.9rem" },
                  },
                  lineProps: { sx: { stroke: "#555" } },
                  tickProps: { sx: { stroke: "#555" } },
                },
              ]}
              yAxis={[
                {
                  label: "Weight (kg)",
                  labelProps: { sx: { fill: "#F5F5F5", fontWeight: 500 } },
                  tickLabelProps: {
                    sx: { fill: "#F5F5F5", fontSize: "0.9rem" },
                  },
                  lineProps: { sx: { stroke: "#555" } },
                  tickProps: { sx: { stroke: "#555" } },
                },
              ]}
              sx={{
                "& .MuiChartsLegend-root": { display: "none" }, // hide legend for cleaner look
                "& .MuiChartsTooltip-root": {
                  backgroundColor: "#1E1E1E",
                  color: "#FFF",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                },
                "& .MuiChartsAxis-root line": { stroke: "#555" },
                "& .MuiChartsAxis-root text": {
                  fill: "#F5F5F5",
                  fontWeight: 500,
                },
              }}
            />
          </Box>

          <Box
            sx={{
              bgcolor: "#2A2A2A",
              margin: 3,
              borderRadius: "12px",
              padding: 3,
              height: "80vh",
              width: "40vw",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Section Title */}
            <Typography
              sx={{
                color: "#F5F5F5",
                fontSize: "18px",
                fontWeight: "600",
                fontFamily: "Arial, sans-serif",
                mb: 3,
              }}
            >
              Monthly PR Progress
            </Typography>

            {/* Table Header */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                px: 2,
                py: 1,
                borderBottom: "1px solid #555",
                color: "#B0B0B0",
                fontWeight: 500,
              }}
            >
              <Typography sx={{ flex: 2 }}>Exercise</Typography>
              <Typography sx={{ flex: 1, textAlign: "center" }}>
                Current (kg)
              </Typography>
              <Typography sx={{ flex: 1, textAlign: "center" }}>
                Target (kg)
              </Typography>
            </Box>

            {/* Different lifts */}
            {[
              { name: "Bench Press", prev: 80, current: 85 },
              { name: "Squat", prev: 120, current: 125 },
              { name: "Deadlift", prev: 150, current: 160 },
            ].map((lift, index) => (
              <Box
                key={lift.name}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  px: 2,
                  py: 1.5,
                  mt: 1,
                  borderRadius: "8px",
                  bgcolor: index % 2 === 0 ? "#333" : "#2E2E2E",
                  color: "#FFFFFF",
                  alignItems: "center",
                  transition: "background 0.3s",
                  "&:hover": { bgcolor: "#FF6F00", color: "#fff" },
                }}
              >
                <Typography sx={{ flex: 2, fontSize: "16px", fontWeight: 500 }}>
                  {lift.name}
                </Typography>
                <Typography
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                >
                  {lift.prev}
                </Typography>
                <Typography
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                >
                  {lift.current}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Progress;
