import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        minlength: 2,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    bio: {
        type: String,
        default: '',
    },
    profilePic: {
        type: String,
        default: '',
    },
    nativeLanguage: {
        type: String,
        default: '',
    },
    learningLanguage: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        default: '',
    },
    isOnboarded: {
        type: Boolean,
        default: false,
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ]
}, { timestamps: true });

/// pre hook
UserSchema.pre('save', async function (next) {
    if(!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (e) {
        console.log(e);
        next(e);
    }
})
UserSchema.methods.matchPassword =  async function (password) {
    return  await bcrypt.compare(password, this.password);
}
const User =  mongoose.model('User', UserSchema);
export default User;