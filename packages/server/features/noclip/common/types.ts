export interface NoClip {
    isStarted(player: PlayerMp): boolean;
    start(player: PlayerMp): void;
    stop(player: PlayerMp): void;
}
