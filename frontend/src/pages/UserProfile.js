import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaRegCircleUser } from "react-icons/fa6";
import { FaEnvelope, FaCalendarAlt, FaUserTag } from "react-icons/fa";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const UserProfile = () => {
    const user = useSelector(state => state?.user?.user)
    const [data, setData] = useState({
        name: "",
        email: "",
        profilePic: "",
        role: "",
        createdAt: ""
    })
    const [loading, setLoading] = useState(true)

    const fetchUserProfile = async () => {
        setLoading(true)
        try {
            const response = await fetch(SummaryApi.userProfile.url, {
                method: SummaryApi.userProfile.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                }
            })

            const dataResponse = await response.json()

            if (dataResponse.success) {
                setData(dataResponse.data)
            }

            if (dataResponse.error) {
                toast.error(dataResponse.message)
            }
        } catch (error) {
            toast.error("Failed to fetch profile data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUserProfile()
    }, [])

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <div className='animate-pulse text-center'>
                    <div className='w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4'></div>
                    <div className='h-6 bg-gray-200 rounded w-48 mx-auto mb-2'></div>
                    <div className='h-4 bg-gray-200 rounded w-32 mx-auto'></div>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <div className='container mx-auto px-6 max-w-4xl'>
                {/* Header Section with Gradient */}
                <div className='card-modern overflow-hidden mb-6'>
                    <div className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white'>
                        <div className='flex flex-col md:flex-row items-center gap-6'>
                            {/* Profile Picture */}
                            <div className='relative'>
                                <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white'>
                                    {data.profilePic ? (
                                        <img 
                                            src={data.profilePic} 
                                            alt={data.name} 
                                            className='w-full h-full object-cover'
                                        />
                                    ) : (
                                        <FaRegCircleUser className='w-full h-full text-gray-400 p-4' />
                                    )}
                                </div>
                                <div className='absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg'>
                                    <div className='w-6 h-6 bg-green-500 rounded-full border-2 border-white'></div>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className='flex-1 text-center md:text-left'>
                                <h1 className='text-3xl md:text-4xl font-bold mb-2'>{data.name || 'User'}</h1>
                                <div className='flex items-center justify-center md:justify-start gap-2 mb-3'>
                                    <span className='bg-white bg-opacity-20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2'>
                                        <FaUserTag className='text-yellow-300' />
                                        {data.role || 'User'}
                                    </span>
                                </div>
                                <p className='text-indigo-100 text-sm'>
                                    Member since {new Date(data.createdAt).toLocaleDateString('en-US', { 
                                        month: 'long', 
                                        year: 'numeric' 
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Cards Grid */}
                <div className='grid md:grid-cols-2 gap-6'>
                    {/* Email Card */}
                    <div className='card-modern p-6 hover:shadow-xl transition-all'>
                        <div className='flex items-start gap-4'>
                            <div className='w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                                <FaEnvelope className='text-indigo-600 text-xl' />
                            </div>
                            <div className='flex-1'>
                                <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1'>
                                    Email Address
                                </h3>
                                <p className='text-gray-900 font-medium break-all'>
                                    {data.email || 'Not provided'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Account Created Card */}
                    <div className='card-modern p-6 hover:shadow-xl transition-all'>
                        <div className='flex items-start gap-4'>
                            <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                                <FaCalendarAlt className='text-purple-600 text-xl' />
                            </div>
                            <div className='flex-1'>
                                <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1'>
                                    Account Created
                                </h3>
                                <p className='text-gray-900 font-medium'>
                                    {new Date(data.createdAt).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Role Card */}
                    <div className='card-modern p-6 hover:shadow-xl transition-all'>
                        <div className='flex items-start gap-4'>
                            <div className='w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                                <FaUserTag className='text-pink-600 text-xl' />
                            </div>
                            <div className='flex-1'>
                                <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1'>
                                    User Role
                                </h3>
                                <p className='text-gray-900 font-medium'>
                                    {data.role || 'General User'}
                                </p>
                                <p className='text-sm text-gray-500 mt-1'>
                                    {data.role === 'ADMIN' ? 'Full access to admin panel' : 'Standard user access'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Account Status Card */}
                    <div className='card-modern p-6 hover:shadow-xl transition-all'>
                        <div className='flex items-start gap-4'>
                            <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                                <div className='w-6 h-6 bg-green-500 rounded-full'></div>
                            </div>
                            <div className='flex-1'>
                                <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1'>
                                    Account Status
                                </h3>
                                <p className='text-gray-900 font-medium'>Active</p>
                                <p className='text-sm text-gray-500 mt-1'>
                                    Your account is in good standing
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info Section */}
                <div className='card-modern p-6 mt-6'>
                    <h2 className='text-xl font-bold text-gray-900 mb-4'>Profile Information</h2>
                    <div className='space-y-4'>
                        <div className='flex items-center justify-between py-3 border-b border-gray-100'>
                            <span className='text-gray-600 font-medium'>Full Name</span>
                            <span className='text-gray-900 font-semibold'>{data.name || 'Not set'}</span>
                        </div>
                        <div className='flex items-center justify-between py-3 border-b border-gray-100'>
                            <span className='text-gray-600 font-medium'>Email</span>
                            <span className='text-gray-900 font-semibold'>{data.email || 'Not set'}</span>
                        </div>
                        <div className='flex items-center justify-between py-3 border-b border-gray-100'>
                            <span className='text-gray-600 font-medium'>Role</span>
                            <span className='text-gray-900 font-semibold'>{data.role || 'Not set'}</span>
                        </div>
                        <div className='flex items-center justify-between py-3'>
                            <span className='text-gray-600 font-medium'>Member Since</span>
                            <span className='text-gray-900 font-semibold'>
                                {new Date(data.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile
