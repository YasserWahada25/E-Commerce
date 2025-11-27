import React, { useEffect, useState } from 'react'
import UploadProduct from '../components/UploadProduct'
import SummaryApi from '../common'
import AdminModernProductCard from '../components/AdminModernProductCard'

const AllProducts = () => {
  const [openUploadProduct,setOpenUploadProduct] = useState(false)
  const [allProduct,setAllProduct] = useState([])

  const fetchAllProduct = async() =>{
    const response = await fetch(SummaryApi.allProduct.url)
    const dataResponse = await response.json()

    console.log("product data",dataResponse)

    setAllProduct(dataResponse?.data || [])
  }

  useEffect(()=>{
    fetchAllProduct()
  },[])
  
  return (
    <div className='min-h-full'>
        {/* Header */}
        <div className='bg-white rounded-xl shadow-sm p-6 mb-6 flex justify-between items-center'>
            <div>
              <h2 className='font-bold text-2xl text-gray-900'>All Products</h2>
              <p className='text-sm text-gray-500 mt-1'>Manage your product inventory</p>
            </div>
            <button 
              className='btn-primary' 
              onClick={()=>setOpenUploadProduct(true)}
            >
              Upload Product
            </button>
        </div>

        {/* Product Grid */}
        <div className='product-grid'>
          {
            allProduct.map((product,index)=>{
              return(
                <AdminModernProductCard 
                  product={product} 
                  key={index+"allProduct"} 
                  fetchData={fetchAllProduct}
                />
              )
            })
          }
        </div>

        {/* Upload Product Modal */}
        {
          openUploadProduct && (
            <UploadProduct onClose={()=>setOpenUploadProduct(false)} fetchData={fetchAllProduct}/>
          )
        }
    </div>
  )
}

export default AllProducts