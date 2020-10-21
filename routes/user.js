const express = require("express")
const router = express.Router()
const rateLimit = require("express-rate-limit")
const userCtrl = require("../controllers/user")
const passValid = require("../middleware/password")

const passLimite = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes : temps défini pour retester l'application
    max: 3, // 3 essais max par adresse ip
   message: "Merci de reéssayer ultérieurement"   

})

router.post("/signup",passValid, userCtrl.signup)
router.post("/login", passLimite, userCtrl.login)

module.exports = router

