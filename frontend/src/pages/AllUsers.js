import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import moment from 'moment'
import { MdModeEdit } from "react-icons/md";
import ChangeUserRole from '../components/ChangeUserRole';

const AllUsers = () => {
    const [allUser,setAllUsers] = useState([])
    const [openUpdateRole,setOpenUpdateRole] = useState(false)
    const [updateUserDetails,setUpdateUserDetails] = useState({
        email : "",
        name : "",
        role : "",
        _id  : ""
    })

    const fetchAllUsers = async() => {
        const fetchData = await fetch(SummaryApi.allUser.url,{
            method : SummaryApi.allUser.method,
            credentials : 'include'
        })

        const dataResponse = await fetchData.json()

        if(dataResponse.success){
            setAllUsers(dataResponse.data)
        }

        if(dataResponse.error){
            toast.error(dataResponse.message)
        }

    }

    useEffect(()=>{
        fetchAllUsers()
    },[])

  return (
    <div className='min-h-full'>
        {/* Header */}
        <div className='bg-white rounded-xl shadow-sm p-6 mb-6'>
            <div>
              <h2 className='font-bold text-2xl text-gray-900'>All Users</h2>
              <p className='text-sm text-gray-500 mt-1'>Manage user accounts and roles</p>
            </div>
        </div>

        {/* Table Container */}
        <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
            <div className='overflow-x-auto'>
                <table className='w-full'>
                    <thead>
                        <tr className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white'>
                            <th className='py-4 px-6 text-left text-sm font-semibold'>Sr.</th>
                            <th className='py-4 px-6 text-left text-sm font-semibold'>Name</th>
                            <th className='py-4 px-6 text-left text-sm font-semibold'>Email</th>
                            <th className='py-4 px-6 text-left text-sm font-semibold'>Role</th>
                            <th className='py-4 px-6 text-left text-sm font-semibold'>Created Date</th>
                            <th className='py-4 px-6 text-left text-sm font-semibold'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            allUser.map((el,index) => {
                                return(
                                    <tr 
                                        key={el._id} 
                                        className='border-b border-gray-100 hover:bg-indigo-50 transition-colors'
                                    >
                                        <td className='py-4 px-6 text-sm text-gray-700'>{index+1}</td>
                                        <td className='py-4 px-6'>
                                            <span className='font-medium text-gray-900'>{el?.name}</span>
                                        </td>
                                        <td className='py-4 px-6 text-sm text-gray-600'>{el?.email}</td>
                                        <td className='py-4 px-6'>
                                            <span className={`badge ${el?.role === 'ADMIN' ? 'badge-primary' : 'badge-success'}`}>
                                                {el?.role}
                                            </span>
                                        </td>
                                        <td className='py-4 px-6 text-sm text-gray-600'>
                                            {moment(el?.createdAt).format('LL')}
                                        </td>
                                        <td className='py-4 px-6'>
                                            <button 
                                                className='p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-md' 
                                                onClick={()=>{
                                                    setUpdateUserDetails(el)
                                                    setOpenUpdateRole(true)
                                                }}
                                            >
                                                <MdModeEdit className='text-lg'/>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>

        {/* Change User Role Modal */}
        {
            openUpdateRole && (
                <ChangeUserRole 
                    onClose={()=>setOpenUpdateRole(false)} 
                    name={updateUserDetails.name}
                    email={updateUserDetails.email}
                    role={updateUserDetails.role}
                    userId={updateUserDetails._id}
                    callFunc={fetchAllUsers}
                />
            )      
        }
    </div>
  )
}

export default AllUsers