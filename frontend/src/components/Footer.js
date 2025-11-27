import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white mt-auto'>
      {/* Main Footer Content */}
      <div className='container mx-auto px-4 sm:px-6 py-8 sm:py-12'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8'>
          {/* Company Info */}
          <div className='space-y-4'>
            <h3 className='text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4'>À propos de nous</h3>
            <p className='text-sm sm:text-base text-gray-300 leading-relaxed'>
              Votre destination e-commerce de confiance pour des produits de qualité et un service exceptionnel.
            </p>
            <div className='flex gap-3 pt-2'>
              <a 
                href='https://facebook.com' 
                target='_blank' 
                rel='noopener noreferrer'
                className='w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 flex items-center justify-center transition-all hover:scale-110'
                aria-label='Facebook'
              >
                <FaFacebook className='text-base sm:text-lg' />
              </a>
              <a 
                href='https://twitter.com' 
                target='_blank' 
                rel='noopener noreferrer'
                className='w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 flex items-center justify-center transition-all hover:scale-110'
                aria-label='Twitter'
              >
                <FaTwitter className='text-base sm:text-lg' />
              </a>
              <a 
                href='https://instagram.com' 
                target='_blank' 
                rel='noopener noreferrer'
                className='w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 flex items-center justify-center transition-all hover:scale-110'
                aria-label='Instagram'
              >
                <FaInstagram className='text-base sm:text-lg' />
              </a>
              <a 
                href='https://linkedin.com' 
                target='_blank' 
                rel='noopener noreferrer'
                className='w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 flex items-center justify-center transition-all hover:scale-110'
                aria-label='LinkedIn'
              >
                <FaLinkedin className='text-base sm:text-lg' />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h3 className='text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4'>Liens Rapides</h3>
            <ul className='space-y-2 sm:space-y-3'>
              <li>
                <Link to='/' className='text-sm sm:text-base text-gray-300 hover:text-white transition-colors flex items-center gap-2 group'>
                  <span className='w-0 group-hover:w-2 h-0.5 bg-indigo-400 transition-all'></span>
                  Accueil
                </Link>
              </li>
              <li>
                <Link to='/categories' className='text-sm sm:text-base text-gray-300 hover:text-white transition-colors flex items-center gap-2 group'>
                  <span className='w-0 group-hover:w-2 h-0.5 bg-indigo-400 transition-all'></span>
                  Catégories
                </Link>
              </li>
              <li>
                <Link to='/about' className='text-sm sm:text-base text-gray-300 hover:text-white transition-colors flex items-center gap-2 group'>
                  <span className='w-0 group-hover:w-2 h-0.5 bg-indigo-400 transition-all'></span>
                  À propos
                </Link>
              </li>
              <li>
                <Link to='/contact' className='text-sm sm:text-base text-gray-300 hover:text-white transition-colors flex items-center gap-2 group'>
                  <span className='w-0 group-hover:w-2 h-0.5 bg-indigo-400 transition-all'></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className='space-y-4'>
            <h3 className='text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4'>Service Client</h3>
            <ul className='space-y-2 sm:space-y-3'>
              <li>
                <a href='#' className='text-sm sm:text-base text-gray-300 hover:text-white transition-colors flex items-center gap-2 group'>
                  <span className='w-0 group-hover:w-2 h-0.5 bg-indigo-400 transition-all'></span>
                  Politique de retour
                </a>
              </li>
              <li>
                <a href='#' className='text-sm sm:text-base text-gray-300 hover:text-white transition-colors flex items-center gap-2 group'>
                  <span className='w-0 group-hover:w-2 h-0.5 bg-indigo-400 transition-all'></span>
                  Livraison
                </a>
              </li>
              <li>
                <a href='#' className='text-sm sm:text-base text-gray-300 hover:text-white transition-colors flex items-center gap-2 group'>
                  <span className='w-0 group-hover:w-2 h-0.5 bg-indigo-400 transition-all'></span>
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href='#' className='text-sm sm:text-base text-gray-300 hover:text-white transition-colors flex items-center gap-2 group'>
                  <span className='w-0 group-hover:w-2 h-0.5 bg-indigo-400 transition-all'></span>
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className='space-y-4'>
            <h3 className='text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4'>Contactez-nous</h3>
            <ul className='space-y-3 sm:space-y-4'>
              <li className='flex items-start gap-3'>
                <FaMapMarkerAlt className='text-indigo-400 mt-1 flex-shrink-0 text-sm sm:text-base' />
                <span className='text-sm sm:text-base text-gray-300'>
                  123 Avenue Commerce<br />
                  Tunis, Tunisie
                </span>
              </li>
              <li className='flex items-center gap-3'>
                <FaPhone className='text-indigo-400 flex-shrink-0 text-sm sm:text-base' />
                <a href='tel:+21612345678' className='text-sm sm:text-base text-gray-300 hover:text-white transition-colors'>
                  +216 12 345 678
                </a>
              </li>
              <li className='flex items-center gap-3'>
                <FaEnvelope className='text-indigo-400 flex-shrink-0 text-sm sm:text-base' />
                <a href='mailto:contact@ecommerce.com' className='text-sm sm:text-base text-gray-300 hover:text-white transition-colors break-all'>
                  contact@ecommerce.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='border-t border-gray-700 border-opacity-50'>
        <div className='container mx-auto px-4 sm:px-6 py-4 sm:py-6'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4'>
            <p className='text-xs sm:text-sm text-gray-400 text-center sm:text-left'>
              © {currentYear} E-Commerce. Tous droits réservés.
            </p>
            <p className='text-xs sm:text-sm text-gray-400 text-center sm:text-right'>
              Powered by <span className='text-indigo-400 font-semibold'>Degani Omar</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
