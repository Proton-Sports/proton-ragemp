import vehicleNames from '~/config/vehicle-names.json';

export const getVehicleModelDisplayName = (vehicleModel: number) => {
    return (vehicleNames as unknown as Record<string, string>)[vehicleModel] ?? 'Unknown Vehicle';
};
