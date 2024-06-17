import { Reservation } from '../schemas/reservation.schema';

export type TPastStays = {
  reservations: Reservation[];
  nextCursor: string;
};
