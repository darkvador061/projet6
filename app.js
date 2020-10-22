const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const saucesRoutes = require("./routes/sauces")
const userRoutes = require("./routes/user")
const path = require("path")
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize")
const session = require('cookie-session')



const app = express()


require("dotenv").config() //import de dotenv pour gérer des variables dissimulées

app.use(helmet()) //Import de helmet pour configurer de manière appropriée des en-têtes HTTP
app.use(mongoSanitize()) //Import de mongo-sanitize pour empecher les attaques par injection


mongoose.connect(process.env.DB_MANGO,
{ useNewUrlParser: true,
  useUnifiedTopology: true 
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
// sécurisation des cookies 
const expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 heure
app.use(session({
  name: 'session',
  keys: process.env.DB_TOKEN,
  cookie: { secure: true,
            httpOnly: true,
            domain: 'http://localhost:3000',
            expires: expiryDate
          }
  })
);






app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;
