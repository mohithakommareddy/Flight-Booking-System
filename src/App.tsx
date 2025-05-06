import  { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import FlightSearch from './pages/FlightSearch';
import FlightDetails from './pages/FlightDetails';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<FlightSearch />} />
        <Route path="flight/:id" element={<FlightDetails />} />
        <Route path="booking/:id" element={<Booking />} />
        <Route path="payment/:id" element={<Payment />} />
        <Route path="confirmation/:id" element={<Confirmation />} />
      </Route>
    </Routes>
  );
}

export default App;
 