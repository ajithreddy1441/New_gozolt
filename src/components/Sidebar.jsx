import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, Search, ChevronUp, Car, Users, Settings, CreditCard, Euro, Building2, SlidersHorizontal } from 'lucide-react';

const CarRentalSidebar = ({ externalSelectedLocation, mobileOnly }) => {
  // --- State for Map ---
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 280, height: 200 });

  const rentalLocations = useMemo(() => ([
    { id: 1, name: "Moha International Airport", lat: 32, lng: 45 },
    { id: 2, name: "City Center", lat: 28, lng: 52 },
    { id: 3, name: "Downtown Station", lat: 35, lng: 48 },
    { id: 4, name: "Beach Resort Area", lat: 25, lng: 55 },
    { id: 5, name: "Business District", lat: 38, lng: 42 }
  ]), []);

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

  // If an external location is provided (from SearchBar selection on /search), select it
  useEffect(() => {
    if (!externalSelectedLocation) return;
    // If coordinates provided and within the demo grid bounds, keep as is; otherwise map name to closest demo point
    const toDemoCoords = (lat, lng) => ({
      // Map world [-90,90] to [0,40] and [-180,180] to [0,60]
      lat: ((lat + 90) / 180) * 40,
      lng: ((lng + 180) / 360) * 60
    });
    if (
      typeof externalSelectedLocation.lat === 'number' &&
      typeof externalSelectedLocation.lng === 'number'
    ) {
      const demo = toDemoCoords(externalSelectedLocation.lat, externalSelectedLocation.lng);
      setSelectedLocation({ 
        ...externalSelectedLocation, 
        demoLat: demo.lat, 
        demoLng: demo.lng,
        realLat: externalSelectedLocation.lat,
        realLng: externalSelectedLocation.lng
      });
      return;
    }
    // Fallback: try to find a rental location by name contains
    const byName = rentalLocations.find(loc =>
      externalSelectedLocation.name && loc.name.toLowerCase().includes(externalSelectedLocation.name.toLowerCase())
    );
    setSelectedLocation(byName || null);
  }, [externalSelectedLocation, rentalLocations]);

  const openInGoogleMaps = () => {
    if (!selectedLocation) return;
    let url = '';
    if (
      selectedLocation.id === 'external' &&
      typeof selectedLocation.realLat === 'number' &&
      typeof selectedLocation.realLng === 'number'
    ) {
      url = `https://www.google.com/maps/search/?api=1&query=${selectedLocation.realLat},${selectedLocation.realLng}`;
    } else if (selectedLocation.name) {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedLocation.name)}`;
    }
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  // --- State for Filters ---
  const [selectedFilters, setSelectedFilters] = useState({
    carType: [],
    passengers: [],
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

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  // Only render mobile button if mobileOnly is true
  if (mobileOnly) {
    return (
      <>
      <div className='bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center gap-2 shadow-md'>
        <button
          className="lg:hidden bg-white border border-gray-300 rounded-full px-4 py-2 flex justify-center items-center gap-2 shadow-md"
          onClick={() => setIsMobileSidebarOpen(true)}
        >
          {/* Use your filter icon here */}
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>
        {/* Mobile sidebar overlay */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end">
            <div className="bg-white w-80 max-w-full h-full overflow-y-auto shadow-xl animate-slide-in-right relative">
              <button
                className="absolute top-4 right-4 text-gray-600 text-2xl"
                onClick={() => setIsMobileSidebarOpen(false)}
                aria-label="Close Filters"
              >
                &times;
              </button>
              <div className="pt-10">
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
                          </div>
                        </div>
                      );
                    })}
                    {/* External selected pin (if coords provided and not matching demo ids) */}
                    {selectedLocation && selectedLocation.id === 'external' &&
                      typeof selectedLocation.demoLat === 'number' && typeof selectedLocation.demoLng === 'number' && (
                        <div
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
                          style={{
                            left: `${(selectedLocation.demoLng / 60) * mapDimensions.width}px`,
                            top: `${(selectedLocation.demoLat / 40) * mapDimensions.height}px`
                          }}
                        >
                          <MapPin className="w-7 h-7 text-red-600 fill-red-600 drop-shadow-lg animate-bounce" />
                        </div>
                      )}
                  </div>

                  {/* Show on Map Button */}
                  <button 
                    onClick={openInGoogleMaps}
                    disabled={!selectedLocation}
                    className={`mt-3 w-full ${selectedLocation ? 'bg-[#0174b7] hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'} text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2`}
                  >
                    <Search className="w-4 h-4" /> Show On Map
                  </button>

                  {/* Selected location info removed as per request (no availability UI) */}
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
                <div className="p-4 space-y-6">
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
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* Filters Button for mobile/tablet */}
      <button
        className="block lg:hidden fixed top-4 right-4 z-40 bg-white border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2 shadow-md"
        onClick={() => setIsMobileSidebarOpen(true)}
      >
        <Settings className="w-5 h-5" />
        Filters
      </button>
      {/* Sidebar for desktop */}
      <div className="hidden lg:block bg-white border-r border-gray-200 h-full overflow-y-auto w-80 ">
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
                  </div>
                </div>
              );
            })}
            {/* External selected pin (if coords provided and not matching demo ids) */}
            {selectedLocation && selectedLocation.id === 'external' &&
              typeof selectedLocation.demoLat === 'number' && typeof selectedLocation.demoLng === 'number' && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
                  style={{
                    left: `${(selectedLocation.demoLng / 60) * mapDimensions.width}px`,
                    top: `${(selectedLocation.demoLat / 40) * mapDimensions.height}px`
                  }}
                >
                  <MapPin className="w-7 h-7 text-red-600 fill-red-600 drop-shadow-lg animate-bounce" />
                </div>
              )}
          </div>

          {/* Show on Map Button */}
          <button 
            onClick={openInGoogleMaps}
            disabled={!selectedLocation}
            className={`mt-3 w-full ${selectedLocation ? 'bg-[#0174b7] hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'} text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2`}
          >
            <Search className="w-4 h-4" /> Show On Map
          </button>

          {/* Selected location info removed as per request (no availability UI) */}
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
      {/* Mobile/Tablet Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end">
          <div className="bg-white w-80 max-w-full h-full overflow-y-auto shadow-xl animate-slide-in-right relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-600 text-2xl"
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-label="Close Filters"
            >
              &times;
            </button>
            {/* Sidebar content */}
            <div className="pt-10">
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
                        </div>
                      </div>
                    );
                  })}
                  {/* External selected pin (if coords provided and not matching demo ids) */}
                  {selectedLocation && selectedLocation.id === 'external' &&
                    typeof selectedLocation.demoLat === 'number' && typeof selectedLocation.demoLng === 'number' && (
                      <div
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
                        style={{
                          left: `${(selectedLocation.demoLng / 60) * mapDimensions.width}px`,
                          top: `${(selectedLocation.demoLat / 40) * mapDimensions.height}px`
                        }}
                      >
                        <MapPin className="w-7 h-7 text-red-600 fill-red-600 drop-shadow-lg animate-bounce" />
                      </div>
                    )}
                </div>

                {/* Show on Map Button */}
                <button 
                  onClick={openInGoogleMaps}
                  disabled={!selectedLocation}
                  className={`mt-3 w-full ${selectedLocation ? 'bg-[#0174b7] hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'} text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2`}
                >
                  <Search className="w-4 h-4" /> Show On Map
                </button>

                {/* Selected location info removed as per request (no availability UI) */}
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
          </div>
        </div>
      )}
    </>
  );
};

export default CarRentalSidebar;