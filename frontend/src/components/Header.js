import React, { useContext, useState, useEffect, useRef } from 'react'
import Logo from './Logo'
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
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
  const context = useContext(Context)
  const navigate = useNavigate()
  const searchInput = useLocation()
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchPopup, setShowSearchPopup] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const menuRef = useRef(null)
  const searchRef = useRef(null)
  const searchTimeoutRef = useRef(null)

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

    // Nettoyer le timeout précédent
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Si l'utilisateur tape, ouvrir le popup immédiatement
    if (value.trim()) {
      setShowSearchPopup(true)
      setIsSearching(true)
      
      // Debounce: attendre 300ms après la dernière frappe pour l'API
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
    navigate(`/product/${productId}`)
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
    }

    if (menuDisplay || showSearchPopup) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuDisplay, showSearchPopup])

  // Nettoyer le timeout lors du démontage
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  return (
    <header className='h-20 shadow-md bg-white fixed w-full z-50'>
      <div className='h-full container mx-auto flex items-center px-6 justify-between'>
        {/* Logo */}
        <div className='flex items-center gap-8'>
          <Link to={"/"}>
            <Logo w={90} h={50} />
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className='hidden lg:flex items-center gap-6'>
            <Link 
              to="/" 
              className={`relative text-gray-700 hover:text-indigo-600 font-medium transition-all pb-1 ${
                searchInput.pathname === '/' 
                  ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600' 
                  : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/categories" 
              className={`relative text-gray-700 hover:text-indigo-600 font-medium transition-all pb-1 ${
                searchInput.pathname === '/categories' 
                  ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600' 
                  : ''
              }`}
            >
              Categories
            </Link>
            <Link 
              to="/about" 
              className={`relative text-gray-700 hover:text-indigo-600 font-medium transition-all pb-1 ${
                searchInput.pathname === '/about' 
                  ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600' 
                  : ''
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`relative text-gray-700 hover:text-indigo-600 font-medium transition-all pb-1 ${
                searchInput.pathname === '/contact' 
                  ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600' 
                  : ''
              }`}
            >
              Contact Us
            </Link>
          </nav>
        </div>

        {/* Search Bar */}
        <div className='hidden lg:flex items-center flex-1 max-w-md mx-8 relative' ref={searchRef}>
          <div className='w-full flex items-center bg-gray-100 rounded-full overflow-hidden border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all px-4'>
            <input
              type='text'
              placeholder='Rechercher des produits...'
              className='w-full py-2.5 bg-transparent outline-none text-sm'
              onChange={handleSearchInput}
              value={search}
            />
            <button className='text-gray-500 hover:text-indigo-600 transition-colors'>
              <GrSearch className="text-xl" />
            </button>
          </div>

          {/* Search Popup */}
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

        {/* Right Side Icons */}
        <div className='flex items-center gap-6'>
          {/* User Menu */}
          <div className='relative' ref={menuRef}>
            {user?._id && (
              <>
                <div
                  className='text-3xl cursor-pointer relative flex justify-center'
                  onClick={() => setMenuDisplay(prev => !prev)}
                >
                  {user?.profilePic ? (
                    <img 
                      src={user?.profilePic} 
                      className='w-10 h-10 rounded-full object-cover border-2 border-indigo-200 hover:border-indigo-400 transition-all' 
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
    </header>
  )
}

export default Header