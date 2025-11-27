const express = require('express')

const router = express.Router()

const userSignUpController = require("../controller/user/userSignUp")
const userSignInController = require('../controller/user/userSignIn')
const userDetailsController = require('../controller/user/userDetails')
const authToken = require('../middleware/authToken')
const userLogout = require('../controller/user/userLogout')
const allUsers = require('../controller/user/allUsers')
const updateUser = require('../controller/user/updateUser')
const UploadProductController = require('../controller/product/uploadProduct')
const getProductController = require('../controller/product/getProduct')
const updateProductController = require('../controller/product/updateProduct')
const getCategoryProduct = require('../controller/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct')
const getProductDetails = require('../controller/product/getProductDetails')
const addToCartController = require('../controller/user/addToCartController')
const countAddToCartProduct = require('../controller/user/countAddToCartProduct')
const addToCartViewProduct  = require('../controller/user/addToCartViewProduct')
const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct')
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct')
const searchProduct = require('../controller/product/searchProduct')
const searchByTitle = require('../controller/product/searchByTitle')
const filterProductController = require('../controller/product/filterProduct')
const adminProfileController = require('../controller/user/adminProfile')
const userProfileController = require('../controller/user/userProfile')
const getCategoriesWithCount = require('../controller/product/getCategoriesWithCount')
const forgotPasswordController = require('../controller/user/forgotPassword')
const verifyResetCodeController = require('../controller/user/verifyResetCode')
const resetPasswordController = require('../controller/user/resetPassword')

const createReclamationController = require('../controller/reclamation/createReclamation')
const getAllReclamationsController = require('../controller/reclamation/getAllReclamations')
const getReclamationsCountController = require('../controller/reclamation/getReclamationsCount')
const updateReclamationStatusController = require('../controller/reclamation/updateReclamationStatus')

const getAdminStatsController = require('../controller/admin/getStats')

const upload = require('../middleware/multer')

router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)
router.get("/user-details",authToken,userDetailsController)
router.get("/userLogout",userLogout)

//password reset
router.post("/forgot-password",forgotPasswordController)
router.post("/verify-reset-code",verifyResetCodeController)
router.post("/reset-password",resetPasswordController)

//admin panel 
router.get("/all-user",authToken,allUsers)
router.post("/update-user",authToken,updateUser)
router.get("/admin-profile",authToken,adminProfileController)
router.get("/admin/stats",authToken,getAdminStatsController)

//user profile
router.get("/user-profile",authToken,userProfileController)

//product
router.post("/upload-product",authToken,upload.array('productImage'),UploadProductController)
router.get("/get-product",getProductController)
router.post("/update-product",authToken,updateProductController)
router.get("/get-categoryProduct",getCategoryProduct)
router.get("/categories-with-count",getCategoriesWithCount)
router.post("/category-product",getCategoryWiseProduct)
router.post("/product-details",getProductDetails)
router.get("/search",searchProduct)
router.get("/search-by-title",searchByTitle)
router.post("/filter-product",filterProductController)

//user add to cart
router.post("/addtocart",authToken,addToCartController)
router.get("/countAddToCartProduct",authToken,countAddToCartProduct)
router.get("/view-card-product",authToken,addToCartViewProduct)
router.post("/update-cart-product",authToken,updateAddToCartProduct)
router.post("/delete-cart-product",authToken,deleteAddToCartProduct)

//reclamations
router.post("/reclamations",authToken,createReclamationController)
router.get("/admin/reclamations",authToken,getAllReclamationsController)
router.get("/admin/reclamations/count",authToken,getReclamationsCountController)
router.put("/admin/reclamations/status",authToken,updateReclamationStatusController)

module.exports = router