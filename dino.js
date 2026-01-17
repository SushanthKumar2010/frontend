const dino = document.createElement("div");
const cactus = document.createElement("div");

document.body.appendChild(dino);
document.body.appendChild(cactus);

dino.style.cssText = `
  width: 40px;
  height: 40px;
  background: black;
  position: absolute;
  bottom: 20px;
  left: 50px;
`;

cactus.style.cssText = `
  width: 20px;
  height: 40px;
  background: black;
  position: absolute;
  bottom: 20px;
  left: 100%;
`;

let isJumping = false;
let score = 0;

// Jump logic
document.addEventListener("keydown", () => {
  if (!isJumping) jump();
});

function jump() {
  isJumping = true;
  let up = 0;
  const jumpUp = setInterval(() => {
    if (up >= 80) {
      clearInterval(jumpUp);
      const down = setInterval(() => {
        if (up <= 0) {
          clearInterval(down);
          isJumping = false;
        }
        up -= 5;
        dino.style.bottom = 20 + up + "px";
      }, 20);
    }
    up += 5;
    dino.style.bottom = 20 + up + "px";
  }, 20);
}

// Obstacle movement
setInterval(() => {
  let left = cactus.offsetLeft;
  cactus.style.left = left - 5 + "px";

  if (left < -20) {
    cactus.style.left = "100%";
    score++;
  }

  // Collision
  if (left < 90 && left > 50 && parseInt(dino.style.bottom) < 50) {
    alert("Game Over! Score: " + score);
    location.reload();
  }
}, 20);
