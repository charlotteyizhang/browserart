<?php include("connect.php");
    $mysqli = getConnect();
    $sensor_input = isset($_GET['data']) ? $_GET['data'] : null;
    echo $sensor_input;
    /* create a prepared statement */

    $stmt = $mysqli->stmt_init();
    if($sensor_input != null){
        $query = "INSERT INTO sound (volume) VALUES (?)";
        //select weight from the wardrobe to compare with the sensor weight
        if ($stmt->prepare($query)) {
           $stmt->bind_param("d",$sensor_input);
            $stmt->execute();
            echo $stmt->insert_id;

            /* free result set */
            $stmt->close();
        }
    }
    $mysqli->close();
    

?>