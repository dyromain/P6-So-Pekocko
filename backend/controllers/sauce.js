// Importation du modèle Sauces
const Sauces = require('../models/Sauces');

// Package qui permet de modifier ou supprimer des fichiers
const fs = require('fs');

// Création de la sauce
exports.createSauce = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauces);
  delete saucesObject._id;
  const sauces = new Sauces({
    ...saucesObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  sauces.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Modification de la sauce
exports.modifySauce = (req, res, next) => {
  const saucesObject = req.file ?
    {
      ...JSON.parse(req.body.sauces),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauces.updateOne({ _id: req.params.id }, { ...saucesObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Suppression de la sauce
exports.deleteSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then(sauces => {
      const filename = sauces.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauces.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Création du like et dislike
exports.likeSauce = (req, res, next) => {    
  const like = req.body.like;
  if (like === 1) { // Like
      Sauces.updateOne({_id: req.params.id}, { $inc: { likes: 1}, $push: { usersLiked: req.body.userId}, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Vous aimez cette sauce !' }))
      
      .catch( error => res.status(400).json({ error }))
  } else if (like === -1) { // Dislike
      Sauces.updateOne({_id: req.params.id}, { $inc: { dislikes: 1}, $push: { usersDisliked: req.body.userId}, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Vous n\'aimez pas cette sauce !' }))
      .catch(error => res.status(400).json({ error }))

  } else { // Annuler like ou dislike
      Sauces.findOne( {_id: req.params.id})
      .then(sauces => {
          if (sauces.usersLiked.indexOf(req.body.userId)!== -1){
               Sauces.updateOne({_id: req.params.id}, { $inc: { likes: -1}, $pull: { usersLiked: req.body.userId}, _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Vous n\'aimez plus cette sauce !' }))
              .catch(error => res.status(400).json({ error }))
              }
          else if (sauces.usersDisliked.indexOf(req.body.userId)!== -1) {
              Sauces.updateOne( {_id: req.params.id}, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId}, _id: req.params.id})
              .then(() => res.status(200).json({ message: 'Vous aimez cette sauce !' }))
              .catch(error => res.status(400).json({ error }))
              }           
      })
      .catch(error => res.status(400).json({ error }))             
  }   
};

// Récupération d'une seule sauce
exports.getOneSauce =  (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(404).json({ error }))
};

// Récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauces.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({ error }))
};