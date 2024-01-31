<?php
header("Access-Control-Allow-Origin: *");
// create connect
function local_host(){
    $serverName = "localhost";
    $userName = "root";
    $password = "";
    $dbname = "weather";

    $conn = mysqli_connect($serverName, $userName, $password);

    if (!$conn){
        die("Connection unsuccessfull<br/>");
    }


    db_create($conn, $dbname);

    $conn = db_connection($serverName, $userName, $password, $dbname);

    table_creation($conn);

    $cityName = isset($_GET['city']) ? $_GET['city']:'';
    // $cityName = ucfirst($cityName);
    api_fetch($conn,$cityName);
    api_json($conn,$cityName);


}
function db_connection($serverName, $userName, $password, $dbname){

    $conn = mysqli_connect($serverName, $userName, $password, $dbname);

    // Checking if connection with database is done or not
    if(!$conn){
        die("Connection unsuccessfull<br/>");
    }
    else{

        return $conn;
    }
}

function db_create($conn, $dbname){
    $sql_query = "CREATE DATABASE IF NOT EXISTS $dbname";

    if (mysqli_query($conn, $sql_query) === FALSE){
        echo "Database create failed<br/>";
    }
}

function table_creation($conn){
    $sql_query = "CREATE TABLE IF NOT EXISTS weather_info(
        no int(11) AUTO_INCREMENT PRIMARY KEY,
        date text,
        city varchar(50),
        country varchar(50),
        day varchar(50),
        temp float,
        description varchar(50),
        icon varchar(50),
        pressure int(11),
        humidity int(11),
        wind float,
        time int(50)
    )";

    if (mysqli_query($conn, $sql_query) === FALSE){
        echo "Table create failed<br/>";
    }
}




    // insert.php
function api_fetch($conn,$cityName){
    $api_Url = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=". $cityName ."&appid=7e4b75e1b4dee7ce1d87c0a0d59b77f0";
    $api_data = file_get_contents($api_Url);
    $api_data = json_decode($api_data,TRUE);
    $temp = $api_data['main']['temp'];
    $weathercondition = $api_data['weather'][0]['description'];
    $humidity =  $api_data['main']['humidity'];
    $pressure = $api_data['main']['pressure'];
    $wind = $api_data['wind']['speed'];
    $icon =  $api_data['weather'][0]['icon'];
    $day = date('l');
    $date = date("'m/d'");
    $cityName = $api_data['name'];
    $country = $api_data['sys']['country'];
    $timezone = $api_data['timezone'];
    // Insert into table
    $sql = "SELECT Date FROM weather_info WHERE Date = $date AND City = '$cityName'";
    $data = $conn->query($sql);
    if ($data->num_rows === 0){
        $sql = "INSERT INTO weather_info(Temperature,Description,Humidity,Wind,Pressure,Icon,Days,Date,City,Timezone,Country)
        VALUES ('$temp','$weathercondition','$humidity','$wind','$pressure','$icon','$day',$date,'$cityName','$timezone','$country')";
        if ($conn->query($sql) === FALSE){
            echo "</br>Insertion failed";
        }

    }
    else{
        $sql = "UPDATE weather_info SET
        Temperature = '$temp',
        Description= '$weathercondition',
        Humidity='$humidity',
        Wind='$wind',
        Pressure='$pressure',
        Icon='$icon',
        Days='$day',
        Date=$date,
        City='$cityName',
        Timezone='$timezone',
        Country='$country'
        WHERE Date=$date AND City ='$cityName' ";
        if ($conn->query($sql) === FALSE){
            echo "<br>Update failed";
        }
    }
    // if ($conn->query($sql) === FALSE){
    //     echo "<br> insertion failed";
    // }        
}

function api_json($conn,$cityName){
    // $sql = "SELECT * FROM weather_info WHERE City = 'Haridwar' ";
    $sql = "SELECT * FROM weather_info WHERE City = '$cityName' ";


    

    $result = $conn->query($sql);

    // Check if there is any data
    if ($result->num_rows > 0) {
        $data = array();

        // Fetch each row and add it to the data array
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        // Close the database connection
        $conn->close();

        // Convert data to JSON format
        $json_data = json_encode($data);

        // Set headers to indicate JSON content
        header('Content-Type: application/json');

        // Output the JSON data
        echo $json_data;
    } 
    else {
        // If no data is found, return an empty JSON array
        echo json_encode();
    }
}

local_host()

    
?>