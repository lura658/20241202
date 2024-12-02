let fireworks = [];
let fireSound;
let showName = false; // 新增控制姓名顯示的變數

function preload() {
  // 預載煙火音效
  fireSound = loadSound('sound/213236__mrauralization__fireworks.wav');
}

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 設定文字置中對齊
  textAlign(CENTER, CENTER);
  colorMode(HSB);
}

function draw() {
  // 設定背景色為深色
  background(0, 0, 20, 25);
  
  // 隨機產生新煙火
  if (random(1) < 0.05) {
    fireworks.push(new Firework());
  }
  
  // 更新和顯示所有煙火
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }

  // 顯示主要文字
  textSize(60);
  fill(255);
  text('淡江大學', width/2, height/2 - 40);
  textSize(40);
  text('教育科技學系', width/2, height/2 + 40);

  // 檢查滑鼠是否點擊"淡江大學"文字
  let mainTextX = width/2;
  let mainTextY = height/2 - 40;
  let mainTextWidth = textWidth('淡江大學');
  
  // 如果滑鼠在文字範圍內
  if (mouseX > mainTextX - mainTextWidth/2 && 
      mouseX < mainTextX + mainTextWidth/2 &&
      mouseY > mainTextY - 30 && 
      mouseY < mainTextY + 30) {
    cursor(HAND); // 改變游標為手型
    if (mouseIsPressed) {
      showName = true;
    }
  } else {
    cursor(ARROW);
  }

  // 如果showName為true，顯示學號和姓名
  if (showName) {
    textSize(30);
    fill(255);
    text('413730101 吳映璇', width/2, height/2 + 100);
  }
}

// 煙火類別
class Firework {
  constructor() {
    this.particles = [];
    this.x = random(width);
    this.y = height;
    this.targetY = random(height/4, height/2);
    this.vel = -15;
    this.exploded = false;
  }
  
  update() {
    if (!this.exploded) {
      this.y += this.vel;
      if (this.y <= this.targetY) {
        this.explode();
      }
    }
    
    for (let particle of this.particles) {
      particle.update();
    }
  }
  
  explode() {
    this.exploded = true;
    fireSound.play();
    for (let i = 0; i < 100; i++) {
      let p = new Particle(this.x, this.y);
      this.particles.push(p);
    }
  }
  
  show() {
    if (!this.exploded) {
      stroke(255);
      strokeWeight(4);
      point(this.x, this.y);
    }
    
    for (let particle of this.particles) {
      particle.show();
    }
  }
  
  done() {
    return this.exploded && this.particles.every(p => p.lifetime <= 0);
  }
}

// 煙火粒子類別
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(2, 10));
    this.acc = createVector(0, 0.2);
    this.color = random(360);
    this.lifetime = 255;
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifetime -= 5;
  }
  
  show() {
    if (this.lifetime > 0) {
      stroke(this.color, 80, 100, this.lifetime);
      strokeWeight(2);
      point(this.pos.x, this.pos.y);
    }
  }
}

// 視窗大小改變時調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}