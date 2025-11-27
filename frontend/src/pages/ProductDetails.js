import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SummaryApi from '../common'
import { FaStar, FaMinus, FaPlus, FaTruck, FaUndo } from "react-icons/fa";
import displayINRCurrency from '../helpers/displayCurrency';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import { toast } from 'react-toastify';

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
  const user = useSelector(state => state?.user?.user)

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
    if (!user || !user._id) {
      toast.error("Please login to continue")
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
      navigate('/login')
      return
    }

    await addToCart(e, id, user, navigate)
    fetchUserAddToCart()
  }

  const handleBuyProduct = async (e, id) => {
    if (!user || !user._id) {
      toast.error("Please login to continue")
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
      navigate('/login')
      return
    }

    await addToCart(e, id, user, navigate)
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
      stars.push(<FaStar key={i} className="text-amber-400 text-xs sm:text-sm" />)
    }
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-amber-400 opacity-50 text-xs sm:text-sm" />)
    }
    while (stars.length < 5) {
      stars.push(<FaStar key={`empty-${stars.length}`} className="text-gray-300 text-xs sm:text-sm" />)
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
    <div className='min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-8 sm:pb-12'>
      <div className='container mx-auto px-3 sm:px-6'>
        {loading ? (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12'>
            {/* Image Skeleton */}
            <div className='space-y-3 sm:space-y-4'>
              <div className='bg-gray-200 h-64 sm:h-80 lg:h-96 rounded-2xl animate-pulse' />
              <div className='flex gap-2 sm:gap-4'>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className='bg-gray-200 h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 rounded-xl animate-pulse' />
                ))}
              </div>
            </div>
            {/* Info Skeleton */}
            <div className='space-y-3 sm:space-y-4'>
              <div className='bg-gray-200 h-6 sm:h-8 w-3/4 rounded animate-pulse' />
              <div className='bg-gray-200 h-4 sm:h-6 w-1/2 rounded animate-pulse' />
              <div className='bg-gray-200 h-10 sm:h-12 w-full rounded animate-pulse' />
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12'>
            {/* Left Side - Images */}
            <div className='space-y-3 sm:space-y-4'>
              {/* Main Image */}
              <div className='card-modern p-4 sm:p-6 bg-white'>
                <div className='h-64 sm:h-80 lg:h-96 flex items-center justify-center bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden'>
                  <img
                    src={activeImage}
                    alt={data?.productName}
                    className='h-full w-full object-contain mix-blend-multiply'
                  />
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className='flex gap-2 sm:gap-4 overflow-x-auto scrollbar-none pb-2'>
                {data?.productImage?.map((imgURL, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(imgURL)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === imgURL
                        ? 'border-indigo-600 shadow-lg'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <img
                      src={imgURL}
                      alt={`Product ${index + 1}`}
                      className='w-full h-full object-contain mix-blend-multiply bg-gray-50 p-1 sm:p-2'
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side - Product Info */}
            <div className='space-y-4 sm:space-y-6'>
              {/* Brand Badge */}
              {data?.brandName && (
                <span className='badge badge-primary text-xs sm:text-sm'>
                  {data.brandName}
                </span>
              )}

              {/* Product Name */}
              <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900'>
                {data?.productName}
              </h1>

              {/* Subtitle */}
              <p className='text-sm sm:text-base lg:text-lg text-gray-600'>
                {data?.category && `Premium ${data.category} - High Quality Product`}
              </p>

              {/* Rating */}
              <div className='flex items-center gap-2 sm:gap-3'>
                <div className='flex items-center gap-0.5 sm:gap-1'>
                  {renderStars()}
                </div>
                <span className='text-sm sm:text-base lg:text-lg font-semibold text-gray-900'>
                  {data?.rating || 4.5}
                </span>
                <span className='text-xs sm:text-sm text-gray-500'>
                  ({data?.ratingCount || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className='flex items-center gap-2 sm:gap-3 lg:gap-4 py-3 sm:py-4 border-y border-gray-200'>
                <span className='text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-600'>
                  {displayINRCurrency(data.sellingPrice)}
                </span>
                {data?.price && data?.price !== data?.sellingPrice && (
                  <>
                    <span className='text-lg sm:text-xl lg:text-2xl text-gray-400 line-through'>
                      {displayINRCurrency(data.price)}
                    </span>
                    <span className='badge badge-success text-xs sm:text-sm'>
                      {Math.round(((data.price - data.sellingPrice) / data.price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Color Selector */}
              {data?.colors && data.colors.length > 0 && (
                <div className='space-y-2 sm:space-y-3'>
                  <h3 className='font-semibold text-sm sm:text-base text-gray-900'>Choose Color:</h3>
                  <div className='flex gap-2 sm:gap-3'>
                    {data.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${
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
              <div className='space-y-2 sm:space-y-3'>
                <h3 className='font-semibold text-sm sm:text-base text-gray-900'>Quantity:</h3>
                <div className='flex items-center gap-3 sm:gap-4'>
                  <div className='flex items-center border-2 border-gray-300 rounded-lg overflow-hidden'>
                    <button
                      onClick={decrementQuantity}
                      className='px-3 py-2 sm:px-4 bg-gray-100 hover:bg-gray-200 transition-colors'
                      disabled={data?.stock === 0}
                    >
                      <FaMinus className='text-gray-600 text-xs sm:text-sm' />
                    </button>
                    <span className='px-4 sm:px-6 py-2 font-semibold text-base sm:text-lg'>{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className='px-3 py-2 sm:px-4 bg-gray-100 hover:bg-gray-200 transition-colors'
                      disabled={data?.stock === 0}
                    >
                      <FaPlus className='text-gray-600 text-xs sm:text-sm' />
                    </button>
                  </div>
                  {data?.stock > 0 ? (
                    <span className='text-xs sm:text-sm text-gray-600'>
                      {data.stock} items in stock
                    </span>
                  ) : (
                    <span className='text-xs sm:text-sm text-red-600 font-semibold'>
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4'>
                {data?.stock > 0 ? (
                  <>
                    <button
                      onClick={(e) => handleBuyProduct(e, data?._id)}
                      className='flex-1 btn-primary py-3 sm:py-4 text-sm sm:text-base lg:text-lg'
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(e, data?._id)}
                      className='flex-1 btn-secondary py-3 sm:py-4 text-sm sm:text-base lg:text-lg'
                    >
                      Add to Cart
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className='flex-1 py-3 sm:py-4 text-sm sm:text-base lg:text-lg bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-60 font-semibold'
                  >
                    SOLD OUT
                  </button>
                )}
              </div>

              {/* Delivery Info */}
              <div className='space-y-2 sm:space-y-3 pt-4 sm:pt-6'>
                <div className='flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-green-50 rounded-xl border border-green-200'>
                  <FaTruck className='text-green-600 text-lg sm:text-xl lg:text-2xl mt-0.5 sm:mt-1 flex-shrink-0' />
                  <div>
                    <h4 className='font-semibold text-sm sm:text-base text-gray-900'>Free Delivery</h4>
                    <p className='text-xs sm:text-sm text-gray-600 mt-1'>
                      Free standard shipping on orders over 500 DT
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200'>
                  <FaUndo className='text-blue-600 text-lg sm:text-xl lg:text-2xl mt-0.5 sm:mt-1 flex-shrink-0' />
                  <div>
                    <h4 className='font-semibold text-sm sm:text-base text-gray-900'>Return Delivery</h4>
                    <p className='text-xs sm:text-sm text-gray-600 mt-1'>
                      Free 30-day return policy. No questions asked.
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className='pt-4 sm:pt-6 border-t border-gray-200'>
                <h3 className='font-semibold text-gray-900 text-base sm:text-lg mb-2 sm:mb-3'>Description</h3>
                <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>
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
