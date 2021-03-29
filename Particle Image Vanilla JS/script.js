const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

// mouse object
const mouse = {
    x: null,
    y: null,
    radius: 75
}

// https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
// event object has an x and y property which we can assign to our mouse object
window.addEventListener('mousemove', () => {
    mouse.x = event.x + canvas.clientLeft / 2;
    mouse.y = event.y + canvas.clientTop / 2;
})

function drawImage() {
    let imageWidth = png.width;
    let imageHeight = png.height;
    const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
    ctx.clearRect(0, 0, canvas.height, canvas.width);

    class Particle {
        constructor(x, y, color) {
            this.x = x + canvas.width / 2 - png.width / 2;
            this.y = y + canvas.height / 2 - png.height / 2;
            this.color = color;
            this.size = 2;
            // same as this.x except we wont be mutating is as we are using this to compute the difference
            this.baseX = x + canvas.width / 2 - png.width / 2;
            this.baseY = y + canvas.height / 2 - png.height / 2;
            this.density = (Math.random() * 10) + 2;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            ctx.fillStyle = this.color;
            // collision detection
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            // trignometry
            // forcey = sin(theta) = opposite/hypothenuse
            // forcex = cos(theta) = opposite/hypothenuse
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;

            const maxDistance = 100;
            // adds in force scaling depending on how far we are away from the particle;
            // the closer we are the greater the force
            // the farther we are the less the force
            let force = (maxDistance - distance) / maxDistance;
            // ensures force can never be a negative value which cases errors
            if (force < 0) force = 0;

            let directionX = (forceDirectionX * force * this.density * 0.6);
            let directionY = (forceDirectionY * force * this.density * 0.6);

            if (distance < mouse.radius + this.size) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                // if particle position hasnt returned to original position
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    // move it closer to origin by 5%
                    this.x -= dx / 20;
                } if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 20;
                }
            }
            this.draw();
        }
    }
    // init hook
    function init() {
        particleArray = [];
        for (let y = 0, y2 = data.height; y < y2; y++) {
            for (let x = 0, x2 = data.width; x < x2; x++) {
                if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
                    let positionX = x;
                    let positionY = y;
                    // we change the color since we use 16 bit color bitmaps and we compute a new one due to distance
                    let color = "rgb(" + data.data[(y * 4 * data.width) + (x * 4)] + "," + data.data[(y * 4 * data.width) + (x * 4) + 1] + "," + data.data[(y * 4 * data.width) + (x * 4) + 2] + ")";
                    particleArray.push(new Particle(positionX*4, positionY*4,color));
                }
            }
        }
    }
    function animate() {
        requestAnimationFrame(animate);
        ctx.fillStyle = `rgba(0,0,0,0.5)`;
        ctx.fillRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particleArray.length; i++) {
            particleArray[i].update();
        }
    }
    init();
    animate();
    // on resize reinitialize our functions
    window.addEventListener('resize', function () {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    })
}

const png = new Image();
png.src = "mimikyu.png";
console.log(png);
window.addEventListener('load', event => {
    ctx.drawImage(png, 0, 0);
    drawImage();
});