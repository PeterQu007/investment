<?php 
include_once 'mySql_Conn.php';
get_header();
?>

<hr />
<h2>
  <a href="https://stockhouse.com/" target="_blank"> StockHouse </a> | 
  <a href="https://web.tmxmoney.com/account/login-register.php" target="_blank">TMX</a> | 
  <a href="https://stockchase.com/" target="_blank">StockChase</a> | 
  <a href="https://www.sedi.ca/sedi/SVTItdController?locale=en_CA" target="_blank"> SEDI </a>
</h2>

<ul>

  <?php 
    $sql="Select * From reits Order By Category, Ticker";
    $results= mysqli_query($conn, $sql);
    $stockHouseLink = "https://stockhouse.com/companies/bullboard?symbol=";
    $tmxChartingLink = "https://web.tmxmoney.com/charting.php?qm_symbol=";
    while($row = mysqli_fetch_assoc($results)){
    ?>
      <!-- <li>
        <span title="<?php echo $row['Description'] . ' | ' . $row['Location'] ?>">
        <?php echo $row['Ticker'] ?></span>
        <a href=<?php echo $stockHouseLink . 't.' . $row[ 'Ticker'] ?>
        target="_blank"
        >&nbspStockhouse&nbsp&nbsp|&nbsp</a>
        <a
        href=<?php echo $tmxChartingLink . $row['Ticker'] ?>
        target="_blank"
        >&nbspTmx Price&nbsp</a>
      </li> -->

    <?php
    }

  ?>

</ul>

<?php 
  //do shortcode
  echo do_shortcode("[wpdatatable id=1]");
  echo do_shortcode("[wpdatatable id=3]");
  while(have_posts()){
    the_post();
    echo the_title();
    echo the_permalink();
    echo the_content();
  
  }

  get_footer();
?>

