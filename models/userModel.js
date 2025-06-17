const mongoose = require("mongoose")
const validator = require('validator')
const bcrypt = require('bcrypt')


// const usernameRegex = /^(?!.*[_.]{2})[a-zA-Z0-9][a-zA-Z0-9._]{1,28}[a-zA-Z0-9]$/;
const phoneRegex = /^(010|011|012|015)\d{8}$/; 


// Custom username validation function
const validateUsername = (username) => {
    const errors = [];
    
    // Check length
    if (username.length < 3) {
        errors.push("Username must be at least 3 characters long");
    }
    if (username.length > 30) {
        errors.push("Username cannot exceed 30 characters");
    }
    
    // Check if starts or ends with letter/number
    if (!/^[a-zA-Z0-9]/.test(username)) {
        errors.push("Username must start with a letter or number");
    }
    if (!/[a-zA-Z0-9]$/.test(username)) {
        errors.push("Username must end with a letter or number");
    }
    
    // Check for invalid characters
    if (!/^[a-zA-Z0-9._]+$/.test(username)) {
        errors.push("Username can only contain letters, numbers, periods (.), and underscores (_)");
    }
    
    // Check for consecutive periods or underscores
    if (/[_.]{2,}/.test(username)) {
        errors.push("Username cannot have consecutive periods (.) or underscores (_)");
    }
    
    // Check for spaces
    if (/\s/.test(username)) {
        errors.push("Username cannot contain spaces");
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// creating a custom password validation
const validatePassword = (password) => {
    const errors = [];
    
    // Check minimum length
    if (password.length < 8) {
        errors.push("Password should be at least 8 characters long");
    }
    
    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
        errors.push("Password should contain at least one uppercase letter");
    }
    
    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
        errors.push("Password should contain at least one lowercase letter");
    }
    
    // Check for number
    if (!/\d/.test(password)) {
        errors.push("Password should contain at least one number");
    }
    
    // Check for special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push("Password should contain at least one special character (!@#$%^&*()_+-=[]{}|;':\",./<>?)");
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

// user model
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true, 
        minlength: [3, "Username must be at least 3 characters long"],
        maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password_hash: {
        type: String,
        required: true,
        select: false
    },
    phone_number: {
        type: String,
        required: true,
        unique: true
    },
    created_at: { type: Date, default: Date.now },

    last_login: Date,
    user_presence: {
        type: Number,
        enum: [0, 1],
        required: true,
        default: 0
            },
    viewed_errors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WindowsError"
        }
    ],
    service_ratings: [
        {
            shop_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ServiceShop"
            },
        rating: Number
        },
    ],
    profile_image: String
})

// Register User
userSchema.statics.registerUser= async function (username, email, password_hash, phone_number, user_presence){
    // Doing multiple checks
    if (!username || !email || !password_hash || !phone_number) {
        throw Error('All fields must be filled!')
    }

    // Enhanced username validation with specific error messages
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
        throw Error(usernameValidation.errors.join('\n'));
    }

    if (!validator.isEmail(email)) { 
        throw Error('Invalid Email!')
    }

    // Enhanced password validation with specific error messages
    const passwordValidation = validatePassword(password_hash);
    if (!passwordValidation.isValid) {
        throw Error(passwordValidation.errors.join('\n'));
    }
     // Egyptian Regex phone number
    if (!validator.matches(phone_number, phoneRegex)) { 
        throw Error('Invalid phone_number')
    }

    const existingEmail = await this.findOne({ email })
    if (existingEmail) { 
        throw Error('Email is already in use!')
    }   
    const existingPhone = await this.findOne({ phone_number })
    if (existingPhone) { 
        throw Error('Phone is already in use!')
    }   
    
    const existingUsername = await this.findOne({ username })
    if (existingUsername) {
        throw Error('username is already in use!')
    }
    // Hash password
    // salt default = 10 rounds
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password_hash, salt);
    
            // Create user
            const user = await this.create({
                username,
                email,
                password_hash: hashedPassword,
                phone_number,
                user_presence
            });
    return user
}
userSchema.statics.login = async function (identifier, password) {
    // Doing multiple checks
    if (!identifier || !password) { 
        throw Error('All Fields must be filled')
    }
    // 
    // Find specialist by email Or phone number
    const user = await this.findOne({
        $or: [{ email: identifier }, { phone_number: identifier },{username: identifier} ]
    }).select('+password_hash');

    if (!user) {
        throw new Error("Invalid email/phone");
    }

    // Compare password
    const matchPassword = await bcrypt.compare(password, user.password_hash);
    if (!matchPassword) {
        throw new Error("Invalid password");
    }
    return user
}

// Exporting user model
module.exports = mongoose.model("User", userSchema)
