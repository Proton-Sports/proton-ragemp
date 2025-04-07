export interface PlayerTabProps {
  players?: { id: number; name: string }[];
  onPlayersChange: (players: PlayerTabProps['players']) => void;
}

export interface VehicleTabProps {
  vehicles?: { id: number; name: string }[];
  onVehiclesChange: (vehicles: VehicleTabProps['vehicles']) => void;
  onVehicleCreate: (vehicle: NonNullable<VehicleTabProps['vehicles']>[number]) => void;
  onVehicleDestroy: (id: number) => void;
}
