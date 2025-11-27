import React, { useContext, useState } from 'react'
import loginIcons from '../assest/signin.gif'
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { Link, useNavigate } from 'react-router-dom'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import Context from '../context'

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate()
    const { fetchUserDetails, fetchUserAddToCart } = useContext(Context)

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const dataResponse = await fetch(SummaryApi.signIn.url, {
            method: SummaryApi.signIn.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const dataApi = await dataResponse.json()

        if (dataApi.success) {
            toast.success(dataApi.message)
            navigate('/')
            fetchUserDetails()
            fetchUserAddToCart()
        }

        if (dataApi.error) {
            toast.error(dataApi.message)
        }
    }

    return (
        <section className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                {/* Card Container */}
                <div className='card-modern p-8 bg-white'>
                    {/* Icon */}
                    <div className='w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center'>
                        <img src={loginIcons} alt='login icon' className='w-20 h-20' />
                    </div>

                    {/* Title */}
                    <div className='text-center mb-8'>
                        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Welcome Back</h1>
                        <p className='text-gray-600'>Sign in to continue shopping</p>
                    </div>

                    {/* Form */}
                    <form className='space-y-5' onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                Email Address
                            </label>
                            <input
                                type='email'
                                placeholder='Enter your email'
                                name='email'
                                value={data.email}
                                onChange={handleOnChange}
                                required
                                className='input-modern w-full'
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                Password
                            </label>
                            <div className='relative'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder='Enter your password'
                                    value={data.password}
                                    name='password'
                                    onChange={handleOnChange}
                                    required
                                    className='input-modern w-full pr-12'
                                />
                                <button
                                    type='button'
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors'
                                    onClick={() => setShowPassword((preve) => !preve)}
                                >
                                    {showPassword ? (
                                        <FaEyeSlash className='text-xl' />
                                    ) : (
                                        <FaEye className='text-xl' />
                                    )}
                                </button>
                            </div>
                            <Link
                                to={'/forgot-password'}
                                className='block text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2 text-right transition-colors'
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            className='btn-primary w-full py-3 text-base font-semibold mt-6'
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className='text-center text-gray-600 mt-6'>
                        Don't have an account?{' '}
                        <Link
                            to={"/sign-up"}
                            className='text-indigo-600 hover:text-indigo-700 font-semibold transition-colors'
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Login