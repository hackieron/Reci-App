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

// Middleware to validate Firebase Authentication token
const validateFirebaseToken = async (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({ error: 'Unauthorized: Missing authorization header' });
  }

  try {
    // Verify Firebase Authentication token
    const decodedToken = await admin.auth().verifyIdToken(authToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

// Apply token validation middleware to all routes except '/'
app.use((req, res, next) => {
  if (req.path !== '/') {
    validateFirebaseToken(req, res, next);
  } else {
    next();
  }
});

// POST endpoint for creating a new recipe
app.post('/api/recipes', async (req, res) => {
  try {
    const { recipeName, ingredients, steps } = req.body;

    // Create new recipe document
    const recipeRef = await db.collection('recipes').add({
      recipeName,
      ingredients,
      steps,
      userId: req.user.uid // Include userId obtained from Firebase Authentication token
    });

    // Respond with success message and ID of the newly created recipe
    res.status(201).json({ message: 'Recipe created successfully', recipeId: recipeRef.id });
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// Route handler for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
