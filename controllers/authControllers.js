// Import User Module
const User = require('../models/User');
// Import JWT
const jwt = require('jsonwebtoken');
// Handl Errors
const hanldError = (err) => {
    let errors = { email: '', password: '' };
    // Incorrect Email
    if (err.message == "Incorrect Email") {
        errors.email = "That is Email is no Registered";
    }
    // Incorrect Password
    if (err.message == "Incorrect Password") {
        errors.password = "Wrong Password";
    }
    // Duplicate Error
    if (err.code === 11000) {
        errors.email = 'This email is existed before';
        return errors;
    }
    // Validation Error
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        });
    }
    return errors;
};
// Create JWT Token
let maxAge = 2 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'we will creat shop', {
        expiresIn: maxAge
    });
};
// Get for sign up
module.exports.signup_get = (req, res) => {
    res.render("signup");
};
// Get for Log in
module.exports.login_get = (req, res) => {
    res.render("login");
};
// Post for sign up
module.exports.signup_post = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    } catch (error) {
        const errors = hanldError(error);
        res.status(400).json({ errors });
    }
};
// Post for Log in
module.exports.login_post = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id })
    } catch (error) {
        const errors = hanldError(error);
        res.status(400).json({ errors });
    }
};
// Logout Function
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};