const reclamationModel = require('../../models/reclamationModel')
const ROLE = require('../../common/role')

async function getReclamationsCountController(req, res) {
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

        // Count only NEW reclamations
        const count = await reclamationModel.countDocuments({ status: 'new' })

        res.json({
            data: { count },
            message: 'Count fetched successfully',
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

module.exports = getReclamationsCountController
