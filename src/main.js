import { GameLoop } from "kontra";
import { canvas, context } from "./init";
import { mazeSprite, tileEngine } from "./customMaze";
import { character } from "./character";
import { fog } from "./fog";
import { intersects } from "./utils";
import drawIntroduction from "./intro.js";
import { Robot } from "./Ai";

let gameRunning = true;

const [updateIntroduction, renderIntroduction] = drawIntroduction(
  context,
  canvas,
  onIntroFinish
);
document.getElementById("startButton")?.addEventListener("click", startGame);

function onIntroFinish() {
  gameRunning = true;
}

const gameLoop = GameLoop({
  update: function (dt) {
    if (!gameRunning) {
      updateIntroduction(context, canvas, dt);
    } else {
      character.update();
      character.updateCharacterMovement();
      Robot.update();
    }
  },
  render: function () {
    if (!gameRunning) {
      renderIntroduction(context, canvas);
    } else {
      const windowRect = {
        x: scrollX,
        y: scrollY,
        width: innerWidth,
        height: innerHeight,
      };
      mazeSprite.forEach((sprite) => {
        if (intersects(sprite, windowRect)) {
          sprite.render();
        }
      });
      if (tileEngine !== null) tileEngine.render();
      character.render();
      fog.render();
      Robot.render();
    }
  },
});

function startGame() {
  //hide the start button on game start
  const startButton = document.getElementById("startButton");
  if (startButton !== null) {
    startButton.style.display = "none";
  }
  gameLoop.start();
}

function cleanup() {
  const button = document.getElementById("startButton");
  if (button !== null) {
    button.removeEventListener("click", startGame);
  }
}
