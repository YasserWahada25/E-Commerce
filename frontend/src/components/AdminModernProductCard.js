import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaStar, MdModeEdit } from 'react-icons/fa'
import { MdModeEdit as MdEdit } from 'react-icons/md'
import displayINRCurrency from '../helpers/displayCurrency'
import AdminEditProduct from './AdminEditProduct'

const AdminModernProductCard = ({ product, fetchData }) => {
  const [editProduct, setEditProduct] = useState(false)

  const handleEditClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setEditProduct(true)
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
    <>
      <Link 
        to={`/product/${product?._id}`} 
        className="card-modern group relative overflow-hidden bg-white p-4 block"
      >
        {/* Edit Icon */}
        <button
          onClick={handleEditClick}
          className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all hover:bg-indigo-600 hover:text-white"
        >
          <MdEdit className="text-lg" />
        </button>

        {/* Product Image */}
        <div className="relative h-64 flex items-center justify-center mb-4 bg-gray-50 rounded-xl overflow-hidden">
          <img
            src={product?.productImage?.[0]}
            alt={product?.productName}
            className="h-full w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          {/* Brand Badge */}
          {product?.brandName && (
            <span className="badge badge-primary text-xs">
              {product.brandName}
            </span>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-base text-gray-900 line-clamp-2 min-h-[3rem]">
            {product?.productName}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-2 min-h-[2.5rem]">
            {product?.description || 'High quality product with excellent features'}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {renderStars()}
            </div>
            <span className="text-sm text-gray-600">
              ({product?.ratingCount || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-2xl font-bold text-indigo-600">
              {displayINRCurrency(product?.sellingPrice)}
            </span>
            {product?.price && product?.price !== product?.sellingPrice && (
              <span className="text-sm text-gray-400 line-through">
                {displayINRCurrency(product?.price)}
              </span>
            )}
          </div>

          {/* Category Badge */}
          <div className="pt-2">
            <span className="badge badge-success text-xs">
              {product?.category}
            </span>
          </div>
        </div>
      </Link>

      {/* Edit Product Modal */}
      {editProduct && (
        <AdminEditProduct 
          productData={product} 
          onClose={() => setEditProduct(false)} 
          fetchdata={fetchData}
        />
      )}
    </>
  )
}

export default AdminModernProductCard
