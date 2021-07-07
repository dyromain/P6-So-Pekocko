// Importation du token d'authentification
const jwt = require('jsonwebtoken');

// Création d'un middleware d'authentification 
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Récupération du token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // Décoder le token
    const userId = decodedToken.userId; // Récupération du userID
    if (req.body.userId && req.body.userId !== userId) { // Vérifie si l'userId correspond au token
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};