const passwordValidator = require("password-validator")

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(7)                                    // minimum 7 caractères
.is().max(20)                                   // maximum 20 caractères
.has().uppercase()                              // Doit avoir 1 lettre majuscule minimum
.has().lowercase()                              // Doit avoir 1 lettre minuscule minimum
.has().digits(2)                                // Doit avoir 2 chiffres minimum
.has().not().spaces()                           // pas d'espace autorisé
.is().not().oneOf(['Passw0rd', 'Password123']); // Liste noir des mots de passe


module.exports = passwordSchema;
 