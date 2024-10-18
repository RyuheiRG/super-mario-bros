const INIT_SPRITESHEET = [
  {
    key: 'mario',
    path: '../assets/entities/mario.png',
    frameWidth: 18,
    frameHeight: 16
  },

  {
    key: 'goomba',
    path: '../assets/entities/goomba.png',
    frameWidth: 16,
    frameHeight: 16
  },

  {
    key: 'coin',
    path: '../assets/items/coin.png',
    frameWidth: 16,
    frameHeight: 16
  },

  {
    key: 'mario-grown',
    path: '../assets/entities/mario-grown.png',
    frameWidth: 18,
    frameHeight: 32
  }
]

export const initSpritesheet = ({ load }) => {
  INIT_SPRITESHEET.forEach(({ key, path, frameWidth, frameHeight }) => {
    load.spritesheet(key, path, { frameWidth, frameHeight })
  })
}
