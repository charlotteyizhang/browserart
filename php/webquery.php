<?php include("connect.php");

$mysqli = getConnect();
$stmt = $mysqli->stmt_init();
$sound = 1.0;
$query = "SELECT volume FROM sound ORDER BY id DESC LIMIT 1";
if($stmt->prepare($query)){
    $stmt->execute();
    $stmt->bind_result($sound);
    $stmt->store_result();
    while($stmt->fetch()){
        echo $sound;       
    }
    $stmt->close();
}
$mysqli->close();

?>