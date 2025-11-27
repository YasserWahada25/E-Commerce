const productModel = require("../../models/productModel")

const getCategoriesWithCount = async(req,res)=>{
    try{
        // Get all distinct categories
        const categories = await productModel.distinct("category")

        // Build category data with count and image
        const categoryData = []

        for(const category of categories){
            // Count products in this category
            const count = await productModel.countDocuments({ category })
            
            // Get first product from this category for the image
            const product = await productModel.findOne({ category })

            if(product){
                categoryData.push({
                    category: category,
                    image: product.productImage[0] || '',
                    count: count
                })
            }
        }

        res.json({
            message : "Categories with count",
            data : categoryData,
            success : true,
            error : false
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = getCategoriesWithCount
