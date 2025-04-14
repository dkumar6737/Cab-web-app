
import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div>
      <div className='bg-cover bg-center bg-[url(https://images.pexels.com/photos/15481199/pexels-photo-15481199/free-photo-of-yellow-cab-between-buildings.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)] h-screen pt-8 flex justify-between flex-col w-full'>
      <img className='w-20 mb-10' src="https://houseofbeauty.org.uk/wp-content/uploads/2020/07/Book-Now.png" alt="" />
        <div className='bg-white pb-8 py-4 px-4'>
          <h2 className='text-[30px] font-semibold'>Get Started with Cab Booking</h2>
          <Link to='/login' className='flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5'>Continue</Link>
        </div>
      </div>
    </div>
  )
}

export default Start