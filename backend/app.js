const express = require('express'); // Importation d'express
const bodyParser = require('body-parser'); // Permet d'extraire l'objet JSON des requêtes POST
const app = express(); // Utilisation du framework express
const mongoose = require('mongoose'); // Plugin Mongoose pour se connecter à la base de données MongoDB
const path = require('path'); 

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://dyromain:GLAMOURd32@cluster0.xlhke.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', //Connection à la base de données MongoDB
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Accès à l'API depuis toute origines
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Tous les headers de requêtes autorisés vers l'API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Toutes les méthodes de requêtes autorisées
    next();
  });

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauce', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;