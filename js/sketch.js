/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

nodeDatas = [
  { label: '太郎', x: 400, y: 200 },
  { label: '花子', x: 800, y: 400 },
  { label: 'よしお', x: 300, y: 400 },
  { label: 'しずよ', x: 700, y: 600 }
]
eventDatas = [
  { type: 'action', label: '花子への気持ち高まる', node: '太郎', order: 1 },
  { type: 'arrow', label: '告白', origin: '太郎', dist: '花子', order: 2 },
  { type: 'action', label: '戸惑い', node: '花子', order: 3 },
  { type: 'arrow', label: '相談', origin: '花子', dist: 'しずよ', order: 4 },
  { type: 'action', label: '不安', node: '太郎', order: 5 },
  { type: 'arrow', label: '調査依頼', origin: '太郎', dist: 'よしお', order: 6 },
  { type: 'arrow', label: '調査', origin: 'よしお', dist: 'しずよ', order: 7 },
  { type: 'arrow', label: '報告', origin: 'よしお', dist: '太郎', order: 8 },
  { type: 'arrow', label: '後押し', origin: 'しずよ', dist: '花子', order: 8 },
  { type: 'arrow', label: 'OK', origin: '花子', dist: '太郎', order: 9 },
  { type: 'action', label: '歓喜', node: '太郎', order: 10 }
]

function setup () {
  createCanvas(windowWidth, windowHeight)
  textSize(20)
  nodes = []
  arrows = []
  actions = []
  nodeDatas.forEach((node) => nodes.push(new Node(node.x, node.y, node.label)))
  eventDatas.forEach((event) => {
    if (event.type === 'arrow') {
      const origin = nodes.find((node) => node.label === event.origin)
      const dist = nodes.find((node) => node.label === event.dist)
      arrows.push(new Arrow(origin, dist, event.label, event.order))
    } else if (event.type === 'action') {
      const node = nodes.find((node) => node.label === event.node)
      actions.push(new Action(node, event.label, event.order))
    }
  })
  startFrame = null
  button = createButton('スタート')
  button.position(30, 30)
  button.mousePressed(start)
}

function start () {
  if (startFrame === null) startFrame = frameCount
}

function draw () {
  background(255)
  nodes.forEach(node => {
    node.update()
    if (mouseIsPressed && dist(pmouseX, pmouseY, node.x, node.y) < 20) {
      node.move()
    }
  })
  actions.forEach(action => {
    if (startFrame && frameCount > startFrame + 180 * (action.order - 1) && frameCount < startFrame + 180 * action.order) {
      action.update()
    }
  })
  arrows.forEach(arrow => {
    if (startFrame && frameCount > startFrame + 180 * (arrow.order - 1) && frameCount < startFrame + 180 * arrow.order) {
      arrow.update()
    }
  })
}

class Node {
  constructor (x, y, label) {
    this.x = x
    this.y = y
    this.label = label
  }

  update () {
    fill(0)
    text(this.label, this.x - 40, this.y - 40)
    noFill()
    circle(this.x, this.y, 40)
  }

  move () {
    this.x = mouseX
    this.y = mouseY
  }
}

class Action {
  constructor (node, label, order) {
    this.node = node
    this.label = label
    this.order = order
  }

  update () {
    fill(0)
    console.log(this.node.x)
    text(this.label, this.node.x + 40, this.node.y)
    noFill()
  }
}

class Arrow {
  constructor (origin, dist, label, order) {
    this.origin = origin
    this.dist = dist
    this.label = label
    this.order = order
    this.vector = null
    this.length = 0
    this.arrowSize = 10
  }

  update () {
    if (!this.isEnd()) this.length += 0.01
    this.vector = createVector(
      this.dist.x - lerp(this.dist.x, this.origin.x, this.length),
      this.dist.y - lerp(this.dist.y, this.origin.y, this.length)
    )
    let labelLength
    if (this.length < 0.5) {
      labelLength = this.length
    } else {
      labelLength = 0.5
    }
    fill(0)
    text(this.label, lerp(this.origin.x, this.dist.x, labelLength) - 40, lerp(this.origin.y, this.dist.y, labelLength) - 40)
    noFill()
    this.drawArrow(createVector(this.origin.x, this.origin.y), this.vector)
  }

  isEnd () {
    return this.length > 1
  }

  drawArrow (base, vec) {
    push()
    strokeWeight(1)
    fill(0)
    translate(base.x, base.y)
    line(0, 0, vec.x, vec.y)
    rotate(vec.heading())
    translate(vec.mag() - this.arrowSize, 0)
    triangle(0, this.arrowSize / 2, 0, -this.arrowSize / 2, this.arrowSize, 0)
    pop()
  }
}
