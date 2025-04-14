import React from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const services = [
  { id: 1, video: 'https://videos.pexels.com/video-files/4607429/4607429-uhd_2732_1440_25fps.mp4', title: 'Quick Booking', description: 'Easily book a ride in a few taps.' },
  { id: 2, video: 'https://videos.pexels.com/video-files/5834290/5834290-uhd_2560_1440_24fps.mp4', title: 'Safe Rides', description: 'Safety is our top priority during rides.' },
  { id: 3, video: 'https://videos.pexels.com/video-files/29477901/12688938_2560_1440_30fps.mp4', title: '24/7 Availability', description: 'Rides are available around the clock.' },
  { id: 4, video: 'https://videos.pexels.com/video-files/11785727/11785727-hd_1920_1080_60fps.mp4', description: 'We provide affordable rides for everyone.' },
  { id: 5, video: 'https://videos.pexels.com/video-files/18611606/18611606-uhd_2560_1440_24fps.mp4', title: 'Multiple Vehicle Options', description: 'Choose from a variety of vehicles for your ride.' }
];

const ServicesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const yourData = location.state?.yourData;


  const goHome = () => {
    navigate(-1)
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white text-black text-center py-12">
        <button
          onClick={goHome}
          className="absolute top-4 right-4 h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </button>
        <h1 className="text-5xl font-semibold">Our Services</h1>
        <p className="mt-4 text-lg">The best way to travel with comfort, safety, and convenience.</p>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(service => (
            <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
              <video src={service.video} autoPlay loop muted className="w-full h-72 object-cover" />
              <div className="p-6">
                <h2 className="text-3xl font-semibold text-gray-800">{service.title}</h2>
                <p className="mt-4 text-gray-600 text-lg">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button onClick={goHome} className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300">
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
