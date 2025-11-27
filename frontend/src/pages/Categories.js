import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SummaryApi from '../common'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await fetch(SummaryApi.categoriesWithCount.url)
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className='min-h-screen bg-gray-50 pt-20 sm:pt-24'>
      <div className='container mx-auto px-3 sm:px-6 py-6 sm:py-8'>
        {/* Header */}
        <div className='mb-6 sm:mb-8'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2'>
            Catégories de produits
          </h1>
          <p className='text-sm sm:text-base text-gray-600'>
            Explorez nos catégories et trouvez ce que vous cherchez
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6'>
            {[...Array(8)].map((_, index) => (
              <div key={index} className='card-modern p-4 sm:p-6 animate-pulse'>
                <div className='bg-gray-200 h-5 sm:h-6 rounded w-3/4 mb-2 sm:mb-3' />
                <div className='bg-gray-200 h-3 sm:h-4 rounded w-1/2' />
              </div>
            ))}
          </div>
        ) : (
          <>
            {categories.length > 0 ? (
              <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6'>
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    to={`/product-category?category=${category.category}`}
                    className='group'
                  >
                    <div className='card-modern p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-indigo-50'>
                      <div className='flex flex-col'>
                        {/* Category Name */}
                        <h3 className='text-base sm:text-lg lg:text-xl font-bold text-gray-900 capitalize mb-1 sm:mb-2 group-hover:text-indigo-600 transition-colors'>
                          {category.category}
                        </h3>
                        
                        {/* Item Count */}
                        <p className='text-xs sm:text-sm text-gray-600'>
                          {category.count} {category.count === 1 ? 'article' : 'articles'}
                        </p>
                      </div>

                      {/* Hover Arrow */}
                      <div className='mt-3 sm:mt-4 flex items-center text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity'>
                        <span className='text-xs sm:text-sm font-medium'>Voir les produits</span>
                        <svg 
                          className='w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform' 
                          fill='none' 
                          stroke='currentColor' 
                          viewBox='0 0 24 24'
                        >
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className='text-center py-12 sm:py-16'>
                <div className='text-4xl sm:text-6xl mb-3 sm:mb-4'>📦</div>
                <h3 className='text-xl sm:text-2xl font-bold text-gray-900 mb-2'>
                  Aucune catégorie disponible
                </h3>
                <p className='text-sm sm:text-base text-gray-600'>
                  Les catégories seront affichées ici une fois ajoutées
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Categories

