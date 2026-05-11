"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomeSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterData, setFilterData] = useState({ destinations: [], durations: [] });
  
  const [selectedFilters, setSelectedFilters] = useState({
    destination: searchParams.get("destination") || "",
    duration: searchParams.get("duration") || "",
    budget: searchParams.get("budget") || "",
    type: searchParams.get("type") || ""
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch("/api/packages/filters");
        const data = await res.json();
        setFilterData(data);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchFilters();
  }, []);

  const handleFilterChange = (name, value) => {
    setSelectedFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedFilters.destination) params.set("destination", selectedFilters.destination);
    if (selectedFilters.duration) params.set("duration", selectedFilters.duration);
    if (selectedFilters.budget) params.set("budget", selectedFilters.budget);
    if (selectedFilters.type) params.set("type", selectedFilters.type);

    router.push(`/packages?${params.toString()}`);
  };

  return (
    <section id="search" style={{ padding: 0 }}>
      <div className="container">
        <div id="search">
          <h3 className="search-title">Find Your Perfect Journey</h3>
          <div className="search-grid">
            <div className="search-field">
              <label>Destination</label>
              <select 
                id="filterDest" 
                value={selectedFilters.destination} 
                onChange={(e) => handleFilterChange("destination", e.target.value)}
              >
                <option value="">All Destinations</option>
                {filterData.destinations.map(dest => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
            </div>
            <div className="search-field">
              <label>Duration</label>
              <select 
                id="filterDur" 
                value={selectedFilters.duration} 
                onChange={(e) => handleFilterChange("duration", e.target.value)}
              >
                <option value="">Any Duration</option>
                {filterData.durations.map(dur => (
                  <option key={dur} value={dur}>{dur} Days</option>
                ))}
              </select>
            </div>
            <div className="search-field">
              <label>Budget</label>
              <select 
                id="filterPrice" 
                value={selectedFilters.budget} 
                onChange={(e) => handleFilterChange("budget", e.target.value)}
              >
                <option value="">Any Budget</option>
                <option value="0-10000">Below ₹10,000</option>
                <option value="10000-25000">₹10,000 - ₹25,000</option>
                <option value="25000-50000">₹25,000 - ₹50,000</option>
                <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                <option value="100000-1000000">Above ₹1,00,000</option>
              </select>
            </div>
            <div className="search-field">
              <label>Tour Type</label>
              <select 
                id="filterType" 
                value={selectedFilters.type} 
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Hill Station">Hill Station</option>
                <option value="Beach Holiday">Beach Holiday</option>
                <option value="Cultural">Cultural & Heritage</option>
                <option value="Adventure">Adventure</option>
                <option value="Spiritual">Spiritual</option>
                <option value="International">International</option>
              </select>
            </div>
            <button className="btn-primary search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
