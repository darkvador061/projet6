const passwordSchema = require('../models/password');

//verification que le mot de passe saisie corresponde a la demande
module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)){
    return res.status(400).json({ error: "Mot de passe trop faible, doit contenir min 7 caractères avec au minimum ( 1 majuscule, 1 minuscule, 1 chiffre, pas de symboles, pas d'espaces)"})
  } else{  
    next();
  }
}