const productModel = require("../../models/productModel")

const getProductController = async(req,res)=>{
    try{
        const { category } = req.query
        
        let query = {}
        if (category && category !== '') {
            query.category = category
        }

        const allProduct = await productModel.find(query).sort({ createdAt : -1 })

        res.json({
            message : "All Product",
            success : true,
            error : false,
            data : allProduct
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }

}

module.exports = getProductController