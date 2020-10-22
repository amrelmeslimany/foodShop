const { Router } = require('express');
const router = Router();
const authController = require("../controllers/authControllers");
// Routes of All Express
// Get
router.get('/signup', authController.signup_get);
// Post
router.post('/signup', authController.signup_post);
// Get
router.get('/login', authController.login_get);
// Post
router.post('/login', authController.login_post);
// Post
router.get('/logout', authController.logout_get);
// Export whole these
module.exports = router;