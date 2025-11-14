import React from "react";
import {
  Box,
  Typography,
} from "@mui/material";

const MainPage = () => {
  return (
    <Box
      display="flex"
      minHeight="100vh"
      sx={{
        bgcolor: '#1E1E1C', // Darker, more modern background
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: '18%',
          minHeight: '100vh',
          bgcolor: '#2A2A2A', 
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',     // Horizontally center content
        }}
      >
        {/* Logo + Text */}
        <Box
          display="flex"
          alignItems="end"
          textAlign="end"
          gap={2}
          margin={2}
        >
          
          <Typography
            sx={{
              color: '#f9f9f9ff',
              fontWeight: 'bold',
              fontSize: '25px',
              letterSpacing: '1px',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            GetFit
          </Typography>
        </Box>

        <Box
          sx={{
            marginTop: 1,
            width: '100%',
            height: '55px',
            '&:hover': {
                background: 'linear-gradient(to right, #252525ff 98%, #FF6F00 98%)'
            },
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',}}>
            
            <Typography
              sx={{
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                textAlign: 'center',
                color: 'white'
              }}
            >
              Overview
            </Typography>
        </Box>

        <Box
          sx={{
            marginTop: 1,
            width: '100%',
            height: '55px',
            '&:hover': {
                background: 'linear-gradient(to right, #252525ff 98%, #FF6F00 98%)'
            },
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',}}>
            
            <Typography
              sx={{
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                textAlign: 'center',
                color: 'white'
              }}
            >
              Account
            </Typography>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          bgcolor: '#1E1E1C',
        }}
      >
        {/* Main content goes here */}

        <Typography
          sx={{
            color: 'white',
            margin: 4,
            fontSize: '20px',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          Welcome back, User!
        </Typography>
        <Box 
          sx={{
            padding: 4,
            width: '20%',
            height: '20%',
            background: '#FF6F00',
            margin: 4,
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            

          }}>
            <Typography
                sx={{ 
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, sans-serif',
                    textAlign: 'center'

                }}
                >
                    Current Weight
                </Typography>
            
            <Typography
                sx={{ 
                    color: 'white',
                    fontSize: '50px',
                    fontFamily: 'Arial, sans-serif',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    marginTop: 2
                    }}>
                        75 kg
                    </Typography>

        </Box>

        <Box 
          sx={{
            padding: 4,
            width: '20%',
            height: '20%',
            background: '#FF6F00',
            margin: 4,
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            

          }}>
            <Typography
                sx={{ 
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, sans-serif',
                    textAlign: 'center'

                }}
                >
                    Current Weight
                </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MainPage;
