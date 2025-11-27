const reclamationModel = require('../../models/reclamationModel')
const userModel = require('../../models/userModel')

async function createReclamationController(req, res) {
    try {
        // Vérifier que l'utilisateur est authentifié
        if (!req.userId) {
            return res.status(401).json({
                message: 'User must be logged in to send a message.',
                error: true,
                success: false
            })
        }

        const { subject, message } = req.body
        
        console.log("createReclamationController hit", { subject, message, userId: req.userId })

        // Validation des champs requis (seulement subject et message)
        if (!subject || !message) {
            return res.status(400).json({
                message: 'Subject and message are required',
                error: true,
                success: false
            })
        }

        // Récupérer les informations de l'utilisateur depuis la base de données
        const user = await userModel.findById(req.userId)
        
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false
            })
        }

        // Length validation
        if (subject.length > 200 || message.length > 2000) {
            return res.status(400).json({
                message: 'Input exceeds maximum length',
                error: true,
                success: false
            })
        }

        // Créer la réclamation avec les données de l'utilisateur authentifié
        const reclamation = new reclamationModel({
            name: user.name.trim(),
            email: user.email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim(),
            status: 'new'
        })

        const savedReclamation = await reclamation.save()

        res.status(201).json({
            data: savedReclamation,
            message: 'Your message has been sent successfully',
            success: true,
            error: false
        })

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = createReclamationController
