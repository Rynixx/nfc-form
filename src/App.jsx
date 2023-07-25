import {Routes, Route, BrowserRouter} from "react-router-dom";
import Verify from './Verify'; // This is your verify component

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="verify" element={<Verify />} />
      <Route path="*" element={<Verify />} />
    </Routes>
  </BrowserRouter>
  );
}


