import SummaryApi from "../common"
import { toast } from 'react-toastify'

const addToCart = async(e, id, user, navigate) => {
    e?.stopPropagation()
    e?.preventDefault()

    // Check if user is logged in
    if (!user || !user._id) {
        toast.error("Please login to continue")
        
        // Store current page URL for redirect after login
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
        
        // Redirect to login page
        if (navigate) {
            navigate('/login')
        }
        
        return {
            success: false,
            error: true,
            message: "Please login to continue"
        }
    }

    const response = await fetch(SummaryApi.addToCartProduct.url,{
        method : SummaryApi.addToCartProduct.method,
        credentials : 'include',
        headers : {
            "content-type" : 'application/json'
        },
        body : JSON.stringify(
            { productId : id }
        )
    })

    const responseData = await response.json()

    if(responseData.success){
        toast.success(responseData.message)
    }

    if(responseData.error){
        toast.error(responseData.message)
    }


    return responseData

}


export default addToCart