import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function AdminSignup() {
    const [firstName,setFirstName] =useState('')
    const [lastName,setLastName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [adminData,setAdminData] = useState({})

    const navigate = useNavigate()

    const handleAdmin = async (e) => {
      e.preventDefault()
      const newAdmin = {
        fullname: {
          firstname: firstName,
          lastname: lastName
        },
        email: email,
        password: password
      }
  
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/register`, newAdmin)
  
      if (response.status === 201) {
        const data = response.data
        setAdminData(data.admin)
        localStorage.setItem('token', data.token)
        navigate('/adminLogin')
      }
  
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')
    }
  
  return (


    
    <div>
        <div className='p-7 h-screen flex flex-col justify-between'>
            <div>
            <img className='w-20 mb-10' src="https://houseofbeauty.org.uk/wp-content/uploads/2020/07/Book-Now.png" alt="" />
            <h3 className='text-lg w-1/2  font-medium mb-2'>What's your name</h3>
            <div className='flex gap-4 mb-7'>

            <input
                required
                className='bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="text"
                placeholder='First name'
                value={firstName}
                onChange={(e)=>{
                    setFirstName(e.target.value)
                }}
              />

            <input
                required
                className='bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="text"
                placeholder='Last name'
                value={lastName}
                onChange={(e)=>{
                    setLastName(e.target.value)
                }}
              />
            </div>

            <h3 className='text-lg font-medium mb-2'>What's your email</h3>
            <input
              required
             value={email}
             onChange={(e)=>{
                setEmail(e.target.value)
             }}
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              type="email"
              placeholder='email@example.com'
            />
        
        <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

            <input
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              value={password}
              onChange={(e)=>{
                setPassword(e.target.value)
              }}
              required type="password"
              placeholder='password'
            />
        
        <button
        onClick={handleAdmin}
              className='bg-[#278] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
            >Create account
        </button>
        <p className='text-center'>Already have a account? <a className='text-blue-600' href="/adminLogin">Login here</a> </p>
            </div>
            <div>
          <p className='text-[10px] leading-tight text-center' >This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
            Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
        </div>
        </div>
    </div>
  )
}

export default AdminSignup