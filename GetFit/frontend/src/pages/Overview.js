
import { useNavigate } from "react-router-dom";
import { Box, Typography, Avatar, Button } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

const Overview = () => {
  
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
        <Box display="flex" alignItems="end" textAlign="end" gap={2} margin={2}>
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
              if (item === "Account") {
                navigate("/account");
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
                item === "Overview"
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
          }}
        >
          Welcome back, User!
        </Typography>

        {/* Responsive Cards Row */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            boxSizing: "border-box",
            px: 2,
            gap: 2,
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{ flex: 3, display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* Stat cards */}
            <Box sx={{ display: "flex", gap: 2 }}>
              {[
                { title: "This months visits", value: "17 visits" },
                { title: "Current Weight", value: "70kg" },
                { title: "Target Weight", value: "72kg" },
              ].map((card, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: 1,
                    p: 3,
                    bgcolor:
                      card.title === "This months visits"
                        ? "#FF6F00"
                        : card.title === "Current Weight"
                        ? "#2b2929ff"
                        : "#2b2929ff",

                    borderRadius: 3,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.6)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "#F5F5F5",
                      fontWeight: "600",
                      fontSize: "16px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: "32px",
                      fontWeight: "bold",
                      mt: 2,
                    }}
                  >
                    {card.value}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Visits Graph card */}
            <Box
              sx={{
                p: 3,
                bgcolor: "#2C2C29",
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                height: "600px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography sx={{ color: "#F5F5F5", fontWeight: "600", mb: 2 }}>
                Visits Graph
              </Typography>

              <BarChart
                xAxis={[
                  {
                    data: [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ],
                  },
                ]}
                series={[
                  {
                    data: [17, 15, 15, 18, 17, 15, 12, 14, 19, 12, 17, 15],
                    color: "#FF6F00",
                  },
                ]}
                width={1100}
                height={500}
                margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
                sx={{
                  "& .MuiChartsAxis-root text": { fill: "#F5F5F5" },
                  "& .MuiChartsLegend-root text": { fill: "#B0B0B0" },
                  "& .MuiChartsAxis-line": { stroke: "#B0B0B0" },
                  "& .MuiChartsAxis-tick": { stroke: "#B0B0B0" },
                }}
              />
            </Box>
          </Box>

          {/* Friends card */}
          <Box
            sx={{
              flex: 1,
              p: 3,
              bgcolor: "#2C2C29",
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              minHeight: "750px",
            }}
          >
            <Typography
              sx={{
                color: "#F5F5F5",
                fontWeight: "600",
                borderBottom: "2px solid #FFFFFF",
                pb: 1,
              }}
            >
              Friends list
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Overview;
