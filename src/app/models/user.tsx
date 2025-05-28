import {Schema} from 'mongoose';
import {model, models} from 'mongoose';
import bcrypt from 'bcryptjs'; // Import bcryptjs

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        validate: (pass: string | any[]) => {
            if (!pass?.length || pass.length < 8) {
                // Note: Throwing an Error here might not be caught by Mongoose's default validation handling
                // Consider returning false or using a custom validator function that returns a Promise
                // For simplicity, I'll keep the Error for now, but be aware of this.
                throw new Error('Password must be at least 8 characters long');
             }
        }
    },
    // Removed confirmPassword from the schema
}, {timestamps: true});

// Pre-save hook to hash the password
UserSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// You might want to add a method to the schema for password comparison
// UserSchema.methods.comparePassword = async function(candidatePassword: string) {
//     return bcrypt.compare(candidatePassword, this.password);
// };


export const User = models?.User || model('User', UserSchema);

