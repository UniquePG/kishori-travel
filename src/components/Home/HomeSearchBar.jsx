"use client";

export default function HomeSearchBar() {
  return (
    <section id="search" style={{ padding: 0 }}>
      <div className="container">
        <div id="search">
          <h3 className="search-title">Find Your Perfect Journey</h3>
          <div className="search-grid">
            <div className="search-field">
              <label>Destination</label>
              <select id="filterDest">
                <option value="">All Destinations</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="Kashmir">Kashmir</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Goa">Goa</option>
                <option value="Kerala">Kerala</option>
                <option value="International">International</option>
              </select>
            </div>
            <div className="search-field">
              <label>Duration</label>
              <select id="filterDur">
                <option value="">Any Duration</option>
                <option value="short">Short (1-4 Days)</option>
                <option value="medium">Medium (5-8 Days)</option>
                <option value="long">Long (9+ Days)</option>
              </select>
            </div>
            <div className="search-field">
              <label>Budget</label>
              <select id="filterPrice">
                <option value="">Any Budget</option>
                <option value="budget">Budget Friendly</option>
                <option value="mid1">Mid-Range</option>
                <option value="mid2">Premium</option>
                <option value="mid3">Luxury</option>
              </select>
            </div>
            <div className="search-field">
              <label>Tour Type</label>
              <select id="filterType">
                <option value="">All Types</option>
                <option value="hills">Hill Station</option>
                <option value="beach">Beach Holiday</option>
                <option value="cultural">Cultural & Heritage</option>
                <option value="International">International</option>
              </select>
            </div>
            <button className="btn-primary search-btn" onClick={() => {
                const element = document.getElementById("packages");
                if (element) element.scrollIntoView({ behavior: "smooth" });
            }}>
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
