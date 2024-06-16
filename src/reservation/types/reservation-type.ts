export type TReservation<THotel = string, TUser = string> = {
  id?: number;
  hotelId: THotel;
  userId: TUser; // guestId
  arrivalDate: Date;
  departureDate: Date;
  status: 'active' | 'cancelled';
  amount: number; // baseAmount + taxAmount in hotel
};
