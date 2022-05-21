import * as React from 'react';
import Axios from 'axios';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography  from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { useLocation } from 'react-router-dom';


export default function TemporaryDrawer({user, setLoggedIn, databaseLocation}) {
    const [state, setState] = React.useState({
        right: false,
    });

    const location = useLocation().pathname;

    const toggleDrawer = (anchor, open) => (event) => {

        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ right: open });
    };

    const logout = async () => {
        await Axios.post(`${databaseLocation}/logout`);

        setLoggedIn(false);
        if(databaseLocation.includes("local")) { console.log("Logged out."); }
    }

  

  const list = (anchor) => (
    <Box
      sx={{ width: 240 }}
      role="presentation"
      onKeyDown={toggleDrawer(anchor, false)}
        
    >
      <List 
      disablePadding
      >
        <ListItem key='Avatar'
            sx={{
                height: 116,
                backgroundColor: '#05160B',
                
            }}  
        >
            <ListItemIcon>
                <AccountCircleIcon  
            variant='outlined' 
            fontSize='large'
            sx={{
                color: '#92AD94',
                height: '48px',
                width: '48px'

            }} />
            </ListItemIcon>
            <ListItemText 
              primary={user.username}
              sx={{color: '#FFFFFB'}}
            
            />
        </ListItem>
       {location ===  "/home" && <ListItem button key='Settings' component={Link} to="/settings" onClick={toggleDrawer(anchor,false)}>
       
            <ListItemIcon>
                <SettingsIcon 
                 sx={{

                    paddingLeft: 0.8
                }}      
                />
            </ListItemIcon>
            <ListItemText primary='Settings'/>
        </ListItem>  }
        {location === "/details" && <ListItem button key='Settings' component={Link} to="/settings" onClick={toggleDrawer(anchor,false)}>
       
            <ListItemIcon>
                <SettingsIcon 
                 sx={{

                    paddingLeft: 0.8
                }}      
                />
            </ListItemIcon>
            <ListItemText primary='Settings'/>
        </ListItem>  }
        {location === "/settings" && <ListItem button key='Home' component={Link} to="/home" onClick={toggleDrawer(anchor,false)}>
            <ListItemIcon>
                <HomeIcon 
                 sx={{

                    paddingLeft: 0.8
                }}      
                />
            </ListItemIcon>
            <ListItemText primary='Home'/>
        </ListItem> }
        <ListItem button key='Logout' onClick={logout}>
            <ListItemIcon>
                <LogoutIcon 
                 sx={{

                    paddingLeft: 1
                }}  
                />
            </ListItemIcon>
            <ListItemText primary='Logout'/>
        </ListItem>
        <ListItem button key='Close' onClick={toggleDrawer(anchor,false)}>
            <ListItemIcon>
                <CloseIcon
                 sx={{

                    paddingLeft: 0.8
                }}  
                />
            </ListItemIcon>
            <ListItemText primary='Close'/>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button 
            onClick={toggleDrawer(anchor, true)}
          >
            <AccountCircleIcon 
            variant='outlined' 
            fontSize='large'
            sx={{
                color: '#92AD94',
                marginTop: 1,
                marginRight: '1rem',
                height: '48px',
                width: '48px'

            }}
          />
          </Button>
          <Drawer
            anchor='right'
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}