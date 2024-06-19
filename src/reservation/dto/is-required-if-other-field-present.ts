import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function IsRequiredIfOtherFieldPresent(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isRequiredIfOtherFieldPresent',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (relatedValue !== undefined && relatedValue !== null) {
            return value !== undefined && value !== null;
          }
          return true;
        },
      },
    });
  };
}