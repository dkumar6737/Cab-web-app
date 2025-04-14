// AboutPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/home');
  }
  return (
  <div className="bg-gray-100 min-h-screen py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Header Section */}
    <header className="text-center mb-12">
    <button
      onClick={goHome}
      className="absolute top-4 right-4 h-10 w-10 bg-gray-100  flex items-center justify-center rounded-full"
    >
      <i className="text-lg font-medium ri-logout-box-r-line"></i>
    </button>
      <h1 className="text-5xl font-bold text-blue-600 mb-4">
      About Our First Cab Application
      </h1>
      <p className="text-xl text-gray-700">
      Convenient, fast, and reliable rides at your fingertips. Discover how our platform makes your daily commute effortless.
      </p>
    </header>

    {/* About Content Section */}
    <section className="mb-16">
      <h2 className="text-3xl font-semibold text-blue-600 text-center mb-4">Our Story</h2>
      <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto">
      Our First Cab Application was built to simplify the way people travel. Our mission is to provide you with a seamless, reliable, and safe travel experience wherever you are. Whether you're traveling to work, the airport, or heading out for an evening, we aim to be your go-to transportation solution.
      </p>
    </section>

    {/* /* Image Grid Section */ }
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      <div className="flex flex-col items-center">
        <img src="https://images.pexels.com/photos/1577131/pexels-photo-1577131.jpeg" alt="Image 1" className="w-full rounded-lg shadow-lg mb-4"/>
        <p className="text-lg text-gray-700 text-center">Experience the comfort and convenience of our First Cab Application.</p>
      </div>
      <div className="flex flex-col items-center">
        <img src="https://images.pexels.com/photos/24739986/pexels-photo-24739986/free-photo-of-levc-tx-taxi-driving-down-the-street-of-london.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Image 2" className="w-full rounded-lg shadow-lg mb-4"/>
        <p className="text-lg text-gray-700 text-center">Reliable rides at your fingertips, anytime and anywhere.</p>
      </div>
      <div className="flex flex-col items-center">
        <img src="https://images.pexels.com/photos/10061031/pexels-photo-10061031.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Image 3" className="w-full rounded-lg shadow-lg mb-4"/>
        <p className="text-lg text-gray-700 text-center">Join thousands of satisfied customers who trust our service.</p>
      </div>
    
    </section>

    {/* Features Section */}
    <section className="mb-16">
      <h2 className="text-3xl font-semibold text-blue-600 text-center mb-6">Our Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
        <img src="https://tse1.mm.bing.net/th?id=OIF.dSvOTCxQKmVLC7CCnuAJ3g&pid=Api&P=0&h=180" alt="Feature 1" className="w-full h-32 mb-4"/>
        <h3 className="text-2xl font-semibold text-blue-600 mb-2">Real-time Tracking</h3>
        <p className="text-lg text-gray-700 text-center">
        Track your ride in real-time from pickup to drop-off, ensuring you always know your ride’s status.
        </p>
      </div>
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
        <img src="http://www.mobileappoutsourcing.com/wp-content/uploads/2018/06/Payment-interface-integration-in-a-Taxi-booking-Android-app-.jpg" alt="Feature 2" className="w-full h-32 mb-4"/>
        <h3 className="text-2xl font-semibold text-blue-600 mb-2">Multiple Payment Options</h3>
        <p className="text-lg text-gray-700 text-center">
        We offer a variety of payment methods including credit cards, debit cards, and digital wallets.
        </p>
      </div>
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
        <img src="https://img.freepik.com/premium-vector/taxi-banner-online-mobile-application-order-taxi-service-man-call-taxi-by-smartphone_126283-323.jpg?w=1380" alt="Feature 3" className="w-full h-30 mb-4"/>
        <h3 className="text-2xl font-semibold text-blue-600 mb-2">24/7 Customer Support</h3>
        <p className="text-lg text-gray-700 text-center">
        Our customer support team is available round the clock to assist you with any queries.
        </p>
      </div>
      </div>
    </section>

    {/* Testimonials Section */}
    <section className="mb-16">
      <h2 className="text-3xl font-semibold text-blue-600 text-center mb-6">What Our Developer, Owner, and Designer Say</h2>
      <div className="flex flex-wrap justify-center gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <p className="text-lg text-gray-700 italic mb-4">
            "Building this app has been an incredible journey. We are committed to providing the best user experience."
          </p>
          <p className="font-semibold text-blue-600">Kumar</p>
          <p className="text-gray-500">Lead Developer</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <p className="text-lg text-gray-700 italic mb-4">
            "Our mission is to revolutionize transportation. We believe in making travel safe, easy, and accessible for everyone."
          </p>
          <p className="font-semibold text-blue-600">Gourav</p>
          <p className="text-gray-500">Founder & Owner</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <p className="text-lg text-gray-700 italic mb-4">
            "Designing this app has been a rewarding experience. We strive to create an intuitive and visually appealing interface."
          </p>
          <p className="font-semibold text-blue-600">Sahil</p>
          <p className="text-gray-500">UI/UX Designer</p>
        </div>
      </div>
    </section>

    {/* Our Mission Section */}
    <section className="bg-black text-white py-12">
      <div className="text-center">
      <h2 className="text-4xl font-semibold mb-4">Our Mission</h2>
      <p className="text-xl mb-4">
        We are committed to revolutionizing the way people travel. Our goal is to make transportation safer, more accessible, and easier than ever before.
      </p>
      <button onClick={goHome} className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold mt-4 hover:bg-gray-200">
        Go Home
      </button>
      </div>
    </section>

    {/* Footer Section */}
    <footer className="text-center py-12 text-gray-600">
      <p>Thank you for choosing our First Cab Application. We look forward to driving you to your next destination!</p>
    </footer>
    </div>
  <div className="flex justify-center space-x-4 mt-10">
    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
    <i className="ri-twitter-line text-2xl text-black hover:text-gray-600"></i>
    </a>
    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
    <i className="ri-linkedin-line text-2xl text-black hover:text-gray-600"></i>
    </a>
    <a href="https://www.instagram.com/invites/contact/?igsh=b18v6htvkqzo&utm_content=nu9tbxu" target="_blank" rel="noopener noreferrer">
    <i className="ri-instagram-line text-2xl text-black hover:text-gray-600"></i>
    </a>
    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
    <i className="ri-facebook-line text-2xl text-black hover:text-gray-600"></i>
    </a>
    <a href="https://www.github.com" target="_blank" rel="noopener noreferrer">
    <i className="ri-github-line text-2xl text-black hover:text-gray-600"></i>
    </a>
  </div>
  </div>
  );
};

export default AboutPage;
