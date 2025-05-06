export  interface Flight {
  id: number;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  seatsAvailable: number;
  departureDate: string;
  returnDate: string | null;
}
 