import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function AdminLogin() {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [adminData,setAdminData] = useState({})
    
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        const adminData = {
            email: email,
            password: password
        }
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/login`, adminData)
        if(response.status === 200){
            const data = response.data
            localStorage.setItem('token',data.token)
            navigate('/dashboard')
        }
        setEmail('')
        setPassword('')
    }
    
  return (
    <div>
        <div className='p-7 h-screen flex flex-col justify-between'>
            <div>
            <img className='w-20 mb-10' src="https://houseofbeauty.org.uk/wp-content/uploads/2020/07/Book-Now.png" alt="" />

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
            required 
            value={password}
            onChange={(e)=>{
                setPassword(e.target.value)
            }}
            type="password"
            placeholder='password'
            />
            
            <button
            onClick={handleLogin}
            className='bg-[#278] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'>
                Login
            </button>
            <p className='text-center'>Already have a account? <a className='text-blue-600' href="/admin">Signup here</a> </p>
            </div>
            <div>
          <p className='text-[10px] leading-tight text-center' >This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
            Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
            </div>

            
        </div>
    </div>
  )
}

export default AdminLogin