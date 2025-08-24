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

  return (

    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-5 py-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar for desktop */}
          <div className="hidden lg:block w-60 xl:w-80 flex-shrink-0">
            <Sidebar externalSelectedLocation={externalSelectedLocation} />
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
              />
            </div>

            <Cars carsData={carsData} loading={loading} searchParams={searchParams} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarRentalLayout;