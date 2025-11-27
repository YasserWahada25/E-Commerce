import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SummaryApi from '../common'
import { FaStar, FaMinus, FaPlus, FaTruck, FaUndo } from "react-icons/fa";
import displayINRCurrency from '../helpers/displayCurrency';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
    rating: 4.5,
    ratingCount: 0,
    colors: [],
    stock: 0
  })
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(null)

  const { fetchUserAddToCart } = useContext(Context)
  const navigate = useNavigate()

  const fetchProductDetails = async () => {
    setLoading(true)
    const response = await fetch(SummaryApi.productDetails.url, {
      method: SummaryApi.productDetails.method,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        productId: params?.id
      })
    })
    setLoading(false)
    const dataResponse = await response.json()

    setData(dataResponse?.data)
    setActiveImage(dataResponse?.data?.productImage[0])
    if (dataResponse?.data?.colors?.length > 0) {
      setSelectedColor(dataResponse?.data?.colors[0])
    }
  }

  useEffect(() => {
    fetchProductDetails()
  }, [params])

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id)
    fetchUserAddToCart()
  }

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id)
    fetchUserAddToCart()
    navigate("/cart")
  }

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  // Generate star rating
  const renderStars = () => {
    const rating = data?.rating || 4.5
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const stars = []

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-amber-400" />)
    }
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-amber-400 opacity-50" />)
    }
    while (stars.length < 5) {
      stars.push(<FaStar key={`empty-${stars.length}`} className="text-gray-300" />)
    }

    return stars
  }

  const colorMap = {
    'black': '#000000',
    'white': '#FFFFFF',
    'red': '#EF4444',
    'blue': '#3B82F6',
    'green': '#10B981',
    'yellow': '#F59E0B',
    'purple': '#A855F7',
    'pink': '#EC4899',
    'gray': '#6B7280',
    'silver': '#C0C0C0',
    'gold': '#FFD700'
  }

  return (
    <div className='min-h-screen bg-gray-50 pt-24 pb-12'>
      <div className='container mx-auto px-6'>
        {loading ? (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Image Skeleton */}
            <div className='space-y-4'>
              <div className='bg-gray-200 h-96 rounded-2xl animate-pulse' />
              <div className='flex gap-4'>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className='bg-gray-200 h-24 w-24 rounded-xl animate-pulse' />
                ))}
              </div>
            </div>
            {/* Info Skeleton */}
            <div className='space-y-4'>
              <div className='bg-gray-200 h-8 w-3/4 rounded animate-pulse' />
              <div className='bg-gray-200 h-6 w-1/2 rounded animate-pulse' />
              <div className='bg-gray-200 h-12 w-full rounded animate-pulse' />
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Left Side - Images */}
            <div className='space-y-4'>
              {/* Main Image */}
              <div className='card-modern p-6 bg-white'>
                <div className='h-96 flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden'>
                  <img
                    src={activeImage}
                    alt={data?.productName}
                    className='h-full w-full object-contain mix-blend-multiply'
                  />
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className='flex gap-4 overflow-x-auto scrollbar-none'>
                {data?.productImage?.map((imgURL, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(imgURL)}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === imgURL
                        ? 'border-indigo-600 shadow-lg'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <img
                      src={imgURL}
                      alt={`Product ${index + 1}`}
                      className='w-full h-full object-contain mix-blend-multiply bg-gray-50 p-2'
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side - Product Info */}
            <div className='space-y-6'>
              {/* Brand Badge */}
              {data?.brandName && (
                <span className='badge badge-primary'>
                  {data.brandName}
                </span>
              )}

              {/* Product Name */}
              <h1 className='text-4xl font-bold text-gray-900'>
                {data?.productName}
              </h1>

              {/* Subtitle */}
              <p className='text-lg text-gray-600'>
                {data?.category && `Premium ${data.category} - High Quality Product`}
              </p>

              {/* Rating */}
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-1'>
                  {renderStars()}
                </div>
                <span className='text-lg font-semibold text-gray-900'>
                  {data?.rating || 4.5}
                </span>
                <span className='text-gray-500'>
                  ({data?.ratingCount || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className='flex items-center gap-4 py-4 border-y border-gray-200'>
                <span className='text-4xl font-bold text-indigo-600'>
                  {displayINRCurrency(data.sellingPrice)}
                </span>
                {data?.price && data?.price !== data?.sellingPrice && (
                  <>
                    <span className='text-2xl text-gray-400 line-through'>
                      {displayINRCurrency(data.price)}
                    </span>
                    <span className='badge badge-success text-sm'>
                      {Math.round(((data.price - data.sellingPrice) / data.price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Color Selector */}
              {data?.colors && data.colors.length > 0 && (
                <div className='space-y-3'>
                  <h3 className='font-semibold text-gray-900'>Choose Color:</h3>
                  <div className='flex gap-3'>
                    {data.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? 'border-indigo-600 ring-2 ring-indigo-200'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{
                          backgroundColor: colorMap[color.toLowerCase()] || color
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className='space-y-3'>
                <h3 className='font-semibold text-gray-900'>Quantity:</h3>
                <div className='flex items-center gap-4'>
                  <div className='flex items-center border-2 border-gray-300 rounded-lg overflow-hidden'>
                    <button
                      onClick={decrementQuantity}
                      className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors'
                    >
                      <FaMinus className='text-gray-600' />
                    </button>
                    <span className='px-6 py-2 font-semibold text-lg'>{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className='px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors'
                    >
                      <FaPlus className='text-gray-600' />
                    </button>
                  </div>
                  {data?.stock > 0 && (
                    <span className='text-sm text-gray-600'>
                      {data.stock} items in stock
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-4 pt-4'>
                <button
                  onClick={(e) => handleBuyProduct(e, data?._id)}
                  className='flex-1 btn-primary py-4 text-lg'
                >
                  Buy Now
                </button>
                <button
                  onClick={(e) => handleAddToCart(e, data?._id)}
                  className='flex-1 btn-secondary py-4 text-lg'
                >
                  Add to Cart
                </button>
              </div>

              {/* Delivery Info */}
              <div className='space-y-3 pt-6'>
                <div className='flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-200'>
                  <FaTruck className='text-green-600 text-2xl mt-1' />
                  <div>
                    <h4 className='font-semibold text-gray-900'>Free Delivery</h4>
                    <p className='text-sm text-gray-600 mt-1'>
                      Free standard shipping on orders over 500 DT
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200'>
                  <FaUndo className='text-blue-600 text-2xl mt-1' />
                  <div>
                    <h4 className='font-semibold text-gray-900'>Return Delivery</h4>
                    <p className='text-sm text-gray-600 mt-1'>
                      Free 30-day return policy. No questions asked.
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className='pt-6 border-t border-gray-200'>
                <h3 className='font-semibold text-gray-900 text-lg mb-3'>Description</h3>
                <p className='text-gray-600 leading-relaxed'>
                  {data?.description || 'High-quality product with excellent features and durability. Perfect for everyday use.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetails