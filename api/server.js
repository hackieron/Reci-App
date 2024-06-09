const express = require('express');
const admin = require('firebase-admin');
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin SDK
const serviceAccount = require('../backend/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://console.firebase.google.com/u/0/project/reciapp-5cea0/firestore/data/~2'
});

// Firestore instance
const db = admin.firestore();

// Middleware to parse JSON bodies
app.use(express.json());

// POST endpoint for creating a new recipe
app.post('/api/recipes', async (req, res) => {
  try {
    const { recipeName, ingredients, steps } = req.body;

    // Create new recipe document
    const recipeRef = await db.collection('recipes').add({
      recipeName,
      ingredients,
      steps
    });

    // Respond with success message and ID of the newly created recipe
    res.status(201).json({ message: 'Recipe created successfully', recipeId: recipeRef.id });
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
