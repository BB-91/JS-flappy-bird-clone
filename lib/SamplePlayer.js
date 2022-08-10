/*

    let jumpAudioPlayers = [];
    let jumpAudioIndex = 2;

    const VOLUME = {
        IMPACT: 0.07,
        JUMP: 0.3,
    }

    const impactAudioPlayer = new Audio(`../audio/punch_heavy_huge_distorted_04.mp3`)
    impactAudioPlayer.volume = VOLUME.IMPACT;

    const JUMP_AUDIO_PLAYER_OFFSET = 2 // first file name ends in 02

    const incrementJumpAudioIndex = () => {
        jumpAudioIndex = Math.max((jumpAudioIndex + 1) % 10, JUMP_AUDIO_PLAYER_OFFSET);
    }

    const initJumpAudioPlayers = () => {
        for (let i = 0; i < 8; i++) {
            const path = `../audio/whoosh_low_deep_0${jumpAudioIndex}.mp3`;
            const jumpAudioPlayer = new Audio(path);
            jumpAudioPlayer.volume = VOLUME.JUMP;
            jumpAudioPlayers.push(jumpAudioPlayer);
            incrementJumpAudioIndex();
        }
    }


    initJumpAudioPlayers();

    const stopThenPlay = (audioPlayer) => {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    }

    const playNextJumpSound = () => {
        const jumpAudioPlayer = jumpAudioPlayers[jumpAudioIndex - JUMP_AUDIO_PLAYER_OFFSET];
        stopThenPlay(jumpAudioPlayer);
        incrementJumpAudioIndex();
    }

    const playImpactSound = () => {
        stopThenPlay(impactAudioPlayer);
    }


    export { playNextJumpSound, playImpactSound };

*/