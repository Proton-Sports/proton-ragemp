mp.events.add('playerReady', (player) => {
    player.model = mp.joaat('mp_m_freemode_01');
    player.spawn(new mp.Vector3(0, 0, 72));
});
