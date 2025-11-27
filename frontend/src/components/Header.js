import React, { useContext, useState } from 'react'
import Logo from './Logo'
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser, FaChevronDown } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify'
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';
import CategoryDropdown from './CategoryDropdown';

const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const [menuDisplay, setMenuDisplay] = useState(false)
  const [categoryDropdown, setCategoryDropdown] = useState(false)
  const context = useContext(Context)
  const navigate = useNavigate()
  const searchInput = useLocation()
  const URLSearch = new URLSearchParams(searchInput?.search)
  const searchQuery = URLSearch.getAll("q")
  const [search, setSearch] = useState(searchQuery)

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: 'include'
    })

    const data = await fetchData.json()

    if (data.success) {
      toast.success(data.message)
      dispatch(setUserDetails(null))
      navigate("/")
    }

    if (data.error) {
      toast.error(data.message)
    }
  }

  const handleSearch = (e) => {
    const { value } = e.target
    setSearch(value)

    if (value) {
      navigate(`/search?q=${value}`)
    } else {
      navigate("/search")
    }
  }

  return (
    <header className='h-20 shadow-md bg-white fixed w-full z-40'>
      <div className='h-full container mx-auto flex items-center px-6 justify-between'>
        {/* Logo */}
        <div className='flex items-center gap-8'>
          <Link to={"/"}>
            <Logo w={90} h={50} />
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className='hidden lg:flex items-center gap-6'>
            <button
              onClick={() => setCategoryDropdown(!categoryDropdown)}
              className='flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors relative'
            >
              Categories
              <FaChevronDown className={`text-xs transition-transform ${categoryDropdown ? 'rotate-180' : ''}`} />
            </button>
            <Link to="/deals" className='text-gray-700 hover:text-indigo-600 font-medium transition-colors'>
              Deals
            </Link>
            <Link to="/new" className='text-gray-700 hover:text-indigo-600 font-medium transition-colors'>
              What's New
            </Link>
            <Link to="/delivery" className='text-gray-700 hover:text-indigo-600 font-medium transition-colors'>
              Delivery
            </Link>
          </nav>
        </div>

        {/* Search Bar */}
        <div className='hidden lg:flex items-center flex-1 max-w-md mx-8'>
          <div className='w-full flex items-center bg-gray-100 rounded-full overflow-hidden border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all'>
            <input
              type='text'
              placeholder='Search products...'
              className='w-full px-4 py-2.5 bg-transparent outline-none text-sm'
              onChange={handleSearch}
              value={search}
            />
            <button className='px-4 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors'>
              <GrSearch className="text-white" />
            </button>
          </div>
        </div>

        {/* Right Side Icons */}
        <div className='flex items-center gap-6'>
          {/* User Menu */}
          <div className='relative flex justify-center'>
            {user?._id && (
              <div
                className='text-3xl cursor-pointer relative flex justify-center'
                onClick={() => setMenuDisplay(prev => !prev)}
              >
                {user?.profilePic ? (
                  <img src={user?.profilePic} className='w-10 h-10 rounded-full object-cover border-2 border-indigo-200' alt={user?.name} />
                ) : (
                  <FaRegCircleUser className="text-gray-600 hover:text-indigo-600 transition-colors" />
                )}
              </div>
            )}

            {menuDisplay && (
              <div className='absolute bg-white bottom-0 top-14 right-0 shadow-xl rounded-lg overflow-hidden min-w-[180px] slide-down'>
                <nav className='p-2'>
                  {user?.role === ROLE.ADMIN && (
                    <Link
                      to={"/admin-panel/all-products"}
                      className='block px-4 py-2.5 hover:bg-indigo-50 rounded-lg transition-colors text-gray-700 hover:text-indigo-600 font-medium'
                      onClick={() => setMenuDisplay(false)}
                    >
                      Admin Panel
                    </Link>
                  )}

                  {user?.role === ROLE.ADMIN ? (
                    <Link
                      to={"/admin/profile"}
                      className='block px-4 py-2.5 hover:bg-indigo-50 rounded-lg transition-colors text-gray-700 hover:text-indigo-600 font-medium'
                      onClick={() => setMenuDisplay(false)}
                    >
                      Profile
                    </Link>
                  ) : (
                    <Link
                      to={"/profile"}
                      className='block px-4 py-2.5 hover:bg-indigo-50 rounded-lg transition-colors text-gray-700 hover:text-indigo-600 font-medium'
                      onClick={() => setMenuDisplay(false)}
                    >
                      Profile
                    </Link>
                  )}
                </nav>
              </div>
            )}
          </div>

          {/* Cart */}
          {user?._id && (
            <Link to={"/cart"} className='text-2xl relative group'>
              <FaShoppingCart className="text-gray-600 group-hover:text-indigo-600 transition-colors" />
              <div className='bg-indigo-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3 text-xs font-semibold'>
                {context?.cartProductCount}
              </div>
            </Link>
          )}

          {/* Login/Logout */}
          <div>
            {user?._id ? (
              <button
                onClick={handleLogout}
                className='px-5 py-2.5 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 font-medium transition-all shadow-sm hover:shadow-md'
              >
                Logout
              </button>
            ) : (
              <Link
                to={"/login"}
                className='px-5 py-2.5 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 font-medium transition-all shadow-sm hover:shadow-md inline-block'
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Category Dropdown */}
      <div className='relative'>
        <CategoryDropdown
          isOpen={categoryDropdown}
          onClose={() => setCategoryDropdown(false)}
        />
      </div>
    </header>
  )
}

export default Header