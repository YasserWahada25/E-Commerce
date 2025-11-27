import React, { useEffect, useState } from 'react'
import ModernProductCard from '../components/ModernProductCard'
import SummaryApi from '../common'

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)
  const [sortBy, setSortBy] = useState('featured')

  const filters = [
    'Headphone Type',
    'Price',
    'Review',
    'Color',
    'Material',
    'Offer',
    'All Filters'
  ]

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch(SummaryApi.allProduct.url)
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Apply sorting when sortBy changes
  useEffect(() => {
    if (products.length === 0) return

    let sortedProducts = [...products]

    switch (sortBy) {
      case 'price-low':
        sortedProducts.sort((a, b) => a.sellingPrice - b.sellingPrice)
        break
      case 'price-high':
        sortedProducts.sort((a, b) => b.sellingPrice - a.sellingPrice)
        break
      case 'rating':
        sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'newest':
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'featured':
      default:
        // Keep original order
        break
    }

    setProducts(sortedProducts)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy])

  return (
    <div className='min-h-screen bg-gray-50 pt-16 sm:pt-20'>
      {/* Hero Banner */}
      <div className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white'>
        <div className='container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16'>
          <div className='flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8'>
            {/* Left Content */}
            <div className='flex-1 space-y-4 sm:space-y-6 text-center lg:text-left'>
              <div className='inline-block'>
                <span className='bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold'>
                  🎉 Special Offer
                </span>
              </div>
              <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'>
                Discover Amazing
                <br />
                <span className='text-yellow-300'>Products</span>
              </h1>
              <p className='text-sm sm:text-base lg:text-lg text-indigo-100 max-w-md mx-auto lg:mx-0'>
                Shop the latest trends with exclusive deals and fast delivery. Your perfect product is just a click away!
              </p>
              <button className='bg-white text-indigo-600 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-sm sm:text-base lg:text-lg hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1'>
                Buy Now
              </button>
            </div>

            {/* Right Image */}
            <div className='flex-1 flex justify-center w-full lg:w-auto'>
              <div className='relative w-full max-w-xs sm:max-w-sm lg:max-w-md'>
                <div className='absolute inset-0 bg-white opacity-10 rounded-full blur-3xl'></div>
                <div className='relative bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white border-opacity-20'>
                  <img
                    src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'
                    alt='Featured Product'
                    className='w-full h-auto object-contain drop-shadow-2xl'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className='bg-white border-b border-gray-200 sticky top-16 sm:top-20 z-30 shadow-sm'>
        <div className='container mx-auto px-3 sm:px-6 py-3 sm:py-4'>
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4'>
            {/* Filter Chips - Horizontal scroll on mobile */}
            <div className='flex items-center gap-2 sm:gap-3 flex-1 overflow-x-auto scrollbar-none pb-2 sm:pb-0'>
              {filters.map((filter, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFilter(filter)}
                  className={`filter-chip flex-shrink-0 text-xs sm:text-sm ${activeFilter === filter ? 'active' : ''}`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className='flex items-center gap-2 w-full sm:w-auto'>
              <span className='text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0'>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='input-modern py-2 px-3 sm:px-4 cursor-pointer text-xs sm:text-sm font-medium flex-1 sm:flex-initial'
              >
                <option value='featured'>Featured</option>
                <option value='price-low'>Price: Low to High</option>
                <option value='price-high'>Price: High to Low</option>
                <option value='rating'>Top Rated</option>
                <option value='newest'>Newest</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className='container mx-auto px-3 sm:px-6 py-6 sm:py-8'>
        <div className='mb-4 sm:mb-6'>
          <h2 className='text-xl sm:text-2xl font-bold text-gray-900'>
            All Products
          </h2>
          <p className='text-sm sm:text-base text-gray-600 mt-1'>
            {products.length} products available
          </p>
        </div>

        {loading ? (
          <div className='product-grid'>
            {[...Array(12)].map((_, index) => (
              <div key={index} className='card-modern p-3 sm:p-4 animate-pulse'>
                <div className='bg-gray-200 h-48 sm:h-64 rounded-xl mb-3 sm:mb-4' />
                <div className='space-y-2 sm:space-y-3'>
                  <div className='bg-gray-200 h-3 sm:h-4 rounded w-1/2' />
                  <div className='bg-gray-200 h-4 sm:h-6 rounded w-3/4' />
                  <div className='bg-gray-200 h-3 sm:h-4 rounded w-full' />
                  <div className='bg-gray-200 h-3 sm:h-4 rounded w-2/3' />
                  <div className='bg-gray-200 h-8 sm:h-10 rounded-lg w-full' />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='product-grid'>
            {products.map((product, index) => (
              <ModernProductCard key={product._id || index} product={product} />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className='text-center py-12 sm:py-16'>
            <div className='text-4xl sm:text-6xl mb-3 sm:mb-4'>🛍️</div>
            <h3 className='text-xl sm:text-2xl font-bold text-gray-900 mb-2'>No products found</h3>
            <p className='text-sm sm:text-base text-gray-600'>Try adjusting your filters or check back later</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
