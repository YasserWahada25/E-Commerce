import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { FaEnvelope, FaCheck, FaTimes, FaEye } from 'react-icons/fa'
import { toast } from 'react-toastify'
import moment from 'moment'

const AllReclamations = () => {
    const [reclamations, setReclamations] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedReclamation, setSelectedReclamation] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const fetchReclamations = async () => {
        setLoading(true)
        try {
            const response = await fetch(SummaryApi.allReclamations.url, {
                method: SummaryApi.allReclamations.method,
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage, or handled by cookie
                },
                credentials: 'include' // Important for cookies
            })
            const data = await response.json()

            if (data.success) {
                setReclamations(data.reclamations)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to fetch reclamations")
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (id, status) => {
        try {
            const response = await fetch(SummaryApi.updateReclamationStatus.url, {
                method: SummaryApi.updateReclamationStatus.method,
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    reclamationId: id,
                    status: status
                }),
                credentials: 'include'
            })
            const data = await response.json()

            if (data.success) {
                toast.success("Status updated")
                fetchReclamations() // Refresh list
                if (selectedReclamation && selectedReclamation._id === id) {
                    setSelectedReclamation(data.data) // Update modal data if open
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("Error updating status")
        }
    }

    useEffect(() => {
        fetchReclamations()
    }, [])

    const handleView = (reclamation) => {
        setSelectedReclamation(reclamation)
        setShowModal(true)
        if (reclamation.status === 'new') {
            updateStatus(reclamation._id, 'seen')
        }
    }

    return (
        <div className='bg-white p-4 rounded-lg shadow-md h-full overflow-y-auto'>
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold text-gray-800'>Reclamations</h2>
            </div>

            {loading ? (
                <div className='flex justify-center items-center h-64'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
                </div>
            ) : (
                <div className='overflow-x-auto'>
                    <table className='w-full min-w-[800px]'>
                        <thead className='bg-gray-50 border-b border-gray-200'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Date</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Subject</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200'>
                            {reclamations.map((item) => (
                                <tr key={item._id} className='hover:bg-gray-50 transition-colors cursor-pointer' onClick={() => handleView(item)}>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${item.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                                              item.status === 'seen' ? 'bg-yellow-100 text-yellow-800' : 
                                              'bg-green-100 text-green-800'}`}>
                                            {item.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        {moment(item.createdAt).format('MMM D, YYYY')}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm font-medium text-gray-900'>{item.name}</div>
                                        <div className='text-sm text-gray-500'>{item.email}</div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                                        {item.subject.length > 30 ? item.subject.substring(0, 30) + '...' : item.subject}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                        <button 
                                            className='text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition-colors'
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleView(item)
                                            }}
                                        >
                                            <FaEye />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {reclamations.length === 0 && (
                                <tr>
                                    <td colSpan="5" className='px-6 py-12 text-center text-gray-500'>
                                        No reclamations found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail Modal */}
            {showModal && selectedReclamation && (
                <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
                    <div className='bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn'>
                        <div className='p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl'>
                            <h3 className='text-xl font-bold text-gray-800'>Reclamation Details</h3>
                            <button 
                                onClick={() => setShowModal(false)}
                                className='text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-200 rounded-full'
                            >
                                <FaTimes />
                            </button>
                        </div>
                        
                        <div className='p-6 space-y-6'>
                            <div className='flex justify-between items-start'>
                                <div>
                                    <h4 className='text-sm font-semibold text-gray-500 uppercase tracking-wide'>From</h4>
                                    <p className='text-lg font-medium text-gray-900'>{selectedReclamation.name}</p>
                                    <p className='text-indigo-600'>{selectedReclamation.email}</p>
                                </div>
                                <div className='text-right'>
                                    <h4 className='text-sm font-semibold text-gray-500 uppercase tracking-wide'>Date</h4>
                                    <p className='text-gray-700'>{moment(selectedReclamation.createdAt).format('MMMM Do YYYY, h:mm a')}</p>
                                </div>
                            </div>

                            <div className='bg-gray-50 p-4 rounded-xl border border-gray-100'>
                                <h4 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2'>Subject</h4>
                                <p className='text-gray-900 font-medium'>{selectedReclamation.subject}</p>
                            </div>

                            <div>
                                <h4 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3'>Message</h4>
                                <div className='bg-white border border-gray-200 rounded-xl p-4 text-gray-700 leading-relaxed min-h-[150px] whitespace-pre-wrap'>
                                    {selectedReclamation.message}
                                </div>
                            </div>

                            <div className='flex items-center gap-4 pt-4 border-t border-gray-100'>
                                <span className='text-sm font-semibold text-gray-500'>Current Status:</span>
                                <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full 
                                    ${selectedReclamation.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                                      selectedReclamation.status === 'seen' ? 'bg-yellow-100 text-yellow-800' : 
                                      'bg-green-100 text-green-800'}`}>
                                    {selectedReclamation.status.toUpperCase()}
                                </span>

                                <div className='flex-1'></div>

                                {selectedReclamation.status !== 'solved' && (
                                    <button 
                                        onClick={() => updateStatus(selectedReclamation._id, 'solved')}
                                        className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm'
                                    >
                                        <FaCheck /> Mark as Solved
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AllReclamations
