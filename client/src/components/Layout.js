import React from 'react';
import { AppBar, Drawer, Toolbar, Typography } from '@mui/material';
import TemporaryDrawer from './TemporaryDrawer';
import { Box } from '@mui/system';
import { useLocation } from 'react-router-dom';
import logo from '../assets/512x512_Mensario Logo.png'
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button'
import { createTheme, ThemeProvider } from '@mui/material/styles';



export default function Layout({ user, loggedIn, setLoggedIn, databaseLocation, children }) {

    const location = useLocation().pathname;

  return (
  
    <div>
    <AppBar
            position="sticky"
            sx={{
                display: "flex",
                backgroundColor: '#05160B',
                minHeight: '116px',
                alignItems: 'center',
                width: '100%',
                paddingRight: 0
                }}>
    {loggedIn === false && 
        <Toolbar
            disableGutters
            sx={{
            marginTop: 1,
            justifyContent: "center",
            paddingRight: 0
            }}>
                <img src={logo} alt="Mensario Logo" width='96px' height='96px' />
        </Toolbar> }
    {loggedIn === true && 
            <Toolbar
                disableGutters
                sx={{
                    marginTop:  3,
                    display: "flex",
                    justifyContent: "space-between",
                    width: '100%'
                    
                }}>
                <Box sx={{marginLeft: '1rem'}}>
                    <Button component={Link} to="/home">
                        <img src={logo} alt="Mensario Logo" width='50px' height='50px' />
                    </Button>
                </Box>
                <Typography 
                    variant='h2' 
                    sx={{
                    fontWeight: '500',
                    fontSize: '3rem',
                    color: '#E4E6ED'
                    }}
                >
                Mensario
                </Typography>
    

                <TemporaryDrawer
                    setLoggedIn={setLoggedIn}
                    databaseLocation={databaseLocation}
                    user={user}
                    variant='permanent'
                    anchor='right'
                    sx={{
                        width: '20%',
                        backgroundColor: '#ffffff',
                    }}
                >
                </TemporaryDrawer>
            </Toolbar>
         }
    </AppBar>
    
        <div>{children}</div>
    </div>
)};
