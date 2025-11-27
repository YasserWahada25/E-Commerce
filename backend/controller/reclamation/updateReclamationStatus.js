const reclamationModel = require('../../models/reclamationModel')
const ROLE = require('../../common/role')

async function updateReclamationStatusController(req, res) {
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

        const { reclamationId, status } = req.body

        // Validation
        if (!reclamationId || !status) {
            return res.status(400).json({
                message: 'Reclamation ID and status are required',
                error: true,
                success: false
            })
        }

        // Validate status value
        const validStatuses = ['new', 'seen', 'solved']
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid status value',
                error: true,
                success: false
            })
        }

        // Update reclamation
        const updatedReclamation = await reclamationModel.findByIdAndUpdate(
            reclamationId,
            { status },
            { new: true }
        )

        if (!updatedReclamation) {
            return res.status(404).json({
                message: 'Reclamation not found',
                error: true,
                success: false
            })
        }

        res.json({
            data: updatedReclamation,
            message: 'Status updated successfully',
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

module.exports = updateReclamationStatusController
