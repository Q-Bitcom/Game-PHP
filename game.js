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
    gravity: 0.26,
    jump: -6
};
//pipe spawning array
let pipes = [];
let activeCoins = [];
let coinsCollected = 0; 
let frameCount = 0;
let score = 0;
let isGameOver = false;

         function triggerGameOver() {
            isGameOver = true;
          if (score > 0 || coinsCollected > 0) { // Now prompts if they got a score OR a coin!
            let playerName = prompt("Great run! Enter your name for the Leaderboard:");
          if (playerName !== null && playerName.trim() !== "") {
          submitScore(playerName, score, coinsCollected);
        }
    }
}

// L1-CC-LeaderboardAPI-2026-03-18

// This function sends the data to your PHP server
        function submitScore(playerName, finalScore, finalCoins) { 
            let formData = new FormData();
            formData.append('name', playerName);
            formData.append('score', finalScore);
            formData.append('coins', finalCoins); 

            fetch('leaderboard.php', {
                method: 'POST',
                body: formData
            })
    .then(response => response.text()) // Wait for PHP to answer
    .then(result => {
        console.log("Server says: ", result); // Prints PHP's response in the console
    })
    .catch(error => {
        console.error("Error saving score:", error);
    });
}

// L1-CC-Boundaries-2026-03-13

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;


    // 1. FLOOR BOUNDARY 
    if (bird.y + bird.size > canvas.height) {
        triggerGameOver();
    }

    // 2. CEILING BOUNDARY (The new fix!)
    if (bird.y < 0) {
        bird.y = 0;         // Keep the bird at the top
        bird.velocity = 0;  // Stop it from trying to go higher
    }

    ctx.fillStyle = bird.color;
    ctx.fillRect(bird.x, bird.y, bird.size, bird.size);

    // pipe spawning code
    const GAP = 180; 

    if (frameCount % 180 === 0) {
        // 1. Randomize the height of the top pipe
        let topHeight = Math.random() * (canvas.height / 2) + 50;

        // 2. Add the Top Pipe
        pipes.push({
            x: canvas.width,
            y: 0,
            width: 50,
            height: topHeight,
            type: 'top',
            passed: false
        });

        // 3. Add the Bottom Pipe
        pipes.push({
            x: canvas.width,
            y: topHeight + GAP, // Starts right after the gap
            width: 50,
            height: canvas.height - (topHeight + GAP), // Fills the rest of the screen
            type: 'bottom',
            passed: false
        });
        // Add a coin to the activeCoins array
        if (Math.random() < 0.2) { 
           
                let randomCoinY = Math.random() * (canvas.height - 60) + 30;

                // 2. Spawns at a random horizontal distance! 
                // This pushes it off-screen to the right, but places it randomly in the open space between pipes
                let randomCoinX = canvas.width + 50 + (Math.random() * 200);

                activeCoins.push({
                    x: randomCoinX,  // <--- Using our new random X!
                    y: randomCoinY,  // <--- Using our new random Y!
                    radius: 12, 
                    collected: false
                });
            }
        }
    // 1. Tell the timer to keep ticking (Add this!)
    frameCount++;

    // 2. Move and Draw the Pipes (The "second part")
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2; 

        ctx.fillStyle = "#2ecc71";
        ctx.fillRect(pipes[i].x, pipes[i].y, pipes[i].width, pipes[i].height);

        // 4. COLLISION DETECTION
        if (
            bird.x < pipes[i].x + pipes[i].width &&  
            bird.x + bird.size > pipes[i].x &&       
            bird.y < pipes[i].y + pipes[i].height && 
            bird.y + bird.size > pipes[i].y          
        ) {
            triggerGameOver();
        } 
        
        // 5. SCORE SYSTEM (Added safety check here!)
        if (pipes[i] && !pipes[i].passed && bird.x > pipes[i].x + pipes[i].width) {
            pipes[i].passed = true; // Check the box so we don't count it again!

            // Only add a point if it's the top pipe
            if (pipes[i].type === 'top') {
                score++;
            }
        }

        // 3. Memory Cleanup: Remove pipes that leave the screen
            if (pipes[i] && pipes[i].x + pipes[i].width < 0) {
                pipes.splice(i, 1);
                i--; // Adjust index so we don't skip the next pipe
            }
        } // <--- THIS IS THE END OF THE PIPE LOOP! PASTE RIGHT BELOW THIS LINE!

    // 8. COIN SYSTEM
    for (let j = 0; j < activeCoins.length; j++) {
        activeCoins[j].x -= 2; // Move left at the exact same speed as pipes

        // Draw the Coin (A shiny yellow circle)
        ctx.beginPath();
        ctx.arc(activeCoins[j].x, activeCoins[j].y, activeCoins[j].radius, 0, Math.PI * 2);
        ctx.fillStyle = "#f1c40f"; // Gold/Yellow color
        ctx.fill();
        ctx.closePath();

        // COIN COLLISION DETECTION
        // We treat the circle like a box to keep the math simple!
        let coinLeft = activeCoins[j].x - activeCoins[j].radius;
        let coinRight = activeCoins[j].x + activeCoins[j].radius;
        let coinTop = activeCoins[j].y - activeCoins[j].radius;
        let coinBottom = activeCoins[j].y + activeCoins[j].radius;

        if (
            bird.x < coinRight &&
            bird.x + bird.size > coinLeft &&
            bird.y < coinBottom &&
            bird.y + bird.size > coinTop
        ) {
            // CHING! Coin collected!
            coinsCollected++;
            activeCoins.splice(j, 1); // Delete the coin from the screen
            j--; // Adjust index so we don't skip the next coin
            continue; // Skip the memory cleanup below since the coin is already gone
        }

        // Memory Cleanup: Remove coins that fly off the left side of the screen
        if (activeCoins[j] && activeCoins[j].x + activeCoins[j].radius < 0) {
            activeCoins.splice(j, 1);
            j--;
        }
    }
        // 8. COIN SYSTEM
        for (let j = 0; j < activeCoins.length; j++) {
             // ... all the coin code you just pasted ...
        }


        // 5. Draw the Score and Coins
        ctx.fillStyle = "#ffffff"; 
        ctx.font = "bold 24px Arial";
        ctx.fillText("Score: " + score + " | Coins: " + coinsCollected, 15, 40);

    // 7. GAME OVER SCREEN
    if (isGameOver) {
        // Darken the screen slightly
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Game Over Text
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center"; // Centers the text perfectly
        ctx.font = "bold 40px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

        ctx.font = "20px Arial";
        ctx.fillText("Press Spacebar to Restart", canvas.width / 2, canvas.height / 2 + 20);

        // Reset text alignment for the next time we draw the score
        ctx.textAlign = "left"; 

        return; // <--- CRITICAL: This completely stops the update loop!
    }
    
    requestAnimationFrame(update);
}

// Listen for key presses
window.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        
        // If the game is over, Spacebar restarts it
        if (isGameOver) {
            // Reset all the variables HERE
            bird.y = 300;
            bird.velocity = 0;
            pipes = [];
            frameCount = 0;
            score = 0;
            isGameOver = false;
            update(); // Kickstart the loop again!
        } 
        // If the game is running, Spacebar makes the bird jump
        else {
            bird.velocity = bird.jump; 
        }
    }
});

// Start the game!
update();