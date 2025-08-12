import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  CalendarDays,
  Search as SearchIcon,
  Car,
  DollarSign,
  Shield,
  Wrench,
  Smartphone,
  Check,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  // State for search form
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");

  // State for newsletter
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = () => {
    if (!pickupLocation || !pickupDate || !dropoffDate) {
      alert("Please fill in all search fields");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call/processing delay
    setTimeout(() => {
      const query = new URLSearchParams({
        pickup: pickupLocation,
        pickupDate,
        dropoffDate,
      }).toString();
      navigate(`/search?${query}`);
    }, 2000);
  };

  const handleSubscribe = () => {
    if (email) {
      setIsSubscribed(true);
      console.log("Subscribed:", email);
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const faqs = [
    {
      question: "Eco Friendly To Drive",
      answer: `Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. ...`,
    },
    {
      question: "How Old Do You Have To Be To Rent A Car?",
      answer: "You typically need to be at least 21 years old...",
    },
    {
      question: "Do You Rent To International Visitors?",
      answer: "Yes, we do rent to international visitors...",
    },
    {
      question: "If Insurance Missing Need To Provide Other Proof",
      answer: "You may be asked to provide alternative documentation...",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="bg-white relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto">
          {/* Header */}
          <div className="bg-[#0174B7] text-white p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-slate-900 text-lg font-bold">R</span>
                </div>
                <span className="text-xl font-bold">RENT N RIDES</span>
              </div>
              <div className="text-sm">Finding The Perfect Ride For You...</div>
            </div>
          </div>

          {/* Search Progress Bar */}
          <div className="bg-gray-100 px-4 py-3">
            <div className="max-w-7xl mx-auto">
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-[#0174B7] h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>

          {/* Filters Sidebar and Results Grid */}
          <div className="max-w-7xl mx-auto p-4 flex gap-6">
            {/* Left Sidebar Skeleton */}
            <div className="w-64 space-y-6">
              {/* Filter sections */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse flex-1"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Results Grid Skeleton */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Car Image Skeleton */}
                    <div className="relative">
                      <div className="h-48 bg-gray-200 animate-pulse"></div>
                      <div className="absolute top-2 right-2 w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                    </div>
                    
                    {/* Car Details Skeleton */}
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      
                      {/* Features */}
                      <div className="flex space-x-4 pt-2">
                        {[1, 2, 3, 4].map((j) => (
                          <div key={j} className="flex items-center space-x-1">
                            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-8"></div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Price and Button */}
                      <div className="flex items-center justify-between pt-3">
                        <div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-16 mb-1"></div>
                          <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                        </div>
                        <div className="h-10 bg-[#0174B7] rounded animate-pulse w-24 opacity-50"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-[#eef2ff] px-4 py-8 lg:py-12">
        <div className="mx-auto grid lg:grid-cols-2 items-center gap-8">
          {/* Left Content */}
          <div className="order-1 lg:order-none">
            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-bold leading-snug ml-0 sm:ml-6">
              <span className="text-[#0174B7]">Easy</span>{" "}
              <span className="text-black">Rentals,</span> <br />
              <span className="text-black">Anywhere You Go.</span>
            </h1>
            <p className="mt-4 sm:mt-8 mb-6 sm:mb-0 text-lg font-medium text-gray-800">
              <span className="border-b-2 border-gray-400 pb-1">
                Find Perfect Car To Drive
              </span>
            </p>
          </div>

          {/* Right Image - Adjusted for tablet */}
          <div className="flex justify-center lg:justify-end md:justify-end">
            <img
              src="car-bg-remove.png"
              alt="Blue rental car"
              className="max-w-full h-auto sm:h-full md:mr-0 lg:mr-0"
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center px-4">
          <div className="bg-white shadow-md rounded-3xl flex flex-col sm:flex-row flex-wrap items-center p-3 sm:p-4 gap-3 sm:gap-2 w-full max-w-5xl">
            {/* Pick-up Location */}
            <div className="flex items-center gap-2 w-full sm:flex-1 min-w-[200px] px-2">
              <MapPin className="text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Malta International Airport"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full outline-none text-sm placeholder-gray-400 italic"
              />
            </div>

            {/* Pick-up Date */}
            <div className="flex items-center gap-2 w-full sm:flex-1 min-w-[150px] px-2">
              <Calendar className="text-gray-400" size={18} />
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full outline-none text-sm text-gray-700"
              />
            </div>

            {/* Drop-off Date */}
            <div className="flex items-center gap-2 w-full sm:flex-1 min-w-[150px] px-2">
              <Calendar className="text-gray-400" size={18} />
              <input
                type="date"
                value={dropoffDate}
                onChange={(e) => setDropoffDate(e.target.value)}
                className="w-full outline-none text-sm text-gray-700"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full sm:w-auto bg-[#0174B7] hover:bg-[#0174B7]/90 transition-colors duration-200 text-white p-3 rounded-full shadow-md"
            >
              <div className="flex items-center justify-center gap-2">
                <SearchIcon size={20} />
                <span className="sm:hidden">Search</span>
              </div>
            </button>
          </div>
        </div>
      </section>
  
      {/* Logos Row */}
      <div className="bg-white py-6 mt-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <p className="text-gray-500 text-sm mb-4">
            Trusted by over 50,000 Suppliers
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 opacity-60">
            <img src="/logo1.png" alt="logo" className="h-6" />
            <img src="/logo2.png" alt="logo" className="h-6" />
            <img src="/logo3.png" alt="logo" className="h-6" />
            <img src="/logo4.png" alt="logo" className="h-6" />
            <img src="/logo5.png" alt="logo" className="h-6" />
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <section className="container bg-white mx-auto px-4 py-12 sm:py-16 text-center">
        <h3 className="text-gray-500 tracking-widest text-sm">HOW IT WORKS</h3>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
          Rent a Ride in 3 Easy Steps
        </h2>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
          {/* Step 1 */}
          <div>
            <div className="bg-white rounded-2xl shadow-md p-6 inline-block">
              <MapPin size={32} className="text-[#0174B7] mx-auto" />
            </div>
            <h4 className="font-semibold mt-4">Choose Location</h4>
            <p className="text-gray-500 text-sm mt-2">
              Choose your location and find your best car.
            </p>
          </div>

          {/* Step 2 */}
          <div>
            <div className="bg-[#0174B7] rounded-2xl shadow-md p-6 inline-block">
              <CalendarDays size={32} className="text-white mx-auto" />
            </div>
            <h4 className="font-semibold mt-4">Pick-up Date</h4>
            <p className="text-gray-500 text-sm mt-2">
              Select your pick up date and time to book your car.
            </p>
          </div>

          {/* Step 3 */}
          <div>
            <div className="bg-white rounded-2xl shadow-md p-6 inline-block">
              <Car size={32} className="text-[#0174B7] mx-auto" />
            </div>
            <h4 className="font-semibold mt-4">Book your car</h4>
            <p className="text-gray-500 text-sm mt-2">
              Book your car and we will deliver it to you.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why <span className="text-[#0174B7]">RENT N RIDES</span> is Your
            </h2>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Perfect Road Trip Partner
            </h3>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 relative">
            {/* Dotted lines connecting features */}
            <div className="hidden md:block absolute inset-0 pointer-events-none">
              {/* Horizontal dotted line */}
              <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-16 border-t-2 border-dotted border-gray-300"></div>
              {/* Vertical dotted lines */}
              <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 h-1/4 border-l-2 border-dotted border-gray-300"></div>
              <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 h-1/4 border-l-2 border-dotted border-gray-300"></div>
            </div>

            {/* No Hidden Fees - Top Left */}
            <div className="bg-[#0174B7] text-white p-6 sm:p-8 rounded-2xl relative z-10">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <DollarSign className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3">No Hidden Fees</h3>
                  <p className="text-blue-100 leading-relaxed text-sm sm:text-base">
                    We believe in transparency. That's why our prices are clear and up-front, with no hidden fees or surprises at the checkout.
                  </p>
                </div>
              </div>
            </div>

            {/* 100% Guaranteed - Top Right */}
            <div className="bg-white border-2 border-gray-200 p-6 sm:p-8 rounded-2xl relative z-10">
              <div className="flex items-start space-x-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">100% Guaranteed</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    Our comprehensive insurance options give you peace of mind, whether it's unexpected weather or a minor bump.
                  </p>
                </div>
              </div>
            </div>

            {/* Unwavering Service - Bottom Left */}
            <div className="bg-white border-2 border-gray-200 p-6 sm:p-8 rounded-2xl relative z-10">
              <div className="flex items-start space-x-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Wrench className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Unwavering Service</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    We're passionate about creating a seamless and enjoyable experience for every driver.
                  </p>
                </div>
              </div>
            </div>

            {/* Convenience is Ours - Bottom Right */}
            <div className="bg-white border-2 border-gray-200 p-6 sm:p-8 rounded-2xl relative z-10">
              <div className="flex items-start space-x-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Convenience is Ours</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    Skip the lines and paperwork! Our user-friendly website and app let you book your car in minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section with adjusted image positioning */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                Be the first to know about our hottest deals and discounts
              </h2>
              
              {/* Subscription Form */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1">
                    <input
                      type="email"
                      placeholder="Your Email Id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-full focus:border-[#0174B7] focus:outline-none text-gray-700 placeholder-gray-400"
                    />
                  </div>
                  <button
                    onClick={handleSubscribe}
                    disabled={isSubscribed}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-[#0174B7] hover:bg-[#0174B7] disabled:bg-green-600 text-white font-semibold rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isSubscribed ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Subscribed!</span>
                      </div>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </div>
                
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-600">
                    Your email is safe with us, we don't spam.{' '}
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      Privacy Policy
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Image - Adjusted for tablet */}
            <div className="relative md:flex md:justify-end">
              <div className="relative overflow-hidden rounded-2xl md:ml-auto">            
                <img
                  src="/car-rect.png"
                  alt="Mountain road with cars"
                  className="w-full h-auto object-cover md:max-w-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-2xl mx-auto py-12 sm:py-16 px-4 bg-white">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Frequently Asked Questions (FAQ)</h2>
        {faqs.map((item, idx) => (
          <div key={idx} className="mb-6 border-b pb-4">
            <div className="flex items-center">
              <span className="bg-[#0174B7] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <button
                className={`text-base sm:text-lg font-semibold flex-1 text-left`}
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                {item.question}
              </button>
              <span 
                className="ml-2 cursor-pointer text-lg" 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                {openIndex === idx ? '↓' : '→'}
              </span>
            </div>
            {openIndex === idx && (
              <p className="mt-3 text-gray-600 text-sm sm:text-base">{item.answer}</p>
            )}
          </div>
        ))}
      </section>

      {/* Footer with adjusted layout */}
      <footer className="bg-transparent text-white relative overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/Footer-section.png')"
            }}
          ></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto py-8 sm:py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8">
            {/* Left Section */}
            <div className="md:col-span-1 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-slate-900 text-lg sm:text-xl font-bold">R</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-wider">RENT N RIDES</h2>
              </div>
              <div className="text-gray-300 leading-relaxed text-sm sm:text-base">
                <p className="mb-2">Research has had a very large influence</p>
                <p className="mb-2">on my life. I have learned most of what</p>
                <p>I know through research.</p>
              </div>
            </div>

            {/* Middle Section - Now includes Locations on mobile/tablet */}
            <div className="md:col-span-2 lg:col-span-1">
              <div className="grid grid-cols-2 gap-8">
                {/* Quick Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
                  <ul className="space-y-2">
                    {['Home', 'About Us', 'Career', 'Latest News', 'Gallery', 'Contact Us'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-gray-300 hover:text-amber-500 transition-colors duration-200 text-sm sm:text-base">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Locations - Moved here for mobile/tablet */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Our Locations</h3>
                  <ul className="space-y-2">
                    {['Malta', 'Spain', 'Portugal', 'Greece', 'Cyprus', 'France'].map((location) => (
                      <li key={location}>
                        <span className="text-gray-300 text-sm sm:text-base">{location}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Follow Us - Now appears below on mobile */}
                <div className="col-span-2 lg:col-span-1 lg:mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-white">Follow Us</h3>
                  <div className="flex space-x-3">
                    {[
                      { icon: Instagram, link: "#" },
                      { icon: Facebook, link: "#" },
                      { icon: Youtube, link: "#" },
                      { icon: Twitter, link: "#" }
                    ].map(({ icon: Icon, link }, index) => (
                      <a
                        key={index}
                        href={link}
                        className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-amber-500 transition-colors duration-200 group"
                      >
                        <Icon className="w-5 h-5 text-gray-400 group-hover:text-slate-900" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Only for desktop (logo) */}
            <div className="hidden lg:flex lg:col-span-1 justify-end">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-amber-500 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-slate-900 text-3xl sm:text-4xl font-bold">R</span>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-xs sm:text-sm">
                © 2025 Primion. All Rights Reserved. Terms & Conditions
              </p>
              <div className="flex items-center space-x-4 sm:space-x-6">
                <a
                  href="/privacy-policy"
                  className="text-xs sm:text-sm text-gray-300 hover:text-amber-500 transition-colors duration-200"
                >
                  Privacy policy
                </a>
                <a
                  href="/terms-of-use"
                  className="text-xs sm:text-sm text-gray-300 hover:text-amber-500 transition-colors duration-200"
                >
                  Terms of use
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero;