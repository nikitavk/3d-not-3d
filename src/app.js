var CircleParticles = function (pos, r, color, particleSettings) {
  var particleSettings = particleSettings || {};
  this.particleColor = particleSettings.color || "#0000ff";
  this.particleSpeed = particleSettings.speed || 0.01;
  this.particleRadius = particleSettings.radius || 3;
  this.particlesCount = particleSettings.count || 100;
  this.pos = pos;
  this.r = r;
  this.color = color;

  this.ps  = [];

  let p;
  const n = Math.sqrt(this.particlesCount);

  for (let i = 0; i<n; i++) {
    for (let j = 0; j<n; j++) {
        p = new Particle(1/n*i, 1/n*j, this.particleRadius, this.particleColor, this.particleSpeed, this.pos, this.r);
        this.ps.push(p);
    }
  }

  this.move = function() {
    this.ps.forEach( (p,i,a) => p.move());
  };
};

var Particle = function (x,y,d,c,s, parentPos, parentR) {
  this.init = function (x,y,d,c,s, parentPos, parentR) {
    this.x = x;
    this.y = y;
    this.d = d;
    this.color = c;
    this.speed = s;
    this.ctx = ctx;

    this.stereoPos = transformCoordinates(stereographicProjection({x: this.x, y: this.y}), parentR, parentPos );
  };

  this.move = function() {
    this.y += this.speed;
    if (this.y > 1) {
      this.y = 0;
    } else {
      this.stereoPos = transformCoordinates(stereographicProjection({x: this.x, y: this.y}), parentR, parentPos );
    }
  };

  this.init(x,y,d,c,s, parentPos, parentR);
};

function drawCircleParticles(circleParticles) {
  drawCircle ({x: circleParticles.pos.x, y: circleParticles.pos.y}, circleParticles.r, circleParticles.color);
  circleParticles.ps.forEach( (p,i,a) => drawCircle(p.stereoPos, p.d/2, p.color));
}

function distance(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x,2) + Math.pow(a.y - b.y, 2));
}

function transformCoordinates(c, r, circlePos) {
  return { x: c.x * r + circlePos.x, y: c.y * r + circlePos.y}
}

function stereographicProjection (p) {
  p.x = p.x*2 - 1;
  p.y = p.y*2 - 1;

  let x = (p.x*2)/(1+Math.pow(p.x,2)+Math.pow(p.y,2));
  let y = (p.y*2)/(1+Math.pow(p.x,2)+Math.pow(p.y,2));
  let z = (-1+Math.pow(p.x,2)+Math.pow(p.y,2))/(1+Math.pow(p.x,2)+Math.pow(p.y,2));
  return { x: x,
           y: y,
           z: z
         };
}

function drawCircle (c, r, color) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, r, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();
}

var c = document.getElementById("canvas"),
ctx = c.getContext('2d');

var circleParticlesOrange = new CircleParticles({x: 400, y: 400}, 100, "#eb5201", {color: "#38550f", count: 500, radius: 3, speed: 0.005});
var circleParticlesBlood = new CircleParticles({x: 100, y: 100}, 50, "#7f3943", {color: "#b3969a", count: 64, radius: 2, speed: 0.05});
var circleParticlesBiege = new CircleParticles({x: 400, y: 400}, 400, "#f5cd83", {color: "#68695f", count: 1000, radius: 5, speed: 0.001});
var circleParticlesChocolate = new CircleParticles({x: 600, y: 600}, 400, "#683217", {color: "#895330", count: 10000, radius: 3, speed: 0.001});

setInterval( function() {
  ctx.fillStyle = "#e9dbcc";
  ctx.fillRect(0, 0, c.width, c.height);
  circleParticlesBiege.move();
  circleParticlesOrange.move();
  circleParticlesBlood.move();
  circleParticlesChocolate.move();
  drawCircleParticles(circleParticlesBiege);
  drawCircleParticles(circleParticlesBlood);
  drawCircleParticles(circleParticlesChocolate);
  drawCircleParticles(circleParticlesOrange);
}, 10);