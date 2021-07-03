/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function setup () {
  WHITE = color(255)
  BROWN = color(102, 51, 0)
  GREEN = color(0, 102, 0)
  createCanvas(600, 600)
  frameRate(5)
  noStroke()
  sheeps = []
  grasses = []
  patchSize = 5
  rowsOfGrass = height / patchSize

  for (let i = 0; i < 10; i++) {
    sheeps.push(new Sheep(random(width), random(height)))
  }

  for (let x = 0; x < width; x += patchSize) {
    for (let y = 0; y < height; y += patchSize) {
      grasses.push(new Grass(x, y, patchSize))
    }
  }
}

function draw () {
  background(255)
  grasses.forEach(grass => grass.update())
  sheeps.forEach(sheep => sheep.update())
}

class Sheep {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.age = 0
    this.move = 10
    this.energy = Sheep.baseEnergy
    this.col = WHITE
  }

  static birthCost = 25
  static maxBirthableAge = 40
  static baseEnergy = 30
  static lifeSpan = 60

  update () {
    this.age += 1
    this.col = color(255 - 255 / 100 * this.age)
    if (this.age > Sheep.lifeSpan) sheeps.splice(this)

    this.energy -= 1
    if (this.energy <= 0) sheeps.splice(this)

    if (this.energy > Sheep.baseEnergy + Sheep.birthCost &&
          this.age < Sheep.maxBirthableAge) {
      this.energy -= Sheep.birthCost
      sheeps.push(new Sheep(this.x, this.y))
    }
    this.x += random(-this.move, this.move)
    this.y += random(-this.move, this.move)

    if (this.x > width) this.x %= width
    if (this.y > height) this.y %= height
    if (this.x < 0) this.x += width
    if (this.y < 0) this.y += height

    const xscl = int(this.x / patchSize)
    const yscl = int(this.y / patchSize)
    const grass = grasses[xscl * rowsOfGrass + yscl]

    if (grass.eaten === false) {
      this.energy += grass.energy
      grass.eaten = true
    }
    fill(this.col)
    ellipse(this.x, this.y, 5 * this.energy / Sheep.baseEnergy, 5 * this.energy / Sheep.baseEnergy)
  }
}

class Grass {
  constructor (x, y, sz) {
    this.x = x
    this.y = y
    this.energy = 5
    this.eaten = false
    this.sz = sz
  }

  static growProbability = 0.1

  update () {
    if (this.eaten) {
      if (random(1) < 0.1) {
        this.eaten = false
      } else {
        fill(BROWN)
      }
    } else {
      fill(GREEN)
    }
    rect(this.x, this.y, this.sz, this.sz)
  }
}
