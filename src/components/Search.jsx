import React, { useMemo, useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import HeaderSearch from "./HeaderSearch";
import Cars from "./Cars";
import { useLocation } from "react-router-dom";

const CarRentalLayout = () => {
  const location = useLocation();
  const [carsData, setCarsData] = useState([]);
  const { searchParams } = location.state || {};
  const [loading, setLoading] = useState(false);
  const pickupInputRef = useRef(null);
  const dropoffInputRef = useRef(null);

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const pickup = params.get("pickup") || undefined;
  const pickupLat = params.get("pickupLat");
  const pickupLng = params.get("pickupLng");

  const externalSelectedLocation = useMemo(() => {
    if (!pickup) return undefined;
    const lat = pickupLat ? Number(pickupLat) : undefined;
    const lng = pickupLng ? Number(pickupLng) : undefined;
    if (typeof lat === "number" && !Number.isNaN(lat) && typeof lng === "number" && !Number.isNaN(lng)) {
      return { id: "external", name: pickup, lat, lng, available: 0 };
    }
    return { id: "external", name: pickup };
  }, [pickup, pickupLat, pickupLng]);

  const [filters, setFilters] = useState({
    carType: '',
    passengers: '',
    transmission: [],
    cards: [],
    deposit: [],
    companies: []
  });

  const handleFilterChange = (category, value) => {
    if (category === 'carType' || category === 'passengers') {
      setFilters(prev => ({
        ...prev,
        [category]: value
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [category]: prev[category].includes(value)
          ? prev[category].filter(item => item !== value)
          : [...prev[category], value]
      }));
    }
  };

  const clearAllFilters = () => {
    setFilters({
      carType: '',
      passengers: '',
      transmission: [],
      cards: [],
      deposit: [],
      companies: []
    });
  };

  // Check if we have cars data from navigation state
  useEffect(() => {
    if (location.state?.carsData) {
      setCarsData(location.state.carsData);
    } else if (location.search) {
      // If no cars data in state but we have search params, make API call
      fetchCarsFromParams();
    }
  }, [location.state, location.search]);

  const fetchCarsFromParams = async () => {
    if (!location.search) return;

    setLoading(true);
    try {
      const params = new URLSearchParams(location.search);

      const formData = new URLSearchParams();
      formData.append('pickup_location', params.get('pickup_location') || '[]');
      formData.append('dropoff_location', params.get('dropoff_location') || '[]');
      formData.append('pickup_date', params.get('pickup_date') || '');
      formData.append('dropoff_date', params.get('dropoff_date') || '');
      formData.append('driver_age', params.get('driver_age') || '25');
      formData.append('country', params.get('country') || 'PK');

      const response = await fetch('https://api.rentnrides.com/api/search-car', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }

      const data = await response.json();
      setCarsData(data.data?.cars || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCarsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtering logic
  const filteredCars = useMemo(() => {
    return carsData.filter(car => {
      // Car Type
      if (filters.carType && car.category !== filters.carType) return false;
      // Passengers - Extract the number from the filter string
    if (filters.passengers) {
      const filterSeats = parseInt(filters.passengers); // Extract "4" from "4 Passengers"
      if (car.seats !== filterSeats) return false;
    }
      // Transmission - Handle "All", "Automatic", and "Manual" filters
    if (filters.transmission.length > 0) {
      // If "All" is selected, show all cars regardless of transmission
      if (filters.transmission.includes('All')) {
        // Do nothing, show all cars
      } 
      // If specific transmission types are selected
      else {
        const carTransmission = car.transmission_type?.toLowerCase() || '';
        
        const hasAutomatic = filters.transmission.includes('Automatic') && 
                            (carTransmission.includes('auto') || carTransmission === 'automatic');
        
        const hasManual = filters.transmission.includes('Manual') && 
                         (carTransmission.includes('manual') || carTransmission.includes('man'));
        
        // Show car only if it matches at least one selected transmission type
        if (!hasAutomatic && !hasManual) return false;
      }
    }
     // Deposit filter - handle string values like "750.00"
    if (filters.deposit.length > 0) {
      // Convert deposit string to number (remove any non-numeric characters except decimal point)
      const carDeposit = parseFloat(car.deposit?.replace(/[^\d.]/g, '') || 0);
      
      const matchesDeposit = filters.deposit.some(depositRange => {
        switch (depositRange) {
          case '€ 0 - € 500':
            return carDeposit >= 0 && carDeposit <= 500;
          case '€ 501 - € 1,000':
            return carDeposit >= 501 && carDeposit <= 1000;
          case '€ 1,001 - € 1,500':
            return carDeposit >= 1001 && carDeposit <= 1500;
          case '€ 1,501 - € 2,000':
            return carDeposit >= 1501 && carDeposit <= 2000;
          case '€ 2,000 +':
            return carDeposit > 2000;
          default:
            return false;
        }
      });
      
      if (!matchesDeposit) return false;
    }
    
    // Add other filters as needed...
      return true;
    });
  }, [carsData, filters]);

  return (

    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-5 py-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar for desktop */}
          <div className="hidden lg:block w-60 xl:w-80 flex-shrink-0">
            <Sidebar
              externalSelectedLocation={externalSelectedLocation}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearAllFilters}
              resultsCount={filteredCars.length} // Add this
            />
          </div>

          {/* Main content area */}
          <div className="flex-1 min-w-0"> {/* min-w-0 prevents flex overflow */}
            <HeaderSearch
              setCarsData={setCarsData}
              pickupInputRef={pickupInputRef}
              dropoffInputRef={dropoffInputRef}
            /> 

            {/* Filters button for mobile/tablet */}
            <div className="block lg:hidden mb-4">
              <Sidebar
                  externalSelectedLocation={externalSelectedLocation}
                  mobileOnly
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={clearAllFilters}
                  resultsCount={filteredCars.length} // Add this
                />
            </div>

            <Cars carsData={filteredCars} loading={loading} searchParams={searchParams} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarRentalLayout;