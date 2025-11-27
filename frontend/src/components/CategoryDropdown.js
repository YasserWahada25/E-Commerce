import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SummaryApi from '../common'

const CategoryDropdown = ({ isOpen, onClose }) => {
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
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div className="absolute left-0 right-0 top-full mt-2 z-50 flex justify-center px-4 slide-down">
        <div className="card-modern max-w-4xl w-full p-6 bg-white">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Popular Categories</h3>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-32 rounded-xl mb-3" />
                  <div className="bg-gray-200 h-4 rounded w-3/4 mb-2" />
                  <div className="bg-gray-200 h-3 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  to={`/product-category?category=${category.category}`}
                  onClick={onClose}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    {/* Category Image */}
                    <div className="h-32 flex items-center justify-center mb-3 overflow-hidden rounded-lg">
                      <img
                        src={category.image}
                        alt={category.category}
                        className="h-full w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Category Info */}
                    <h4 className="font-semibold text-gray-900 capitalize text-sm mb-1 truncate">
                      {category.category}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {category.count} {category.count === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default CategoryDropdown
