import { boolean } from 'boolean';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxDate,
  MaxLength,
  Min,
  MinDate,
  MinLength,
  UUIDVersion,
  ValidateNested,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { isNullOrUndefined } from '../utils/index.util';

type ValidationEnumOptions<E, T> = {
  enum: E;
  required?: boolean;
  default?: T;
};
export function IsValidEnum<E extends object, T>(
  opts: ValidationEnumOptions<E, T>,
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    const { required = true } = opts;
    IsEnum(opts.enum)(target, propertyKey);
    if (opts.default)
      Transform(({ value }) =>
        isNullOrUndefined(value) ? opts.default : value,
      )(target, propertyKey);
    if (required) IsNotEmpty()(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Validate Number is valid
 */
type ValidationDateOptions = {
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
};

export function IsValidDate(
  { required = true, maxDate, minDate }: ValidationDateOptions = {
    required: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string): void {
    Type(() => Date)(target, propertyKey);
    if (minDate) MinDate(minDate)(target, propertyKey);
    if (maxDate) MaxDate(maxDate)(target, propertyKey);
    if (required) IsDefined()(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Validate Number is valid
 */
type ValidationNumberOptions = {
  required?: boolean;
  min?: number;
  max?: number;
  default?: number;
};
export function IsValidNumber(
  {
    required = true,
    min,
    max,

    default: _default,
  }: ValidationNumberOptions = {
    required: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsNumber()(target, propertyKey);
    Type(() => Number)(target, propertyKey);
    if (typeof min === 'number') Min(min)(target, propertyKey);
    if (typeof max === 'number') Max(max)(target, propertyKey);
    if (typeof _default === 'number')
      Transform(({ value }) => (isNullOrUndefined(value) ? _default : value))(
        target,
        propertyKey,
      );
    if (required) IsDefined()(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Validate Number string is valid
 */
type ValidationNumberStringOptions = {
  required?: boolean;
  maxLength?: number;
};

export function IsValidNumberString(
  { required = true, maxLength }: ValidationNumberStringOptions = {
    required: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsNumberString()(target, propertyKey);
    if (maxLength) MaxLength(maxLength)(target, propertyKey);
    if (required) IsDefined()(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Validate text is valid
 */
type ValidationTextOptions = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  matches?: RegExp;
  trim?: boolean;
};

export function IsValidText(
  {
    minLength = 1,
    maxLength = 255,
    required = true,
    matches,
    trim = true,
  }: ValidationTextOptions = {
    required: true,
    minLength: 1,
    maxLength: 255,
    trim: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string): void {
    IsString()(target, propertyKey);
    MaxLength(maxLength)(target, propertyKey);
    if (trim) {
      Transform(({ value }: { value: string }) => value?.trim())(
        target,
        propertyKey,
      );
    }
    if (matches) Matches(matches)(target, propertyKey);
    if (required) {
      MinLength(minLength)(target, propertyKey);
      IsNotEmpty()(target, propertyKey);
    } else IsOptional()(target, propertyKey);
  };
}

/**
 * Validate uuid is valid
 */
type ValidationUUIDOptions = {
  required?: boolean;
  version?: UUIDVersion;
};

export function IsValidUUID(
  { required = true, version = '4' }: ValidationUUIDOptions = {
    required: true,
    version: '4',
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsUUID(version)(target, propertyKey);
    if (required) IsNotEmpty()(target, propertyKey);
  };
}

/**
 * Validate object is valid
 */
type ValidationObjectOptions = {
  required?: boolean;
  object?: { new (...args: any[]): any };
};

export function IsValidObject(
  { object, required = true }: ValidationObjectOptions = {
    required: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    ValidateNested()(target, propertyKey);
    if (typeof object === 'function') Type(() => object)(target, propertyKey);
    if (required) IsDefined()(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Valid array of number
 */
type ValidationArrayOptions<T = any> = {
  required?: boolean;
  minSize?: number;
  maxSize?: number;
  unique?: boolean;
  minValue?: number;
  maxValue?: number;
  defaults?: T[];
};

// Don't know why default value min/max size array not work here.
export function IsValidArrayNumber(
  {
    required = true,
    minSize,
    maxSize,
    unique,
    maxValue,
    minValue,
  }: ValidationArrayOptions = {
    required: true,
    unique: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsNumber({}, { each: true })(target, propertyKey);
    Transform(({ value }) =>
      Array.isArray(value)
        ? value.map(Number)
        : isNullOrUndefined(value)
        ? []
        : [Number(value)],
    )(target, propertyKey);
    if (typeof minSize === 'number') ArrayMinSize(minSize)(target, propertyKey);
    if (typeof maxSize === 'number') ArrayMaxSize(maxSize)(target, propertyKey);
    if (unique) ArrayUnique()(target, propertyKey);
    if (typeof minValue === 'number')
      Min(minValue, { each: true })(target, propertyKey);
    if (typeof maxValue === 'number')
      Max(maxValue, { each: true })(target, propertyKey);
    if (required) IsDefined()(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

export function IsValidArrayString(
  { required = true, minSize, maxSize, unique }: ValidationArrayOptions = {
    required: true,
    unique: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsString({ each: true })(target, propertyKey);
    Transform(({ value }) =>
      Array.isArray(value) ? value : isNullOrUndefined(value) ? [] : [value],
    )(target, propertyKey);
    if (typeof minSize === 'number') ArrayMinSize(minSize)(target, propertyKey);
    if (typeof maxSize === 'number') ArrayMaxSize(maxSize)(target, propertyKey);
    if (unique) ArrayUnique()(target, propertyKey);
    if (required) IsNotEmpty({ each: true })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Validate array of object is valid
 */
export function IsValidArrayObject(
  {
    maxSize,
    minSize,
    required = true,

    defaults,
  }: ValidationArrayOptions,
  object: { new (...args: any[]): any },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsArray()(target, propertyKey);
    ValidateNested({ each: true })(target, propertyKey);
    if (typeof minSize === 'number') ArrayMinSize(minSize)(target, propertyKey);
    if (typeof maxSize === 'number') ArrayMaxSize(maxSize)(target, propertyKey);
    if (Array.isArray(defaults)) {
      Transform(({ value }) =>
        Array.isArray(value)
          ? value
          : isNullOrUndefined(value)
          ? defaults
          : [value],
      )(target, propertyKey);
    } else {
      Transform(({ value }) =>
        Array.isArray(value) ? value : isNullOrUndefined(value) ? [] : [value],
      )(target, propertyKey);
    }
    Type(() => object)(target, propertyKey);
    if (required) IsNotEmpty()(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

export function IsValidArrayEnum(
  {
    maxSize,
    minSize,
    unique,
    required = true,
    defaults,
  }: ValidationArrayOptions,
  enumObj: object,
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsArray()(target, propertyKey);
    IsEnum(enumObj, { each: true })(target, propertyKey);
    if (typeof minSize === 'number') ArrayMinSize(minSize)(target, propertyKey);
    if (typeof maxSize === 'number') ArrayMaxSize(maxSize)(target, propertyKey);
    if (unique) ArrayUnique()(target, propertyKey);
    if (Array.isArray(defaults)) {
      Transform(({ value }) =>
        Array.isArray(value) ? value : value ? [value] : defaults,
      )(target, propertyKey);
    } else {
      Transform(({ value }) =>
        Array.isArray(value) ? value : value ? [value] : [],
      )(target, propertyKey);
    }
    if (required) IsNotEmpty()(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Match two field
 */
export function MatchField(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const message =
            validationOptions?.message ||
            ([propertyName, 'common.word.invalid'] as any);

          return JSON.stringify(message);
        },
      },
    });
  };
}

/**
 * Require all field exist
 */
export function ExcludeAllField(
  property: string[],
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: property,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const constraints = args.constraints;
          for (const keyField of constraints) {
            const relatedValue = (args.object as any)[keyField];
            if (relatedValue) return false;
          }

          return true;
        },
        defaultMessage(args?: ValidationArguments) {
          const message =
            validationOptions?.message ||
            ([propertyName, 'common.word.invalid'] as any);

          return JSON.stringify(message);
        },
      },
    });
  };
}

/**
 * Require all field exist
 */
export function RequireAllField(
  property: string[],
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: property,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const constraints = args.constraints;
          for (const keyField of constraints) {
            const relatedValue = (args.object as any)[keyField];
            if (!relatedValue) return false;
          }

          return true;
        },
        defaultMessage() {
          const message =
            validationOptions?.message ||
            ([propertyName, 'common.word.invalid'] as any);

          return JSON.stringify(message);
        },
      },
    });
  };
}

/**
 * Require one of fields exist
 */
export function IsRequireOneOf(
  property: string[],
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: property,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const constraints = args.constraints;

          for (const keyField of constraints) {
            const relatedValue = (args.object as any)[keyField];
            if (relatedValue) return true;
          }

          return false;
        },

        defaultMessage(args?: ValidationArguments) {
          const message =
            validationOptions?.message ||
            ([propertyName, 'common.word.invalid'] as any);

          return JSON.stringify(message);
        },
      },
    });
  };
}

/**
 * Validate only one field exists, if two field, or no filed exist, this will throw error
 * @param property Fields to check exists
 * @param validationOptions
 */
export function IsOnlyOneFieldExist(
  property: string[],
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: property,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const constraints = args.constraints;
          let isExisted = false;

          for (const fieldKey of constraints) {
            const fieldValue = (args.object as any)[fieldKey];

            // Two field exists
            if (fieldValue && isExisted) return false;

            if (fieldValue) isExisted = true;
          }

          if ((args.object as any)[args.property] && isExisted) return false;

          return true;
        },

        defaultMessage(args?: ValidationArguments): string {
          const message =
            validationOptions?.message ||
            ([propertyName, 'common.word.invalid'] as any);

          return JSON.stringify(message);
        },
      },
    });
  };
}

type ValidationEnumStringOptions = {
  enum: Record<string, any>;
  required?: boolean;
  default?: string;
};

type ValidationEnumNumberOptions = {
  enum: Record<string, any>;
  required?: boolean;
  default?: number;
};

export function IsValidEnumNumber(
  opts: ValidationEnumNumberOptions,
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsEnum(opts.enum)(target, propertyKey);
    if (opts.required) IsDefined()(target, propertyKey);
    else IsOptional()(target, propertyKey);
    if (opts.default)
      Transform(({ value }) => value || opts.default)(target, propertyKey);
  };
}

export function IsValidEnumString(
  opts: ValidationEnumStringOptions,
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsEnum(opts.enum)(target, propertyKey);
    if (opts.required) IsDefined()(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

type ValidationBooleanOptions = {
  required?: boolean;
  default?: boolean;
};

export function IsValidBoolean(
  { default: _default, required }: ValidationBooleanOptions = {
    required: true,
  },
) {
  return function (target: any, propertyKey: string | symbol): void {
    IsBoolean()(target, propertyKey);
    Transform(({ value }) =>
      value ? boolean(value) : typeof _default === 'boolean' ? _default : value,
    )(target, propertyKey);
    if (required) IsDefined()(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

type ValidationEmailOptions = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  matches?: RegExp;
  trim?: boolean;
};

export function IsValidEmail(
  {
    minLength = 1,
    maxLength = 255,
    required = true,
    matches,
    trim = true,
  }: ValidationEmailOptions = {
    required: true,
    minLength: 1,
    maxLength: 255,
    trim: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsEmail()(target, propertyKey);
    MinLength(minLength)(target, propertyKey);
    MaxLength(maxLength)(target, propertyKey);
    if (trim) {
      Transform(({ value }: { value: string }) => {
        if (value !== null) return value.trim();
        else return value;
      })(target, propertyKey);
    }
    if (matches) Matches(matches)(target, propertyKey);
    if (required) IsNotEmpty()(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}
