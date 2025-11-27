const reclamationModel = require('../../models/reclamationModel')
const ROLE = require('../../common/role')

async function getAllReclamationsController(req, res) {
    try {
        // Check if user is admin
        if (req.userId) {
            const userModel = require('../../models/userModel')
            const user = await userModel.findById(req.userId)
            
            if (user?.role !== ROLE.ADMIN) {
                return res.status(403).json({
                    message: 'Access denied. Admin only.',
                    error: true,
                    success: false
                })
            }
        } else {
            return res.status(401).json({
                message: 'Unauthorized',
                error: true,
                success: false
            })
        }

        // Fetch all reclamations, sorted by newest first
        const reclamations = await reclamationModel.find().sort({ createdAt: -1 })

        res.json({
            reclamations: reclamations,
            message: 'Reclamations fetched successfully',
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

module.exports = getAllReclamationsController
