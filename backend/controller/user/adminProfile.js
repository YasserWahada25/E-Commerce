const userModel = require("../../models/userModel")

async function adminProfileController(req,res){
    try{
        const user = await userModel.findById(req.userId)

        if(user.role !== 'ADMIN'){
             throw new Error("Permission denied")
        }

        res.status(200).json({
            data : user,
            error : false,
            success : true,
            message : "Admin Profile Details"
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = adminProfileController
