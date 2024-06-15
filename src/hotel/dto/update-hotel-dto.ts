import { InputType, PartialType } from '@nestjs/graphql';
import { CreateHotelDto } from './create-hotel-dto';

@InputType()
export class UpdateHotelDto extends PartialType(CreateHotelDto) {} 
//  implements Partial<THotel> {
//   @Field(() => String, { nullable: true })
//   @IsString()
//   name: string;

//   @Field(() => [String, String], { nullable: true })
//   @IsString()
//   location: { lat: string; long: string; };

//   @Field(() => String, { nullable: true })
//   @IsString()
//   rating: string;

//   @Field(() => Number, { nullable: true })
//   @IsNumber()
//   baseAmount: number;

//   @Field(() => Number, { nullable: true })
//   @IsNumber()
//   taxAmount: number;
// }
