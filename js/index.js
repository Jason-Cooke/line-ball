var canvas;
var ctx;
var score = 0;

const BALL_X = 50;
var ball_Y ;
const BALL_SIZE = 15;

const GRAVITY = Math.round(document.documentElement.clientHeight/56);
const DRAG = GRAVITY*-1;//So that you're dragged up to the same degree that you're pulled down.
var ballYV = GRAVITY; //Initially let gravity act

const PIPE_WIDTH = 15;
var pipeXV = 7 ;
var difficulty = 1000;//var not const because it will decrease as the game goes on :)
const difficultyMin = 400;
const difficultyDecreaseRate = 30;
var nextPipeTime = Date.now() + difficulty;

// var pipe_X ;

var pipes = [];
var score = 0;
var lives;
var gameOver; //boolean
var gameOverScreen = false;//boolean
//The above variable exists to stop the gameover screen being cast several times successively.
//Before, this wasn't noticeable, but when I animated it it became so.





window.onload = () => {
  canvas = document.getElementById("mainGame");
  canvas.height = document.documentElement.clientHeight;
  canvas.width = document.documentElement.clientWidth;
  ctx = canvas.getContext('2d'); 
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ball_Y = canvas.height/2;
  gameOver = false;
  lives = 3;


  document.addEventListener('keydown', function(evt){
      if(evt.code == "Space"){

          ballYV = DRAG;

      }
  });

  window.addEventListener('resize', function(){

      canvas.height = document.documentElement.clientHeight;
      canvas.width = document.documentElement.clientWidth;

  });

  document.addEventListener('keyup', function(evt){
      if(evt.code == "Space"){

            ballYV = GRAVITY;

        }
  });

  document.addEventListener('mousedown', function(evt){
   
      if(gameOver){
            gameReset();
            difficulty = 1000;
            gameOver = false;
            gameOverScreen = false;
        }
  });
  
  mainGame();
  

}; //initializing function


var mainGame = () => {

  if(!gameOver){
      
      if(outsideBoundaries()){
        checkLives();
      };

      ball_Y += ballYV; 

      ctx.fillStyle = "white";
      ctx.fillRect(0,0,canvas.width,canvas.height);
      
      ctx.fillStyle = "salmon"
      ctx.beginPath();
      ctx.arc(BALL_X,ball_Y,BALL_SIZE,0,Math.PI*2);
      ctx.fill();

      pipes.forEach(function(elem,index){

        ctx.fillStyle = "#acacac";
        ctx.fillRect(elem.pipe_X , elem.pipe_Y, PIPE_WIDTH, elem.pipeHeight);

        if(elem.pipe_X < 0){

          //delete the pipe if it moves out of canvas;
          score++;
          pipes.splice(index,1)

        }
        elem.pipe_X -= pipeXV;
     
        if (isColliding(elem))checkLives();

      });


      if(Date.now() > nextPipeTime){
        generatePipes();
        nextPipeTime = Date.now() + difficulty;
        difficulty = (difficulty > difficultyMin) ? difficulty - difficultyDecreaseRate : difficulty;
        //The above line of code decreases difficulty if it's above 200.
      }

      ctx.fillStyle = "black";
      ctx.font="20px Arial";

      var scoreText = "Score : " + score;
      var livesText = "Lives : " + lives;
      var difficultyText = "Difficulty: " + (1000 - difficulty);

      ctx.fillText(scoreText, canvas.width - ctx.measureText(scoreText).width - 10,30);
      ctx.fillText(livesText, canvas.width - ctx.measureText(livesText).width - 10,50);
      ctx.fillText(difficultyText, canvas.width - ctx.measureText(difficultyText).width - 10,70);

  }

  else if(!gameOverScreen){//The !gameoverScreen is to prevent the repetitive calling of the animation, which would cause several animations at once

      gameOverScreen = true;
      var opacity = 0;

      var drawBackscreen = () => {

        ctx.globalAlpha = opacity;
        opacity = opacity + 0.001

        ctx.fillStyle = "salmon";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "black";
        ctx.font="60px Arial";
        ctx.fillText("GAME OVER",canvas.width/2 - ctx.measureText("GAME OVER").width/2, canvas.height/2 - 50);
        ctx.font="30px Arial";
        ctx.fillText("Final Score : " + score , canvas.width/2 - 100, canvas.height/2);
        ctx.fillStyle = "#474747";
        ctx.font="20px Arial";
        ctx.fillText("Click to Play ", canvas.width/2  - 60, canvas.height/2 + 50);

        if(!gameOver)return; //If the function is returned from, the...

        if(opacity >= 1)return;// ...function doesn't call itself again, breaking the loop.

        window.requestAnimationFrame(drawBackscreen);//This is where it calls itself.
      }
      drawBackscreen();

  }

  window.requestAnimationFrame(mainGame);

} //main game

var checkLives = () => {
  lives--;
  lives > 0 ? gameReset() : gameOver = true;
}

var gameReset = () => {
  difficulty = (difficulty*2 < 1000) ? difficulty*2 : 1000;//So it's easier than where they died and they can have some time to warm up, but it doesn't get REALLY easy.
  ball_Y = canvas.height/2;
  pipes = [];
  if(gameOver) {
    score = 0;
    lives = 3;
  }
}



var outsideBoundaries = () => {

  return ball_Y < 0 || ball_Y > canvas.height;

}


var generatePipes = () => {


  var pipe =  {
    pipeHeight : 0,
    pipe_X : canvas.width,
    pipe_Y: canvas.height,
    pipeOrigin : 0

  };

  pipe.pipeHeight = Math.floor(Math.random()*(canvas.height/6)-10)+canvas.height/2;

  pipe.pipeOrigin = Math.floor(Math.random()*2);
  //0 -> means top ; 1 -> means bottom
  if(pipe.pipeOrigin == 0){
    pipe.pipe_Y = 0;

  }
  else{
      pipe.pipe_Y = canvas.height - pipe.pipeHeight 
  }

  pipes.push(pipe);

}


var generatePowerUp = () => {

}



var isColliding  = (pipe) => {
 
  if(pipe.pipe_X <= BALL_X + BALL_SIZE && pipe.pipe_X >= BALL_X - BALL_SIZE){
      if(pipe.pipeOrigin == 0  && pipe.pipeHeight > ball_Y){
        return true;
      }
      else if(pipe.pipeOrigin == 1  && pipe.pipe_Y < ball_Y){
        return true;
      }
      else{
        return false;
      }

  }


}




