import React, {useState, useEffect, useCallback} from "react";
import Canteen from '../Canteen/Canteen';
import "./canteensList.css";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
  } from "react-google-maps";
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import { Input, AppBar } from "@mui/material";
import { alpha } from '@mui/material/styles';
import { FormControlLabel } from "@mui/material";
import { borderRadius } from "@mui/system";



const CanteensList = ({canteens, setCanteens, user, setUser, setSelectedCanteen, databaseLocation}) => {

    const [CanteensListInformation, setCanteensListInformation] = useState({filteredList: canteens, searchText: "", OnlyOpenCanteens: false});
    const [filteredList, setFilteredList] = useState([]);
    const [currentView, setCurrentView] = useState("List View");

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
    
    const ViewMenu = () => {

        const [value, setValue] = useState(0);

        const handleChange = (e, newValue) => {
            console.log("handleChange.newValue: " + newValue);
            console.log("handleChange.innerHTML: " + e.target.innerHTML);
            setValue(newValue);
            // setCurrentView(e.target.innerHTML);
            
            // if(e.target.innerHTML.includes("Map")) {
            //     getCurrentLocation();
            // }
        };


        return (
            <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <AppBar
                    position='relative'
                    sx={{
                        display: "flex",
                        alignItems: 'center',
                        maxWidth: '200px',
                        // backgroundColor: '#05160B',
                        // borderRadius: '15%',
                        // '& .MuiAppBar-root:text': {
                        // color: '#FFFFFB',
                        // }

                    }}
                >
                    <Tabs 
                        value={value} 
                        onChange={handleChange} 
                        aria-label="basic tabs example"
                        textColor="secondary"
                        indicatorColor="secondary"
                        // sx={{
                        //     color: '#FFFFFB',
                        //     backgroundColor: '#05160B'
                        // }}
                        >
                        <Tab
                            sx={{
                            '&:hover': {
                            backgroundColor: '#92AD94',
                            color: '#05160B'
                            
                            }}} label="List View" />

                        <Tab sx={{
                            '&:hover': {
                            backgroundColor: '#92AD94',
                            color: '#05160B'
                            
                            }}} label="Map View"/>
                    </Tabs>
                </AppBar>
                </Box>
                <TabPanel value={value} index={0}>
                    <StackList /> 
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <MyMap />
                </TabPanel>
            </Box>
        )
    }

    
    
    const SearchSection = () => {
    
        const [searchText, setSearchText] = useState("");
    
        const updateFilteredList = (newSearchText, newOnlyOpenCanteens) => {
            console.log("newOnlyOpenCanteens: " + newOnlyOpenCanteens)
            if(newOnlyOpenCanteens) {
                showOnlyOpenCanteens(newSearchText);
            }
            else {
                const newList = canteens.filter(canteen => canteen.name.toLowerCase().includes(newSearchText.toLowerCase()));
                setCanteensListInformation({filteredList:newList, searchText:newSearchText, OnlyOpenCanteens:false});
                console.log("setOnlyOpenCanteens to false..")
            }
        }
    
        const showOnlyOpenCanteens = async (newSearchText) => {
            const results = await filter(canteens, async canteen => {
                
                if(canteen.name.toLowerCase().includes(newSearchText.toLowerCase())) {
                    let canteenOpen = await isCanteenOpen(canteen);
                    if(canteenOpen == true) {
                        return canteens;
                    }
                }
            })
            setCanteensListInformation({filteredList:results, searchText:newSearchText, OnlyOpenCanteens:true});
            console.log("setOnlyOpenCanteens to true..")
        }
    
        async function filter(arr, callback) {
            const fail = Symbol()
            return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i=>i !== fail)
        }
    
        const isCanteenOpen = async (canteen) => {
    
            let bool = false;
            const todaysDate = new Date().toISOString().split("T")[0];

            const response = await fetch("https://openmensa.org/api/v2/canteens/"+canteen.id+"/days/"+todaysDate+"/meals")
            .then(response => response.json())
            .then(data => {
                bool = true;
            })
            .catch(err => {
                console.log("isCanteenOpen Exception < !!!");
                bool = false;
            });
            return bool;
        }
    
        const handleOnlyOpenCanteens = (e) => {
    
            // if(document.getElementById("onlyOpenCanteensCheckbox").checked) {
            console.log("event.target.checked: " + e.target.checked);
            if(e.target.checked) {
                updateFilteredList(CanteensListInformation.searchText, true);
                // setOnlyOpenCanteens(true);
            }
            else {
                // setFilteredList(canteens.filter( (canteen) => {
                //     canteen.name.toLowerCase().includes(searchText.toLowerCase())
                // }));
                updateFilteredList(CanteensListInformation.searchText, false);
                // setOnlyOpenCanteens(false);
            }
        }
    
        // const handleSearch = (e) => {
        //     setSearchText(e.target.value);
        // }
    
        const handleSearch = useCallback( (e) => {
                console.log("SearchText updated to " + e.target.value);
                setSearchText(e.target.value);
                updateFilteredList(e.target.value, CanteensListInformation.OnlyOpenCanteens);
            }, [searchText]
        );

        const label = { inputProps: { 'aria-label': 'Switch demo' } };

        return (
            <div className="searchSection">
                <Box 
                    className="searchInput"
                    sx={{
                        marginTop: 2

                    }}
                >
                    <Input type="text" name="searchInput" placeholder="Search" defaultValue={CanteensListInformation.searchText} onChange={handleSearch} autoFocus />
                </Box>
    
                {/* <h1>Found canteens: {CanteensListInformation.filteredList.length}</h1> */}

                <Box
                    sx={{
                        marginTop: 5

                    }}
                >

                    {/* Only open canteens */}

                    {/* <FormGroup>
                            <FormControlLabel control={CanteensListInformation.OnlyOpenCanteens && <Switch checked={checked} onChange={handleOnlyOpenCanteens} />} label="Label" />
                            <FormControlLabel disabled control={!CanteensListInformation.OnlyOpenCanteens && <Switch onChange={handleOnlyOpenCanteens} />} label="Disabled" />
                    </FormGroup> */}
                        {   <FormControlLabel
                                value="top"
                                control={<Switch
                                            checked={CanteensListInformation.OnlyOpenCanteens}
                                            onChange={handleOnlyOpenCanteens}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#F06543',
                                                '&:hover': {
                                                backgroundColor: alpha('#F06543'),
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    backgroundColor: '#F06543',

                                                },
                                                '& $track': {
                                                    backgroundColor: '#F06543',
                                                },
                                            }}
                                            }
                                        />}
                                label="Only open canteens"
                                labelPlacement="start"
                            />

                             }
                </Box>
                  
                <ViewMenu />
            </div>
        )
    }

    const MyMap = () => {
        const [zoomLevel, setZoomLevel] = useState(14);
        const [coords, setCoords] = useState([52.3932931, 13.1311834]);

        useEffect( () => {
            console.log("MyMap.getCurrentLocation");
            getCurrentLocation();
        }, [])

        function handleZoomChanged() {
            // setZoomLevel(this.getZoom());
        }

        function getCurrentLocation() {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(getCoordinates);
            } else {
              alert("Geolocation is not supported by this browser.");
            }
        }
    
        const getCoordinates = ( (position) => {
            setCoords([parseFloat(position.coords.latitude), parseFloat(position.coords.longitude)]);
            console.log("getCoordinates: " + parseFloat(position.coords.latitude), parseFloat(position.coords.longitude));
        })

        const MapWithAMarker = withScriptjs(withGoogleMap(props => {

            if(typeof coords[0] === "undefined") {
                setCoords([52.3932931, 13.1311834]);
                console.log("Setting to initial coords!");
            }
            
            return (
                <GoogleMap
                defaultZoom={zoomLevel}
                defaultCenter={{ lat: +coords[0], lng: +coords[1] }}
                onZoomChanged={props.handleZoomChanged}
                >
                    {CanteensListInformation.filteredList.map((canteen) => {
    
                        let icon = "/images/pizza.png";
                        if(user.favoriteCanteen === canteen.id) {
                            icon = "/images/heart.png";
                        }
                        return (
                            <Marker
                                key={`${canteen.lat}-${canteen.lng}-${canteen.name}`}
                                position={{ lat: canteen.lat, lng: canteen.lng }}
                                icon={{
                                    url: icon,
                                    origin: new window.google.maps.Point(0, 0),
                                    anchor: new window.google.maps.Point(15, 15),
                                    scaledSize: new window.google.maps.Size(30, 30),
                                }}
                                onClick={ () => {
                                    setCoords([canteen.lat, canteen.lng]);
                                    props.setZoomLevel(18);
                                }}
                            />
                        )
                    })}
                    <Marker key="initialMarker" position={{ lat: coords[0], lng: coords[1]}} />
                </GoogleMap>
            )
        }));

        return (
            <MapWithAMarker
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places}`}
                loadingElement={<div className="loadingElement" />}
                containerElement={<div className="mapsContainer" />}
                mapElement={<div className="mapElement" />}
                zoomLevel={zoomLevel}
                setZoomLevel={setZoomLevel}
                handleZoomChanged={handleZoomChanged}
            />
        )
    }

    const StackList = () => {
        return (
            <Stack spacing={2}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                               
            }}
            >
                { CanteensListInformation.filteredList.map( (canteen, index) => {
                    return (
                        <Canteen
                            key={canteen.id}
                            index={index}
                            canteens={canteens}
                            setCanteens={setCanteens}
                            canteen={canteen}
                            user={user}
                            setUser={setUser}
                            setSelectedCanteen={setSelectedCanteen}
                            databaseLocation={databaseLocation}
                        />
                )}) }
            
            </Stack>
        )
    }

    


    return (
        <div className="CanteensList">
            <SearchSection />

            {/* { currentView.includes("List") && <StackList /> }
            

            { currentView.includes("Map") &&
                <MapWithAMarker
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places}`}
                    loadingElement={<div className="loadingElement" />}
                    containerElement={<div className="mapsContainer" />}
                    mapElement={<div className="mapElement" />}
                />
            } */}
            
        </div>
    )
}


export default CanteensList;