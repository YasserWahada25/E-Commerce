const productModel = require("../../models/productModel")

const searchByTitle = async(req,res)=>{
    try{
        const title = req.query.title 

        if(!title || title.trim() === ''){
            return res.json({
                data: [],
                message: "Search title is required",
                error: false,
                success: true
            })
        }

        // Recherche insensible à la casse par titre uniquement
        // Utilisation de $regex avec $options pour une recherche partielle
        const products = await productModel.find({
            productName: { 
                $regex: title, 
                $options: 'i'  // i = insensible à la casse
            }
        }).select('_id productName sellingPrice productImage').limit(20)

        console.log(`🔍 Search "${title}" - ${products.length} product(s) found`)

        res.json({
            data: products,
            message: `${products.length} product(s) found`,
            error: false,
            success: true
        })
    }catch(err){
        console.error('❌ Search error:', err.message)
        res.json({
            message: err.message || err,
            error: true,
            success: false,
            data: []
        })
    }
}

module.exports = searchByTitle

