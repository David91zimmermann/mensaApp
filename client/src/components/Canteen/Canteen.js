import Axios from 'axios';
import { useHistory } from "react-router-dom";
import React from "react";
import "./canteen.css";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Box from '@mui/material/Box'



const Canteen = ({index, canteens, setCanteens, canteen, user, setUser, setSelectedCanteen, databaseLocation}) => {

      let history = useHistory();

      const toogleFavorite = (e) => {
            
        if(user.favoriteCanteen === canteen.id) {

            const newItems = [...canteens];
            setCanteens(newItems);

            user.favoriteCanteen = 999;
            console.log("same!");
        }
        else {
            const newItems = [...canteens];
            newItems[index].isSelected = !newItems[index].isSelected;
            setCanteens(newItems);

            user.favoriteCanteen = canteen.id;
        }
        setUser(user);
        updateUser();
      }

      const updateUser = () => {
            Axios.put(`${databaseLocation}/api/updateUser`, {
                user: user
            });
      }

      const showDetails = () => {
            history.push("/details");
            setSelectedCanteen(canteen);
      }


      return (
                  <Card sx={{ 
                        maxWidth: 'sm', 
                        width: '100%',
                        minHeight: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                        }}
                        className="everySnd"
                        >
                        <CardContent>
                              <Typography gutterBottom variant="h5" component="div">
                                    {canteen.name}
                              </Typography>
                              <Typography variant="h6" color="text.secondary">
                                    {canteen.city}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                    {canteen.address}
                              </Typography>

                        </CardContent>

                        <CardActions
                              sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-end',
                                    width: '100%',
                              }}
                        >
                        {/* Show More Button */}
                        <Button 
                        size="small" 
                        onClick={showDetails}
                        sx={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              color: '#F06543'
                        }}
                        >
                        Show more
                        </Button>

                        {/* Favorite Button */}
                        <Button 
                              size ="small"
                              onClick={toogleFavorite}
                              sx={{
                              color: '#F06543'
                              
                        }}>
                              {user.favoriteCanteen === canteen.id ? (
                              <FavoriteIcon/>
                              ) : (
                              <FavoriteBorderIcon/>
                              )}
                        </Button >
                        </CardActions>
                  </Card>
      )

};


export default Canteen;