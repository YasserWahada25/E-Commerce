import React from 'react'
import { FaShoppingBag, FaUsers, FaShieldAlt, FaTruck } from 'react-icons/fa'

const About = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <div className='bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20'>
        <div className='container mx-auto px-6'>
          <div className='max-w-3xl mx-auto text-center'>
            <h1 className='text-5xl font-bold mb-6'>About Us</h1>
            <p className='text-xl text-indigo-100 leading-relaxed'>
              Welcome to our e-commerce platform. We're dedicated to providing you with the best online shopping experience, 
              offering quality products, exceptional service, and unbeatable value.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className='container mx-auto px-6 py-16'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-2xl shadow-lg p-8 mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>Our Mission</h2>
            <p className='text-lg text-gray-600 leading-relaxed'>
              Our mission is to revolutionize online shopping by creating a seamless, enjoyable, and trustworthy platform 
              where customers can discover and purchase products they love. We believe in quality, transparency, and 
              putting our customers first in everything we do.
            </p>
          </div>

          {/* Features Grid */}
          <div className='grid md:grid-cols-2 gap-6 mb-12'>
            <div className='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all'>
              <div className='w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-4'>
                <FaShoppingBag className='text-2xl text-indigo-600' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>Quality Products</h3>
              <p className='text-gray-600'>
                We carefully curate our product selection to ensure you receive only the highest quality items.
              </p>
            </div>

            <div className='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all'>
              <div className='w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-4'>
                <FaTruck className='text-2xl text-indigo-600' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>Fast Delivery</h3>
              <p className='text-gray-600'>
                Quick and reliable shipping to get your products to you as fast as possible.
              </p>
            </div>

            <div className='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all'>
              <div className='w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-4'>
                <FaShieldAlt className='text-2xl text-indigo-600' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>Secure Shopping</h3>
              <p className='text-gray-600'>
                Your security is our priority. Shop with confidence knowing your data is protected.
              </p>
            </div>

            <div className='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all'>
              <div className='w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-4'>
                <FaUsers className='text-2xl text-indigo-600' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>Customer Support</h3>
              <p className='text-gray-600'>
                Our dedicated support team is here to help you with any questions or concerns.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className='bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8'>
            <h2 className='text-3xl font-bold text-gray-900 mb-6 text-center'>Our Values</h2>
            <div className='space-y-4'>
              <div className='flex items-start gap-4'>
                <div className='w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0'></div>
                <div>
                  <h4 className='font-semibold text-gray-900 mb-1'>Customer First</h4>
                  <p className='text-gray-600'>We prioritize customer satisfaction in every decision we make.</p>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0'></div>
                <div>
                  <h4 className='font-semibold text-gray-900 mb-1'>Innovation</h4>
                  <p className='text-gray-600'>We continuously improve our platform to enhance your shopping experience.</p>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0'></div>
                <div>
                  <h4 className='font-semibold text-gray-900 mb-1'>Integrity</h4>
                  <p className='text-gray-600'>We operate with transparency and honesty in all our interactions.</p>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0'></div>
                <div>
                  <h4 className='font-semibold text-gray-900 mb-1'>Excellence</h4>
                  <p className='text-gray-600'>We strive for excellence in product quality and customer service.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
