import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Captainlogin from './pages/Captainlogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import CaptainLogout from './pages/CaptainLogout'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'
import 'remixicon/fonts/remixicon.css'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import DeleteAccount from './pages/DeleteAccount'
import RideHistory from './pages/RideHistory'
import CaptainRideHistory from './pages/CaptainRideHistory'
import PaymentPage from './pages/PaymentPage'
import Chat from './pages/UserChat'
import CaptainChat from './pages/CaptainChat'






const App = () => {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/riding' element={<Riding />} />
        <Route path='/captain-riding' element={<CaptainRiding />} />

        <Route path='/signup' element={<UserSignup />} />
        <Route path='/captain-login' element={<Captainlogin />} />
        <Route path='/captain-signup' element={<CaptainSignup />} />
        <Route path='/captain-home' element={<CaptainHome />} />


        {/* <Route path='/Home2' element={<Home2 />} /> */}
        <Route path='/home'
          element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          } />
          
        <Route path='/user/logout'
          element={<UserProtectWrapper>
            <UserLogout />
            {/* <UserProfile /> */}
          </UserProtectWrapper>
          } />
           <Route path='/user/logout'
          element={<UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>
          } />
        <Route path='/captain-home' element={
          <CaptainProtectWrapper>
            <CaptainHome />
          </CaptainProtectWrapper>

        } />
        <Route path='/captain/logout' element={
          <CaptainProtectWrapper>
            <CaptainLogout />
          </CaptainProtectWrapper>
        } />
         

         <Route path='/about' element={<AboutPage />} />
         <Route path='/services' element={<ServicesPage />} />
         <Route path='/delete-acc' element={<DeleteAccount />} />
         <Route path='ride-history' element={<RideHistory />}></Route>
         <Route path='captain-ride-history' element={<CaptainRideHistory />}></Route>
         <Route path='payment-page' element={<PaymentPage />}></Route>
          <Route path='chat' element={<Chat />}></Route>
          <Route path='captain-chat' element={<CaptainChat />}></Route>

      </Routes>
      

    
    </div>
  )
}

export default App