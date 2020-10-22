const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const maskData = require("maskdata")
const User = require("../models/User")

require("dotenv").config()

exports.signup = (req, res, next) => {

  const maskedMail = maskData.maskEmail2(req.body.email); // masquage de l'adresse mail
 
   bcrypt.hash(req.body.password, 10)
   .then(hash => {
       const user = new User({
           email:maskedMail, // masquage de l'adresse mail
           password:hash 
       })
       user.save()
       .then(() => res.status(201).json({message:"Utilisateur crée !!"}))
       .catch(error => res.status(400).json({error}))
   })
   .catch(error => res.status(500).json({error}))

}

exports.login = (req, res, next) => {

  const maskedMail = maskData.maskEmail2(req.body.email);
  
    User.findOne({ email: maskedMail }) // masquage de l'adresse mail
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id},
                 process.env.DB_TOKEN,
                { expiresIn: "24h"}
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};