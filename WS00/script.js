const game = document.getElementById('game');
const basket = document.getElementById('basket');
let basketPosition = game.clientWidth / 2 ;
let score = 0;
let gameOver = false;



function updateScore() {
    score += 1;
    document.getElementById('score-value').innerText = score; 
}


function moveBasket(event) {
    if (gameOver) return;
    if (event.key === 'ArrowLeft' && basketPosition > 50) {
        basketPosition -= 40;
    } else if (event.key === 'ArrowRight' && basketPosition < game.clientWidth - 50) {
        basketPosition += 40;
    }
    basket.style.left = basketPosition + 'px';
}

function FallingSpeedCalc() {
    let base = 3;
    let increaseMultiplier = 1 + score/200;
    return Math.round (base * increaseMultiplier);


}


function createFallingBall() {
    const object = document.createElement('div');
    object.classList.add('falling-object');
    object.style.left = Math.random() * (game.clientWidth - 20) + 'px';
    object.style.top = '0px'; // Spawn y coordinate
    game.appendChild(object);

    let fallInterval = setInterval(() => {
        let objectPosition = parseInt(object.style.top) || 0;

        // Check if the object has fallen past game window
        if (objectPosition > game.clientHeight - 20) {
            clearInterval(fallInterval);
            game.removeChild(object);
            if (!gameOver) {
                showEndScreen(score);
                gameOver = true;
            }
        } else {
            object.style.top = objectPosition + FallingSpeedCalc() + 'px'; // Move ball down

            // Collision with Basket
            const basketBottom = game.clientHeight - 20; // Bottom of the basket
            const objectBottom = objectPosition + 30; // Bottom of the ball
            const objectLeft = parseInt(object.style.left);
            const objectRight = objectLeft + 30; // Right of the ball

            
            const hitboxWidth = 60; 
            const hitboxOffset = 60; // Calculate offset to center the hitbox

            // Collision detection stuff
            if (
                objectBottom >= basketBottom && // Object is in basket
                objectLeft + 3 >= basketPosition - hitboxOffset && // Left side overlaps
                objectRight - 3 <= basketPosition + hitboxWidth // Right side overlaps
            ) {
                clearInterval(fallInterval);
                game.removeChild(object);
                updateScore();
            }
        }
    }, 16);

        //Respawn balls
        setTimeout(createFallingBall, 1500); 
    
}



function showEndScreen(score) {
    document.getElementById('final-score').innerText = score;
    const endScreen = document.getElementById('end-screen');
    endScreen.classList.add('active'); // Make endscreen visible
    const shapes = document.querySelectorAll('.shape1, .shape2, .shape3, .shape4');
    // Hide shapes
    shapes.forEach(shape => {
        shape.style.display = 'none'; // Hide each shape
    });

}

document.getElementById('restart-button').addEventListener('click', function() {
    location.reload(); // Reload the page 
    
});

document.addEventListener('keydown', moveBasket);
setTimeout(createFallingBall, 1000); 
