import React,  { useState } from "react";
import { useHistory } from "react-router-dom";
import Axios from 'axios';
import './login.css';
import { Select, Button, FormControl, InputLabel, MenuItem, Input, Typography, Container, Box } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Login = ({ setLoggedIn, setUser, desiredPath, databaseLocation }) => {


      const theme = createTheme();

            theme.typography.h3 = {
                  fontSize: '1.8rem',
                  '@media (min-width:600px)': {
                  fontSize: '2 rem',
                  },
                   [theme.breakpoints.up('md')]: {
                        fontSize: '3rem',
                  },
            };

            theme.typography.h4 = {
                  fontSize: '1.5rem',
                  '@media (min-width:600px)': {
                  fontSize: '1.7rem',
                  },
                   [theme.breakpoints.up('md')]: {
                        fontSize: '2.5rem',
                  },
            };


      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [role, setRole] = useState('');

      const [loginStatus, setLoginStatus] = useState('');

      let history = useHistory(); 

      Axios.defaults.withCredentials = true;


      const login = async () => {
            await Axios.post(`${databaseLocation}/login`, {
                  username: username,
                  password: password
            }).then( (response) => {
                //   console.log(response.data);
                  console.log("Typeof Response: " + typeof response.data.msg);
                  if(typeof response.data.msg != "undefined" && !response.data.msg.includes("Wrong")) {

                        console.log("DiseredPath: " + desiredPath);
                        if(desiredPath.length > 1) { history.push(desiredPath); }
                        else { history.push("/home") }

                        setLoggedIn(true);
                        setUser(response.data.user);
                        redirect();
                        if(databaseLocation.includes("local")) { console.log("Login.js2: Logged in!"); }

                        // setTimeout(showNotification, 10000);

                  } else {
                        console.log("Typeof Response2: " + typeof response.data.msg);
                        setLoginStatus(response.data.msg);
                  }
            });
      };

      const signUp = async () => {
            
            if(username.length >= 3 && password.length >= 3)
            {
                  console.log("Signup Role: "+ role);
                  await Axios.post(`${databaseLocation}/api/signup`, {
                        username: username,
                        password: password,
                        role: role

                  }).then( (response) => {
                        if(response.data.msg.includes("Duplicate")) {
                              setLoginStatus("Username exists already!");
                        }
                        else if(response.data.loggedIn === true) {
                              setLoggedIn(true);
                              setUser({username:username, role:role});
                              redirect();
                              if(databaseLocation.includes("local")) { console.log("Successfully logged in!"); }
                        }
                  });
            }
            else {
                  setLoginStatus("Please choose a username & password with at least 3 characters");
            }
      }

      const redirect = () => {
            if(desiredPath.length > 1) {
                  history.push(desiredPath);
            }
            else {
                  history.push("/home")
            }
      }


      return (
            <Box
                  sx={{
                  display: 'flex',
	            justifyContent: 'center',
	            flexDirection: 'column',
	            margin: '1rem',
                  
                  }}    
            >     <ThemeProvider theme={theme}>
                  <Typography variant='h3'
                  sx={{
	            margin: '1rem',
                  
                  }}  
                  >Welcome on <span className="greenItalic">Mensario</span></Typography>
                  <Typography 
                  variant='h4'sx={{
	            marginBottom: '2rem',
                  
                  }} 
                  
                   >Are you ready to eat?</Typography>
                  </ThemeProvider>

                  <Container
                  maxWidth={"md"}
                  disableGutters
                  >
                  <ThemeProvider theme={theme}>
                  <Typography variant="h4"className="loginStatus" >{loginStatus}</Typography>
                  </ThemeProvider>
                        <FormControl
                        fullWidth
                        required
                        sx={{
	                        marginBottom: '1rem',
                  
                        }} 
                        >
                              <Input 
                                    onChange={(e) => { setUsername(e.target.value) }} 
                                    type="text" 
                                    placeholder="Username"
                                    required
                              />
                              <Input 
                                    onChange={(e) => { setPassword(e.target.value) }} 
                                    type="password" 
                                    placeholder="Password" 
                                    required
                              />
                              <br></br>
                              <Button 
                                    variant='contained' 
                                    className="button_login" 
                                    onClick={login}
                                    sx={{
                                          backgroundColor: "#92AD94",
                                          paddingBottom: 1,
                                          '&:hover': {
                                          backgroundColor: '#05160B' 
                                          }
                                          
                                    }}
                              > 
                              <Typography 
      >Login </Typography>
                              </Button>
                        </FormControl>
      
                              <Typography variant="h5" className="text_signUp">Not signed up yet?</Typography>
                              {/* <select onChange={(e) => { setRole(e.target.value) }} className="selection">
                                    <option value="student">Student</option>
                                    <option value="employee">Employee</option>
                                    <option value="other">Other</option>
                              </select> */}
                              <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Employment</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={role}
                                    label="Employment"
                                    onChange={(e) => { setRole(e.target.value) }}
                                    required
                                    sx={{
                                          '&:clicked': {
                                          outlineColor: '#92AD94' 
                                          }
                              
                                    }}                      
                                    >

                                    <MenuItem value={"student"}>Student</MenuItem>
                                    <MenuItem value={"employee"}>Employee</MenuItem>
                                    <MenuItem value={"other"}>Other</MenuItem>
                                    </Select>

                                    <Button 
                                    variant='contained' 
                                    className="button_signUp"
                                    color="secondary"
                                    onClick={signUp}
                                    sx={{
                                          // backgroundColor: "#92AD94",
                                          '&:hover': {
                                          backgroundColor: '#05160B' 
                                          }
                                    }}
                                    > 
                                    Sign Up 
                                    </Button>
                              </FormControl>
                        </Container>
            </Box>
      )
};


export default Login;