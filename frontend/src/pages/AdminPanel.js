import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaRegCircleUser, FaUsers, FaBoxOpen, FaEnvelope, FaChartBar, FaXmark, FaBars } from "react-icons/fa6";
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import ROLE from '../common/role';
import SummaryApi from '../common';

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate()
    const location = useLocation()
    const [reclamationCount, setReclamationCount] = useState(0)
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

    useEffect(() => {
        if (user?.role !== ROLE.ADMIN) {
            navigate("/")
        }
    }, [user])

    // Fetch reclamation count
    const fetchReclamationCount = async () => {
        try {
            const response = await fetch(SummaryApi.reclamationsCount.url, {
                method: SummaryApi.reclamationsCount.method,
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include'
            })
            const data = await response.json()
            if (data.success) {
                setReclamationCount(data.data.count)
            }
        } catch (error) {
            console.error("Failed to fetch reclamation count", error)
        }
    }

    useEffect(() => {
        if (user?.role === ROLE.ADMIN) {
            fetchReclamationCount()
            // Poll every 30 seconds for updates
            const interval = setInterval(fetchReclamationCount, 30000)
            return () => clearInterval(interval)
        }
    }, [user])

    const isActive = (path) => {
        return location.pathname.includes(path)
    }

    const closeMobileSidebar = () => {
        setMobileSidebarOpen(false)
    }

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (mobileSidebarOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [mobileSidebarOpen])

    return (
        <div className='min-h-screen bg-gray-50 pt-16 sm:pt-20'>
            {/* Mobile Sidebar Toggle Button */}
            <button 
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className='md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all'
            >
                {mobileSidebarOpen ? (
                    <FaXmark className='text-xl' />
                ) : (
                    <FaBars className='text-xl' />
                )}
            </button>

            <div className='flex min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]'>
                {/* Sidebar - Desktop */}
                <aside className='hidden md:block bg-white w-full max-w-64 shadow-lg border-r border-gray-200 fixed md:sticky top-16 sm:top-20 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] overflow-y-auto'>
                    {/* Profile Section */}
                    <div className='p-4 lg:p-6 border-b border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50'>
                        <div className='flex flex-col items-center gap-2 lg:gap-3'>
                            <div className='relative'>
                                <div className='w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-3 border-indigo-200 shadow-md bg-white'>
                                    {user?.profilePic ? (
                                        <img 
                                            src={user?.profilePic} 
                                            className='w-full h-full object-cover' 
                                            alt={user?.name} 
                                        />
                                    ) : (
                                        <FaRegCircleUser className='w-full h-full text-indigo-400 p-2 lg:p-3' />
                                    )}
                                </div>
                                <div className='absolute -bottom-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full border-2 border-white'></div>
                            </div>
                            <div className='text-center'>
                                <p className='font-bold text-gray-900 text-base lg:text-lg line-clamp-1'>{user?.name}</p>
                                <span className='inline-block mt-1 px-2 lg:px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold'>
                                    {user?.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className='p-3 lg:p-4'>
                        <div className='space-y-1.5 lg:space-y-2'>
                            <Link 
                                to={"dashboard"} 
                                className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg font-medium transition-all text-sm lg:text-base ${
                                    isActive('dashboard')
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                }`}
                            >
                                <FaChartBar className='text-base lg:text-lg flex-shrink-0' />
                                <span>Dashboard</span>
                            </Link>
                            
                            <Link 
                                to={"all-users"} 
                                className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg font-medium transition-all text-sm lg:text-base ${
                                    isActive('all-users')
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                }`}
                            >
                                <FaUsers className='text-base lg:text-lg flex-shrink-0' />
                                <span>All Users</span>
                            </Link>
                            
                            <Link 
                                to={"all-products"} 
                                className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg font-medium transition-all text-sm lg:text-base ${
                                    isActive('all-products')
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                }`}
                            >
                                <FaBoxOpen className='text-base lg:text-lg flex-shrink-0' />
                                <span>All Products</span>
                            </Link>

                            <Link 
                                to={"reclamations"} 
                                className={`flex items-center justify-between px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg font-medium transition-all text-sm lg:text-base ${
                                    isActive('reclamations')
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                }`}
                            >
                                <div className='flex items-center gap-2 lg:gap-3'>
                                    <FaEnvelope className='text-base lg:text-lg flex-shrink-0' />
                                    <span>Reclamations</span>
                                </div>
                                {reclamationCount > 0 && (
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                        isActive('reclamations') 
                                            ? 'bg-white text-indigo-600' 
                                            : 'bg-indigo-600 text-white'
                                    }`}>
                                        {reclamationCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </nav>

                    {/* Footer Info */}
                    <div className='absolute bottom-0 left-0 right-0 p-3 lg:p-4 border-t border-gray-200 bg-gray-50'>
                        <p className='text-xs text-gray-500 text-center'>
                            Admin Dashboard v1.0
                        </p>
                    </div>
                </aside>

                {/* Mobile Sidebar Overlay & Sidebar */}
                {mobileSidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <div 
                            className='md:hidden fixed inset-0 bg-black bg-opacity-50 z-40'
                            onClick={closeMobileSidebar}
                        ></div>
                        
                        {/* Mobile Sidebar */}
                        <aside className='md:hidden fixed top-16 sm:top-20 left-0 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] w-64 sm:w-72 bg-white shadow-xl z-50 overflow-y-auto animate-slideInRight'>
                            {/* Profile Section */}
                            <div className='p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50'>
                                <div className='flex flex-col items-center gap-2 sm:gap-3'>
                                    <div className='relative'>
                                        <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 border-indigo-200 shadow-md bg-white'>
                                            {user?.profilePic ? (
                                                <img 
                                                    src={user?.profilePic} 
                                                    className='w-full h-full object-cover' 
                                                    alt={user?.name} 
                                                />
                                            ) : (
                                                <FaRegCircleUser className='w-full h-full text-indigo-400 p-3' />
                                            )}
                                        </div>
                                        <div className='absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white'></div>
                                    </div>
                                    <div className='text-center'>
                                        <p className='font-bold text-gray-900 text-base sm:text-lg'>{user?.name}</p>
                                        <span className='inline-block mt-1 px-2 sm:px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold'>
                                            {user?.role}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className='p-3 sm:p-4'>
                                <div className='space-y-2'>
                                    <Link 
                                        to={"dashboard"} 
                                        onClick={closeMobileSidebar}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                                            isActive('dashboard')
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                        }`}
                                    >
                                        <FaChartBar className='text-lg' />
                                        <span>Dashboard</span>
                                    </Link>
                                    
                                    <Link 
                                        to={"all-users"} 
                                        onClick={closeMobileSidebar}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                                            isActive('all-users')
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                        }`}
                                    >
                                        <FaUsers className='text-lg' />
                                        <span>All Users</span>
                                    </Link>
                                    
                                    <Link 
                                        to={"all-products"} 
                                        onClick={closeMobileSidebar}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                                            isActive('all-products')
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                        }`}
                                    >
                                        <FaBoxOpen className='text-lg' />
                                        <span>All Products</span>
                                    </Link>

                                    <Link 
                                        to={"reclamations"} 
                                        onClick={closeMobileSidebar}
                                        className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
                                            isActive('reclamations')
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                        }`}
                                    >
                                        <div className='flex items-center gap-3'>
                                            <FaEnvelope className='text-lg' />
                                            <span>Reclamations</span>
                                        </div>
                                        {reclamationCount > 0 && (
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                                isActive('reclamations') 
                                                    ? 'bg-white text-indigo-600' 
                                                    : 'bg-indigo-600 text-white'
                                            }`}>
                                                {reclamationCount}
                                            </span>
                                        )}
                                    </Link>
                                </div>
                            </nav>

                            {/* Footer Info */}
                            <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50'>
                                <p className='text-xs text-gray-500 text-center'>
                                    Admin Dashboard v1.0
                                </p>
                            </div>
                        </aside>
                    </>
                )}

                {/* Main Content */}
                <main className='flex-1 p-3 sm:p-4 lg:p-6 overflow-auto w-full'>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminPanel
