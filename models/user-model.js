const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        unique: false,  
    },
    email: {
        type: String,
        required: true,
        unique: true,  
    },
    
  
    password: {
        type: String,
        required: true,
    },
    isAdmin: {    
        type: Boolean,
        default: false,
    },
    resetToken:{type:String},
    resetTokenExpiration:{type:Date},
});


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});


userSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            userId: this._id.toString(),
            email: this.email,
            isAdmin: this.isAdmin,
        },
       'ritik111 ', 
        { expiresIn: "30d" }
    );
};

const Users = mongoose.models.Users || mongoose.model("Users", userSchema);
module.exports = Users;
