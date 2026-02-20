const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
        maxlength: [50, "First Name must be at most 50 characters long"],
        minlength: [2, "First Name must be at least 2 characters long"],
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 1,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: "Please Enter valid Email"
        },
        trim: true
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (value) => validator.isStrongPassword(value),
            message: "Please Enter valid Password"
        },
        trim: true
    },
    mobileNo: {
        type: String,
        required: true,
        set: (value) => value.startsWith("+91") ? value : `+91${value}`,
        validate: {
            validator: (value) => validator.isMobilePhone(value, "en-IN"),
            message: "Please Enter valid Mobile Number"
        },
        trim: true
    },
    role: {
        type: String,
        required: true,
        enum: {
            values: ["admin", "teacher", "student", "parent", "superAdmin"],
            message: `{VALUE} is not a valid role`
        },
        trim: true
    },
    status: {
        type: String,
        enum: {
            values: ["active", "inactive", "approved", "pending", "rejected"],
            message: `{VALUE} is not a valid status`
        },
        default: "pending",
        trim: true
    },
    googleId: {
        type: String,
    },
    isProfileCompleted: {
        type: Boolean,
        default: false
    },
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    hashedOtp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    blockedUntil: {
        type: Date,
        default: null
    },
    createdBy: {
        type: String,
        default: "self"
    }
},
    { timestamps: true }
);

// userSchema.pre("save", async function () {
//     const user = await User.findOne({ email: this.email });
//     if (user) {
//         throw new Error("User Already Exits");
//     }
// });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
