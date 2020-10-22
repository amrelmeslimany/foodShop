// Make Schema Model
const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
// Schema Modael
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please Enter Eamil'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please Enter A Valid Email']
    },
    password: {
        type: String,
        required: [true, 'Please Enter Password'],
        minlength: [8, 'Minlength is 8']
    }
});
// Before user is created
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
// Static Login Shema
userSchema.statics.login = async function(email, password) {
        const user = await this.findOne({ email });
        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                return user;
            }
            throw Error('Incorrect Password')

        }
        throw Error('Incorrect Email')
    }
    // Model itself
const User = mongoose.model('user', userSchema);
// Export Model of user
module.exports = User;