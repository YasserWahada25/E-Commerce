import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaEnvelope } from 'react-icons/fa'
import SummaryApi from '../common'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!email) {
            toast.error('Please enter your email address')
            return
        }

        setLoading(true)

        try {
            const response = await fetch(SummaryApi.forgotPassword.url, {
                method: SummaryApi.forgotPassword.method,
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ email })
            })

            const data = await response.json()

            if (data.success) {
                toast.success(data.message)
                // Navigate to verification code page with email
                navigate('/verify-reset-code', { state: { email } })
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                {/* Card Container */}
                <div className='card-modern p-8 bg-white'>
                    {/* Icon */}
                    <div className='w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center'>
                        <FaEnvelope className='text-5xl text-indigo-600' />
                    </div>

                    {/* Title */}
                    <div className='text-center mb-8'>
                        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Forgot Password?</h1>
                        <p className='text-gray-600'>
                            Enter your email address and we'll send you a verification code to reset your password
                        </p>
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className='input-modern w-full'
                                disabled={loading}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            className='btn-primary w-full py-3 text-base font-semibold mt-6'
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Verification Code'}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className='text-center mt-6'>
                        <button
                            onClick={() => navigate('/login')}
                            className='text-indigo-600 hover:text-indigo-700 font-semibold transition-colors'
                        >
                            ← Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ForgotPassword