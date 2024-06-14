export type TReservation = {
  id: number;
  hotelId: number;
  userId: number; // guestId
  arrivalDate: Date;
  departureDate: Date;
  status: 'active' | 'cancelled';
  checkOut: string;
  amount: number;
};