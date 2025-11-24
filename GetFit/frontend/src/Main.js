import React, { useState } from "react";

import {
  Box,
  Typography,
} from "@mui/material";

const MainPage = () => {
  
  const [overview, selectOverview] = useState(true);
  const [account, selectAccount] = useState(false);

  if (overview) return (
    
    // Overall Container
    <Box
      display="flex"
      minHeight="100vh"
      sx={{
        bgcolor: '#1E1E1C', 
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: '18%',
          minHeight: '100vh',
          bgcolor: '#202020ff', 
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
            
            background: 'linear-gradient(to right, #252525ff 98%, #FF6F00 98%)',
            
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
              Calendar  
            </Typography>
        </Box>

        <Box
          onClick={() => {
            selectOverview(false);
            selectAccount(true);
          }}
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
              Progress
            </Typography>
        </Box>
        
        <Box
          sx={{
            marginTop: "auto",
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
              Log out
            </Typography>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          minHeight: '100vh',
          width: '100%',
          bgcolor: '#2a2a28ff',
        }}
      >
        {/* Main content goes here */}

        <Typography
          sx={{
            color: 'white',
            margin: 2,
            fontSize: '20px',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          Welcome back, User!
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            margin: 0,
            padding: 0,
            justifyContent: 'start',
            alignItems: 'flex-start',

          }}
        >
          <Box 
            sx={{
              padding: 2,
              minWidth: '17%',
              height: 'auto',
              background: '#FF6F00',
              margin: 2,
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',


            }}>
              <Typography
                  sx={{ 
                      color: 'white',
                      fontSize: '15px',
                      fontWeight: 'bold',
                      fontFamily: 'Arial, sans-serif',
                      textAlign: 'center'

                  }}
                  >
                      This months visits
                  </Typography>
                
              <Typography
                  sx={{ 
                      color: 'white',
                      fontSize: '30px',
                      fontFamily: 'Arial, sans-serif',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      marginTop: 2
                      }}>
                          17 visits
                      </Typography>

          </Box>

          <Box 
            sx={{
              padding: 2,
              minWidth: '17%',
              height: 'auto',
              background: '#FF6F00',
              margin: 2,
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',


            }}>
              <Typography
                  sx={{ 
                      color: 'white',
                      fontSize: '15px',
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
                      fontSize: '30px',
                      fontFamily: 'Arial, sans-serif',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      marginTop: 2
                      }}>
                          70kg
                      </Typography>
          </Box>

          <Box 
            sx={{
              padding: 2,
              minWidth: '17%',
              height: 'auto',
              background: '#FF6F00',
              margin: 2,
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',


            }}>
              <Typography
                  sx={{ 
                      color: 'white',
                      fontSize: '15px',
                      fontWeight: 'bold',
                      fontFamily: 'Arial, sans-serif',
                      textAlign: 'center'

                  }}
                  >
                    Target Weight
                  </Typography>
              
              <Typography
                  sx={{ 
                      color: 'white',
                      fontSize: '30px',
                      fontFamily: 'Arial, sans-serif',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      marginTop: 2
                      }}>
                          72kg
                      </Typography>
          </Box>

          <Box 
            sx={{
              padding: 4,
              minWidth: '17%',
              height: '500px',
              background: '#252525ff',
              margin: 2,
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',


            }}>
              <Typography
                  sx={{ 
                      color: 'white',
                      fontSize: '15px',
                      fontWeight: 'bold',
                      fontFamily: 'Arial, sans-serif',
                      textAlign: 'start',
                      margin: 0,
                      borderBottom: '2px solid white',
                      paddingBottom: 1,
                      


                  }}
                  >
                    Friends list
                  </Typography>
              
              
          </Box>
        </Box>
      </Box>
    </Box>
  );

  if (account) return (
     // Overall Container
    <Box
      display="flex"
      minHeight="100vh"
      sx={{
        bgcolor: '#1E1E1C', 
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
          onClick={() => {
            selectOverview(true);
            selectAccount(false);
          }}
          sx={{
            marginTop: 1,
            width: '100%',
            height: '55px',
            ":hover": {
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
          onClick={() => {
            selectOverview(false);
            selectAccount(true);
          }}
          sx={{
            marginTop: 1,
            width: '100%',
            height: '55px',
          
            background: 'linear-gradient(to right, #252525ff 98%, #FF6F00 98%)',
            
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

        <Box
          sx={{
            marginTop: "auto",
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
              Log out
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
        
      </Box>
    </Box>
  );

};

export default MainPage;
