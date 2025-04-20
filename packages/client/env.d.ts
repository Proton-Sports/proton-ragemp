declare interface EntityMp {
    readonly type:
        | 'player'
        | 'vehicle'
        | 'object'
        | 'marker'
        | 'blip'
        | 'textlabel'
        | 'colshape'
        | 'checkpoint'
        | 'webview'
        | 'ped'
        | 'pickup';
}
