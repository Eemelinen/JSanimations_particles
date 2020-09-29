const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

let particleArray = [];

let mouse = {
  x: null,
  y: null,
  radius: (canvas.height / 130) * (canvas.width / 130),
};

window.addEventListener('mousemove',
  function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
  }
)

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = '#8C5523';
    ctx.fill();
  }

  update() {
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY
    }
    /**
    * ! Collision detection */
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 15) {
        this.directionX = -this.directionX;
        this.x += 3;
      };
      if (mouse.x > this.x && this.x > this.size * 15) {
        this.directionX = -this.directionX;
        this.x -= 3;
      };
      if (mouse.y < this.y && this.y < canvas.height - this.size * 15) {
        this.directionY = -this.directionY;
        this.y += 3;
      };
      if (mouse.y > this.y && this.y > this.size * 15) {
        this.directionY = -this.directionY;
        this.y -= 3;
      };
    };

    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}

function init() {
  particleArray = [];
  let particleAmount = (canvas.height * canvas.width) / 14000;
  for (let i = 0; i < particleAmount; i++) {
    let size = (Math.random() * 5) + 1 ;
    let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
    let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
    let directionX = (Math.random() * 5) - 2.5;
    let directionY = (Math.random() * 5) - 2.5;
    let color = '#8C5523';
    particleArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

/**
* ! Line drawing between dots */
function connect() {
  let opacityVal = 0;
  for (let a = 0; a < particleArray.length; a++) {
    for (let b = a; b < particleArray.length; b++) {

      let distance =  ((   particleArray[a].x - particleArray[b].x )
                        * (particleArray[a].x - particleArray[b].x))
                        + ((particleArray[a].y - particleArray[b].y)
                        * (particleArray[a].y - particleArray[b].y
                      ));

      if (distance < (canvas.width / 7) * (canvas.height / 7)) {
        opacityVal = 1 - (distance / 20000);
        ctx.strokeStyle = `rgba(140, 85, 31, ${opacityVal})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particleArray[a].x, particleArray[a].y);
        ctx.lineTo(particleArray[b].x, particleArray[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].update();
  }
  connect();
}

window.addEventListener('resize',
  function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = ((canvas.height / 80) * (canvas.height / 80));
    init();
  }
);

window.addEventListener('mouseout',
  function() {
    mouse.x = null;
    mouse.y = null;
  }
);

init();
animate();

