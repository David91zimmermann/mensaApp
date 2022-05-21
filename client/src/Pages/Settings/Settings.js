import React,  { useState, useEffect } from "react";
import Axios from 'axios';
import "./settings.css";
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import logo from '../src/assets/512x512_Mensario Logo.png'




const Settings = ( {user, setUser, canteens, setLoggedIn, databaseLocation} ) => {

      const [meal, setMeal] = useState([]);
      const [refresh, setRefresh] = useState(false);

      useEffect(() => {
            getMeal();
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])


      const getMeal = async (e) => {
    
            try {
                const response = await fetch("https://openmensa.org/api/v2/canteens/"+user.favoriteCanteen+"/days/2019-11-18/meals/"+user.favoriteMeal);
                
                const data = await response.json();
                if(databaseLocation.includes("local")) { console.log(data); }
                setMeal(data);
            }
            catch (e) {
                // console.log(e);
            }
      }


      const logout = async () => {
            await Axios.post(`${databaseLocation}/logout`);

            setLoggedIn(false);
            if(databaseLocation.includes("local")) { console.log("Logged out."); }
      }
const handleVegetarian = () => {

        if(document.getElementById("vegetarischCheck").checked) {

            // document.getElementById("pescetarianCheck").checked = false;
            document.getElementById("veganCheck").checked = false;
            user.preferedFood = "Vegetarisch";
        }
        else {
            user.preferedFood = "None";
        }
        saveUser();
      }

      const handleVegan = () => {

        console.log("veganCheck: " + document.getElementById("veganCheck").innerHTML);
        if(document.getElementById("veganCheck").checked) {

            // document.getElementById("pescetarianCheck").checked = false;
            document.getElementById("vegetarischCheck").checked = false;
            user.preferedFood = "Vegan";
            console.log("PreferedFood set to Vegan!");
        }
        else {
            user.preferedFood = "None";
        }
        saveUser();
    }

    const handleAllergics = (e) => {

        console.log("handleAllergics " + e.target.id);

        //Whatever
        let allergic = String(e.target.id).replace("Check", "");
        allergic = allergic.charAt(0).toUpperCase() + allergic.slice(1); //first letter to upper case
        if(document.getElementById(e.target.id).checked) {
            console.log("Allergic: " + allergic);
            if(!user.allergics.includes(allergic)) {
                user.allergics += ","+allergic;
            }
        }
        else {
            user.allergics = user.allergics.replace(","+allergic, "");
        }
        saveUser();
    }

    const saveUser = () => {
        setRefresh(true);
        setUser(user);
        Axios.put(`${databaseLocation}/api/updateUser`, {
            user: user
        });
    }

    const Checkbox = (title, onChange, striked) => {

        if(String(user.preferedFood) === title || String(user.allergics).includes(title)) {
            
            return (
                <>
                   {striked && <><strike>{title}</strike> <input type="checkbox" id={String(title).toLowerCase()+"Check"} onChange={onChange} checked/></> }                   
                   {striked === false && <>{title} <input type="checkbox" id={String(title).toLowerCase()+"Check"} onChange={onChange} checked/></> }                   
                </>
            );
        }
        else {
            return (
                <>
                    {title} <input type="checkbox" id={String(title).toLowerCase()+"Check"} onChange={onChange} />
                </>
            );
        }
    }

      return (
          <div className="settings-div">
                { databaseLocation.includes("local") && console.log("reRender triggered") }
                <Box 
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '80%',
                        justifyContent: 'center',
                        maxWidth: 'sm',
                        
                        // alignItems: 'center'
                    }}
                >
                    <Box 
                        sx={{
                        marginTop: 5,
                        
                        // display: 'flex',
                        // flexDirection: 'row',
                        justifyContent: 'center',
                        width: '100%'
                        }}
                    >
                        <Card
                            sx={{
                                backgroundColor: '#F5FBEF'
                            }}
                        >
                            <CardContent>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}
                                >

                                <AccountCircleIcon  
                                    variant='outlined' 
                                    fontSize='large'
                                    sx={{
                                    color: 'primary',
                                    height: '48px',
                                    width: '48px'
                                    }}/> 
                                <Typography variant='h3'
                                >{user.username}</Typography> 
                                {/* <img src={logo} alt="Mensario Logo" width='50px' height='50px'/> */}
                                {/* <AccountCircleIcon  
                                    variant='outlined' 
                                    fontSize='large'
                                    sx={{
                                    color: 'primary',
                                    height: '48px',
                                    width: '48px'
                                    }}/>  */}
                                </Box>

                                <Box 
                                    sx={{
                                    //     display: 'flex',
                                    //     alignItems: 'flex-start'
                                        marginTop: 5
                                    }}
                                >
                                <Typography variant='h4'
                                >Favorites:</Typography>
                                    <Typography variant='h5'>Favorite Canteen:</Typography>
                                    <div className="favoriteDiv">
                                        { typeof user.favoriteCanteen === "object" && <Typography>You didn't choose a favorite canteen yet</Typography>}
                                        { typeof user.favoriteCanteen === "number" && canteens.filter(canteen => canteen.id === user.favoriteCanteen).map(canteen => {
                                            return (
                                                    <Typography key={canteen.id}>{ canteen.name }</Typography>
                                            )
                                        }) }
                                    </div>
                                    <Typography variant='h5'>Favorite Dish:</Typography>
                                    <div className="favoriteDiv">
                                            { typeof user.favoriteMeal === "object" && <Typography>You didn't choose a favorite meal yet</Typography>}
                                            { typeof user.favoriteMeal === "number" && <Typography>{meal.name}</Typography> }
                                    </div>
                                </Box>

                                <div className="preferedFoodSettings">
                        <Typography variant='h4'>Food Settings:</Typography>
                        <Typography variant='h5'>Diet:</Typography>
                        <Typography>If you choose one of these options, only the chosen food will be displayed to you</Typography>
                        {/* <br/> */}
                        {/* { Checkbox("Pescetarian", handlePescetarian, false) } */}
                        <br/>
                        {/* <Checkbox label="Vegetarisch"  />
                        onChange={handleVegetarian} */}
                        <br/>                        
                        {/* {/* <Checkbox label="Vegan"  />
                        onChange={handleVegan} */}

                        { Checkbox("Vegan", handleVegan, false) }
                        { Checkbox("Vegetarian", handleVegetarian, false) }




                        <br/>
                        <br/>
                        <Typography variant='h5'>Diet:</Typography>
                        <Typography>dont't show me food which contains ...</Typography>
                        { Checkbox("Laktose", handleAllergics, true) }
                        <br/>
                        { Checkbox("Soja", handleAllergics, true) }
                        <br/>
                        { Checkbox("Weizen", handleAllergics, true) }
                        <br/>
                        { Checkbox("Haselnuss", handleAllergics, true) }
                        <br/>
                        { Checkbox("Mandel", handleAllergics, true) }
                        <br/>
                        { Checkbox("Pistazie", handleAllergics, true) }
                        <br/>
                        { Checkbox("Erdnuss", handleAllergics, true) }
                        <br/>
                        {/* <Checkbox label="Laktose"  defaultChecked/>
                        onChange={handleAllergics} */}
                        <br/>
                        {/* <Checkbox label="Soja"  defaultChecked/>
                        onChange={handleAllergics} */}
                        <br/>
                        {/* <Checkbox label="Weizen"  defaultChecked/>
                        onChange={handleAllergics} */}

                        <br/>
                        {/* <Checkbox label="Haselnuss"  defaultChecked/>
                        onChange={handleAllergics} */}


                        <br/>
                        {/* <Checkbox label="Mandel" defaultChecked/>
                        onChange={handleAllergics}  */}
                        <br/>


                        {/* <Checkbox label="Pistazie" defaultChecked/>
                        onChange={handleAllergics}  */}
                        <br/>

                        {/* <Checkbox label="Erdnuss"  defaultChecked/>
                        onChange={handleAllergics} */}

                        <br/>
                        <br/>
                  </div>
                                
                                <Typography ></Typography>
                            </CardContent>
                        </Card>
                    </Box>
                
                

                  

                  <div className="logout">
                        <h2>Logout</h2>
                        <button className="black-btn" onClick={logout}>
                              <i className="fas fa-sign-out-alt"></i>
                        </button>
                  </div>
                </Box>
            </div>
      )
};


export default Settings;