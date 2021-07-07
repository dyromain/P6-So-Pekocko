// Importation de mongoose
const mongoose = require('mongoose');

// Package qui permet de vérifier que l'adresse e-mail n'a pas été déjà enregistrée
const uniqueValidator = require('mongoose-unique-validator');

// Structure du schéma user
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);