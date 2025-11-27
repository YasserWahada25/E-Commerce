import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import productCategory from '../helpers/productCategory'
import ModernProductCard from '../components/ModernProductCard'
import SummaryApi from '../common'

const CategoryProduct = () => {
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const urlSearch = new URLSearchParams(location.search)
  const urlCategoryListinArray = urlSearch.getAll("category")

  const urlCategoryListObject = {}
  urlCategoryListinArray.forEach(el => {
    urlCategoryListObject[el] = true
  })

  const [selectCategory, setSelectCategory] = useState(urlCategoryListObject)
  const [filterCategoryList, setFilterCategoryList] = useState([])
  const [sortBy, setSortBy] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(SummaryApi.filterProduct.url, {
        method: SummaryApi.filterProduct.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          category: filterCategoryList
        })
      })

      const dataResponse = await response.json()
      setData(dataResponse?.data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    }
    setLoading(false)
  }

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target

    setSelectCategory((prev) => {
      return {
        ...prev,
        [value]: checked
      }
    })
  }

  useEffect(() => {
    fetchData()
  }, [filterCategoryList])

  useEffect(() => {
    const arrayOfCategory = Object.keys(selectCategory).map(categoryKeyName => {
      if (selectCategory[categoryKeyName]) {
        return categoryKeyName
      }
      return null
    }).filter(el => el)

    setFilterCategoryList(arrayOfCategory)

    // Format for url change when change on the checkbox
    const urlFormat = arrayOfCategory.map((el, index) => {
      if ((arrayOfCategory.length - 1) === index) {
        return `category=${el}`
      }
      return `category=${el}&&`
    })

    navigate("/product-category?" + urlFormat.join(""))
  }, [selectCategory])

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target
    setSortBy(value)

    if (value === 'asc') {
      setData(prev => [...prev].sort((a, b) => a.sellingPrice - b.sellingPrice))
    }

    if (value === 'dsc') {
      setData(prev => [...prev].sort((a, b) => b.sellingPrice - a.sellingPrice))
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Desktop version */}
      <div className='container mx-auto px-6 py-8'>
        <div className='hidden lg:grid grid-cols-[280px,1fr] gap-6'>
          {/* Left side - Filters */}
          <div className='space-y-6'>
            {/* Sort by */}
            <div className='card-modern p-6'>
              <h3 className='text-lg font-bold text-gray-900 mb-4'>Sort By</h3>
              
              <form className='space-y-3'>
                <label className='filter-option'>
                  <input 
                    type='radio' 
                    name='sortBy' 
                    checked={sortBy === 'asc'} 
                    onChange={handleOnChangeSortBy} 
                    value="asc"
                    className='custom-radio'
                  />
                  <span className='filter-label'>Price - Low to High</span>
                </label>

                <label className='filter-option'>
                  <input 
                    type='radio' 
                    name='sortBy' 
                    checked={sortBy === 'dsc'} 
                    onChange={handleOnChangeSortBy} 
                    value="dsc"
                    className='custom-radio'
                  />
                  <span className='filter-label'>Price - High to Low</span>
                </label>
              </form>
            </div>

            {/* Filter by Category */}
            <div className='card-modern p-6'>
              <h3 className='text-lg font-bold text-gray-900 mb-4'>Category</h3>
              
              <form className='space-y-3'>
                {productCategory.map((categoryName, index) => {
                  const isSelected = selectCategory[categoryName?.value]
                  return (
                    <label 
                      key={categoryName?.id || index} 
                      className='filter-option'
                    >
                      <input 
                        type='checkbox' 
                        name="category" 
                        checked={isSelected} 
                        value={categoryName?.value} 
                        id={categoryName?.value} 
                        onChange={handleSelectCategory}
                        className='custom-checkbox'
                      />
                      <span className={`filter-label ${isSelected ? 'active' : ''}`}>
                        {categoryName?.label}
                      </span>
                    </label>
                  )
                })}
              </form>
            </div>
          </div>

          {/* Right side - Products */}
          <div>
            <div className='mb-6'>
              <h2 className='text-2xl font-bold text-gray-900'>
                {filterCategoryList.length > 0 ? 'Filtered Products' : 'All Products'}
              </h2>
              <p className='text-gray-600 mt-1'>
                {data.length} products available
              </p>
            </div>

            {loading ? (
              <div className='product-grid'>
                {[...Array(12)].map((_, index) => (
                  <div key={index} className='card-modern p-4 animate-pulse'>
                    <div className='bg-gray-200 h-64 rounded-xl mb-4' />
                    <div className='space-y-3'>
                      <div className='bg-gray-200 h-4 rounded w-1/2' />
                      <div className='bg-gray-200 h-6 rounded w-3/4' />
                      <div className='bg-gray-200 h-4 rounded w-full' />
                      <div className='bg-gray-200 h-4 rounded w-2/3' />
                      <div className='bg-gray-200 h-10 rounded-lg w-full' />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {data.length > 0 ? (
                  <div className='product-grid'>
                    {data.map((product, index) => (
                      <ModernProductCard key={product._id || index} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-16'>
                    <div className='text-6xl mb-4'>🔍</div>
                    <h3 className='text-2xl font-bold text-gray-900 mb-2'>No products found</h3>
                    <p className='text-gray-600'>
                      {filterCategoryList.length > 0 
                        ? 'Try selecting different categories or adjust your filters'
                        : 'No products available at the moment'}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile version */}
        <div className='lg:hidden'>
          <div className='mb-6'>
            <h2 className='text-2xl font-bold text-gray-900'>
              {filterCategoryList.length > 0 ? 'Filtered Products' : 'All Products'}
            </h2>
            <p className='text-gray-600 mt-1'>
              {data.length} products available
            </p>
          </div>

          {/* Mobile Filters - Collapsible */}
          <div className='mb-6 space-y-4'>
            <details className='card-modern p-4'>
              <summary className='font-bold text-gray-900 cursor-pointer'>Sort By</summary>
              <form className='space-y-3 mt-4'>
                <label className='filter-option'>
                  <input 
                    type='radio' 
                    name='sortBy' 
                    checked={sortBy === 'asc'} 
                    onChange={handleOnChangeSortBy} 
                    value="asc"
                    className='custom-radio'
                  />
                  <span className='filter-label'>Price - Low to High</span>
                </label>

                <label className='filter-option'>
                  <input 
                    type='radio' 
                    name='sortBy' 
                    checked={sortBy === 'dsc'} 
                    onChange={handleOnChangeSortBy} 
                    value="dsc"
                    className='custom-radio'
                  />
                  <span className='filter-label'>Price - High to Low</span>
                </label>
              </form>
            </details>

            <details className='card-modern p-4'>
              <summary className='font-bold text-gray-900 cursor-pointer'>Categories</summary>
              <form className='space-y-3 mt-4'>
                {productCategory.map((categoryName, index) => {
                  const isSelected = selectCategory[categoryName?.value]
                  return (
                    <label 
                      key={categoryName?.id || index} 
                      className='filter-option'
                    >
                      <input 
                        type='checkbox' 
                        name="category" 
                        checked={isSelected} 
                        value={categoryName?.value} 
                        id={`mobile-${categoryName?.value}`} 
                        onChange={handleSelectCategory}
                        className='custom-checkbox'
                      />
                      <span className={`filter-label ${isSelected ? 'active' : ''}`}>
                        {categoryName?.label}
                      </span>
                    </label>
                  )
                })}
              </form>
            </details>
          </div>

          {/* Mobile Products */}
          {loading ? (
            <div className='product-grid'>
              {[...Array(6)].map((_, index) => (
                <div key={index} className='card-modern p-4 animate-pulse'>
                  <div className='bg-gray-200 h-64 rounded-xl mb-4' />
                  <div className='space-y-3'>
                    <div className='bg-gray-200 h-4 rounded w-1/2' />
                    <div className='bg-gray-200 h-6 rounded w-3/4' />
                    <div className='bg-gray-200 h-4 rounded w-full' />
                    <div className='bg-gray-200 h-4 rounded w-2/3' />
                    <div className='bg-gray-200 h-10 rounded-lg w-full' />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {data.length > 0 ? (
                <div className='product-grid'>
                  {data.map((product, index) => (
                    <ModernProductCard key={product._id || index} product={product} />
                  ))}
                </div>
              ) : (
                <div className='text-center py-16'>
                  <div className='text-6xl mb-4'>🔍</div>
                  <h3 className='text-2xl font-bold text-gray-900 mb-2'>No products found</h3>
                  <p className='text-gray-600'>
                    {filterCategoryList.length > 0 
                      ? 'Try selecting different categories'
                      : 'No products available'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryProduct