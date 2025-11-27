import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SummaryApi from '../common'
import ModernProductCard from '../components/ModernProductCard'

const SearchProduct = () => {
    const query = useLocation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [sortBy, setSortBy] = useState('featured')

    const fetchProduct = async () => {
        setLoading(true)
        const response = await fetch(SummaryApi.searchProduct.url + query.search)
        const dataResponse = await response.json()
        setLoading(false)

        setData(dataResponse.data || [])
    }

    useEffect(() => {
        fetchProduct()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])

    const handleOnChangeSortBy = (e) => {
        const { value } = e.target
        setSortBy(value)

        let sortedData = [...data]

        switch (value) {
            case 'price-low':
                sortedData.sort((a, b) => a.sellingPrice - b.sellingPrice)
                break
            case 'price-high':
                sortedData.sort((a, b) => b.sellingPrice - a.sellingPrice)
                break
            case 'rating':
                sortedData.sort((a, b) => (b.rating || 0) - (a.rating || 0))
                break
            case 'newest':
                sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                break
            case 'featured':
            default:
                // Keep search relevance order
                break
        }

        setData(sortedData)
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='container mx-auto px-6 py-8'>
                {/* Header */}
                <div className='mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>Search Results</h2>
                        <p className='text-gray-600 mt-1'>
                            {loading ? 'Searching...' : `${data.length} products found`}
                        </p>
                    </div>

                    {/* Sort Dropdown */}
                    {data.length > 0 && !loading && (
                        <div className='flex items-center gap-2'>
                            <span className='text-sm text-gray-600 font-medium'>Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={handleOnChangeSortBy}
                                className='input-modern py-2 px-4 cursor-pointer text-sm font-medium'
                            >
                                <option value='featured'>Relevance</option>
                                <option value='price-low'>Price: Low to High</option>
                                <option value='price-high'>Price: High to Low</option>
                                <option value='rating'>Top Rated</option>
                                <option value='newest'>Newest</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
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
                )}

                {/* No Results */}
                {data.length === 0 && !loading && (
                    <div className='text-center py-16'>
                        <div className='text-6xl mb-4'>🔍</div>
                        <h3 className='text-2xl font-bold text-gray-900 mb-2'>No products found</h3>
                        <p className='text-gray-600'>Try searching with different keywords</p>
                    </div>
                )}

                {/* Products Grid */}
                {data.length > 0 && !loading && (
                    <div className='product-grid'>
                        {data.map((product, index) => (
                            <ModernProductCard key={product._id || index} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchProduct