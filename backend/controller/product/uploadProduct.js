const uploadProductPermission = require("../../helpers/permission")
const productModel = require("../../models/productModel")

async function UploadProductController(req,res){
    try{
        const sessionUserId = req.userId

        if(!uploadProductPermission(sessionUserId)){
            throw new Error("Permission denied")
        }
    
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => `${process.env.BACKEND_URL}/uploads/${file.filename}`);
        }

        const productData = {
            ...req.body,
            productImage: imageUrls
        }

        const uploadProduct = new productModel(productData)
        const saveProduct = await uploadProduct.save()

        res.status(201).json({
            message : "Product upload successfully",
            error : false,
            success : true,
            data : saveProduct
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = UploadProductController