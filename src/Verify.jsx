import { useState, useEffect } from "react";
import NFC from "./assets/NFC.png";

export default function Verify() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [userData, setUserData] = useState(null);



  const Spinner = () => (
    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
  );


  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const u = urlParams.get('u');
        const c = urlParams.get('c');
        const m = urlParams.get('m');
        const currentUrl = window.location.href;
        const storedUrl = sessionStorage.getItem("url");

        if (storedUrl && storedUrl === currentUrl) {
          throw new Error("NFC-Scan veraltet. Bitte scannen Sie das Produkt erneut, um die Echtheit zu verifizieren.");
        } else {
          sessionStorage.setItem("url", currentUrl);
        }

        const response = await fetch(`http://test.twigitals.com/api.php?u=${u}&c=${c}&m=${m}&id=${id}`);
        const verify = await response.json();

        const cardQuery = await fetch(`http://test.twigitals.com/checkcard.php?card_id=${id}`)
        console.log(cardQuery);
        const query = await cardQuery.json();


        if (verify && verify !== false) {
          setUserData(query);
          setIsVerified(true);
        } else if (verify === false) {
          throw new Error("Das Produkt konnte nicht verifiziert werden");
        } else {
          setUserData(null);
        }
      } catch (err) {
        setError(err.message);
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
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id'); // Card ID
    if (!firstName || !lastName || !birthday) {
      setError("Alle Felder müssen ausgefüllt werden");
      setLoading(false);
      return;  // stop the function if the data is not valid
    }

    const data = {
      card_id: id,
      firstName: firstName,
      lastName: lastName,
      birthday: birthday
    };
    
    try {
      const response = await fetch("http://test.twigitals.com/form.php", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify(data)
      });
      console.log(response)
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      else {setUserData(data)}
      // you might want to do something with the response, like update the UI
    } catch (error) {
      console.log(error);
      setError("Issue with form submission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* NFC Logo */}
      <div className="mb-10">
        <img src={NFC} alt="NFC Logo" className="w-24 h-24 color-change" />
      </div>
      {error && <p className="text-red-500 text-center mb-6">{error}</p>}
      {isVerified && <p className="text-green-500 text-center mb-6">Mittels NFC-Scan wurde die Echtheit dieses Produktes verifiziert</p>}
      {isVerified && userData ? (
        <div className="transition-all duration-500 ease-in-out transform translate-y-10 opacity-0 animate-fade-slide-down">
          <h2 className="text-xl font-bold text-center mb-4">User Information:</h2>
          <div className="border border-gray-300 rounded-lg p-4">
            <p className="mb-2"><span className="font-semibold">Vorname:</span> {userData.firstName}</p>
            <p><span className="font-semibold">Nachname:</span> {userData.lastName}</p>
          </div>
        </div>
      ) : (
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
              {loading && <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"><Spinner /></span>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
