import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md"
import { FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa"

const Cart = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const context = useContext(Context)
    const navigate = useNavigate()
    const loadingCart = new Array(4).fill(null)

    const fetchData = async () => {
        const response = await fetch(SummaryApi.addToCartProductView.url, {
            method: SummaryApi.addToCartProductView.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
        })

        const responseData = await response.json()

        if (responseData.success) {
            setData(responseData.data)
        }
    }

    const handleLoading = async () => {
        await fetchData()
    }

    useEffect(() => {
        setLoading(true)
        handleLoading()
        setLoading(false)
    }, [])

    const increaseQty = async (id, qty) => {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
            method: SummaryApi.updateCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify({
                _id: id,
                quantity: qty + 1
            })
        })

        const responseData = await response.json()

        if (responseData.success) {
            fetchData()
        }
    }

    const decreaseQty = async (id, qty) => {
        if (qty >= 2) {
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({
                    _id: id,
                    quantity: qty - 1
                })
            })

            const responseData = await response.json()

            if (responseData.success) {
                fetchData()
            }
        }
    }

    const deleteCartProduct = async (id) => {
        const response = await fetch(SummaryApi.deleteCartProduct.url, {
            method: SummaryApi.deleteCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify({
                _id: id,
            })
        })

        const responseData = await response.json()

        if (responseData.success) {
            fetchData()
            context.fetchUserAddToCart()
        }
    }

    const totalQty = data.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0)
    const totalPrice = data.reduce((preve, curr) => preve + (curr.quantity * curr?.productId?.sellingPrice), 0)

    return (
        <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8'>
            <div className='container mx-auto px-4'>
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-3'>
                        <FaShoppingCart className='text-indigo-600' />
                        Shopping Cart
                    </h1>
                    <p className='text-gray-600 mt-2'>
                        {data.length > 0 ? `${data.length} item${data.length > 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
                    </p>
                </div>

                {/* Empty Cart State */}
                {data.length === 0 && !loading && (
                    <div className='card-modern p-12 text-center bg-white'>
                        <div className='w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center'>
                            <FaShoppingCart className='text-6xl text-indigo-600' />
                        </div>
                        <h2 className='text-2xl font-bold text-gray-900 mb-3'>Your cart is empty</h2>
                        <p className='text-gray-600 mb-6'>
                            Looks like you haven't added anything to your cart yet
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className='btn-primary px-8 py-3'
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}

                {/* Cart Content */}
                {data.length > 0 && (
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        {/* Cart Items */}
                        <div className='lg:col-span-2 space-y-4'>
                            {loading ? (
                                loadingCart?.map((el, index) => (
                                    <div key={el + "Add To Cart Loading" + index} className='card-modern h-48 bg-white animate-pulse'>
                                        <div className='flex gap-4 p-4'>
                                            <div className='w-40 h-40 bg-slate-200 rounded-lg'></div>
                                            <div className='flex-1 space-y-3'>
                                                <div className='h-6 bg-slate-200 rounded w-3/4'></div>
                                                <div className='h-4 bg-slate-200 rounded w-1/2'></div>
                                                <div className='h-8 bg-slate-200 rounded w-1/4'></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                data.map((product, index) => (
                                    <div key={product?._id + "cart-item"} className='card-modern bg-white p-4 relative group'>
                                        <div className='flex gap-4'>
                                            {/* Product Image */}
                                            <Link 
                                                to={`/product/${product?.productId?._id}`}
                                                className='w-32 h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden'
                                            >
                                                <img
                                                    src={product?.productId?.productImage[0]}
                                                    className='w-full h-full object-contain mix-blend-multiply hover:scale-110 transition-transform duration-300'
                                                    alt={product?.productId?.productName}
                                                />
                                            </Link>

                                            {/* Product Info */}
                                            <div className='flex-1 flex flex-col justify-between'>
                                                <div>
                                                    <Link 
                                                        to={`/product/${product?.productId?._id}`}
                                                        className='block'
                                                    >
                                                        <h3 className='text-lg font-semibold text-gray-900 line-clamp-2 hover:text-indigo-600 transition-colors'>
                                                            {product?.productId?.productName}
                                                        </h3>
                                                    </Link>
                                                    <p className='text-sm text-gray-500 capitalize mt-1'>
                                                        {product?.productId?.category}
                                                    </p>
                                                </div>

                                                <div className='flex items-center justify-between mt-4'>
                                                    {/* Quantity Controls */}
                                                    <div className='flex items-center gap-3'>
                                                        <button
                                                            className='w-8 h-8 rounded-lg border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all'
                                                            onClick={() => decreaseQty(product?._id, product?.quantity)}
                                                        >
                                                            <FaMinus className='text-xs' />
                                                        </button>
                                                        <span className='text-lg font-semibold text-gray-900 min-w-[2rem] text-center'>
                                                            {product?.quantity}
                                                        </span>
                                                        <button
                                                            className='w-8 h-8 rounded-lg border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all'
                                                            onClick={() => increaseQty(product?._id, product?.quantity)}
                                                        >
                                                            <FaPlus className='text-xs' />
                                                        </button>
                                                    </div>

                                                    {/* Price */}
                                                    <div className='text-right'>
                                                        <p className='text-sm text-gray-500'>Subtotal</p>
                                                        <p className='text-xl font-bold text-indigo-600'>
                                                            {displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                className='absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all'
                                                onClick={() => deleteCartProduct(product?._id)}
                                            >
                                                <MdDelete className='text-xl' />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Cart Summary */}
                        <div className='lg:col-span-1'>
                            <div className='card-modern bg-white p-6 sticky top-24'>
                                <h2 className='text-xl font-bold text-gray-900 mb-6'>Order Summary</h2>

                                <div className='space-y-4 mb-6'>
                                    <div className='flex justify-between text-gray-600'>
                                        <span>Items ({totalQty})</span>
                                        <span className='font-semibold'>{displayINRCurrency(totalPrice)}</span>
                                    </div>
                                    <div className='flex justify-between text-gray-600'>
                                        <span>Shipping</span>
                                        <span className='font-semibold text-green-600'>FREE</span>
                                    </div>
                                    <div className='border-t border-gray-200 pt-4'>
                                        <div className='flex justify-between text-lg font-bold text-gray-900'>
                                            <span>Total</span>
                                            <span className='text-indigo-600'>{displayINRCurrency(totalPrice)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button className='btn-primary w-full py-3 text-base font-semibold'>
                                    Proceed to Checkout
                                </button>

                                <button
                                    onClick={() => navigate('/')}
                                    className='btn-secondary w-full py-3 text-base font-semibold mt-3'
                                >
                                    Continue Shopping
                                </button>

                                {/* Trust Badges */}
                                <div className='mt-6 pt-6 border-t border-gray-200'>
                                    <div className='space-y-3 text-sm text-gray-600'>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-green-600'>✓</span>
                                            <span>Secure checkout</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-green-600'>✓</span>
                                            <span>Free shipping on all orders</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-green-600'>✓</span>
                                            <span>Easy returns within 30 days</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart