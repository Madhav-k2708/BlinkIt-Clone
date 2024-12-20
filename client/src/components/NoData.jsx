import React from 'react'
import noDataImage from '../assets/nothing here yet.webp'

const NoData = () => {
  return (
    <div className='flex flex-col items-center justify-center py-4 gap-2  '>
        <img src={noDataImage} alt="no data" className='w-52 ' />
       <p className=' text-neutral-800'> No Data Available</p>
    </div>
  )
}

export default NoData