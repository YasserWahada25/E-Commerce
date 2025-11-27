import React, { useState, useEffect } from 'react'
import { FaEnvelope, FaUser, FaPaperPlane, FaLock } from 'react-icons/fa'
import { toast } from 'react-toastify'
import SummaryApi from '../common'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Contact = () => {
  const user = useSelector(state => state?.user?.user)
  const isLoggedIn = Boolean(user?._id)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  // Pré-remplir les champs name et email si l'utilisateur est connecté
  useEffect(() => {
    if (isLoggedIn && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }))
    }
  }, [isLoggedIn, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Vérifier si l'utilisateur est connecté
    if (!isLoggedIn) {
      toast.error('You must be logged in to send a message')
      return
    }
    
    // Validation des champs requis (seulement subject et message pour les utilisateurs connectés)
    if (!formData.subject || !formData.message) {
      toast.error('Please fill in subject and message fields')
      return
    }

    setLoading(true)

    try {
      // N'envoyer que subject et message, le backend récupérera name/email du token
      const response = await fetch(SummaryApi.createReclamation.url, {
        method: SummaryApi.createReclamation.method,
        credentials: 'include', // Important pour envoyer les cookies avec le token
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject: formData.subject,
          message: formData.message
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Your message has been sent successfully!')
        // Réinitialiser seulement subject et message
        setFormData(prev => ({
          ...prev,
          subject: '',
          message: ''
        }))
      } else {
        toast.error(data.message || 'Failed to send message')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.')
      console.error('Contact form error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 sm:py-12 pt-20 sm:pt-24'>
      <div className='container mx-auto px-4 sm:px-6'>
        <div className='max-w-2xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-6 sm:mb-10'>
            <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4'>Contact Us</h1>
            <p className='text-base sm:text-lg text-gray-600'>
              Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          {/* Message de connexion requis */}
          {!isLoggedIn && (
            <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 sm:p-6 mb-4 sm:mb-6 rounded-lg'>
              <div className='flex items-start sm:items-center gap-3'>
                <FaLock className='text-yellow-600 text-xl sm:text-2xl flex-shrink-0 mt-0.5 sm:mt-0' />
                <div>
                  <h3 className='text-base sm:text-lg font-semibold text-yellow-800 mb-1'>
                    Connexion requise
                  </h3>
                  <p className='text-sm sm:text-base text-yellow-700'>
                    Vous devez être connecté pour nous envoyer un message.{' '}
                    <Link to="/login" className='font-bold underline hover:text-yellow-900'>
                      Se connecter maintenant
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Contact Form Card */}
          <div className='bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8'>
            <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-6'>
              {/* Name Field */}
              <div>
                <label htmlFor='name' className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2'>
                  Nom complet {isLoggedIn && <span className='text-xs font-normal text-gray-500'>(automatiquement rempli)</span>}
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                    <FaUser className={isLoggedIn ? 'text-gray-400' : 'text-gray-300'} />
                  </div>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={isLoggedIn ? '' : 'Your full name'}
                    disabled={!isLoggedIn || isLoggedIn}
                    readOnly={isLoggedIn}
                    className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg transition-all ${
                      isLoggedIn 
                        ? 'bg-gray-50 cursor-not-allowed text-gray-700' 
                        : 'bg-gray-100 cursor-not-allowed text-gray-400'
                    }`}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor='email' className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2'>
                  Email {isLoggedIn && <span className='text-xs font-normal text-gray-500'>(automatiquement rempli)</span>}
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                    <FaEnvelope className={isLoggedIn ? 'text-gray-400' : 'text-gray-300'} />
                  </div>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={isLoggedIn ? '' : 'your.email@example.com'}
                    disabled={!isLoggedIn || isLoggedIn}
                    readOnly={isLoggedIn}
                    className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg transition-all ${
                      isLoggedIn 
                        ? 'bg-gray-50 cursor-not-allowed text-gray-700' 
                        : 'bg-gray-100 cursor-not-allowed text-gray-400'
                    }`}
                  />
                </div>
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor='subject' className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2'>
                  Sujet {!isLoggedIn && <span className='text-red-500'>*</span>}
                </label>
                <input
                  type='text'
                  id='subject'
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={isLoggedIn ? 'What is this about?' : 'Connectez-vous pour envoyer un message'}
                  disabled={!isLoggedIn}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all ${
                    isLoggedIn 
                      ? 'focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100' 
                      : 'bg-gray-100 cursor-not-allowed text-gray-400'
                  }`}
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor='message' className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2'>
                  Message {!isLoggedIn && <span className='text-red-500'>*</span>}
                </label>
                <textarea
                  id='message'
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={isLoggedIn ? 'Tell us more about your inquiry...' : 'Connectez-vous pour envoyer un message'}
                  rows='6'
                  disabled={!isLoggedIn}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all resize-none ${
                    isLoggedIn 
                      ? 'focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100' 
                      : 'bg-gray-100 cursor-not-allowed text-gray-400'
                  }`}
                ></textarea>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type='submit'
                  disabled={!isLoggedIn || loading}
                  title={!isLoggedIn ? 'You must be logged in to send a message' : ''}
                  className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                >
                  {loading ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      Envoi en cours...
                    </>
                  ) : !isLoggedIn ? (
                    <>
                      <FaLock />
                      Connexion requise
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Envoyer le message
                    </>
                  )}
                </button>
                {!isLoggedIn && (
                  <p className='text-sm text-gray-500 text-center mt-3'>
                    Vous devez être connecté pour envoyer un message.
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className='mt-8 text-center'>
            <p className='text-sm text-gray-500'>
              We typically respond within 24-48 hours during business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
