const INIT_AUDIOS = [
  {
    key: 'gameover',
    path: '../assets/sounds/gameover.mp3'
  },
  {
    key: 'goomba-stomp',
    path: '../assets/sounds/mario-goomba-stomp.mp3'
  },
  {
    key: 'collect-coin',
    path: '../assets/sounds/coin.mp3'
  },
  {
    key: 'power-up',
    path: '../assets/sounds/power-up-mario.mp3'
  },
  {
    key: 'mario-music',
    path: '../assets/sounds/super-mario-bros-music.mp3'
  }
]

export const initAudio = ({ load }) => {
  INIT_AUDIOS.forEach(({ key, path }) => {
    load.audio(key, path)
  })
}

export const playAudio = (id, { sound }, { volume = 1 } = {}) => {
  try {
    return sound.add(id, { volume })
  } catch (error) {
    console.log(error)
  }
}
