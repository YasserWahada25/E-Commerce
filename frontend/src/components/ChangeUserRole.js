import React, { useState } from 'react'
import ROLE from '../common/role'
import { IoMdClose } from "react-icons/io";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const ChangeUserRole = ({
    name,
    email,
    role,
    userId,
    onClose,
    callFunc,
}) => {
    const [userRole,setUserRole] = useState(role)

    const handleOnChangeSelect = (e) => {
        setUserRole(e.target.value)

        console.log(e.target.value)
    }

    const updateUserRole = async() =>{
        const fetchResponse = await fetch(SummaryApi.updateUser.url,{
            method : SummaryApi.updateUser.method,
            credentials : 'include',
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({
                userId : userId,
                role : userRole
            })
        })

        const responseData = await fetchResponse.json()

        if(responseData.success){
            toast.success(responseData.message)
            onClose()
            callFunc()
        }

        console.log("role updated",responseData)

    }

  return (
    <div className='fixed w-full h-full bg-slate-900 bg-opacity-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 p-2 sm:p-4'>
       <div className='bg-white rounded-xl sm:rounded-2xl w-full max-w-md shadow-xl'>
            
            {/* Header */}
            <div className='flex justify-between items-center p-4 sm:p-6 border-b border-gray-200'>
                <div>
                  <h2 className='font-bold text-xl sm:text-2xl text-gray-900'>Change User Role</h2>
                  <p className='text-xs sm:text-sm text-gray-500 mt-1'>Update user permissions</p>
                </div>
                <button 
                  className='w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-red-600 transition-all flex-shrink-0' 
                  onClick={onClose}
                >
                    <IoMdClose className='text-xl sm:text-2xl'/>
                </button>
            </div>

            {/* Content */}
            <div className='p-4 sm:p-6 space-y-3 sm:space-y-4'>
              <div>
                <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2'>Name</label>
                <input 
                  type='text' 
                  value={name} 
                  readOnly 
                  className='input-modern w-full bg-gray-50 cursor-not-allowed'
                />
              </div>

              <div>
                <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2'>Email</label>
                <input 
                  type='email' 
                  value={email} 
                  readOnly 
                  className='input-modern w-full bg-gray-50 cursor-not-allowed'
                />
              </div>

              <div>
                <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2'>Role</label>
                <select 
                  className='input-modern w-full' 
                  value={userRole} 
                  onChange={handleOnChangeSelect}
                >
                    {
                        Object.values(ROLE).map(el => {
                            return(
                                <option value={el} key={el}>{el}</option>
                            )
                        })
                    }
                </select>
              </div>

              {/* Submit Button */}
              <div className='pt-3 sm:pt-4'>
                <button 
                  className='w-full py-2.5 sm:py-3 px-6 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all shadow-sm hover:shadow-md text-sm sm:text-base' 
                  onClick={updateUserRole}
                >
                  Change Role
                </button>
              </div>
            </div>
       </div>
    </div>
  )
}

export default ChangeUserRole