export type TReservation = {
  id?: number;
  hotelId: string;
  userId: string; // guestId
  arrivalDate: Date;
  departureDate: Date;
  status: 'active' | 'cancelled';
  amount: number; // baseAmount + taxAmount in hotel
};
