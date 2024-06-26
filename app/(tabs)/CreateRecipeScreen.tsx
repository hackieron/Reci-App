import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StyleSheet, Text, TextInput, ScrollView, Button } from 'react-native';
import axios from 'axios';

const CreateRecipeScreen = () => {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);

  useEffect(() => {
    // Retrieve user token when component mounts
    retrieveToken();
  }, []);

  const retrieveToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken !== null) {
        console.log('User token retrieved successfully:', userToken);
        setToken(userToken); // Store the token in component state
      } else {
        console.log('No token found');
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  };

  const [token, setToken] = useState('');

  const addIngredient = () => {
    setIngredients(prevIngredients => [...prevIngredients, '']);
  };

  const addStep = () => {
    setSteps(prevSteps => [...prevSteps, '']);
  };

  const handleIngredientChange = (text: string, index: number) => {
    setIngredients(prevIngredients => {
      const newIngredients = [...prevIngredients];
      newIngredients[index] = text;
      return newIngredients;
    });
  };

  const handleStepChange = (text: string, index: number) => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps[index] = text;
      return newSteps;
    });
  };

  const handleSubmit = async () => {
    try {
      // Log the request body and other relevant information
      console.log('Request body:', {
        recipeName,
        ingredients,
        steps,
      });
      console.log('Token:', token);
  
      const response = await axios.post(
        'https://reci-app-test.vercel.app/api/recipes',
        {
          recipeName,
          ingredients,
          steps,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      alert('Recipe created successfully!');
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('Error creating recipe');
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Recipe</Text>
      <TextInput
        style={styles.input}
        placeholder="Recipe Name"
        value={recipeName}
        onChangeText={setRecipeName}
      />
      <Text style={styles.subtitle}>Ingredients</Text>
      {ingredients.map((ingredient, index) => (
        <TextInput
          key={`ingredient-${index}`} // Using a unique key
          style={styles.input}
          placeholder={`Ingredient ${index + 1}`}
          value={ingredient}
          onChangeText={(text) => handleIngredientChange(text, index)}
        />
      ))}
      <Button title="Add Ingredient" onPress={addIngredient} />
      <Text style={styles.subtitle}>Steps</Text>
      {steps.map((step, index) => (
        <TextInput
          key={`step-${index}`} // Using a unique key
          style={styles.input}
          placeholder={`Step ${index + 1}`}
          value={step}
          onChangeText={(text) => handleStepChange(text, index)}
        />
      ))}
      <Button title="Add Step" onPress={addStep} />
      <Button title="Create Recipe" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
});

export default CreateRecipeScreen;
