import { useState, useEffect } from "react";
import NFC from "./assets/NFC.png";

export default function Verify() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [isVerified, setIsVerified] = useState(false); 


  const Spinner = () => (
    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
  );

  useEffect(() => {
    const fetchData = async () => {
      // Get the URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      const u = urlParams.get('u');
      const c = urlParams.get('c');
      const m = urlParams.get('m');
      console.log(urlParams);
      try {
        // Send a GET request to your API
        const response = await fetch(`https://authapi-11-30.azurewebsites.net/auth/verifymac?sUid=${u}&sCounter=${c}&sMac=${m}&sKey=587F8EA7D439790920F7ECDF4303E0E5`, {
          method: 'GET',
          mode: 'no-cors', // 'no-cors' leads to opaque response, remove if possible
        });
        console.log(response)
        const data = await response.json();
        
        if (data) {
          setIsVerified(data.verified);
          if (data.verified) {
            // Display a success message if the product is verified
            setError("Mittels NFC-Scan wurde die Echtheit dieses Produktes verifiziert");
          } else {
            // Display an error message if the product is not verified
            setError("The product could not be verified");
          }
        }

        setFirstName(data.firstName);
        setLastName(data.lastName);
        setBirthday(data.birthday);
      } catch (err) {
        console.log(err)
        setError("Issue with Verification");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await new Promise((resolve) =>
      setTimeout(() => {
        setLoading(false);
        if (!firstName || !lastName || !birthday) {
          setError("Alle Felder müssen ausgefüllt werden");
        }
        resolve();
      }, 2000)
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* NFC Logo */}
      <div className="mb-10">
        <img src={NFC} alt="NFC Logo" className="w-24 h-24 color-change" />
      </div>
      {error && <p className="text-red-500 text-center mb-6">{error}</p>}
      {isVerified && <p className="text-green-500 text-center mb-6">Mittels NFC-Scan wurde die Echtheit dieses Produktes verifiziert</p>}
      <form onSubmit={handleSubmit} className={`w-80 space-y-3 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <div className="transition-all duration-500 ease-in-out transform translate-y-10 opacity-0 animate-fade-slide-down">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
            placeholder="Vorname"
            disabled={loading}
            required
          />
        </div>
        <div className="transition-all duration-500 ease-in-out transform translate-y-10 opacity-0 animate-fade-slide-down delay-200">
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 py-2 text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
            placeholder="Nachname"
            disabled={loading}
            required
          />
        </div>
        <div className="transition-all duration-500 ease-in-out transform translate-y-10 opacity-0 animate-fade-slide-down delay-400">
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full px-3 py-2 text-black placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
            placeholder="Geburtstag"
            disabled={loading}
            required
          />
        </div>
        
        <div className="transition-all duration-500 ease-in-out transform translate-y-10 opacity-0 animate-fade-slide-down delay-600">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-3 py-2 text-white bg-indigo-500 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300 relative"
          >
            <span className={loading ? 'opacity-0' : 'opacity-100'}>Einreichen</span> 
            {loading && <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"><Spinner/></span>}
          </button>
        </div>
      </form>
    </div>
  );
}
