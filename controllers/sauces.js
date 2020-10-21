const Sauce = require('../models/Sauces');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersdisLiked: []      
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !!!'}))
      .catch(error => res.status(400).json({ error }))
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id },{ ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }))
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1]; //nous utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier
        fs.unlink(`images/${filename}`, () => { //nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé
          Sauce.deleteOne({ _id: req.params.id }) //dans le callback, nous implémentons la logique d'origine, en supprimant la Sauce de la base de données.
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }))
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }))
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => { 
        switch (req.body.like) {  // Utilisation du switch pour les 3 cas et un pour les erreurs

            case 1 : // L'utilisateur like
                if (!sauce.usersLiked.includes(req.body.userId)) {  // Si le tableau usersLikes pour cette sauce ne contient pas l'Id de l'utilisateur
                  Sauce.updateOne({_id: req.params.id}, {$inc: {likes: 1}, $push: {usersLiked: req.body.userId}, _id: req.params.id}) //Incrémentation de "likes" et ajout de l'userId au tableau usersLiked
                  .then(() => res.status(201).json({ message: 'Like ajouté avec succès !' }))
                  .catch(error => res.status(400).json({ error }))
                }
              break;
      
            case -1 :  //L'utilisateur dislike
                if (!sauce.usersDisliked.includes(req.body.userId)) {  // Si le tableau usersDisliked pour cette sauce ne contient pas l'userId
                  Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $push: {usersDisliked: req.body.userId}, _id: req.params.id})
              .then(() => res.status(201).json({ message: 'Dislike ajouté avec succès !' }))
              .catch(error => res.status(400).json({ error }));
                }
              break;
      
            case 0: // L'utilisateur enlève son like ou son dislike
                if (sauce.usersLiked.includes(req.body.userId)) { // Si l'userId est présent dans l'array usersLiked
                  Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: req.body.userId}, _id: req.params.id}) //Décrémentation de "likes" et suppression de l'userId du tableau
                  .then(() => res.status(201).json({ message: 'Like annulé avec succès !' }))
                  .catch(error => res.status(400).json({ error }));
                } else if (sauce.usersDisliked.includes(req.body.userId)) { // Si l'userId est présent dans l'array usersDisliked
                  Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId}, _id: req.params.id}) //Idem mais pour le dislikes
                  .then(() => res.status(201).json({ message: 'Dislike annulé avec succès !' }))
                  .catch(error => res.status(400).json({ error })); 
                }   
              break;
            
            default: // Si les précédentes options ne donnent pas true, voici le message d'erreur
              throw { error: "Impossible de modifier les likes, veuillez réesayer !" };
        }
      })
      .catch(error => res.status(400).json({ error }));
};