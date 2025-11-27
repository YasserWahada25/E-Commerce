const userModel = require("../../models/userModel")
const bcrypt = require('bcryptjs')
const ROLE = require("../../common/role")


async function userSignUpController(req, res) {
    try {
        const { email, password, name } = req.body

        console.log("Signup Request Body:", req.body);

        const user = await userModel.findOne({ email })

        console.log("Existing user check:", user)

        if (user) {
            throw new Error("Already user exits.")
        }

        if (!email) {
            throw new Error("Please provide email")
        }
        if (!password) {
            throw new Error("Please provide password")
        }
        if (!name) {
            throw new Error("Please provide name")
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password, salt);

        if (!hashPassword) {
            throw new Error("Something is wrong")
        }

        const payload = {
            ...req.body,
            role: ROLE.GENERAL,
            password: hashPassword
        }

        const userData = new userModel(payload)

        console.log("Attempting to save user...");
        const saveUser = await userData.save()
        console.log("User saved successfully:", saveUser);

        res.status(201).json({
            data: saveUser,
            success: true,
            error: false,
            message: "User created Successfully!"
        })


    } catch (err) {
        console.error("Signup Error:", err);
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        })
    }
}

module.exports = userSignUpController