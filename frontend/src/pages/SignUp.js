import React, { useState } from 'react'
import loginIcons from '../assest/signin.gif'
import { FaEye, FaEyeSlash, FaCamera } from "react-icons/fa"
import { Link, useNavigate } from 'react-router-dom'
import imageTobase64 from '../helpers/imageTobase64'
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [data, setData] = useState({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
        profilePic: "",
    })
    const navigate = useNavigate()

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleUploadPic = async (e) => {
        const file = e.target.files[0]

        const imagePic = await imageTobase64(file)

        setData((preve) => {
            return {
                ...preve,
                profilePic: imagePic
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (data.password === data.confirmPassword) {
            const dataResponse = await fetch(SummaryApi.signUP.url, {
                method: SummaryApi.signUP.method,
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            })

            const dataApi = await dataResponse.json()

            if (dataApi.success) {
                toast.success(dataApi.message)
                navigate("/login")
            }

            if (dataApi.error) {
                toast.error(dataApi.message)
            }
        } else {
            toast.error("Please check password and confirm password")
        }
    }

    return (
        <section className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                {/* Card Container */}
                <div className='card-modern p-8 bg-white'>
                    {/* Profile Picture Upload */}
                    <div className='relative w-28 h-28 mx-auto mb-6'>
                        <div className='w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-4 border-white shadow-lg'>
                            <img
                                src={data.profilePic || loginIcons}
                                alt='profile'
                                className='w-full h-full object-cover'
                            />
                        </div>
                        <label className='absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-full cursor-pointer shadow-lg transition-all hover:scale-110'>
                            <FaCamera className='text-sm' />
                            <input
                                type='file'
                                className='hidden'
                                onChange={handleUploadPic}
                                accept='image/*'
                            />
                        </label>
                    </div>

                    {/* Title */}
                    <div className='text-center mb-8'>
                        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Create Account</h1>
                        <p className='text-gray-600'>Join us and start shopping</p>
                    </div>

                    {/* Form */}
                    <form className='space-y-5' onSubmit={handleSubmit}>
                        {/* Name Field */}
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                Full Name
                            </label>
                            <input
                                type='text'
                                placeholder='Enter your name'
                                name='name'
                                value={data.name}
                                onChange={handleOnChange}
                                required
                                className='input-modern w-full'
                            />
                        </div>

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
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                Confirm Password
                            </label>
                            <div className='relative'>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder='Confirm your password'
                                    value={data.confirmPassword}
                                    name='confirmPassword'
                                    onChange={handleOnChange}
                                    required
                                    className='input-modern w-full pr-12'
                                />
                                <button
                                    type='button'
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors'
                                    onClick={() => setShowConfirmPassword((preve) => !preve)}
                                >
                                    {showConfirmPassword ? (
                                        <FaEyeSlash className='text-xl' />
                                    ) : (
                                        <FaEye className='text-xl' />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            className='btn-primary w-full py-3 text-base font-semibold mt-6'
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className='text-center text-gray-600 mt-6'>
                        Already have an account?{' '}
                        <Link
                            to={"/login"}
                            className='text-indigo-600 hover:text-indigo-700 font-semibold transition-colors'
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default SignUp