import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { LineChart, BarChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";

const Overview = () => {
  // Navigation hook
  const navigate = useNavigate();

  // Store user weight and target weight
  const [currentWeight, setCurrentWeight] = useState(null);
  const [targetWeight, setTargetWeight] = useState(null);

  // Store weight entries for the chart
  const [weightEntries, setWeightEntries] = useState([]);

  useEffect(() => {
    const fetchWeightEntries = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/weights", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          console.error("GET /weights failed:", data.message);
          return;
        }

        if (Array.isArray(data)) {
          // safe to map
          const entries = data.map((w) => ({
            date: w.date,
            weightKg: w.weightKg,
            targetKg: w.targetKg,
          }));
          setWeightEntries(entries);
        } else {
          console.error("Expected array, got:", data);
        }
      } catch (err) {
        console.error("Error fetching weight entries:", err);
      }
    };
    fetchWeightEntries();
  }, [currentWeight]);

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/weights", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && Array.isArray(data) && data.length > 0) {
          const latest = data[0]; 
          setCurrentWeight(latest.weightKg);
          setTargetWeight(latest.targetKg);
        }
      } catch (err) {
        console.error("Error fetching weights:", err);
      }
    };
    fetchWeights();
  }, []);

  // UseState to store whether the user is editing their current or target weight
  const [open, setOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  // UseState to store weight value
  const [value, setValue] = useState("");

  // Handle the chart state
  const [chartType, setChartType] = useState("weight"); // change between weight and visits

  // Store visits
  const [userData, setUserData] = useState({ visits: 0, visitHistory: [] });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setUserData({
            visits: data.visits,
            visitHistory: data.visitHistory || [],
          });
        } else {
          console.error("Profile error:", data.message);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchUserData();
  }, []);

  // Handle editing visits
  const handleVisits = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users/visits", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUserData({
          visits: data.visits,
          visitHistory: data.visitHistory || [],
        });
      } else {
        console.error("Error updating visits:", data.message);
      }
    } catch (err) {
      console.error("Error posting visits:", err);
    }
  };

  // Handle visit history
  const visitsByMonth = {};
  userData.visitHistory.forEach((entry) => {
    const month = dayjs(entry.date).format("MMM");
    visitsByMonth[month] = (visitsByMonth[month] || 0) + 1;
  });

  const months = Object.keys(visitsByMonth);
  const counts = Object.values(visitsByMonth);

  // Handle saving card edits
  const handleOpen = (card) => {
    setEditingCard(card);
    setValue(card.value);
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      // Build request body depending on which card is being edited
      const body =
        editingCard?.title === "Current Weight"
          ? { date: new Date(), weightKg: value, targetKg: targetWeight }
          : { date: new Date(), weightKg: currentWeight, targetKg: value };

      const response = await fetch("http://localhost:5000/api/weights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        if (editingCard?.title === "Current Weight") {
          setCurrentWeight(data.weightEntry.weightKg);
        } else if (editingCard?.title === "Target Weight") {
          setTargetWeight(data.weightEntry.targetKg);
        }
        setOpen(false);
      } else {
        console.error("Error saving weight:", data.message);
      }
    } catch (err) {
      console.error("Error posting weight:", err);
    }
  };

  // UseEffect to handle fetching current and target weight values
  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/weights", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.length > 0) {
          const latest = data[0];
          setCurrentWeight(latest.weightKg);
          setTargetWeight(latest.targetKg);
        }
      } catch (err) {
        console.error("Error fetching weights:", err);
      }
    };
    fetchWeights();
  }, []);

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
            margin: 3,
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
                {
                  title: "This months visits",
                  value:
                    userData.visits !== null ? userData.visits : "Loading...",
                },
                { title: "Current Weight", value: currentWeight ?? "" },
                { title: "Target Weight", value: targetWeight ?? "" },
              ].map((card, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: 1,
                    p: 3,
                    bgcolor:
                      card.title === "This months visits"
                        ? "#FF6F00"
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
                    position: "relative",
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

                  {/* Edit button for weight cards */}
                  {(card.title === "Current Weight" ||
                    card.title === "Target Weight" ||
                    card.title === "This months visits") && (
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "#AAAAAA",
                        "&:hover": { color: "#FF6F00" },
                      }}
                      onClick={() => {
                        if (card.title === "This months visits") {
                          // Post updated visit count
                          handleVisits();
                        } else {
                          handleOpen(card);
                        }
                      }}
                    >
                      {card.title === "This months visits" ? (
                        <AddIcon fontSize="small" />
                      ) : (
                        <EditIcon fontSize="small" />
                      )}
                    </IconButton>
                  )}
                </Box>
              ))}

              <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Edit {editingCard?.title}</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Enter new value"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={handleSave} variant="contained">
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>

            {/* Visits Graph or body weight graph card */}
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
              {/* Header with toggle buttons */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography sx={{ color: "#F5F5F5", fontWeight: "600" }}>
                  {chartType === "weight"
                    ? "Body Weight Graph"
                    : "Visits Graph"}
                </Typography>
                <Box>
                  <Button
                    variant={chartType === "weight" ? "contained" : "outlined"}
                    size="small"
                    sx={{
                      mr: 1,
                      bgcolor:
                        chartType === "weight" ? "transparent" : "#2C2C29",
                      color: "#F5F5F5",
                      border:
                        chartType === "weight" ? "2px solid #FFF" : "none",
                      boxShadow:
                        chartType !== "weight"
                          ? "0 2px 6px rgba(0,0,0,0.5)"
                          : "none",
                      "&:hover": {
                        bgcolor: "#3A3A36",
                      },
                    }}
                    onClick={() => setChartType("weight")}
                  >
                    Weight
                  </Button>
                  <Button
                    variant={chartType === "visits" ? "contained" : "outlined"}
                    size="small"
                    sx={{
                      bgcolor:
                        chartType === "visits" ? "transparent" : "#2C2C29",
                      color: "#F5F5F5",
                      border:
                        chartType === "visits" ? "2px solid #FFF" : "none",
                      boxShadow:
                        chartType !== "visits"
                          ? "0 2px 6px rgba(0,0,0,0.5)"
                          : "none",
                      "&:hover": {
                        bgcolor: "#3A3A36",
                      },
                    }}
                    onClick={() => setChartType("visits")}
                  >
                    Visits
                  </Button>
                </Box>
              </Box>

              {/* Conditional rendering */}
              {chartType === "weight" ? (
                <Box sx={{ overflowX: "auto" }}>
                  <LineChart
                    width={Math.max(weightEntries.length * 80, 1000)}
                    height={500}
                    series={[
                      {
                        data: weightEntries.map((entry) => entry.weightKg),
                        label: "Weight (kg)",
                        color: "#FF6F00",
                        lineSmoothing: 0.3,
                      },
                    ]}
                    xAxis={[
                      {
                        scaleType: "band",
                        data: weightEntries.map((entry) =>
                          dayjs(entry.date).format("DD/MM/YY")
                        ),
                        label: "Date",
                        labelProps: {
                          sx: { fill: "#F5F5F5", fontWeight: 500 },
                        },
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
                        labelProps: {
                          sx: { fill: "#F5F5F5", fontWeight: 500 },
                        },
                        tickLabelProps: {
                          sx: { fill: "#F5F5F5", fontSize: "0.9rem" },
                        },
                        lineProps: { sx: { stroke: "#555" } },
                        tickProps: { sx: { stroke: "#555" } },
                      },
                    ]}
                    sx={{
                      "& .MuiChartsLegend-root": { display: "none" },
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
              ) : (
                <BarChart
                  xAxis={[{ data: months }]}
                  series={[{ data: counts, color: "#FF6F00" }]}
                  width={1000}
                  height={500}
                  sx={{
                    "& .MuiChartsAxis-root text": { fill: "#F5F5F5" },
                    "& .MuiChartsLegend-root text": { fill: "#B0B0B0" },
                    "& .MuiChartsAxis-line": { stroke: "#B0B0B0" },
                    "& .MuiChartsAxis-tick": { stroke: "#B0B0B0" },
                  }}
                />
              )}
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
