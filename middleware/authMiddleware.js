const jwt = require("jsonwebtoken");
const User = require("../models/User");
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt
        // If we have token
    if (token) {
        jwt.verify(token, "we will creat shop", (err, decodededToken) => {
            if (err) {
                res.redirect('/login');
            } else {
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
};
// Check current user
const checkUser = function(req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, "we will creat shop", async(err, decodededToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                const user = await User.findById(decodededToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};
module.exports = { requireAuth, checkUser };