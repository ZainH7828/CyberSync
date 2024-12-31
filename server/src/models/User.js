const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
              return /^\S+@\S+\.\S+$/.test(v); // Simple regex for email validation
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true
    },
    organization: {
        type: Schema.Types.ObjectId, ref: 'Organization', 
        default: null 
    },
    role: {
        type: String,
        default: null,
        required: false
    },
    rights: {
        type: Object,
        default: {},
        required: false
    },
    subCategories: [{
        type: Schema.Types.ObjectId, ref: 'SubCategory',
        default: null
    }],
    subCategoriesId:[{
        type: Schema.Types.ObjectId, ref: 'SubCategoryID',
        default: []
    }],
    isPasswordChanged: {
        type: Boolean,
        default: false
    },
    otp: {
        type: Number
    }
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
        console.log(this.password);
    }

    next();
});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
