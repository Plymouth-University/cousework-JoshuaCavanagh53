import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
} from "@mui/material";

const MainPage =() =>{

    return (
        <Box
            display="flex"
            justifyContent="center"
            minHeight="100vh"
            sx={{
                bgcolor: '#2B2B28',
            }}
            >
          
            <Box
                sx={{
                    width: '15%',
                    minHeight: '100vh',
                    bgcolor: '#3A3A36',
                    padding: 2,
                }}
                >
                {/* Horizontal layout for logo + text */}
                <Box
                    display="flex"
                    alignItems="center"
                    gap={2} // adds spacing between image and text
                >
                    <Box
                    component="img"
                    src="/dumbell.png"
                    alt="Gym Logo"
                    sx={{
                        width: 120,
                        height: 'auto',
                    }}
                    />

                    <Typography
                    sx={{
                        color: '#b84d00ff',
                        fontWeight: 'bold',
                        fontSize: '24px',
                    }}
                    >
                    GetFit
                    </Typography>
                </Box>
                </Box>
           
            <Box
                sx={{
                flexGrow: 1,
                minHeight: '100vh',
                bgcolor: '#2B2B28',
                }}
            >
               
            </Box>
            </Box>

                );
            }

export default MainPage;