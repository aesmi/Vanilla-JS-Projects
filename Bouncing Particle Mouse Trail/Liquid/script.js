// select our canvas element
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

// set our canvas element to whole window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// set array
let particleArray = [];
const numberOfParticles = 10;

const mouse = {
    x: null,
    y: null
}

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
})

setInterval(function () {
    mouse.x = undefined;
    mouse.y = undefined;
}, 200);

// create Particle class
class Particle {
    constructor(x, y, size, color, weight) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.weight = weight;
    }
    // draw method we can call for each loop for our particles to redraw
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    // update state of our object
    update() {
        this.size -= 0.05;
        if (this.size < 0) {
            this.x = (mouse.x + (Math.random() * 20) - 10);
            this.y = (mouse.y + (Math.random() * 20) - 10);
            this.size = 1;
            this.weight = (Math.random() * 2) - 0.5;
        }
        this.y += this.weight;
        this.weight += 0.2;
        if (this.y > canvas.height - this.size) {
            this.weight *= -0.2;
        }
    }

}

// function random_rgba() {
//     var o = Math.round, r = Math.random, s = 255;
//     return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
// }

function init() {
    particleArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.hieght;
        let size = 1;
        let color = "white";
        let weight = 1;
        particleArray.push(new Particle(x, y, size, color, weight));
    }
}

function animate() {
    //ctx.fillStyle = `rgba(0, 0, 0, 0.08)`;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
        particleArray[i].draw();
    }
    connect();
    requestAnimationFrame(animate);
}

init();
animate();

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particleArray.length; a++) {
        for (let b = a; b < particleArray.length; b++) {
            let distance = ((particleArray[a].x - particleArray[b].x) * (particleArray[a].x - particleArray[b].x) + (particleArray[a].y - particleArray[b].y) * (particleArray[a].y - particleArray[b].y))
            if (distance < 1800) {
                opacityValue = 1 - (distance / 10000);
                ctx.strokeStyle = 'rgba(255,255,255' + opacityValue + ')';
                ctx.fillStyle(`rgba(0,0,0,` + opacityValue + ')');
                ctx.beginPath();
                ctx.lineWidth=1;
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.moveTo(particleArray[b].x, particleArray[b].y);
            }
        }
    }
}