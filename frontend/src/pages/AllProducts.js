import React, { useEffect, useState } from 'react'
import UploadProduct from '../components/UploadProduct'
import SummaryApi from '../common'
import AdminModernProductCard from '../components/AdminModernProductCard'
import productCategory from '../helpers/productCategory'

const AllProducts = () => {
  const [openUploadProduct,setOpenUploadProduct] = useState(false)
  const [allProduct,setAllProduct] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')

  const fetchAllProduct = async(category = '') => {
    let url = SummaryApi.allProduct.url
    if (category && category !== '') {
      url += `?category=${category}`
    }
    
    const response = await fetch(url)
    const dataResponse = await response.json()

    console.log("product data", dataResponse)

    setAllProduct(dataResponse?.data || [])
  }

  useEffect(() => {
    fetchAllProduct(selectedCategory)
  }, [selectedCategory])
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  return (
    <div className='min-h-full'>
        {/* Header */}
        <div className='bg-white rounded-xl shadow-sm p-6 mb-6'>
            <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4'>
              <div>
                <h2 className='font-bold text-2xl text-gray-900'>All Products</h2>
                <p className='text-sm text-gray-500 mt-1'>Manage your product inventory</p>
              </div>
              
              <div className='flex flex-col sm:flex-row gap-3 items-stretch sm:items-center'>
                {/* Category Filter */}
                <select 
                  value={selectedCategory} 
                  onChange={handleCategoryChange}
                  className='input-modern min-w-[200px]'
                >
                  <option value=''>All Categories</option>
                  {
                    productCategory.map((category, index) => (
                      <option value={category.value} key={category.value + index}>
                        {category.label}
                      </option>
                    ))
                  }
                </select>

                <button 
                  className='btn-primary whitespace-nowrap' 
                  onClick={() => setOpenUploadProduct(true)}
                >
                  Upload Product
                </button>
              </div>
            </div>
        </div>

        {/* Product Grid */}
        <div className='product-grid'>
          {
            allProduct.map((product,index) => {
              return(
                <AdminModernProductCard 
                  product={product} 
                  key={index+"allProduct"} 
                  fetchData={() => fetchAllProduct(selectedCategory)}
                />
              )
            })
          }
        </div>

        {/* Upload Product Modal */}
        {
          openUploadProduct && (
            <UploadProduct onClose={() => setOpenUploadProduct(false)} fetchData={() => fetchAllProduct(selectedCategory)}/>
          )
        }
    </div>
  )
}

export default AllProducts