// L1-CC-GameLoop-2026-03-13
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player properties (Minimalist Square Bird)
// L1-CC-Gravity-2026-03-13
let bird = {
    x: 50,
    y: 300,
    size: 30,
    color: '#00d4ff',
    velocity: 0,    // Current speed
    gravity: 0.13,
    jump: -5
};
//pipe spawning array
let pipes = [];
let frameCount = 0;

// L1-CC-Boundaries-2026-03-13

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;


    // 1. FLOOR BOUNDARY 
    if (bird.y + bird.size > canvas.height) {
        // Reset the bird to the middle
        bird.y = 300;
        bird.velocity = 0;

        // CLEAR THE OBSTACLES (The Fix!)
        pipes = []; 
        frameCount = 0;

        // Optional: Alert the player
        alert("Game Over! Try again.");
    }

    // 2. CEILING BOUNDARY (The new fix!)
    if (bird.y < 0) {
        bird.y = 0;         // Keep the bird at the top
        bird.velocity = 0;  // Stop it from trying to go higher
    }

    ctx.fillStyle = bird.color;
    ctx.fillRect(bird.x, bird.y, bird.size, bird.size);

    // pipe spawning code
    const GAP = 200; 

    if (frameCount % 200 === 0) {
        // 1. Randomize the height of the top pipe
        let topHeight = Math.random() * (canvas.height / 2) + 50;

        // 2. Add the Top Pipe
        pipes.push({
            x: canvas.width,
            y: 0,
            width: 50,
            height: topHeight,
            type: 'top'
        });

        // 3. Add the Bottom Pipe
        pipes.push({
            x: canvas.width,
            y: topHeight + GAP, // Starts right after the gap
            width: 50,
            height: canvas.height - (topHeight + GAP), // Fills the rest of the screen
            type: 'bottom'
        });
    }
    // 1. Tell the timer to keep ticking (Add this!)
    frameCount++;

    // 2. Move and Draw the Pipes (The "second part")
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2; // Move speed (left)

        ctx.fillStyle = "#2ecc71"; // Minimalist Green
        ctx.fillRect(pipes[i].x, pipes[i].y, pipes[i].width, pipes[i].height);

        // 4. COLLISION DETECTION
        if (
            bird.x < pipes[i].x + pipes[i].width &&  
            bird.x + bird.size > pipes[i].x &&       
            bird.y < pipes[i].y + pipes[i].height && 
            bird.y + bird.size > pipes[i].y          
        ) {
            // CRASH! Reset the game
            bird.y = 300;
            bird.velocity = 0;
            pipes = []; // Clears the pipes
            frameCount = 0; // Resets the spawn timer
            alert("Crash! You hit a pipe.");
        } // <--- THIS IS THE MISSING BRACKET!

        // 3. Memory Cleanup: Remove pipes that leave the screen
        // We added `pipes[i] &&` to prevent the "Ghost Pipe" crash!
        if (pipes[i] && pipes[i].x + pipes[i].width < 0) {
            pipes.splice(i, 1);
            i--; // Adjust index so we don't skip the next pipe
        }
    }
    
    requestAnimationFrame(update);
}

 // Listen for key presses
 window.addEventListener('keydown', function(e) {
     // Check if the key pressed was the Spacebar
     if (e.code === 'Space') {
         bird.velocity = bird.jump; // Set velocity to -8, shooting the bird up
     }
 });

// Start the game!
update();