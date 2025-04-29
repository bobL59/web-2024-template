import { useState, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";
import styled from "styled-components";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Grid,
  Slider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestaurantIcon from "@mui/icons-material/Restaurant";

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface Recipe {
  id: number;
  name: string;
  ingredients: Ingredient[];
  instructions: string[];
  portions: number;
}

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%);
  min-height: 100vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #ff8c42;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledCard = styled(Card)`
  && {
    margin: 1rem;
    background: white;
    border-radius: 15px;
    transition: transform 0.2s;
    &:hover {
      transform: translateY(-5px);
    }
  }
`;

const StyledButton = styled(Button)`
  && {
    margin: 0.5rem;
    background: #ff8c42;
    &:hover {
      background: #ff6b1a;
    }
  }
`;

const PortionSlider = styled.div`
  margin: 1rem 0;
  padding: 0 1rem;
`;

function App() {
  const [recipes, setRecipes] = useLocalStorageState<Recipe[]>("recipes", {
    defaultValue: [],
  });
  const [newRecipe, setNewRecipe] = useState<Partial<Recipe>>({
    name: "",
    ingredients: [{ name: "", amount: 0, unit: "" }],
    instructions: [""],
    portions: 1,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (recipes.length === 0) {
      const boilerplateRecipes: Recipe[] = [
        {
          id: 1,
          name: "Spaghetti Carbonara",
          ingredients: [
            { name: "Spaghetti", amount: 400, unit: "g" },
            { name: "Eggs", amount: 4, unit: "pcs" },
            { name: "Pancetta", amount: 200, unit: "g" },
            { name: "Parmesan", amount: 100, unit: "g" },
          ],
          instructions: [
            "Cook spaghetti according to package instructions",
            "Fry pancetta until crispy",
            "Mix eggs with grated parmesan",
            "Combine everything and serve hot",
          ],
          portions: 4,
        },
        {
          id: 2,
          name: "Chocolate Chip Cookies",
          ingredients: [
            { name: "Flour", amount: 250, unit: "g" },
            { name: "Butter", amount: 200, unit: "g" },
            { name: "Sugar", amount: 150, unit: "g" },
            { name: "Chocolate chips", amount: 200, unit: "g" },
          ],
          instructions: [
            "Mix butter and sugar",
            "Add flour and chocolate chips",
            "Bake at 180°C for 12 minutes",
          ],
          portions: 24,
        },
        {
          id: 3,
          name: "Vegetable Stir Fry",
          ingredients: [
            { name: "Rice", amount: 300, unit: "g" },
            { name: "Mixed vegetables", amount: 500, unit: "g" },
            { name: "Soy sauce", amount: 50, unit: "ml" },
            { name: "Garlic", amount: 3, unit: "cloves" },
          ],
          instructions: [
            "Cook rice",
            "Stir fry vegetables with garlic",
            "Add soy sauce and serve with rice",
          ],
          portions: 2,
        },
        {
          id: 4,
          name: "Greek Salad",
          ingredients: [
            { name: "Cucumber", amount: 1, unit: "pc" },
            { name: "Tomatoes", amount: 4, unit: "pcs" },
            { name: "Feta cheese", amount: 200, unit: "g" },
            { name: "Olives", amount: 100, unit: "g" },
          ],
          instructions: [
            "Chop vegetables",
            "Add feta and olives",
            "Drizzle with olive oil",
          ],
          portions: 4,
        },
        {
          id: 5,
          name: "Smoothie Bowl",
          ingredients: [
            { name: "Bananas", amount: 2, unit: "pcs" },
            { name: "Mixed berries", amount: 200, unit: "g" },
            { name: "Yogurt", amount: 200, unit: "g" },
            { name: "Granola", amount: 100, unit: "g" },
          ],
          instructions: [
            "Blend fruits with yogurt",
            "Pour into bowl",
            "Top with granola",
          ],
          portions: 2,
        },
      ];
      setRecipes(boilerplateRecipes);
    }
  }, [recipes, setRecipes]);

  const handleAddRecipe = () => {
    if (newRecipe.name && newRecipe.ingredients && newRecipe.instructions) {
      setRecipes([
        ...recipes,
        {
          id: Date.now(),
          name: newRecipe.name,
          ingredients: newRecipe.ingredients,
          instructions: newRecipe.instructions,
          portions: newRecipe.portions || 1,
        },
      ]);
      setNewRecipe({
        name: "",
        ingredients: [{ name: "", amount: 0, unit: "" }],
        instructions: [""],
        portions: 1,
      });
    }
  };

  const handleDeleteRecipe = (id: number) => {
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  const handleEditRecipe = (id: number) => {
    setEditingId(id);
  };

  const handleUpdatePortions = (id: number, newPortions: number) => {
    setRecipes(
      recipes.map((recipe) =>
        recipe.id === id
          ? {
              ...recipe,
              portions: newPortions,
              ingredients: recipe.ingredients.map((ing) => ({
                ...ing,
                amount: (ing.amount * newPortions) / recipe.portions,
              })),
            }
          : recipe
      )
    );
  };

  return (
    <AppContainer>
      <Header>
        <Typography variant="h3" component="h1" gutterBottom>
          <RestaurantIcon fontSize="large" /> Recipe Manager
        </Typography>
      </Header>

      <Grid container spacing={3}>
        {recipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <StyledCard>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {recipe.name}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Ingredients:
                </Typography>
                <List>
                  {recipe.ingredients.map((ingredient, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`${ingredient.amount.toFixed(1)} ${
                          ingredient.unit
                        } ${ingredient.name}`}
                      />
                    </ListItem>
                  ))}
                </List>
                <Typography variant="h6" gutterBottom>
                  Instructions:
                </Typography>
                <List>
                  {recipe.instructions.map((instruction, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={`${index + 1}. ${instruction}`} />
                    </ListItem>
                  ))}
                </List>
                <PortionSlider>
                  <Typography gutterBottom>Portions: {recipe.portions}</Typography>
                  <Slider
                    value={recipe.portions}
                    onChange={(_, value) =>
                      handleUpdatePortions(recipe.id, value as number)
                    }
                    min={1}
                    max={10}
                    step={1}
                  />
                </PortionSlider>
              </CardContent>
              <CardActions>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEditRecipe(recipe.id)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteRecipe(recipe.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </AppContainer>
  );
}

export default App;
