import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaRegCircleUser } from "react-icons/fa6";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const UserProfile = () => {
    const user = useSelector(state => state?.user?.user)
    const [data,setData] = useState({
        name : "",
        email : "",
        profilePic : "",
        role : "",
        createdAt : ""
    })

    const fetchUserProfile = async() =>{
        const response = await fetch(SummaryApi.userProfile.url,{
            method : SummaryApi.userProfile.method,
            credentials : 'include',
            headers : {
                "content-type" : "application/json"
            }
        })

        const dataResponse = await response.json()

        if(dataResponse.success){
            setData(dataResponse.data)
        }

        if(dataResponse.error){
            toast.error(dataResponse.message)
        }
    }

    useEffect(()=>{
        fetchUserProfile()
    },[])

  return (
    <div className='p-4'>
        <div className='w-full max-w-sm bg-white m-auto rounded shadow-md p-4'>
            <div className='w-20 h-20 mx-auto relative rounded-full overflow-hidden'>
                {
                    data.profilePic ? (
                        <img src={data.profilePic} alt={data.name} className='w-full h-full object-cover'/>
                    ) : (
                        <FaRegCircleUser className='w-full h-full'/>
                    )
                }
            </div>
            
            <div className='text-center mt-4'>
                <p className='text-lg font-semibold'>{data.name}</p>
                <p className='text-sm text-slate-500'>{data.role}</p>
            </div>

            <div className='mt-4'>
                <div className='flex items-center gap-2'>
                    <p className='font-semibold'>Email :</p>
                    <p>{data.email}</p>
                </div>
                <div className='flex items-center gap-2 mt-2'>
                    <p className='font-semibold'>Created At :</p>
                    <p>{new Date(data.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserProfile
