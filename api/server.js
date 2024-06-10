const express = require('express');
const admin = require('firebase-admin');
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin SDK
const serviceAccount = require('../backend/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://console.firebase.google.com/u/0/project/reciapp-5cea0/firestore/databases/-default-/data/~2F'
});

// Firestore instance
const db = admin.firestore();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization;
  if (!idToken) {
    return res.status(401).json({ error: 'Authorization header is required' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.uid = decodedToken.uid;
    next();
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// POST endpoint for creating a new recipe
app.post('/api/recipes', verifyToken, async (req, res) => {
  try {
    const { recipeName, ingredients, steps } = req.body;
    const userId = req.uid;

    // Create new recipe document
    const recipeRef = await db.collection('recipes').add({
      userId, // Add userId to the recipe document
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
