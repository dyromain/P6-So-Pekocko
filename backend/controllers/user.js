// Chiffrer le mot de passe
const bcrypt = require ('bcrypt');

// Package token pour vérifier que la requête est authentifiée
const jwt = require('jsonwebtoken');

// Importation de l'utilisateur
const User = require('../models/User');

// Pour masquer l'adresse e-mail
const CryptoJS = require("crypto-js");

let hash = "&^(){@dhjdk$+£@#jkskdsab";

// CryptoJS
// const key = `${process.env.KEY}`;
// const keyutf = CryptoJS.enc.Utf8.parse(key);
// const iv = CryptoJS.enc.Base64.parse(key);

// const encrypt = (string) => {
//     const enc = CryptoJS.AES.encrypt(string, keyutf, { iv: iv });
//     return enc.toString();
// }


// Inscription de l'utilisateur
exports.signup = (req, res, next) => {
    const email = CryptoJS.HmacSHA256(req.body.email, `${hash}`).toString();    
    const password = req.body.password;
    bcrypt.hash(password, 10) // on sale 10 fois le password
      .then(hash => {
        const user = new User({
          email: email,
          password: hash
        });
         
        user.save()
          .then(() => { 
              res.status(201).json({ message: 'Utilisateur créé !' })
          }).catch(error => 
             res.status(400).json({ error })
          );
      }).catch(error => res.status(500).json({ error }));
  };


// Connexion de l'utilisateur
  exports.login = (req, res, next) => {
    const email = CryptoJS.HmacSHA256(req.body.email, `${hash}`).toString();
    const password = req.body.password;
    User.findOne({email: email})
    
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };