export type THotel = {
  id?: number;
  name: string;
  location: { lat: string; long: string };
  rating: string;
  baseAmount: number;
  taxAmount: number;
};