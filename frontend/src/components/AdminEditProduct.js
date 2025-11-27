import React, { useState } from 'react'
import { CgClose } from "react-icons/cg";
import productCategory from '../helpers/productCategory';
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import {toast} from 'react-toastify'

const AdminEditProduct = ({
    onClose,
    productData,
    fetchdata
  }) => {

  const [data,setData] = useState({
    ...productData,
    productName : productData?.productName,
    brandName : productData?.brandName,
    category : productData?.category,
    productImage : productData?.productImage || [],
    description : productData?.description,
    price : productData?.price,
    sellingPrice : productData?.sellingPrice,
    stock : productData?.stock || 0
  })
  const [openFullScreenImage,setOpenFullScreenImage] = useState(false)
  const [fullScreenImage,setFullScreenImage] = useState("")


  const handleOnChange = (e)=>{
      const { name, value} = e.target

      setData((preve)=>{
        return{
          ...preve,
          [name]  : value
        }
      })
  }

  const handleUploadProduct = async(e) => {
    const file = e.target.files[0]
    const uploadImageCloudinary = await uploadImage(file)

    setData((preve)=>{
      return{
        ...preve,
        productImage : [ ...preve.productImage, uploadImageCloudinary.url]
      }
    })
  }

  const handleDeleteProductImage = async(index)=>{
    console.log("image index",index)
    
    const newProductImage = [...data.productImage]
    newProductImage.splice(index,1)

    setData((preve)=>{
      return{
        ...preve,
        productImage : [...newProductImage]
      }
    })
    
  }


  {/**upload product */}
  const handleSubmit = async(e) =>{
    e.preventDefault()
    
    const response = await fetch(SummaryApi.updateProduct.url,{
      method : SummaryApi.updateProduct.method,
      credentials : 'include',
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify(data)
    })

    const responseData = await response.json()

    if(responseData.success){
        toast.success(responseData?.message)
        onClose()
        fetchdata()
    }


    if(responseData.error){
      toast.error(responseData?.message)
    }
  

  }

  return (
    <div className='fixed w-full h-full bg-slate-900 bg-opacity-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 p-4'>
      <div className='bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl'>
            
            {/* Header */}
            <div className='flex justify-between items-center p-6 border-b border-gray-200'>
                <div>
                  <h2 className='font-bold text-2xl text-gray-900'>Edit Product</h2>
                  <p className='text-sm text-gray-500 mt-1'>Update product information</p>
                </div>
                <button 
                  className='w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-red-600 transition-all' 
                  onClick={onClose}
                >
                    <CgClose className='text-2xl'/>
                </button>
            </div>

          {/* Form */}
          <form className='flex-1 overflow-y-auto p-6 space-y-4' onSubmit={handleSubmit}>
            <div>
              <label htmlFor='productName' className='block text-sm font-semibold text-gray-700 mb-2'>Product Name</label>
              <input 
                type='text' 
                id='productName' 
                placeholder='Enter product name' 
                name='productName'
                value={data.productName} 
                onChange={handleOnChange}
                className='input-modern w-full'
                required
              />
            </div>

            <div>
              <label htmlFor='brandName' className='block text-sm font-semibold text-gray-700 mb-2'>Brand Name</label>
              <input 
                type='text' 
                id='brandName' 
                placeholder='Enter brand name' 
                value={data.brandName} 
                name='brandName'
                onChange={handleOnChange}
                className='input-modern w-full'
                required
              />
            </div>

            <div>
              <label htmlFor='category' className='block text-sm font-semibold text-gray-700 mb-2'>Category</label>
              <select 
                required 
                value={data.category} 
                name='category' 
                onChange={handleOnChange} 
                className='input-modern w-full'
              >
                  <option value={""}>Select Category</option>
                  {
                    productCategory.map((el,index)=>{
                      return(
                        <option value={el.value} key={el.value+index}>{el.label}</option>
                      )
                    })
                  }
              </select>
            </div>

            <div>
              <label htmlFor='productImage' className='block text-sm font-semibold text-gray-700 mb-2'>Product Images</label>
              <label htmlFor='uploadImageInput'>
                <div className='border-2 border-dashed border-gray-300 rounded-xl h-40 w-full flex justify-center items-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all'>
                  <div className='text-gray-500 flex justify-center items-center flex-col gap-2'>
                    <FaCloudUploadAlt className='text-5xl text-indigo-400'/>
                    <p className='text-sm font-medium'>Click to upload product images</p>
                    <p className='text-xs text-gray-400'>PNG, JPG, GIF up to 5MB</p>
                    <input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadProduct}/>
                  </div>
                </div>
              </label> 
              
              {/* Image Previews */}
              <div className='mt-4'>
                  {
                    data?.productImage[0] ? (
                        <div className='flex items-center gap-3 flex-wrap'>
                            {
                              data.productImage.map((el,index)=>{
                                return(
                                  <div key={index} className='relative group'>
                                      <img 
                                        src={el} 
                                        alt={`Product ${index + 1}`} 
                                        className='w-24 h-24 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-indigo-400 transition-all'  
                                        onClick={()=>{
                                          setOpenFullScreenImage(true)
                                          setFullScreenImage(el)
                                        }}
                                      />
                                      <button 
                                        type='button'
                                        className='absolute -top-2 -right-2 p-1.5 text-white bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-md' 
                                        onClick={()=>handleDeleteProductImage(index)}
                                      >
                                        <MdDelete className='text-sm'/>  
                                      </button>
                                  </div>
                                )
                              })
                            }
                        </div>
                    ) : (
                      <p className='text-red-500 text-xs mt-2'>*Please upload at least one product image</p>
                    )
                  }
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label htmlFor='price' className='block text-sm font-semibold text-gray-700 mb-2'>Price</label>
                <input 
                  type='number' 
                  id='price' 
                  placeholder='Enter price' 
                  value={data.price} 
                  name='price'
                  onChange={handleOnChange}
                  className='input-modern w-full'
                  required
                />
              </div>

              <div>
                <label htmlFor='sellingPrice' className='block text-sm font-semibold text-gray-700 mb-2'>Selling Price</label>
                <input 
                  type='number' 
                  id='sellingPrice' 
                  placeholder='Enter selling price' 
                  value={data.sellingPrice} 
                  name='sellingPrice'
                  onChange={handleOnChange}
                  className='input-modern w-full'
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor='stock' className='block text-sm font-semibold text-gray-700 mb-2'>Quantity (Stock)</label>
              <input 
                type='number' 
                id='stock' 
                placeholder='Enter quantity in stock' 
                value={data.stock} 
                name='stock'
                onChange={handleOnChange}
                className='input-modern w-full'
                min='0'
                required
              />
            </div>

            <div>
              <label htmlFor='description' className='block text-sm font-semibold text-gray-700 mb-2'>Description</label>
              <textarea 
                className='input-modern w-full resize-none' 
                placeholder='Enter product description' 
                rows={4} 
                onChange={handleOnChange} 
                name='description'
                value={data.description}
              >
              </textarea>
            </div>

            {/* Submit Button */}
            <div className='pt-4'>
              <button type='submit' className='btn-primary w-full py-3'>
                Update Product
              </button>
            </div>
          </form>
      </div>

      {/* Display Image Full Screen */}
      {
        openFullScreenImage && (
          <DisplayImage onClose={()=>setOpenFullScreenImage(false)} imgUrl={fullScreenImage}/>
        )
      }

    </div>
  )
}

export default AdminEditProduct