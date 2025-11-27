import React, { useContext, useState, useEffect, useRef } from 'react'
import Logo from './Logo'
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify'
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';
import displayINRCurrency from '../helpers/displayCurrency';

const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const [menuDisplay, setMenuDisplay] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const context = useContext(Context)
  const navigate = useNavigate()
  const searchInput = useLocation()
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchPopup, setShowSearchPopup] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const menuRef = useRef(null)
  const searchRef = useRef(null)
  const searchTimeoutRef = useRef(null)
  const mobileMenuRef = useRef(null)

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
      setMobileMenuOpen(false)
    }

    if (data.error) {
      toast.error(data.message)
    }
  }

  const handleSearch = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      setSearchResults([])
      setShowSearchPopup(false)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    
    try {
      const url = `${SummaryApi.searchByTitle.url}?title=${encodeURIComponent(searchTerm)}`
      console.log('🔍 Recherche:', searchTerm)
      
      const response = await fetch(url, {
        method: SummaryApi.searchByTitle.method,
        credentials: 'include'
      })
      
      const data = await response.json()
      console.log('📦 Résultats:', data.data?.length || 0, 'produit(s)')
      
      if (data.success) {
        setSearchResults(data.data || [])
      } else {
        console.warn('⚠️ Erreur API:', data.message)
        setSearchResults([])
      }
    } catch (error) {
      console.error('❌ Erreur réseau:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchInput = (e) => {
    const { value } = e.target
    setSearch(value)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (value.trim()) {
      setShowSearchPopup(true)
      setIsSearching(true)
      
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(value)
      }, 300)
    } else {
      setSearchResults([])
      setShowSearchPopup(false)
      setIsSearching(false)
    }
  }

  const handleProductClick = (productId) => {
    setShowSearchPopup(false)
    setSearch('')
    setSearchResults([])
    setMobileSearchOpen(false)
    setMobileMenuOpen(false)
    navigate(`/product/${productId}`)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuDisplay(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchPopup(false)
        setSearch('')
        setSearchResults([])
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false)
      }
    }

    if (menuDisplay || showSearchPopup || mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuDisplay, showSearchPopup, mobileMenuOpen])

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  return (
    <header className='h-16 sm:h-20 shadow-md bg-white fixed w-full z-50'>
      <div className='h-full container mx-auto flex items-center px-3 sm:px-6 justify-between'>
        {/* Left Section - Logo */}
        <div className='flex items-center gap-2 sm:gap-4'>
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='lg:hidden mobile-menu-button text-gray-600 hover:text-indigo-600 transition-colors p-2'
          >
            {mobileMenuOpen ? (
              <FaTimes className='text-xl sm:text-2xl' />
            ) : (
              <FaBars className='text-xl sm:text-2xl' />
            )}
          </button>

          <Link to={"/"} onClick={closeMobileMenu}>
            <Logo w={70} h={40} className="sm:w-[90px] sm:h-[50px]" />
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden lg:flex items-center gap-4 xl:gap-6 ml-4'>
            <Link 
              to="/" 
              className={`relative text-sm xl:text-base text-gray-700 hover:text-indigo-600 font-medium transition-all pb-1 ${
                searchInput.pathname === '/' 
                  ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600' 
                  : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/categories" 
              className={`relative text-sm xl:text-base text-gray-700 hover:text-indigo-600 font-medium transition-all pb-1 ${
                searchInput.pathname === '/categories' 
                  ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600' 
                  : ''
              }`}
            >
              Categories
            </Link>
            <Link 
              to="/about" 
              className={`relative text-sm xl:text-base text-gray-700 hover:text-indigo-600 font-medium transition-all pb-1 ${
                searchInput.pathname === '/about' 
                  ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600' 
                  : ''
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`relative text-sm xl:text-base text-gray-700 hover:text-indigo-600 font-medium transition-all pb-1 ${
                searchInput.pathname === '/contact' 
                  ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600' 
                  : ''
              }`}
            >
              Contact Us
            </Link>
          </nav>
        </div>

        {/* Center Section - Desktop Search Bar */}
        <div className='hidden lg:flex items-center flex-1 max-w-md mx-4 xl:mx-8 relative' ref={searchRef}>
          <div className='w-full flex items-center bg-gray-100 rounded-full overflow-hidden border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all px-4'>
            <input
              type='text'
              placeholder='Rechercher des produits...'
              className='w-full py-2 sm:py-2.5 bg-transparent outline-none text-sm'
              onChange={handleSearchInput}
              value={search}
            />
            <button className='text-gray-500 hover:text-indigo-600 transition-colors'>
              <GrSearch className="text-lg xl:text-xl" />
            </button>
          </div>

          {/* Search Popup - Desktop */}
          {showSearchPopup && (
            <div 
              className='absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto animate-fadeInDown'
              style={{ zIndex: 9999 }}
            >
              {isSearching ? (
                <div className='p-6 text-center text-gray-600'>
                  <div className='animate-pulse flex items-center justify-center gap-2'>
                    <svg className='animate-spin h-5 w-5 text-indigo-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    <span>Recherche en cours...</span>
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className='py-2'>
                  {searchResults.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleProductClick(product._id)}
                      className='flex items-center gap-4 p-3 hover:bg-indigo-50 cursor-pointer transition-all border-b border-gray-100 last:border-b-0'
                    >
                      <div className='w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden'>
                        <img
                          src={product.productImage[0]}
                          alt={product.productName}
                          className='w-full h-full object-contain'
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/64'
                          }}
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-800 truncate'>
                          {product.productName}
                        </p>
                      </div>
                      <div className='flex-shrink-0'>
                        <p className='text-sm font-bold text-indigo-600'>
                          {displayINRCurrency(product.sellingPrice)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='p-6 text-center text-gray-600'>
                  <div className='text-4xl mb-2'>🔍</div>
                  <p className='font-medium'>Aucun produit trouvé</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section - Icons & Buttons */}
        <div className='flex items-center gap-2 sm:gap-4 md:gap-6'>
          {/* Mobile Search Icon */}
          <button 
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className='lg:hidden text-gray-600 hover:text-indigo-600 transition-colors p-2'
          >
            <GrSearch className="text-lg sm:text-xl" />
          </button>

          {/* User Menu - Desktop */}
          <div className='hidden sm:block relative' ref={menuRef}>
            {user?._id && (
              <>
                <div
                  className='text-2xl md:text-3xl cursor-pointer relative flex justify-center'
                  onClick={() => setMenuDisplay(prev => !prev)}
                >
                  {user?.profilePic ? (
                    <img 
                      src={user?.profilePic} 
                      className='w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-indigo-200 hover:border-indigo-400 transition-all' 
                      alt={user?.name} 
                    />
                  ) : (
                    <FaRegCircleUser className="text-gray-600 hover:text-indigo-600 transition-colors" />
                  )}
                </div>

                {menuDisplay && (
                  <div className='absolute top-12 right-0 bg-white shadow-xl rounded-lg overflow-hidden min-w-[180px] z-50 slide-down border border-gray-100'>
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
                      
                      <Link
                        to={"/profile"}
                        className='block px-4 py-2.5 hover:bg-indigo-50 rounded-lg transition-colors text-gray-700 hover:text-indigo-600 font-medium'
                        onClick={() => setMenuDisplay(false)}
                      >
                        Profile
                      </Link>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Cart */}
          {user?._id && (
            <Link to={"/cart"} onClick={closeMobileMenu} className='text-xl sm:text-2xl relative group'>
              <FaShoppingCart className="text-gray-600 group-hover:text-indigo-600 transition-colors" />
              <div className='bg-indigo-600 text-white w-4 h-4 sm:w-5 sm:h-5 rounded-full p-0.5 sm:p-1 flex items-center justify-center absolute -top-1 sm:-top-2 -right-2 sm:-right-3 text-[10px] sm:text-xs font-semibold'>
                {context?.cartProductCount}
              </div>
            </Link>
          )}

          {/* Login/Logout - Desktop */}
          <div className='hidden sm:block'>
            {user?._id ? (
              <button
                onClick={handleLogout}
                className='px-3 py-2 md:px-5 md:py-2.5 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 font-medium transition-all shadow-sm hover:shadow-md text-sm md:text-base'
              >
                Logout
              </button>
            ) : (
              <Link
                to={"/login"}
                className='px-3 py-2 md:px-5 md:py-2.5 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 font-medium transition-all shadow-sm hover:shadow-md inline-block text-sm md:text-base'
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className='lg:hidden bg-white border-t border-gray-200 p-3 sm:p-4'>
          <div className='relative'>
            <div className='flex items-center bg-gray-100 rounded-full overflow-hidden border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all px-4'>
              <input
                type='text'
                placeholder='Rechercher des produits...'
                className='w-full py-2 bg-transparent outline-none text-sm'
                onChange={handleSearchInput}
                value={search}
              />
              <button className='text-gray-500 hover:text-indigo-600 transition-colors'>
                <GrSearch className="text-lg" />
              </button>
            </div>

            {/* Search Popup - Mobile */}
            {showSearchPopup && (
              <div 
                className='absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-xl border border-gray-200 max-h-80 overflow-y-auto animate-fadeInDown'
                style={{ zIndex: 9999 }}
              >
                {isSearching ? (
                  <div className='p-4 text-center text-gray-600'>
                    <div className='animate-pulse flex items-center justify-center gap-2'>
                      <svg className='animate-spin h-5 w-5 text-indigo-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                      <span className='text-sm'>Recherche en cours...</span>
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className='py-2'>
                    {searchResults.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => handleProductClick(product._id)}
                        className='flex items-center gap-3 p-3 hover:bg-indigo-50 cursor-pointer transition-all border-b border-gray-100 last:border-b-0'
                      >
                        <div className='w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden'>
                          <img
                            src={product.productImage[0]}
                            alt={product.productName}
                            className='w-full h-full object-contain'
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/64'
                            }}
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-xs sm:text-sm font-medium text-gray-800 truncate'>
                            {product.productName}
                          </p>
                        </div>
                        <div className='flex-shrink-0'>
                          <p className='text-xs sm:text-sm font-bold text-indigo-600'>
                            {displayINRCurrency(product.sellingPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='p-4 text-center text-gray-600'>
                    <div className='text-3xl mb-2'>🔍</div>
                    <p className='font-medium text-sm'>Aucun produit trouvé</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div className='lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40' style={{ top: '64px' }}></div>
          
          {/* Mobile Menu */}
          <div 
            ref={mobileMenuRef}
            className='lg:hidden fixed top-16 sm:top-20 left-0 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] w-64 sm:w-80 bg-white shadow-xl z-50 animate-slideInRight overflow-y-auto'
          >
            <div className='p-4 sm:p-6'>
              {/* User Profile Section - Mobile */}
              {user?._id && (
                <div className='mb-6 pb-6 border-b border-gray-200'>
                  <div className='flex items-center gap-3 mb-4'>
                    {user?.profilePic ? (
                      <img 
                        src={user?.profilePic} 
                        className='w-12 h-12 rounded-full object-cover border-2 border-indigo-200' 
                        alt={user?.name} 
                      />
                    ) : (
                      <div className='w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center'>
                        <FaRegCircleUser className="text-2xl text-indigo-600" />
                      </div>
                    )}
                    <div>
                      <p className='font-semibold text-gray-900'>{user?.name}</p>
                      <p className='text-xs text-gray-500'>{user?.email}</p>
                    </div>
                  </div>
                  
                  {user?.role === ROLE.ADMIN && (
                    <Link
                      to={"/admin-panel/all-products"}
                      className='block w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium text-sm hover:bg-indigo-100 transition-colors mb-2'
                      onClick={closeMobileMenu}
                    >
                      Admin Panel
                    </Link>
                  )}
                  
                  <Link
                    to={"/profile"}
                    className='block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors'
                    onClick={closeMobileMenu}
                  >
                    My Profile
                  </Link>
                </div>
              )}

              {/* Navigation Links */}
              <nav className='space-y-2 mb-6'>
                <Link 
                  to="/" 
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                    searchInput.pathname === '/' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  to="/categories" 
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                    searchInput.pathname === '/categories' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  Categories
                </Link>
                <Link 
                  to="/about" 
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                    searchInput.pathname === '/about' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                    searchInput.pathname === '/contact' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  Contact Us
                </Link>
              </nav>

              {/* Login/Logout Button - Mobile */}
              <div className='pt-4 border-t border-gray-200'>
                {user?._id ? (
                  <button
                    onClick={handleLogout}
                    className='w-full px-4 py-3 rounded-lg text-white bg-red-500 hover:bg-red-600 font-medium transition-all shadow-sm text-center'
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to={"/login"}
                    onClick={closeMobileMenu}
                    className='block w-full px-4 py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-medium transition-all shadow-sm text-center'
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}

export default Header
