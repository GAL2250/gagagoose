let particles = [];
let particleCount = 260;

let mouseTarget;
let isGathering = false;
let gatherTimer = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("canvas-container");

  pixelDensity(1);
  colorMode(RGB, 255, 255, 255, 255);

  mouseTarget = createVector(width / 2, height / 2);

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  // 半透明背景，制造拖影
  background(2, 6, 17, 35);

  mouseTarget.set(mouseX, mouseY);

  if (isGathering) {
    gatherTimer--;

    if (gatherTimer <= 0) {
      isGathering = false;
    }
  }

  for (let p of particles) {
    p.update();
    p.display();
  }

  drawCursorGlow();
}

function mouseMoved() {
  // 鼠标移动时，粒子保持蓝色跟随
  isGathering = false;
}

function mousePressed() {
  // 点击时，粒子变白并向点击点聚拢
  mouseTarget.set(mouseX, mouseY);
  isGathering = true;
  gatherTimer = 90;
}

function touchMoved() {
  mouseTarget.set(mouseX, mouseY);
  isGathering = false;
  return false;
}

function touchStarted() {
  mouseTarget.set(mouseX, mouseY);
  isGathering = true;
  gatherTimer = 90;
  return false;
}

class Particle {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D().mult(random(0.5, 2));
    this.acceleration = createVector(0, 0);
    this.size = random(2, 5);
    this.maxSpeed = random(3, 6);
    this.noiseOffset = random(1000);
  }

  update() {
    let targetForce;

    if (isGathering) {
      // 点击时：强烈向鼠标点击点聚拢
      targetForce = p5.Vector.sub(mouseTarget, this.position);
      let distance = targetForce.mag();

      targetForce.normalize();

      let strength = map(distance, 0, width, 0.2, 1.8);
      targetForce.mult(strength);
    } else {
      // 鼠标移动时：蓝色粒子柔和跟随鼠标
      targetForce = p5.Vector.sub(mouseTarget, this.position);
      let distance = targetForce.mag();

      targetForce.normalize();

      let strength = map(distance, 0, 500, 0.02, 0.45);
      strength = constrain(strength, 0.02, 0.45);
      targetForce.mult(strength);

      // 加一点噪声，让它不像普通鼠标尾巴，而更像生成式流场
      let angle = noise(
        this.position.x * 0.004,
        this.position.y * 0.004,
        frameCount * 0.006 + this.noiseOffset
      ) * TWO_PI * 4;

      let noiseForce = createVector(cos(angle), sin(angle));
      noiseForce.mult(0.18);

      targetForce.add(noiseForce);
    }

    this.acceleration.add(targetForce);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

    // 边界处理：粒子飞出屏幕后从另一边回来
    if (this.position.x < 0) this.position.x = width;
    if (this.position.x > width) this.position.x = 0;
    if (this.position.y < 0) this.position.y = height;
    if (this.position.y > height) this.position.y = 0;
  }

  display() {
    noStroke();

    if (isGathering) {
      // 点击时变白
      fill(255, 255, 255, 210);
      circle(this.position.x, this.position.y, this.size * 1.8);
    } else {
      // 平时是蓝色粒子
      fill(40, 170, 255, 170);
      circle(this.position.x, this.position.y, this.size);

      // 蓝色光晕
      fill(40, 170, 255, 38);
      circle(this.position.x, this.position.y, this.size * 5);
    }
  }
}

function drawCursorGlow() {
  noStroke();

  if (isGathering) {
    fill(255, 255, 255, 45);
    circle(mouseTarget.x, mouseTarget.y, 120);

    fill(255, 255, 255, 90);
    circle(mouseTarget.x, mouseTarget.y, 28);
  } else {
    fill(40, 170, 255, 38);
    circle(mouseTarget.x, mouseTarget.y, 160);

    fill(40, 170, 255, 120);
    circle(mouseTarget.x, mouseTarget.y, 18);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
