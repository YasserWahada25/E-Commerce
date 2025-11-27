import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa'
import SummaryApi from '../common'

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    })
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email
    const code = location.state?.code

    // Redirect if no email or code
    useEffect(() => {
        if (!email || !code) {
            toast.error('Invalid access. Please start from the beginning.')
            navigate('/forgot-password')
        }
    }, [email, code, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const validatePassword = () => {
        if (formData.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters long')
            return false
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return false
        }

        return true
    }

    const getPasswordStrength = () => {
        const password = formData.newPassword
        if (!password) return { strength: 0, text: '', color: '' }

        let strength = 0
        if (password.length >= 8) strength++
        if (password.length >= 12) strength++
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
        if (/\d/.test(password)) strength++
        if (/[^a-zA-Z\d]/.test(password)) strength++

        if (strength <= 2) return { strength: 33, text: 'Weak', color: 'bg-red-500' }
        if (strength <= 3) return { strength: 66, text: 'Medium', color: 'bg-yellow-500' }
        return { strength: 100, text: 'Strong', color: 'bg-green-500' }
    }

    const passwordStrength = getPasswordStrength()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validatePassword()) return

        setLoading(true)

        try {
            const response = await fetch(SummaryApi.resetPassword.url, {
                method: SummaryApi.resetPassword.method,
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    code,
                    newPassword: formData.newPassword
                })
            })

            const data = await response.json()

            if (data.success) {
                toast.success(data.message)
                // Navigate to login
                setTimeout(() => {
                    navigate('/login')
                }, 1500)
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
                        <FaLock className='text-5xl text-indigo-600' />
                    </div>

                    {/* Title */}
                    <div className='text-center mb-8'>
                        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Reset Password</h1>
                        <p className='text-gray-600'>
                            Enter your new password below
                        </p>
                    </div>

                    {/* Form */}
                    <form className='space-y-5' onSubmit={handleSubmit}>
                        {/* New Password Field */}
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                New Password
                            </label>
                            <div className='relative'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name='newPassword'
                                    placeholder='Enter new password'
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    required
                                    className='input-modern w-full pr-12'
                                    disabled={loading}
                                />
                                <button
                                    type='button'
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors'
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <FaEyeSlash className='text-xl' />
                                    ) : (
                                        <FaEye className='text-xl' />
                                    )}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.newPassword && (
                                <div className='mt-2'>
                                    <div className='flex items-center justify-between mb-1'>
                                        <span className='text-xs text-gray-600'>Password Strength:</span>
                                        <span className={`text-xs font-semibold ${
                                            passwordStrength.text === 'Weak' ? 'text-red-500' :
                                            passwordStrength.text === 'Medium' ? 'text-yellow-500' :
                                            'text-green-500'
                                        }`}>
                                            {passwordStrength.text}
                                        </span>
                                    </div>
                                    <div className='w-full bg-gray-200 rounded-full h-2'>
                                        <div
                                            className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                                            style={{ width: `${passwordStrength.strength}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                Confirm Password
                            </label>
                            <div className='relative'>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name='confirmPassword'
                                    placeholder='Confirm new password'
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className='input-modern w-full pr-12'
                                    disabled={loading}
                                />
                                <button
                                    type='button'
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors'
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <FaEyeSlash className='text-xl' />
                                    ) : (
                                        <FaEye className='text-xl' />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
                            <p className='text-xs text-blue-800 font-semibold mb-1'>Password must:</p>
                            <ul className='text-xs text-blue-700 space-y-1'>
                                <li>• Be at least 8 characters long</li>
                                <li>• Include uppercase and lowercase letters (recommended)</li>
                                <li>• Include numbers and special characters (recommended)</li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            className='btn-primary w-full py-3 text-base font-semibold mt-6'
                            disabled={loading}
                        >
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className='text-center mt-6'>
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

export default ResetPassword
