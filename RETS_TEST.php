<?php
/* RETS Variables */
require("PHRets_CREA.php");
$RETS = new PHRets();
$RETSURL = "http://data.crea.ca/Login.svc/Login";
$RETSUsername = "a5gnw2TRWoXjUZRBRkp0Aijh";
$RETSPassword = "QRqvupXM5u24iDZ5RqdAjWg8";
$RETS->Connect($RETSURL, $RETSUsername, $RETSPassword);
$RETS->AddHeader("RETS-Version", "RETS/1.7.2");
$RETS->AddHeader('Accept', '/');
$RETS->SetParam('compression_enabled', true);
$RETS_LimitPerQuery = 10;
$TimeBackPull = "-1 hours";

echo 'Connecting to RETS as : <span style="color:#008000;"><b>'.$RETSUsername.'</b></span><br/>';
echo "-----GETTING ALL Listings-----<br/>";
//Get Id's
$DBML = "(LastUpdated=" . date('Y-m-d', strtotime($TimeBackPull)) . ")";
$params = array("Limit" => 1, "Format" => "STANDARD-XML", "Count" => 1);
$results = $RETS->SearchQuery("Property", "Property", $DBML, $params);
$totalAvailable = $results["Count"];
echo "-----".$totalAvailable." Found-----<br/>";

//$ListingKey = "ListingKey here";
$ListingKey = "21441954";
$propriety = $RETS->SearchQuery("Property", "Property", "(ID=".$ListingKey.")", array("Limit" => 1, "Format" => "STANDARD-XML"));
//$propriety = $RETS->SearchQuery("Property", "Property", "(ID=*)", array("Limit" => 1, "Format" => "STANDARD-XML"));

echo "<pre>";
print_r($propriety);
echo "</pre>";

?>