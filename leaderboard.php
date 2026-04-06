<?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['name']) && isset($_POST['score'])) {

    // Clean the incoming data
    $name = htmlspecialchars($_POST['name']);
    $score = (int)$_POST['score'];

    // Catch the coins! (If no coins are sent, default to 0)
    $coins = isset($_POST['coins']) ? (int)$_POST['coins'] : 0;

    // Read the current leaderboard
    $jsonData = file_get_contents('data/leaderboard.json');
    $leaderboard = json_decode($jsonData, true);

    // Add the new score to the array
    $leaderboard[] = [
        'name' => $name,
        'score' => $score,
        'coins' => $coins // <--- Put the real variable here!
    ];

    // Save the updated array back into the JSON file
    // JSON_PRETTY_PRINT keeps the file readable for humans!
    file_put_contents('data/leaderboard.json', json_encode($leaderboard, JSON_PRETTY_PRINT));

    // Send a success message back to the JavaScript console
    echo "Success! Saved $score for $name.";
    
    // CRITICAL: Stop the file here so we don't send the HTML table to the game!
    exit; 
}


// ==========================================
// 2. THE PAGE VIEWER (The "Webpage" Hat)
// ==========================================

// 1. Get the raw text from the JSON file
$jsonData = file_get_contents('data/leaderboard.json');

// 2. Convert that text into a PHP "Array"
$leaderboard = json_decode($jsonData, true);

$sortBy = $_GET['sort'] ?? 'score';

// 3. The Sorting Logic
usort($leaderboard, function($a, $b) use ($sortBy) {
    if ($sortBy === 'coins') {
        return $b['coins'] - $a['coins']; // Sort by coins
    } else {
        return $b['score'] - $a['score']; // Sort by score (default)
    }
});
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Clicky Bird</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <?php include 'nav.php'; ?>

    <h1>Global Leaderboard</h1>
    <h3>Top Players</h3>
    <div class="leaderboard-container">
        <div class="sort-options">
            <a href="leaderboard.php?sort=score">Sort by High Score</a> | 
            <a href="leaderboard.php?sort=coins">Sort by Most Coins</a>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Player</th>
                    <th>Score</th>
                    <th>Coins</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($leaderboard as $player): ?>
                <tr>
                    <td><?php echo $player['name']; ?></td>
                    <td><?php echo $player['score']; ?></td>
                    <td><?php echo $player['coins']; ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</body>
</html>