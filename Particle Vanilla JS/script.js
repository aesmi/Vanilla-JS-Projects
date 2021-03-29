const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let [adjustX, adjustY] = [0, 0];

// mouse object
const mouse = {
    x: null,
    y: null,
    radius: 75
}

// https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
// event object has an x and y property which we can assign to our mouse object
window.addEventListener('mousemove', () => {
    mouse.x = event.x
    mouse.y = event.y;
})

ctx.fillStyle = 'grey';
ctx.font = `20px Verdana`;
ctx.fillText('Andy', 0, 20);
const textCoordinates = ctx.getImageData(0, 0, 100, 100);
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData
// this method returns (x, y, width, height) of the rectangle of the data
// this is a Unite8ClampArray

class Particle {
    // @param x: number y: number
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 2;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
    }
    draw() {
        ctx.fillStyle = 'white';
        // starts path aka drawing
        ctx.beginPath();
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
        // @params (x, y, radius, start angle (0 radian), end angle (2 radians))
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // stops drawing
        ctx.closePath();
        ctx.fill();
    }
    update() {
        // difference between our mouse and particle object coordinates
        let [dx, dy] = [mouse.x - this.x, mouse.y - this.y];
        let distance = Math.sqrt(dx * dx + dy * dy);
        let [forceDirectionX, forceDirectionY, maxDistance] = [dx / distance, dy / distance, mouse.radius];
        // scales force with distance from radius linearly, hence the further we are from the center the greater the force factor
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;
        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            // if this is not in the original position
            if (this.x !== this.baseX) {
                //difference between physics affected position and initial position 
                let dx = this.x - this.baseX;
                // shrink distance difference by 10%;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                //difference between physics affected position and initial position
                let dy = this.y - this.baseY;
                // shrink distance difference by 10%;
                this.y -= dy / 10;
            }
        }

    }
}

// @params textCoordinates: Object
// so we pass in our textCoordinates object 
function init() {
    particleArray = [];
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
                let [positionX, positionY] = [x + adjustX, y + adjustY];
                particleArray.push(new Particle(positionX * 20, positionY * 20));
            }
        }
    }
}

init();

// this is our loop for running our functions at our refresh rate, quite useful function when making games later on
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        // redraws every particle within our array
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    // we use requestAnimationFrame to call our animation function at the same rate as our screen
    requestAnimationFrame(animate);
}

animate();

function connect() {
    for (let a = 0; a < particleArray.length; a++) {
        for (let b = a; b < particleArray.length; b++) {
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                opacityValue = 1 - (distance/50);
                ctx.strokeStyle = `rgba(255,255,255,` + opacityValue + ')'
                ctx.lineWidth=1;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }
        }
    }
}