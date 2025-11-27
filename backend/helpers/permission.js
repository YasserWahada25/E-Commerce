const userModel = require("../models/userModel")
const ROLE = require("../common/role")

const uploadProductPermission = async(userId) => {
    const user = await userModel.findById(userId)

    if(user.role === ROLE.ADMIN){
        return true
    }

    return false
}


module.exports = uploadProductPermission