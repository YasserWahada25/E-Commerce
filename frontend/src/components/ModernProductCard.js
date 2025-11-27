import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaStar, FaRegHeart, FaHeart } from 'react-icons/fa'
import displayINRCurrency from '../helpers/displayCurrency'
import addToCart from '../helpers/addToCart'
import Context from '../context'

const ModernProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const { fetchUserAddToCart } = useContext(Context)
  const navigate = useNavigate()
  const user = useSelector(state => state?.user?.user)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await addToCart(e, product?._id, user, navigate)
    fetchUserAddToCart()
  }

  const toggleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  // Generate star rating
  const renderStars = () => {
    const rating = product?.rating || 4.5
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

  return (
    <Link 
      to={`/product/${product?._id}`} 
      className="card-modern group relative overflow-hidden bg-white p-3 sm:p-4 block"
    >
      {/* Favorite Icon */}
      <button
        onClick={toggleFavorite}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-1.5 sm:p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
      >
        {isFavorite ? (
          <FaHeart className="text-red-500 text-sm sm:text-base lg:text-lg" />
        ) : (
          <FaRegHeart className="text-gray-400 text-sm sm:text-base lg:text-lg hover:text-red-500 transition-colors" />
        )}
      </button>

      {/* Product Image */}
      <div className="relative h-48 sm:h-56 lg:h-64 flex items-center justify-center mb-3 sm:mb-4 bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden">
        <img
          src={product?.productImage?.[0]}
          alt={product?.productName}
          className="h-full w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-1.5 sm:space-y-2">
        {/* Brand Badge */}
        {product?.brandName && (
          <span className="badge badge-primary text-[10px] sm:text-xs">
            {product.brandName}
          </span>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {product?.productName}
        </h3>

        {/* Description */}
        <p className="hidden sm:block text-xs sm:text-sm text-gray-500 line-clamp-2 min-h-[2.5rem]">
          {product?.description || 'High quality product with excellent features'}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-0.5">
            {renderStars()}
          </div>
          <span className="text-xs sm:text-sm text-gray-600">
            ({product?.ratingCount || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
          <span className="text-lg sm:text-xl lg:text-2xl font-bold text-indigo-600">
            {displayINRCurrency(product?.sellingPrice)}
          </span>
          {product?.price && product?.price !== product?.sellingPrice && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              {displayINRCurrency(product?.price)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        {product?.stock > 0 ? (
          <button
            onClick={handleAddToCart}
            className='w-full btn-primary mt-3 sm:mt-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm font-semibold'
          >
            Add to Cart
          </button>
        ) : (
          <button
            disabled
            className='w-full mt-3 sm:mt-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm font-semibold bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-60'
          >
            SOLD OUT
          </button>
        )}
      </div>
    </Link>
  )
}

export default ModernProductCard
