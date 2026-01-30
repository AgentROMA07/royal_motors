export const CAR_CONDITIONS = ['new', 'used'] as const;
export const CAR_BODY_TYPES = ['sedan', 'suv', 'hatchback', 'wagon', 'coupe', 'minivan', 'pickup'] as const;
export const CAR_FUEL_TYPES = ['petrol', 'diesel', 'gas', 'hybrid', 'electric'] as const;
export const CAR_TRANSMISSIONS = ['automatic', 'manual', 'robot', 'variator'] as const;
export const CAR_DRIVE_TYPES = ['fwd', 'rwd', 'awd'] as const;

export type CarCondition = typeof CAR_CONDITIONS[number];
export type CarBodyType = typeof CAR_BODY_TYPES[number];
export type CarFuelType = typeof CAR_FUEL_TYPES[number];
export type CarTransmission = typeof CAR_TRANSMISSIONS[number];
export type CarDriveType = typeof CAR_DRIVE_TYPES[number];
