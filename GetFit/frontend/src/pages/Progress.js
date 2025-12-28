import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { LineChart } from "@mui/x-charts/LineChart";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import { useEffect } from "react";

const Progress = () => {
  // Navigation hook
  const navigate = useNavigate();

  // Store lifts
  const [lifts, setLifts] = React.useState([]);

  const [open, setOpen] = React.useState(false);
  const [editingLift, setEditingLift] = React.useState(null);

  // Set up new entry input
  const [liftName, setLiftName] = React.useState("");
  const [currentKg, setCurrentKg] = React.useState("");
  const [targetKg, setTargetKg] = React.useState("");
  const [currentReps, setCurrentReps] = React.useState("");
  const [targetReps, setTargetReps] = React.useState("");

  // Handle lift selection
  const [selectedLift, setSelectedLift] = React.useState(null);
  const [liftClicked, setLiftClicked] = React.useState(false);

  // Store lift data
  const selectedLiftObj = lifts.find((l) => l._id === selectedLift);

  const weightData = selectedLiftObj?.history?.map((h) => h.weightKg) || [];
  const dateLabels =
    selectedLiftObj?.history?.map((h) =>
      new Date(h.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    ) || [];

  console.log("Selected lift:", selectedLiftObj);
  console.log("History:", selectedLiftObj?.history);
  console.log("WeightData:", weightData);
  console.log("DateLabels:", dateLabels);

  const resetFields = () => {
    setLiftName("");
    setCurrentKg("");
    setTargetKg("");
    setCurrentReps("");
    setTargetReps("");
  };

  // Populate fields when editing
  useEffect(() => {
    if (editingLift) {
      setLiftName(editingLift.exercise || "");
      setCurrentKg(editingLift.sets?.[0]?.weightKg ?? "");
      setCurrentReps(editingLift.sets?.[0]?.reps ?? "");
      setTargetKg(editingLift.targetSets?.[0]?.weightKg ?? "");
      setTargetReps(editingLift.targetSets?.[0]?.reps ?? "");
    } else {
      resetFields();
    }
  }, [editingLift]);

  // Handle saving new or edited lift
  const handleSave = () => {
    // Basic validation
    if (!liftName || !currentKg || !targetKg || !currentReps || !targetReps)
      return;

    // Decide between add or edit
    if (editingLift) {
      editLift(
        editingLift._id,
        liftName,
        Number(currentKg),
        Number(targetKg),
        Number(currentReps),
        Number(targetReps)
      );
    } else {
      addLift(
        liftName,
        Number(currentKg),
        Number(targetKg),
        Number(currentReps),
        Number(targetReps)
      );
    }

    // Reset fields and close dialog
    resetFields();
    setEditingLift(null);
    setOpen(false);
  };

  // Edit existing lift
  const editLift = async (
    id,
    name,
    currentKg,
    targetKg,
    currentReps,
    targetReps
  ) => {
    // Update local state with schema shape
    setLifts((prev) =>
      prev.map((lift) =>
        lift._id === id
          ? {
              ...lift,
              exercise: name,
              sets: [{ reps: currentReps, weightKg: currentKg }],
              targetSets: [{ reps: targetReps, weightKg: targetKg }],
            }
          : lift
      )
    );

    // Send update to backend
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/lifts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          exercise: name,
          sets: [{ reps: Number(currentReps), weightKg: Number(currentKg) }],
          targetSets: [
            { reps: Number(targetReps), weightKg: Number(targetKg) },
          ],
        }),
      });
    } catch (err) {
      console.error("Error editing lift entry:", err);
    }
  };

  // Add new lift
  const addLift = async (
    name,
    currentKg,
    targetKg,
    currentReps,
    targetReps
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/lifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          exercise: name,
          date: new Date(),
          sets: [{ reps: Number(currentReps), weightKg: Number(currentKg) }],
          targetSets: [
            { reps: Number(targetReps), weightKg: Number(targetKg) },
          ],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Add lift failed:", response.status, errText);
        return;
      }

      const payload = await response.json();

      // Accept either the document directly or a wrapped response
      const newLift = payload?.liftEntry || payload?.lift || payload;

      // Validate shape before inserting
      if (!newLift || !newLift._id) {
        console.error("Backend did not return a lift with _id:", payload);
        return;
      }

      // Ensure arrays exist
      newLift.sets = Array.isArray(newLift.sets) ? newLift.sets : [];
      newLift.targetSets = Array.isArray(newLift.targetSets)
        ? newLift.targetSets
        : [];

      // Update local state
      setLifts((prev) => [...prev, newLift]);

      // Reset the dialog fields and close
      resetFields();
      setOpen(false);
    } catch (err) {
      console.error("Error uploading lift entry:", err);
    }
  };

  // Fetch existing lifts
  useEffect(() => {
    const fetchLifts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/lifts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        // Keep schema shape intact
        const formattedLifts = data.map((lift) => ({
          _id: lift._id,
          exercise: lift.exercise,
          sets: lift.sets,
          targetSets: lift.targetSets,
          date: lift.date,
          history: lift.history || [],
        }));
        setLifts(formattedLifts);
      } catch (err) {
        console.error("Error fetching lifts:", err);
      }
    };

    fetchLifts();
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
          onClick={() =>{
              navigate("/")
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
              {selectedLift
                ? `Weight Progress for ${
                    lifts.find((lift) => lift._id === selectedLift)?.exercise
                  }`
                : "Weight Progress"}
            </Typography>

            {/* Line Chart */}

            {liftClicked && selectedLift && (
              <LineChart
                width={700}
                height={600}
                series={[
                  {
                    data: weightData,
                    label: `${selectedLiftObj?.exercise || ""} (kg)`,
                    color: "#FF6F00",
                    lineSmoothing: 0.3,
                  },
                ]}
                xAxis={[
                  {
                    scaleType: "band",
                    data: dateLabels,
                    label: "Date",
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
                    lineProps: { sx: { stroke: "#FFF" } },
                    tickProps: { sx: { stroke: "#FFF" } },
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
            )}
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
              <AddIcon
                sx={{
                  flex: 0.2,
                  cursor: "pointer",
                  borderRadius: "4px",
                  ":hover": { bgcolor: "#FF6F00", color: "#fff" },
                }}
                onClick={() => {
                  // Handle adding new lift cards
                  setOpen(true);
                }}
              />
            </Box>
            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              PaperProps={{ sx: { bgcolor: "#2C2C29", color: "#F5F5F5" } }}
            >
              <DialogTitle sx={{ color: "#F5F5F5" }}>
                {editingLift ? "Edit Lift" : "Add New Lift"}
              </DialogTitle>
              <DialogContent
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                {/* Lift Name */}
                <TextField
                  label="Lift Name"
                  value={liftName}
                  onChange={(e) => setLiftName(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#FFF" },
                      "&:hover fieldset": { borderColor: "#FFF" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#FFF !important",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "#F5F5F5",
                      backgroundColor: "#333",
                      borderRadius: "4px",
                    },
                    "& .MuiInputLabel-root": { color: "#B0B0B0" },
                  }}
                />

                {/* Current Kg + Reps */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="Current Kg"
                    type="number"
                    value={currentKg}
                    onChange={(e) => setCurrentKg(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#FFF" },
                        "&:hover fieldset": { borderColor: "#FFF" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#FFF !important",
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: "#F5F5F5",
                        backgroundColor: "#333",
                        borderRadius: "4px",
                      },
                      "& .MuiInputLabel-root": { color: "#B0B0B0" },
                    }}
                  />
                  <TextField
                    label="Reps"
                    type="number"
                    value={currentReps}
                    onChange={(e) => setCurrentReps(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#FFF" },
                        "&:hover fieldset": { borderColor: "#FFF" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#FFF !important",
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: "#F5F5F5",
                        backgroundColor: "#333",
                        borderRadius: "4px",
                      },
                      "& .MuiInputLabel-root": { color: "#B0B0B0" },
                    }}
                  />
                </Box>

                {/* Target Kg + Reps */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="Target Kg"
                    type="number"
                    value={targetKg}
                    onChange={(e) => setTargetKg(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#FFF" },
                        "&:hover fieldset": { borderColor: "#FFF" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#FFF !important",
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: "#F5F5F5",
                        backgroundColor: "#333",
                        borderRadius: "4px",
                      },
                      "& .MuiInputLabel-root": { color: "#B0B0B0" },
                    }}
                  />
                  <TextField
                    label="Target Reps"
                    type="number"
                    value={targetReps}
                    onChange={(e) => setTargetReps(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#FFF" },
                        "&:hover fieldset": { borderColor: "#FFF" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#FFF !important",
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: "#F5F5F5",
                        backgroundColor: "#333",
                        borderRadius: "4px",
                      },
                      "& .MuiInputLabel-root": { color: "#B0B0B0" },
                    }}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setOpen(false)}
                  sx={{ color: "#B0B0B0" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{ bgcolor: "#FF6F00", "&:hover": { bgcolor: "#e65c00" } }}
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>

            {/* Different lifts */}
            {lifts.map((lift, index) => {
              const lastSet = lift.sets?.[lift.sets.length - 1];
              const lastTarget = lift.targetSets?.[lift.targetSets.length - 1];

              return (
                <Box
                  key={lift._id}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    px: 2,
                    py: 1.5,
                    mt: 1,
                    borderRadius: "8px",
                    bgcolor:
                      selectedLift === lift._id && liftClicked
                        ? "#FF6F00"
                        : "#333",
                    color: "#FFFFFF",
                    alignItems: "center",
                    transition: "background 0.3s",
                    "&:hover": { bgcolor: "#FF6F00", color: "#fff" },
                  }}
                  onClick={() => {
                    setSelectedLift(lift._id);
                    setLiftClicked(true);
                  }}
                >
                  <Typography
                    sx={{ flex: 2, fontSize: "16px", fontWeight: 500 }}
                  >
                    {lift.exercise}
                  </Typography>

                  <Typography
                    sx={{
                      flex: 1,
                      textAlign: "center",
                      fontSize: "16px",
                      fontWeight: 500,
                    }}
                  >
                    {lastSet
                      ? `${lastSet.weightKg} (${lastSet.reps} reps)`
                      : "N/A"}
                  </Typography>

                  <Typography
                    sx={{
                      flex: 1,
                      textAlign: "center",
                      fontSize: "16px",
                      fontWeight: 500,
                    }}
                  >
                    {lastTarget
                      ? `${lastTarget.weightKg} (${lastTarget.reps} reps)`
                      : "N/A"}
                  </Typography>

                  <EditIcon
                    sx={{
                      flex: 0.2,
                      cursor: "pointer",
                      ":hover": { color: "#000" },
                    }}
                    onClick={() => {
                      setEditingLift(lift);
                      setOpen(true);
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Progress;
