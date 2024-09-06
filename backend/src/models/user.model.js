import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        // we will do discriminator
        enum: ['employer', 'freelancer'],
        required: true
    },
    refreshToken: {
        type: String
    }

}, { timestamps: true},{ discriminatorKey: 'role' })


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()

})

userSchema.methods.isPasswordCorrect = async function (password) {

    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function () {
    try {
        return jwt.sign(
            {
                _id: this._id,
                username: this.username,
                email: this.email
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '2d' }
        );
    } catch (error) {
        console.error("Error generating access token:", error);
    }
}



userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '7d'
        }
    )



}

export const User = mongoose.model("User", userSchema)