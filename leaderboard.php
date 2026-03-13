<?php

// 1. Get the raw text from the JSON file
$jsonData = file_get_contents('data/leaderboard.json');

// 2. Convert that text into a PHP "Array"
$leaderboard = json_decode($jsonData, true);

$sortBy = $_GET['sort'] ?? 'score';

// 2. The Sorting Logic
// This tells PHP: "Compare Player A and Player B based on their score"
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