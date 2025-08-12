import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, ChevronUp, Car, Users, Settings, CreditCard, Euro, Building2 } from 'lucide-react';

const CarRentalSidebar = () => {
  // --- State for Map ---
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 280, height: 200 });

  const rentalLocations = [
    { id: 1, name: "Moha International Airport", lat: 32, lng: 45, available: 15 },
    { id: 2, name: "City Center", lat: 28, lng: 52, available: 8 },
    { id: 3, name: "Downtown Station", lat: 35, lng: 48, available: 12 },
    { id: 4, name: "Beach Resort Area", lat: 25, lng: 55, available: 6 },
    { id: 5, name: "Business District", lat: 38, lng: 42, available: 20 }
  ];

  useEffect(() => {
    const updateDimensions = () => {
      if (mapRef.current) {
        const rect = mapRef.current.getBoundingClientRect();
        setMapDimensions({ width: rect.width, height: rect.height });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  // --- State for Filters ---
  const [selectedFilters, setSelectedFilters] = useState({
    carType: 'Economy',
    passengers: '4 Passengers',
    transmission: [],
    cards: [],
    deposit: [],
    companies: []
  });

  const [expandedSections, setExpandedSections] = useState({
    transmission: true,
    cards: true,
    deposit: true,
    companies: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (category, value) => {
    if (category === 'carType' || category === 'passengers') {
      setSelectedFilters(prev => ({
        ...prev,
        [category]: value
      }));
    } else {
      setSelectedFilters(prev => ({
        ...prev,
        [category]: prev[category].includes(value)
          ? prev[category].filter(item => item !== value)
          : [...prev[category], value]
      }));
    }
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      carType: '',
      passengers: '',
      transmission: [],
      cards: [],
      deposit: [],
      companies: []
    });
  };

  // --- UI Components ---
  const FilterButton = ({ label, isSelected, onClick, icon: Icon }) => (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        isSelected
          ? 'bg-gray-900 text-white shadow-md'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );

  const CheckboxItem = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded px-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-[#0174b7] border-gray-300 rounded focus:ring-[#0174b7]"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );

  const SectionHeader = ({ title, isExpanded, onToggle, icon: Icon }) => (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-3 text-left"
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-gray-600" />}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <ChevronUp className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isExpanded ? '' : 'rotate-180'}`} />
    </button>
  );

  return (
    <div className="hidden lg:block bg-white border-r border-gray-200 h-full overflow-y-auto w-80 xl:w-80">
      {/* Map Section */}
      <div className="m-4 border-b border-gray-200">
        <div className="relative bg-blue-50 h-48 rounded-lg overflow-hidden" ref={mapRef}>
          {/* Background grid */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#3b82f6" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Decorative map features */}
          <svg className="absolute inset-0 w-full h-full">
            <path d="M 0 60 Q 80 50 140 70 T 280 65" stroke="#94a3b8" strokeWidth="3" fill="none" opacity="0.6" />
            <path d="M 50 0 Q 60 80 70 140 T 85 200" stroke="#94a3b8" strokeWidth="2" fill="none" opacity="0.6" />
            <ellipse cx="200" cy="120" rx="25" ry="15" fill="#3b82f6" opacity="0.3" />
            <circle cx="80" cy="100" r="12" fill="#10b981" opacity="0.4" />
            <circle cx="180" cy="50" r="8" fill="#10b981" opacity="0.4" />
          </svg>

          {/* Location Pins */}
          {rentalLocations.map((location) => {
            const x = (location.lng / 60) * mapDimensions.width;
            const y = (location.lat / 40) * mapDimensions.height;
            const isSelected = selectedLocation?.id === location.id;
            return (
              <div
                key={location.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110 ${isSelected ? 'z-20' : 'z-10'}`}
                style={{ left: `${x}px`, top: `${y}px` }}
                onClick={() => handleLocationClick(location)}
              >
                <div className={`relative ${isSelected ? 'animate-pulse' : ''}`}>
                  <MapPin 
                    className={`w-6 h-6 ${
                      isSelected 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-red-400 fill-red-400 hover:text-red-500 hover:fill-red-500'
                    } drop-shadow-lg`}
                  />
                  {location.available > 0 && (
                    <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full text-xs flex items-center justify-center text-white font-bold ${
                      location.available > 15 ? 'bg-green-500' :
                      location.available > 10 ? 'bg-yellow-500' :
                      location.available > 5 ? 'bg-orange-500' : 'bg-red-500'
                    }`}>
                      {location.available > 9 ? '9+' : location.available}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Show on Map Button */}
        <button className="mt-3 w-full bg-[#0174b7] hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2">
          <Search className="w-4 h-4" /> Show On Map
        </button>

        {/* Selected location info */}
        {selectedLocation && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 text-sm">{selectedLocation.name}</h3>
            <p className="text-xs text-gray-600 mt-1">{selectedLocation.available} cars available</p>
            <div className="mt-2 flex gap-1">
              {[...Array(Math.min(5, Math.ceil(selectedLocation.available / 4)))].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-green-400 rounded-full"></div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">51 Results</span>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4">
        {/* Car Type */}
        <div>
          <div className="flex items-center gap-2 m-2">
            <Car className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Car Type</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Mini', 'Economy', 'Compact', 'SUV', 'Premium'].map((type) => (
              <FilterButton
                key={type}
                label={type}
                isSelected={selectedFilters.carType === type}
                onClick={() => handleFilterChange('carType', type)}
              />
            ))}
          </div>
        </div>

        {/* Passengers */}
        <div>
          <div className="flex items-center gap-2 m-2">
            <Users className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Passengers</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['2 Passengers', '4 Passengers', '5 Passengers', '7 Passengers'].map((count) => (
              <FilterButton
                key={count}
                label={count}
                isSelected={selectedFilters.passengers === count}
                onClick={() => handleFilterChange('passengers', count)}
              />
            ))}
          </div>
        </div>

        {/* Transmission */}
        <div className="border-b border-gray-200">
          <SectionHeader
            title="Transmission"
            icon={Settings}
            isExpanded={expandedSections.transmission}
            onToggle={() => toggleSection('transmission')}
          />
          {expandedSections.transmission && (
            <div className=" space-y-1">
              {['All', 'Automatic', 'Manual'].map((transmission) => (
                <CheckboxItem
                  key={transmission}
                  label={transmission}
                  checked={selectedFilters.transmission.includes(transmission)}
                  onChange={() => handleFilterChange('transmission', transmission)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Cards Accepted At Pickup */}
        <div className="border-b border-gray-200">
          <SectionHeader
            title="Cards Accepted At Pickup For Deposit"
            icon={CreditCard}
            isExpanded={expandedSections.cards}
            onToggle={() => toggleSection('cards')}
          />
          {expandedSections.cards && (
            <div className="space-y-1">
              {['Visa Credit', 'Master Credit', 'Visa Debit', 'Master Debit'].map((card) => (
                <CheckboxItem
                  key={card}
                  label={card}
                  checked={selectedFilters.cards.includes(card)}
                  onChange={() => handleFilterChange('cards', card)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Deposit */}
        <div className="border-b border-gray-200">
          <SectionHeader
            title="Deposit"
            icon={Euro}
            isExpanded={expandedSections.deposit}
            onToggle={() => toggleSection('deposit')}
          />
          {expandedSections.deposit && (
            <div className=" space-y-1">
              {[
                '€ 0 - € 500',
                '€ 501 - € 1,000',
                '€ 1,001 - € 1,500',
                '€ 1,501 - € 2,000',
                '€ 2,000 +'
              ].map((range) => (
                <CheckboxItem
                  key={range}
                  label={range}
                  checked={selectedFilters.deposit.includes(range)}
                  onChange={() => handleFilterChange('deposit', range)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Rental Company */}
        <div className="">
          <SectionHeader
            title="Rental Company"
            icon={Building2}
            isExpanded={expandedSections.companies}
            onToggle={() => toggleSection('companies')}
          />
          {expandedSections.companies && (
            <div className=" space-y-1">
              {[
                'City Go Rentals',
                'Abby',
                'Auto Union',
                'Car Ginny',
                'Europ Car',
                'Flex Ways',
                'Green Motion',
                'Ok Mobility',
                'Smart Mobility',
                'U-Save'
              ].map((company) => (
                <CheckboxItem
                  key={company}
                  label={company}
                  checked={selectedFilters.companies.includes(company)}
                  onChange={() => handleFilterChange('companies', company)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarRentalSidebar;