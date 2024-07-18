import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [origin, setOrigin] = useState("SYD");
  const [destination, setDestination] = useState("JFK");
  const [cabin, setCabin] = useState("Business");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProFilters, setShowProFilters] = useState(false);
  const [filters, setFilters] = useState({
    stopCount: 2,
    partnerPrograms: [
      "Air Canada",
      "United Airlines",
      "KLM",
      "Qantas",
      "American Airlines",
      "Etihad Airways",
      "Alaska Airlines",
      "Qatar Airways",
      "LifeMiles",
    ],
    departureTimeFrom: "2024-07-09T00:00:00Z",
    departureTimeTo: "2024-10-07T00:00:00Z",
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://flightbookingbackend-task.onrender.com/search-flights",
        {
          origin,
          destination,
          cabinSelection: cabin,
          stopCount: parseInt(filters.stopCount, 10),
          partnerPrograms: filters.partnerPrograms,
          departureTimeFrom: new Date(filters.departureTimeFrom).toISOString(),
          departureTimeTo: new Date(filters.departureTimeTo).toISOString(),
        }
      );
      setResults(response.data.data);
    } catch (error) {
      console.error("Error fetching data", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Flight Search</h1>
      <div className="form-group select-group">
  <label>Origin:</label>
  <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
    <option value="JFK">JFK</option>
    <option value="DEL">DEL</option>
    <option value="SYD">SYD</option>
    <option value="BOM">BOM</option>
    <option value="BNE">BNE</option>
    <option value="BLR">BLR</option>
  </select>
</div>
<div className="form-group select-group">
  <label>Destination:</label>
  <select value={destination} onChange={(e) => setDestination(e.target.value)}>
    <option value="JFK">JFK</option>
    <option value="DEL">DEL</option>
    <option value="SYD">SYD</option>
    <option value="LHR">LHR</option>
    <option value="CDG">CDG</option>
    <option value="DOH">DOH</option>
    <option value="SIN">SIN</option>
  </select>
</div>

      {/* <div className="form-group">
        <label>Destination:</label>
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        >
          <option value="JFK">JFK</option>
          <option value="DEL">DEL</option>
          <option value="SYD">SYD</option>
          <option value="LHR">LHR</option>
          <option value="CDG">CDG</option>
          <option value="DOH">DOH</option>
          <option value="SIN">SIN</option>
        </select>
      </div> */}
      <div className="form-group">
        <label>Cabin:</label>
        <select value={cabin} onChange={(e) => setCabin(e.target.value)}>
          <option value="Economy">Economy</option>
          <option value="Business">Business</option>
          <option value="First">First</option>
        </select>
      </div>

      <button onClick={() => setShowProFilters(!showProFilters)}>
        {showProFilters ? "Hide Pro Filters" : "Show Pro Filters"}
      </button>

      {showProFilters && (
        <div className="pro-filters">
          <div className="form-group">
            <label>Stop Count:</label>
            <select
              value={filters.stopCount}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  stopCount: parseInt(e.target.value, 10),
                })
              }
            >
              <option value="0">Non-stop</option>
              <option value="1">1 Stop</option>
              <option value="2">2+ Stops</option>
            </select>
          </div>
          <div className="form-group">
            <label>Partner Programs:</label>
            <input
              type="text"
              value={filters.partnerPrograms.join(", ")}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  partnerPrograms: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
          <div className="form-group">
            <label>Departure Time From:</label>
            <input
              type="datetime-local"
              value={filters.departureTimeFrom}
              onChange={(e) =>
                setFilters({ ...filters, departureTimeFrom: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Departure Time To:</label>
            <input
              type="datetime-local"
              value={filters.departureTimeTo}
              onChange={(e) =>
                setFilters({ ...filters, departureTimeTo: e.target.value })
              }
            />
          </div>
        </div>
      )}

      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      <div className="results">
        {results.length > 0 ? (
          results.map((result, index) => (
            <div key={index} className="card">
              <div className="card-header">
                <img src="logo.png" alt="logo" className="logo" />
                <h2>{result.partner_program}</h2>
                <p>
                  {origin} &rarr; {destination}
                </p>
                <p>
                  {filters.departureTimeFrom.split("T")[0]} &rarr;{" "}
                  {filters.departureTimeTo.split("T")[0]}
                </p>
              </div>
              <div className="card-body">
                <div className="card-section">
                  <div className="flex-row">
                    <p className="big-font">
                      {result.min_business_miles || "N/A"}
                    </p>
                    <p>+ ${result.min_business_tax || "N/A"}</p>
                  </div>
                  <p>Min Business Miles</p>

                </div>
                <div className="card-section">
                  <div className="flex-row">
                    <p className="big-font">
                      {result.min_economy_miles || "N/A"}
                    </p>
                    <p>+ ${result.min_economy_tax || "N/A"}</p>
                  </div>
                  <p>Min Economy Miles</p>

                </div>
                <div className="card-section">
                  {/* <p className="big-font">{result.min_first_miles || 'N/A'}</p>
                  <p>+ {result.min_first_tax || 'N/A'}</p> */}
                  <div className="flex-row">
                    <p className="big-font">
                      {result.min_first_miles || "N/A"}
                    </p>
                    <p>+ ${result.min_first_tax || "N/A"}</p>
                  </div>
                  <p>Min First Miles</p>

                </div>
              </div>
            </div>
          ))
        ) : (
          <p>{loading ? "Loading..." : "Try another search route."}</p>
        )}
      </div>
    </div>
  );
}

export default App;

// import React, { useState } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [origin, setOrigin] = useState('SYD');
//   const [destination, setDestination] = useState('JFK');
//   const [cabin, setCabin] = useState('Business');
//   const [results, setResults] = useState([]);

//   const handleSearch = async () => {
//     try {
//       const response = await axios.post('http://localhost:5000/search-flights', {
//         origin,
//         destination,
//         cabinSelection: cabin,
//       });
//       setResults(response.data.data);
//     } catch (error) {
//       console.error('Error fetching data', error);
//     }
//   };

//   return (
//     <div className="App">
//       <h1>Flight Search</h1>
//       <div className="form-group">
//         <label>Origin:</label>
//         <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
//           <option value="JFK">JFK</option>
//           <option value="DEL">DEL</option>
//           <option value="SYD">SYD</option>
//           <option value="BOM">BOM</option>
//           <option value="BNE">BNE</option>
//           <option value="BLR">BLR</option>
//         </select>
//       </div>
//       <div className="form-group">
//         <label>Destination:</label>
//         <select value={destination} onChange={(e) => setDestination(e.target.value)}>
//           <option value="JFK">JFK</option>
//           <option value="DEL">DEL</option>
//           <option value="SYD">SYD</option>
//           <option value="LHR">LHR</option>
//           <option value="CDG">CDG</option>
//           <option value="DOH">DOH</option>
//           <option value="SIN">SIN</option>
//         </select>
//       </div>
//       <div className="form-group">
//         <label>Cabin:</label>
//         <select value={cabin} onChange={(e) => setCabin(e.target.value)}>
//           <option value="Economy">Economy</option>
//           <option value="Business">Business</option>
//           <option value="First">First</option>
//         </select>
//       </div>
//       <button onClick={handleSearch}>Search</button>

//       {results.length > 0 ? (
//         <table>
//           <thead>
//             <tr>
//               <th>Partner Program</th>
//               <th>Min Economy Miles</th>
//               <th>Min Economy Tax</th>
//               <th>Min Business Miles</th>
//               <th>Min Business Tax</th>
//               <th>Min First Miles</th>
//               <th>Min First Tax</th>
//             </tr>
//           </thead>
//           <tbody>
//             {results.map((result, index) => (
//               <tr key={index}>
//                 <td>{result.partner_program}</td>
//                 <td>{result.min_economy_miles || 'N/A'}</td>
//                 <td>{result.min_economy_tax || 'N/A'}</td>
//                 <td>{result.min_business_miles || 'N/A'}</td>
//                 <td>{result.min_business_tax || 'N/A'}</td>
//                 <td>{result.min_first_miles || 'N/A'}</td>
//                 <td>{result.min_first_tax || 'N/A'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>Try another search route.</p>
//       )}
//     </div>
//   );
// }

// export default App;
