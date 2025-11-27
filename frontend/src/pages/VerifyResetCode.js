import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaShieldAlt } from 'react-icons/fa'
import SummaryApi from '../common'

const VerifyResetCode = () => {
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const [timeLeft, setTimeLeft] = useState(900) // 15 minutes in seconds
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email

    // Redirect if no email
    useEffect(() => {
        if (!email) {
            toast.error('Please start from the forgot password page')
            navigate('/forgot-password')
        }
    }, [email, navigate])

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) return

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!code || code.length !== 6) {
            toast.error('Please enter a valid 6-digit code')
            return
        }

        setLoading(true)

        try {
            const response = await fetch(SummaryApi.verifyResetCode.url, {
                method: SummaryApi.verifyResetCode.method,
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ email, code })
            })

            const data = await response.json()

            if (data.success) {
                toast.success(data.message)
                // Navigate to reset password page with email and code
                navigate('/reset-password', { state: { email, code } })
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleResendCode = async () => {
        setResending(true)

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
                toast.success('New verification code sent to your email')
                setTimeLeft(900) // Reset timer
                setCode('') // Clear input
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Failed to resend code. Please try again.')
        } finally {
            setResending(false)
        }
    }

    return (
        <section className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                {/* Card Container */}
                <div className='card-modern p-8 bg-white'>
                    {/* Icon */}
                    <div className='w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center'>
                        <FaShieldAlt className='text-5xl text-indigo-600' />
                    </div>

                    {/* Title */}
                    <div className='text-center mb-8'>
                        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Enter Verification Code</h1>
                        <p className='text-gray-600 mb-2'>
                            We've sent a 6-digit code to
                        </p>
                        <p className='text-indigo-600 font-semibold'>
                            {email}
                        </p>
                    </div>

                    {/* Timer */}
                    <div className='text-center mb-6'>
                        <div className='inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg'>
                            <span className='text-amber-600 font-semibold'>
                                ⏰ Code expires in: {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>

                    {/* Form */}
                    <form className='space-y-5' onSubmit={handleSubmit}>
                        {/* Code Field */}
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                Verification Code
                            </label>
                            <input
                                type='text'
                                placeholder='Enter 6-digit code'
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                required
                                maxLength={6}
                                className='input-modern w-full text-center text-2xl tracking-widest font-bold'
                                disabled={loading}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            className='btn-primary w-full py-3 text-base font-semibold mt-6'
                            disabled={loading || timeLeft <= 0}
                        >
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </button>
                    </form>

                    {/* Resend Code */}
                    <div className='text-center mt-6'>
                        <p className='text-gray-600 mb-2'>Didn't receive the code?</p>
                        <button
                            onClick={handleResendCode}
                            disabled={resending}
                            className='text-indigo-600 hover:text-indigo-700 font-semibold transition-colors'
                        >
                            {resending ? 'Sending...' : 'Resend Code'}
                        </button>
                    </div>

                    {/* Back to Login */}
                    <div className='text-center mt-4'>
                        <button
                            onClick={() => navigate('/login')}
                            className='text-gray-500 hover:text-gray-700 transition-colors'
                        >
                            ← Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default VerifyResetCode
