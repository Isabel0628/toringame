document.addEventListener("DOMContentLoaded", () => {
  const torin = document.getElementById("torin");
  const fairy = document.getElementById("fairy");
  const gameContainer = document.getElementById("game-container");

  const scoreDisplay = document.createElement("div");
  scoreDisplay.id = "score-display";
  scoreDisplay.style.position = "absolute";
  scoreDisplay.style.top = "10px";
  scoreDisplay.style.left = "10px";
  scoreDisplay.style.fontSize = "20px";
  scoreDisplay.style.color = "#fff";
  scoreDisplay.textContent = "점수: 0";
  gameContainer.appendChild(scoreDisplay);

  const ruleBox = document.createElement("div");
  ruleBox.style.position = "absolute";
  ruleBox.style.top = "10px";
  ruleBox.style.right = "10px";
  ruleBox.style.width = "200px";
  ruleBox.style.backgroundColor = "rgba(255, 255, 255, 0.85)";
  ruleBox.style.padding = "10px";
  ruleBox.style.borderRadius = "10px";
  ruleBox.style.fontSize = "14px";
  ruleBox.style.color = "#000";
  ruleBox.innerHTML = "<strong>게임 규칙</strong><br>← → 이동<br>스페이스: 점프<br>Z: 드래곤 멈춤<br>X: 폭탄(3초 쿨타임)";
  gameContainer.appendChild(ruleBox);

  let left = 50;
  let bottom = 80;
  let score = 0;
  let isJumping = false;
  let canThrowBomb = true;

  torin.style.left = left + "px";
  torin.style.bottom = bottom + "px";

  document.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "ArrowRight":
        left += 30;
        if (left > 740) left = 740;
        torin.style.left = left + "px";
        break;
      case "ArrowLeft":
        left -= 30;
        if (left < 0) left = 0;
        torin.style.left = left + "px";
        break;
      case "Space":
        jump();
        break;
      case "KeyZ":
        useWand();
        break;
      case "KeyX":
        throwBomb();
        break;
    }
  });

  function jump() {
    if (isJumping) return;
    isJumping = true;
    let jumpHeight = 260;
    let up = setInterval(() => {
      if (jumpHeight <= 0) {
        clearInterval(up);
        let down = setInterval(() => {
          if (bottom <= 80) {
            clearInterval(down);
            bottom = 80;
            torin.style.bottom = bottom + "px";
            isJumping = false;
          } else {
            bottom -= 6;
            torin.style.bottom = bottom + "px";
          }
        }, 15);
      } else {
        bottom += 6;
        torin.style.bottom = bottom + "px";
        jumpHeight -= 6;
      }
    }, 15);
  }

  function useWand() {
    document.querySelectorAll(".dragon").forEach(dragon => {
      dragon.style.animationPlayState = "paused";
    });
    setTimeout(() => {
      document.querySelectorAll(".dragon").forEach(dragon => {
        dragon.style.animationPlayState = "running";
      });
    }, 5000);
  }

  function throwBomb() {
    if (!canThrowBomb) return;
    canThrowBomb = false;
    setTimeout(() => { canThrowBomb = true; }, 3000);

    const bomb = document.createElement("div");
    bomb.classList.add("balloon-bomb");
    bomb.style.left = left + 60 + "px";
    bomb.style.bottom = bottom + "px";
    gameContainer.appendChild(bomb);

    let pos = left + 60;
    const move = setInterval(() => {
      pos += 6;
      bomb.style.left = pos + "px";
      document.querySelectorAll(".dragon").forEach(dragon => {
        const bRect = bomb.getBoundingClientRect();
        const dRect = dragon.getBoundingClientRect();
        if (
          bRect.left < dRect.right &&
          bRect.right > dRect.left &&
          bRect.top < dRect.bottom &&
          bRect.bottom > dRect.top
        ) {
          dragon.remove();
          bomb.remove();
          score += 50;
          scoreDisplay.textContent = "점수: " + score;
        }
      });
      if (pos > 800) {
        clearInterval(move);
        bomb.remove();
      }
    }, 20);
  }

  function createDragon() {
    const dragon = document.createElement("div");
    dragon.classList.add("dragon");
    dragon.style.right = "-80px";
    dragon.style.bottom = "80px";
    gameContainer.appendChild(dragon);

    let pos = 800;
    const move = setInterval(() => {
      pos -= 2;
      dragon.style.left = pos + "px";

      const torinRect = torin.getBoundingClientRect();
      const dragonRect = dragon.getBoundingClientRect();
      if (
        torinRect.left < dragonRect.right &&
        torinRect.right > dragonRect.left &&
        torinRect.top < dragonRect.bottom &&
        torinRect.bottom > dragonRect.top
      ) {
        clearInterval(move);
        alert("게임 오버! 드래곤에게 잡혔습니다.");
        location.reload();
      }

      if (pos < -80) {
        clearInterval(move);
        dragon.remove();
        score += 10;
        scoreDisplay.textContent = "점수: " + score;
        if (score >= 200) {
          showFairy();
        }
      }
    }, 20);
  }

  function showFairy() {
    fairy.style.display = "block";
    const check = setInterval(() => {
      const torinRect = torin.getBoundingClientRect();
      const fairyRect = fairy.getBoundingClientRect();
      if (
        torinRect.left < fairyRect.right &&
        torinRect.right > fairyRect.left &&
        torinRect.top < fairyRect.bottom &&
        torinRect.bottom > fairyRect.top
      ) {
        clearInterval(check);
        alert("축하합니다! 요정을 구했습니다!");
        location.reload();
      }
    }, 100);
  }

  setInterval(createDragon, 3000);
});
