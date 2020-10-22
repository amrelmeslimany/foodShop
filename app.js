// Requirements
// Express
const express = require("express");
// Mongoose
const mongoose = require("mongoose");
// Lunch Routes
const authRoutes = require('./routes/authRoutes');
// Cookie parser
const cookiePareser = require('cookie-parser');
// Middleware Auth
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
// Lunch app
const app = express();
// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookiePareser());
// View Engine
app.set('view engine', 'pug');
// Database Connection
const urlDB = 'mongodb+srv://amr_123:amr1234@shopping.2pnmn.mongodb.net/foodshop?retryWrites=true&w=majority';
mongoose.connect(urlDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));
// Routes
app.get("*", checkUser);
app.get('/', (req, res) => { res.render('home') });
app.get('/goods', requireAuth, (req, res) => { res.render('goods') });
app.get('/cart', requireAuth, (req, res) => { res.render('cart') });
// Call Routes of auth here
app.use(authRoutes);