import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';

@InputType()
export class LocationInputDto {
  @Field(() => String)
  lat: string;

  @Field(() => String)
  long: string;
}

@ObjectType()
export class LocationObjectDto extends OmitType(LocationInputDto, [] as const, ObjectType) {}