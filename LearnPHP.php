<?php 
// if (!defined('ABSPATH')) exit;
// get_header();

//http://investment.local/wp-content/themes/investment/LearnPHP.php
echo $_SERVER['SERVER_NAME'] . '<br>'; //investment.local
echo $_SERVER['HTTP_HOST'] . '<br>';
echo $_SERVER['SERVER_SOFTWARE'] . '<br>';
echo $_SERVER['DOCUMENT_ROOT'] . '<br>'; //
echo $_SERVER['PHP_SELF'] . '<br>'; //wp-content/themes/investment/LearnPHP.php
echo $_SERVER['SCRIPT_NAME'] . '<br>';
echo $_SERVER['SCRIPT_FILENAME'] . '<br>';
echo $_SERVER['HTTP_USER_AGENT'] . '<br>';
echo $_SERVER['REMOTE_ADDR'] . '<br>';
echo $_SERVER['REMOTE_PORT'] . '<br>';
echo $_SERVER['SERVER_PORT'] . '<br>';
if(isset($_POST['name'])){
  echo $_POST['name'];
}

//date and time
echo date('d-m-Y') . '<br>'; // today
echo date('d-m-Y', time()) . '<br>'; //today
echo date('d-m-Y', strtotime('today')). '<br>'; //today

//echo get_theme_file_uri('/LearnPHP.php') . '<br>'; //file uri

// get_footer();

?>