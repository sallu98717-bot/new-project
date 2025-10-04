// LandingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ImageCarousel from './ImageCarousel';

interface ServiceCardProps {
  title: string;
  description: string;
  ctaText?: string;
  showNumber?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  description, 
  ctaText = "Apply Now", 
  showNumber 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition duration-200">
      {showNumber && (
        <div className="text-3xl font-bold text-gray-800 mb-2">{showNumber}</div>
      )}
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
      <Link to="/rewards-redemption">
        <button className="bg-[#ae265f] hover:bg-[#8a1e4b] text-white font-medium py-2 px-6 rounded transition duration-200 w-full sm:w-auto">
          {ctaText}
        </button>
      </Link>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const services = [
    {
      title: "CARD BLOCK",
      description: "Block your lost or stolen card immediately to prevent unauthorized transactions.",
      showNumber: undefined
    },
    {
      title: "LINK CARD",
      description: "Link your Axis Bank credit card to UPI and enjoy seamless digital payments.",
      showNumber: undefined
    },
    {
      title: "PROTECTION PLAN",
      description: "Secure your transactions with Axis Bank's Card Protection Plan (CPP).",
      showNumber: undefined
    },
    {
      title: "REWARD POINTS",
      description: "Charming reward points is easy with Axis Bank. Once customers have accumulated 500 points they can redeem.",
      showNumber: undefined
    },
    {
      title: "LIMIT INCREASE",
      description: "Increasing your Credit Card limit can help you do it all and more. Conveniently increase the maximum amount you can spend on your Credit Card via NetBanking or Phone Banking. What's more, there are no charges to increasing the card limit.",
      showNumber: undefined
    },
    {
      title: "CARD ACTIVATION",
      description: "Need to activate your new credit card? Follow our simple steps and start using your card today.",
      showNumber: undefined
    },
    {
      title: "INTERNATIONAL SERVICE ACTIVATION",
      description: "Need to Internationalize your new credit card? Follow our simple steps and start using your card today.",
      showNumber: undefined
    },
    {
      title: "INTERNATIONAL SERVICE DEACTIVATION",
      description: "Need to deactivate your international service? Follow our simple steps and stop using your card internationally.",
      showNumber: undefined
    }
  ];

  const featuredService = {
    title: "Apply for Credit Card Online Get Instant Approval",
    description: "Credit Cards serve as convenient financial tools, providing you with the ease of managing your expenses seamlessly. Opting for an Axis Bank Credit Card opens doors to a world of convenience.",
    showNumber: 5,
    subtitle: "REWARD POINTS",
    pointsDescription: "Claiming reward points is easy with Axis Bank. Once customers have accumulated 500 points they can redeem."
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Main Content */}
      <main className=" bg-pink-50 flex-grow bg-gray-50">
        {/* Carousel Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ImageCarousel />
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8 border border-gray-200">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center sm:text-left">
              {featuredService.title}
            </h1>
            <p className="text-gray-600 mb-6 leading-relaxed text-center sm:text-left">
              {featuredService.description}
            </p>
            
            <div className="border-t border-gray-300 my-6"></div>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
              <div className="text-4xl font-bold text-gray-800 flex-shrink-0">
                {featuredService.showNumber}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {featuredService.subtitle}
                </h2>
                <p className="text-gray-600">
                  {featuredService.pointsDescription}
                </p>
              </div>
            </div>
            
            <div className="text-center sm:text-left">
              <Link to="/rewards-redemption">
                <button className="bg-[#ae265f] hover:bg-[#8a1e4b] text-white font-medium py-3 px-8 rounded transition duration-200 w-full sm:w-auto">
                  Apply Now
                </button>
              </Link>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                showNumber={service.showNumber}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;