import { React, useState, useEffect } from 'react';
import Recipe from "../../components/Recipe/Recipe";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
  } from "react-google-maps";
import "./details.css";
import { Link, useLocation } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { Button } from '@mui/material';
import { AppBar, Card, CardContent } from '@mui/material';

const Details = ({selectedCanteen, setUser, user, databaseLocation}) => {


    const [meals, setMeals] = useState([]);
    const [categorys, setCategorys] = useState([]);
    const [favMeal, setFavMeal] = useState();
    const [choosedCategory, setChoosedCategory] = useState();
    // var choosedCategory = "";
    const [choosedDate, setChoosedDate] = useState("2022-03-03");
    const [value, setValue] = useState(0);

    const handleChange = (e, newValue) => {
        setValue(newValue);
        console.log("Tab Index: " + newValue);

        if(e.target.innerHTML === "Alles") {
            setChoosedCategory("");
            // choosedCategory = "";
        }
        else {
            setChoosedCategory(e.target.innerHTML);
            // choosedCategory = e.target.innerHTML;
        }
    };

    useEffect( () => {
        if(databaseLocation.includes("local")) { console.log("Initialized Details!"); }

        setChoosedCategory("");
        // choosedCategory = "";
        // setChoosedDate("2022-03-03");
        // setInitialCategory(); //Must be called after DOM has finished loading
    }, [])

    useEffect( async () => {

        console.log("choosedCategory / choosedDate updated!");
        console.log("selectedCanteen: " + selectedCanteen.id);
        try {
            const response = await fetch("https://openmensa.org/api/v2/canteens/"+selectedCanteen.id+"/days/"+choosedDate+"/meals");
            
            if(response.status === 404)
            {
                document.getElementById("error").innerHTML = "Konnte für diesen Tag keine Gerichte finden!";
                document.getElementById("error").style.display = "block";
            }
            else {
                document.getElementById("error").style.display = "none";
            }
            
            const data = await response.json();
            if(databaseLocation.includes("local")) { console.log("dateHandler.data: " + data); }
            setMeals(data);
            console.log("New Meals loaded!");
        }
        catch (e) {
            console.log(e);
            setMeals([]);
        }

    }, [choosedCategory, choosedDate])

    function TabPanel(props) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box sx={{ p: 3 }}>
                <Typography>{children}</Typography>
              </Box>
            )}
          </div>
        );
      }


    // const setInitialCategory = () => {
    //     let elements = document.getElementsByClassName("category");
    //     for(let el of elements) {
    //         if(el.target.innerHTML === "Alles") {
    //             el.target.style = "background-color: yellow;";
    //         }
    //         else {
    //             el.style = "background-color: green;";
    //         }
    //     }
    // }




    // useEffect( async () => {
    //     // const response = await fetch("https://openmensa.org/api/v2/canteens/"+selectedCanteen.id+"/days/"+date+"/meals");
    //     const response = await fetch("https://openmensa.org/api/v2/canteens/"+selectedCanteen.id+"/days/"+date+"/meals");
        
    //     const data = await response.json();
    //     console.log(data);
    // }, [])

    // const getTodaysDate = () => {
    //     var today = new Date();
    //     var date = "";
    //     if((today.getMonth()+1) < 10) {
    //         date = today.getFullYear()+'-0'+(today.getMonth()+1)+'-'+today.getDate();
    //     } else {
    //         date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    //     }
    //     console.log(date.toString());
    // }

    const dateHandler = async (e) => {
        if(databaseLocation.includes("local")) { console.log( "choosedDate: " + e.target.value ); }
        // console.log( date );

        setChoosedDate(e.target.value);
    }

    //Filter preferedFood
    const showPreferedMeals = (meal) => {

        console.log("Meal: " + meal.name);
        console.log("Meal Notes: " + meal.notes);

        let prefFood = String(user.preferedFood).replace("None", "").toLowerCase();    
        if(String(meal.notes).toLowerCase().includes( prefFood )) {
            
            if(String(user.allergics).toLowerCase().replace(",", "").length > 0) {

                if(String(meal.notes).toLowerCase().includes( String(user.allergics).toLowerCase().replace(",", "") )) {
                    return (<></>);
                }
            }
            
            return (
                <Recipe key={meal.id} selectedCanteen={selectedCanteen} meal={meal} setUser={setUser} user={user} setFavMeal={setFavMeal} databaseLocation={databaseLocation} />
            )
        }
    }

    const categoryHandler = (e) => {
        
        let elements = document.getElementsByClassName("category");
        for(let el of elements) {
            el.style = "background-color: green;";
        }
        e.target.style = "background-color: yellow;";


        if(e.target.innerHTML === "Alles") {
            // setChoosedCategory("");
            choosedCategory = "";
        }
        else {
            // setChoosedCategory(e.target.innerHTML);
            choosedCategory = e.target.innerHTML;
        }
    }


    //Get Distinct Categorys
    useEffect( () => {
        let newCategorys = [...categorys];
        meals.map(meal => {
            if(!newCategorys.includes(meal.category)) {
            
                newCategorys = [...newCategorys, meal.category];
                
                if(databaseLocation.includes("local")) { console.log(categorys); }
            }
        });
        setCategorys(newCategorys);
    }, [meals])

    const MapWithAMarker = withScriptjs(withGoogleMap(props =>

        <GoogleMap
          defaultZoom={14}
          defaultCenter={{ lat: selectedCanteen.lat, lng: selectedCanteen.lng }}
        >
          <Marker
            position={{ lat: selectedCanteen.lat, lng: selectedCanteen.lng }}
          />
        </GoogleMap>
      ));

    const APIKey = "AIzaSyAcnE8oMwxusZtZ-vwc0p-uQf1dK26or58";


    const PreferedRecipes = () => {

        var newMeals = [];
        console.log("Choosed Category: " + choosedCategory);
        if(meals.length > 0) {

            if(typeof choosedCategory != "undefined" && !choosedCategory.toString().includes("Alles") && choosedCategory.toString().length > 0) {
                console.log("Filtering Recipes...");
                return (
                    meals.filter(meal => choosedCategory.includes(meal.category.toString())).map(meal => (
                        // newMeals.push(meal)
                        // showPreferedMeals(meal)
                        <Recipe key={meal.id} selectedCanteen={selectedCanteen} meal={meal} setUser={setUser} user={user} setFavMeal={setFavMeal} databaseLocation={databaseLocation} />
                    ))
                )
            }
            else {
                return (
                    meals.map(meal => (
                        // newMeals.push(meal)
                        // showPreferedMeals(meal)
                        <Recipe key={meal.id} selectedCanteen={selectedCanteen} meal={meal} setUser={setUser} user={user} setFavMeal={setFavMeal} databaseLocation={databaseLocation} />
                    ))
                )
            }
        }
        return null;
    }

    return ( <div>
             <Box
                sx={{ 
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center'
                        }}>
                <Card sx={{ 
                        maxWidth: 'sm', 
                        width: '90%',
                        minHeight: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        backgroundColor: '#F5FBEF',
                        marginTop: 3
                        }}
                        >
                        <CardContent>
                              <Typography gutterBottom variant="h4" component="div">
                                    {selectedCanteen.name}
                              </Typography>
                              <Typography variant="h5" color="text.secondary">
                                    {selectedCanteen.address}
                              </Typography>
                              <Link to="/home">
                        <Button
                            sx={{
                            color: '#F06543'
                            }}
                        >
                            {/* <ArrowBackIcon fontSize='large' label="Go back" /> */}
                            <Typography variant='h6'>Back</Typography>
                                
                        </Button>
                    </Link>

                        </CardContent>
                </Card>
            </Box>

                
            
            {/* <h2>Found Meals: {meals.length}</h2> */}
            <input id="datePicker" type="date" className="datePicker" onChange={dateHandler} value={choosedDate}></input>

            <h2 className="error" id="error">Error Label</h2>

            <Box sx={{ width: '100%', display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                    <AppBar
                        position='relative'
                        disableGutters
                        sx={{
                            display: "flex",
                            justifyContent: 'center',
                            alignItems: 'center',
                            '@media (min-width:320px)': {
                                 maxWidth: '100%',
                                },
                            '@media (min-width:450px)': {
                                 maxWidth: '95%',
                                },
                             '@media (min-width:500px)': {
                                 maxWidth: '90%',
                                },
                            

                            // '& .MuiAppBar-root:text': {
                            // color: '#FFFFFB',
                            // }
                        }}
                 >
                        <Tabs 
                            sx={{'@media (min-width:320px)': {
                                 maxWidth: 350,
                                },
                                '@media (min-width:400px)': {
                                 maxWidth: 380,
                                },
                                '@media (min-width:420px)': {
                                 maxWidth: 410,
                                },
                                '@media (min-width:450px)': {
                                 maxWidth: '90%',
                                },
                                
                                
                                }}
                            value={value} 
                            onChange={handleChange} 
                            aria-label="basic tabs example"
                            variant="scrollable"
                            scrollButtons={true}
                            textColor="secondary"
                            indicatorColor="secondary"
                            
                        >
                            <Tab label="Alles"
                                sx={{
                                '&:hover': {
                                    backgroundColor: '#92AD94',
                                    color: '#05160B'
                                    }
                            }}
                            />
                            {categorys.map( (category, index) => (
                                <Tab 
                                    label={category}
                                    sx={{
                                        '&:hover': {
                                        backgroundColor: '#92AD94',
                                        color: '#05160B'
                                        }
                                        }}

                                 />
                            ))}
                        </Tabs>
                    </AppBar>

                    <TabPanel value={value} index={0}>
                        <h1>Alles</h1>
                    </TabPanel>

                    {categorys.map( (category, i) => (
                        <TabPanel value={value} index={(i+1)}>
                            <h1>{category}</h1>
                        </TabPanel>
                    ))}
                </Box>

                {/* {console.log("Choosed Category: " + choosedCategory)}
                {meals.map(meal => (
                    console.log("Meal.category: " + meal.category)
                ))} */}

                <PreferedRecipes/>
            </Box>


            <MapWithAMarker
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${APIKey}&v=3.exp&libraries=geometry,drawing,places}`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div className="mapsContainer" />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        </div>
    );
}

export default Details;