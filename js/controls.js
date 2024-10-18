const MARIO_ANIMATIONS = {
  grown: {
    idle: 'mario-grown-idle',
    walk: 'mario-grown-walk',
    jump: 'mario-grown-jump',
    bend: 'mario-grown-bend'
  },
  normal: {
    idle: 'mario-idle',
    walk: 'mario-walk',
    jump: 'mario-jump'
  }
}

export const checkControls = ({ keys, mario }) => {
  const isMarioTouchingFloor = mario.body.touching.down && !mario.isCollectCoin

  const isLeftKeyDown = keys.left.isDown
  const isRightKeyDown = keys.right.isDown
  const isJumpKeyDown = keys.up.isDown || keys.space.isDown
  const isArrowDownKey = keys.down.isDown

  if (mario.isDead) return
  if (mario.isBlocked) return

  const marioAnimations = mario.isGrown ? MARIO_ANIMATIONS.grown : MARIO_ANIMATIONS.normal

  if (isLeftKeyDown) {
    isMarioTouchingFloor && mario.anims.play(marioAnimations.walk, true)
    mario.x -= 2
    mario.flipX = true
  } else if (isRightKeyDown) {
    isMarioTouchingFloor && mario.anims.play(marioAnimations.walk, true)
    mario.x += 2
    mario.flipX = false
  } else if (isMarioTouchingFloor) {
    mario.anims.play(marioAnimations.idle, true)
  }

  if (isJumpKeyDown && isMarioTouchingFloor) {
    mario.anims.play(marioAnimations.jump, true)
    mario.setVelocityY(-350)
  }

  if (isArrowDownKey && !mario.isGrown) return

  if (isArrowDownKey && mario.isGrown) {
    mario.anims.play(marioAnimations.bend, true)
  }
}
