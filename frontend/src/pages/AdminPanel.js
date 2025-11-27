import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaRegCircleUser, FaUsers, FaBoxOpen } from "react-icons/fa6";
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import ROLE from '../common/role';

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (user?.role !== ROLE.ADMIN) {
            navigate("/")
        }
    }, [user])

    const isActive = (path) => {
        return location.pathname.includes(path)
    }

    return (
        <div className='min-h-[calc(100vh-120px)] md:flex hidden bg-gray-50'>
            {/* Sidebar */}
            <aside className='bg-white min-h-full w-full max-w-64 shadow-lg border-r border-gray-200'>
                {/* Profile Section */}
                <div className='p-6 border-b border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50'>
                    <div className='flex flex-col items-center gap-3'>
                        <div className='relative'>
                            <div className='w-20 h-20 rounded-full overflow-hidden border-3 border-indigo-200 shadow-md bg-white'>
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
                            <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white'></div>
                        </div>
                        <div className='text-center'>
                            <p className='font-bold text-gray-900 text-lg'>{user?.name}</p>
                            <span className='inline-block mt-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold'>
                                {user?.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className='p-4'>
                    <div className='space-y-2'>
                        <Link 
                            to={"all-users"} 
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
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                                isActive('all-products')
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                            }`}
                        >
                            <FaBoxOpen className='text-lg' />
                            <span>All Products</span>
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

            {/* Main Content */}
            <main className='flex-1 p-6 overflow-auto'>
                <Outlet />
            </main>
        </div>
    )
}

export default AdminPanel