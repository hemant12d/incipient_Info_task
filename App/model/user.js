import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: {
        type: String,
        required: [true, "User must have first name"]
    },
    last_name: {
        type: String,
        required: [true, "User must have last name"]
    },
    age: {
        type: Number,
        required: [true, "User must have age"]
    },
    email: {
        type: String,
        required: [true, "Email can't be empty"],
        unique: [true, "User email already registerd"],
        validate: {
            validator(email) {
              // eslint-disable-next-line max-len
              const emailRegex = /^[-a-z0-9%S_+]+(\.[-a-z0-9%S_+]+)*@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/i;
              return emailRegex.test(email);
            },
            message: '{VALUE} is not a valid email.',
        },
    },
    password: {
        type: String,
        required: [true, "Password is required for user"]
    },
    phone: {
        type: String,
        required: [true, "User must have phone number"]
    }
},
{
    timestamps: true
});
// Incrypt the user password (Document pre M/W) 
userSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next();
    const hashPassword = await bcrypt.hash(this.password, 10);
    this.password = hashPassword;
    return next();
});


const User = mongoose.model('User', userSchema);

export default User;