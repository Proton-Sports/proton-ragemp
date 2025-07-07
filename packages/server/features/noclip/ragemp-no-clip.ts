import type { Messenger } from '@kernel/messenger';
import type { NoClip } from './common/types';

export class RageMpNoClip implements NoClip {
    #messenger: Messenger;
    #noClipPlayers = new WeakSet<PlayerMp>();

    constructor(messenger: Messenger) {
        this.#messenger = messenger;
    }

    public isStarted(player: PlayerMp): boolean {
        return this.#noClipPlayers.has(player);
    }

    public start(player: PlayerMp): void {
        if (this.isStarted(player)) return;

        this.#noClipPlayers.add(player);
        this.#messenger.publish(player, 'noclip.start');
    }

    public stop(player: PlayerMp): void {
        if (!this.isStarted(player)) return;

        this.#noClipPlayers.delete(player);
        this.#messenger.publish(player, 'noclip.stop');
    }
}
