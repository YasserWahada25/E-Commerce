const mongoose = require('mongoose')

const reclamationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'seen', 'solved'],
        default: 'new'
    }
}, {
    timestamps: true
})

const reclamationModel = mongoose.model('reclamation', reclamationSchema)

module.exports = reclamationModel
