import React from 'react';
import style from './recipe.css';
import Axios from 'axios';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GrassIcon from '@mui/icons-material/Grass';

const Recipe = ( {meal, selectedCanteen, setUser, user, setFavMeal, databaseLocation} ) => {


      const toogleFavorite = (e) => {

            if(user.favoriteCanteen !== selectedCanteen.id)
            {
                  if(window.confirm('You can only pick meals of your favorite canteen. Would you like to make this your favorite canteen?')) {
                        user.favoriteCanteen = selectedCanteen.id;
                  }
                  else {
                        return;
                  }
            }

            
            user.favoriteMeal = meal.id;
            setUser(user);

            Axios.put(`${databaseLocation}/api/updateUser`, {
                  favoriteCanteen: user.favoriteCanteen,
                  favoriteMeal: meal.id,
                  userId: user.userId,
            });

            setFavMeal(meal.id); //Trigger Re-Rendering
      }

      const Vegan = () => {
        return (
            <>
            <h4 key="vegan">Vegan </h4>
            <p className="note vegan"><i class="fas fa-leaf"></i></p>
            </>
        )
    }

    const Vegetarian = () => {
        return (
            <>
            <h4 key="vegetarian">Vegetarisch </h4>
            <p className="note vegetarian"><i class="fas fa-leaf"></i></p>
            </>
        )
    }

    const Wheat = () => {
        return (
            <>
            <h4 key="weizen">Weizen </h4>
            <p className="note weizen"><i class="fas fa-leaf"></i></p>
            </>
        )
    }

    const Sweetener = () => {
        return (
            <>
            <h4 key="sweetener">Süßungsmittel </h4>
            <p className="note sweetener"><i class="fas fa-leaf"></i></p>
            </>
        )
    }

    const Soy = () => {
        return (
            <>
            <h4 key="soy">Soja </h4>
            <p className="note soy"><i class="fas fa-leaf"></i></p>
            </>
        )
    }

    const Lactose = () => {
        return (
            <>
            <h4 key="lactose">Laktose </h4>
            <p className="note lactose"><i class="fas fa-leaf"></i></p>
            </>
        )
    }

    const Hazelnut = () => {
        return (
            <>
            <h4 key="hazelnut">Haselnüsse </h4>
            <p className="note hazelnut"><i class="fas fa-leaf"></i></p>
            </>
        )
    }

    const Almond = () => {
        return (
            <>
            <h4 key="almond">Mandeln </h4>
            <p className="note almond"><i class="fas fa-leaf"></i></p>
            </>
        )
    }

    const Peanut = () => {
        return (
            <>
            <h4 key="peanut">Erdnüsse </h4>
            <p className="note peanut"><i class="fas fa-leaf"></i></p>
            </>
        )
    }

    const Pistachio = () => {
        return (
            <>
            <h4 key="pistachio">Pistazie</h4>
            <p className="note pistachio"><i class="fas fa-leaf"></i></p>
            </>
        )
    }

      return (
        <Card 
            className="everySnd"
            sx={{
            maxWidth: 'sm',
            minHeight: '10rem',
            width: '90%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 2,
            
            }}
        > 
            <CardContent sx={{ flex: 1}}>
                <Typography gutterBottom variant="h5" component="div">
                    {meal.name}
                </Typography>
                {user.role === "employee" && <Typography variant="body2" color="text.secondary">{parseFloat(meal.prices.employees).toFixed(2)}€</Typography>}
                {user.role === "student" && <Typography variant="body2" color="text.secondary">{parseFloat(meal.prices.students).toFixed(2)}€</Typography>}
                {user.role === "other" && <Typography variant="body2" color="text.secondary">{parseFloat(meal.prices.others).toFixed(2)}€</Typography>}
                <>
                <Typography variant="body1" color="text.secondary" key={meal.notes.toString()}>
                <div className="recipeNotes">
                    Enthalten:
                    {meal.notes.toString().toLowerCase().includes("vegan") && <Vegan sx={{ marginRight: "5px" }} /> }
                    {meal.notes.toString().toLowerCase().includes("vegetarisch") && <Vegetarian sx={{ marginRight: "5px" }} /> }
                    {meal.notes.toString().toLowerCase().includes("weizen") && <Wheat /> }
                    {meal.notes.toString().toLowerCase().includes("süßungsmittel") && <Sweetener /> }
                    {meal.notes.toString().toLowerCase().includes("soja") && <Soy /> }
                    {meal.notes.toString().toLowerCase().includes("laktose") && <Lactose /> }
                    {meal.notes.toString().toLowerCase().includes("haselnuss") && <Hazelnut /> }
                    {meal.notes.toString().toLowerCase().includes("mandel") && <Almond /> }
                    {meal.notes.toString().toLowerCase().includes("erdnüsse") && <Peanut /> }
                    {meal.notes.toString().toLowerCase().includes("pistazie") && <Pistachio /> }
                    {/* {meal.notes} */}
                </div>
                </Typography>
                </>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>

                    {user.favoriteMeal === meal.id ? (
                        <Button 
                            size="small" 
                            onClick={toogleFavorite}
                            sx={{
                                color: '#F06543'
                            }}
                        >
                                <FavoriteIcon />
                        </Button>
                    ) : (
                        <Button 
                            size="small" 
                            onClick={toogleFavorite}
                            sx={{
                                color: '#F06543'
                            }}
                            >
                                <FavoriteBorderIcon  />
                        </Button>
                    )}
            </CardActions>
        </Card>
      );
}


export default Recipe;