<?php
//http://investment.local/wp-content/themes/investment/searchTicker.php
include "mySql_Conn.php";

if(isset($_POST['ticker'])){
  $ticker = $_POST['ticker'];
}else{
  $ticker = "HOT.UN";
}

$strSql = "SELECT * FROM reits WHERE Remarks !='Delisted' OR Remarks is NULL Order By Description";
//echo $strSql . '</br>';

$conn->real_query($strSql);
  $res = $conn->use_result();

$i = 0;
$reists = [];

  while ($row = $res->fetch_assoc()){
    //echo $row['Description'];
    $reits['ticker'. $i++] = ['ticker' => $row['Ticker'], 'desc' => $row['Description']];
  }

  //var_dump($reits);

  echo json_encode($reits);