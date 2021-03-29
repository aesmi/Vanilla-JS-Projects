// select our canvas element
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

// set our canvas element to whole window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// set array
let particleArray = [];
const numberOfParticles = 200;

const mouse = {
    x: null,
    y: null
}

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
})

setInterval(function()  {
    mouse.x = undefined;
    mouse.y = undefined;
}, 75);

// create Particle class
class Particle {
    constructor(x, y, size, color, weight) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.weight = weight;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update() {
        this.size -= 0.05;
        if (this.size < 0) {
            this.x = (mouse.x + (Math.random() * 20) - 10);
            this.y = (mouse.y + (Math.random() * 20) - 10);
            this.size = (Math.random() * 10) + 2;
            this.weight = (Math.random() * 2) - 0.5;
        }
        this.y += this.weight;
        this.weight += 0.2;
        if (this.y > canvas.height - this.size) {
            this.weight *= -1;
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
        let size = (Math.random() * 5 + 2);
        let color = "white";
        let weight = 1;
        particleArray.push(new Particle(x, y, size, color, weight));
    }
}

function animate() {
    ctx.fillStyle = `rgba(0, 0, 0, 0.08)`;
    ctx.fillRect(0,0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
        particleArray[i].draw();
    }
    requestAnimationFrame(animate);
}

init();
animate();