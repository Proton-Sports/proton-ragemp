import type { PedComponent } from '@repo/shared/models/game';

// Define ClosetClothes interface
export interface ClosetClothes {
    id: number;
    drawable: number;
    texture: number;
    palette: number;
    dlc: number;
}

export interface ClosetService {
    tryGetAllEquippedComponents(player: PlayerMp): Map<PedComponent, ClosetClothes> | null;
    tryGetEquippedClothes(player: PlayerMp, component: PedComponent): ClosetClothes | null;
    setEquipped(player: PlayerMp, component: PedComponent, clothes: ClosetClothes): void;
    unsetEquipped(player: PlayerMp, component?: PedComponent): boolean;
}

class RageMpClosetService implements ClosetService {
    private playerComponents = new Map<PlayerMp, Map<PedComponent, ClosetClothes>>();

    public tryGetAllEquippedComponents(player: PlayerMp): Map<PedComponent, ClosetClothes> | null {
        return this.playerComponents.get(player) || null;
    }

    public tryGetEquippedClothes(player: PlayerMp, component: PedComponent): ClosetClothes | null {
        const components = this.playerComponents.get(player);
        if (!components) {
            return null;
        }

        return components.get(component) || null;
    }

    public setEquipped(player: PlayerMp, component: PedComponent, clothes: ClosetClothes): void {
        let components = this.playerComponents.get(player);

        if (!components) {
            components = new Map<PedComponent, ClosetClothes>();
            this.playerComponents.set(player, components);
        }

        components.set(component, clothes);
    }

    public unsetEquipped(player: PlayerMp, component?: PedComponent): boolean {
        const components = this.playerComponents.get(player);
        if (!components) {
            return false;
        }

        // If component is specified, remove only that component
        if (component !== undefined) {
            const result = components.delete(component);

            // If no components left, remove player from map
            if (components.size === 0) {
                this.playerComponents.delete(player);
            }

            return result;
        }

        // If no component specified, remove all components for this player
        return this.playerComponents.delete(player);
    }
}

export const createRageMpClosetService = () => {
    return new RageMpClosetService();
};
