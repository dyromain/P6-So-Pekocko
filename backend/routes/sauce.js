const express = require('express'); // Importation d'Express
const router = express.Router(); // Importation du router Express
const sauceCtrl = require('../controllers/sauce'); //Importation du controleur de sauce

const auth = require('../middleware/auth');  // Importation du middleware d'authentification
const multer = require('../middleware/multer-config'); // Importation de multer

router.post('/', auth, multer, sauceCtrl.createSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);

module.exports = router;