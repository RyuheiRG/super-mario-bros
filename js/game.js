/* global Phaser */
import { createAnimations } from './animations.js'
import { checkControls } from './controls.js'
import { initAudio, playAudio } from './sounds.js'
import { initSpritesheet } from './spritesheet.js'

const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 244,
  backgroundColor: '#049cd8',
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 }
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

new Phaser.Game(config)
// this --> game --> el juego que estamos construyendo

function preload () {
  this.load.image(
    'cloud1',
    '../assets/scenery/cloud1.png'
  )

  this.load.image(
    'floorbricks',
    '../assets/scenery/floorbricks.png'
  )

  this.load.image(
    'block',
    '../assets/scenery/block.png'
  )

  this.load.image(
    'supermushroom',
    '../assets/items/super-mushroom.png'
  )

  initSpritesheet(this)

  initAudio(this)
}

function create () {
  const marioMusic = playAudio('mario-music', this, { volume: 0.4 })
  marioMusic.setLoop(true).play()

  createAnimations(this)

  this.add.image(100, 50, 'cloud1')
    .setOrigin(0, 0)
    .setScale(0.15)

  this.floor = this.physics.add.staticGroup()

  this.floor.create(
    0,
    config.height - 16,
    'floorbricks'
  )
    .setOrigin(0, 0.5)
    .refreshBody()

  this.floor.create(
    150,
    config.height - 16,
    'floorbricks'
  )
    .setOrigin(0, 0.5)
    .refreshBody()

  this.floor.create(
    350,
    config.height - 16,
    'floorbricks'
  )
    .setOrigin(0, 0.5)
    .refreshBody()

  /*  this.block = this.physics.add.staticGroup()
  this.block.create(
    80,
    config.height - 50,
    'block'
  )
    .setOrigin(0, 0.5)
    .refreshBody() */

  this.mario = this.physics.add.sprite(50, 100, 'mario')
    .setOrigin(0, 1)
    .setCollideWorldBounds(true)
    .setGravityY(450)

  this.goomba = this.physics.add.sprite(120, config.height - 64, 'goomba')
    .setOrigin(0, 1)
    .setGravityY(300)
    .setVelocityX(-50)
  this.goomba.anims.play('goomba-walk', true)

  this.collectibes = this.physics.add.staticGroup()
  this.collectibes.create(150, 150, 'coin').anims.play('coin-idle', true)
  this.collectibes.create(300, 150, 'coin').anims.play('coin-idle', true)
  this.physics.add.overlap(this.mario, this.collectibes, collectItem, null, this)

  this.collectibes.create(200, config.height - 40, 'supermushroom').anims.play('supermushroom-idle', true, collectItem, null, this)

  this.physics.world.setBounds(0, 0, 2000, config.height)
  this.physics.add.collider(this.mario, this.floor)
  // this.physics.add.collider(this.mario, this.block)

  this.physics.add.collider(this.goomba, this.floor)
  this.physics.add.collider(this.mario, this.goomba, onHitEnemy, null, this)

  this.cameras.main.setBounds(0, 0, 2000, config.height)
  this.cameras.main.startFollow(this.mario)

  this.keys = this.input.keyboard.createCursorKeys()
}

function collectItem (mario, item) {
  const { texture: { key } } = item
  item.destroy()

  if (key === 'coin') {
    mario.isCollectCoin = true
    setTimeout(() => {
      mario.isCollectCoin = false
    }, 100)
    playAudio('collect-coin', this, { volume: 0.4 }).play()
    addToScore(100, item, this)
  } else if (key === 'supermushroom') {
    this.physics.world.pause()
    this.anims.pauseAll()
    // this.sound.pauseAll()

    playAudio('power-up', this, { volume: 0.1 }).play()

    let i = 0
    const interval = setInterval(() => {
      i++
      mario.anims.play(i % 2 === 0 ? 'mario-grown-idle' : 'mario-idle')
    }, 100)

    mario.isGrown = true
    mario.isBlocked = true

    setTimeout(() => {
      mario.setDisplaySize(18, 32)
      mario.body.setSize(18, 32)
      mario.isBlocked = false
      clearInterval(interval)
      this.physics.world.resume()
      this.anims.resumeAll()
      // this.sound.resumeAll()
    }, 1000)
  }
}

function addToScore (scoreToAdd, origin, game) {
  const scoreText = game.add.text(
    origin.x,
    origin.y,
    scoreToAdd,
    {
      fontSize: config.width / 25
    }
  )

  game.tweens.add({
    targets: scoreText,
    duration: 500,
    y: scoreText.y - 20,
    onComplete: () => {
      game.tweens.add({
        targets: scoreText,
        duration: 100,
        alpha: 0,
        onComplete: () => {
          scoreText.destroy()
        }
      })
    }
  })
}

function onHitEnemy (mario, goomba) {
  if (mario.body.touching.down && goomba.body.touching.up) {
    goomba.anims.play('goomba-dead', true)
    goomba.setVelocityX(0)
    playAudio('goomba-stomp', this).play()
    addToScore(200, goomba, this)
    mario.setVelocityY(-200)

    setTimeout(() => {
      goomba.destroy()
    }, 400)
  } else {
    !mario.isDead && killMario(this)
  }
}

function update () {
  checkControls(this)

  const { mario } = this

  // check if mario is dead
  if (mario.y >= config.height && !mario.isDead) {
    killMario(this)
  }
}

function killMario (game) {
  const { mario, scene } = game

  mario.isDead = true
  // mario.setTexture('marioIsDead')
  mario.anims.play('mario-dead')
  mario.setCollideWorldBounds(false)
  game.sound.pauseAll()
  playAudio('gameover', game, { volume: 0.4 }).play()

  mario.body.checkCollision.none = true
  mario.setVelocityX(0)

  setTimeout(() => {
    mario.setVelocityY(-450)
  }, 100)

  setTimeout(() => {
    scene.restart()
  }, 2500)
}

console.log('Hello, world')
