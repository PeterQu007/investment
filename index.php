<?php 
include_once 'mySql_Conn.php';
get_header();
echo get_theme_file_uri('/LearnPHP.php') . '<br>'; //file uri

?>
<script>
  //'use strict';
  var name = "windows name";
  var c = {
    name: 'The c Object',
    log: function(){
      this.name = 'Updated c object';
      console.log(this);

      var setname = function(newname){
        this.name = newname;
      }
      setname('Updated again! The C Object');
      console.log(this);
    }
  }
  c.log();
</script>

<hr />
<h2>
  <a href="https://stockhouse.com/" target="_blank"> StockHouse </a> | 
  <a href="https://web.tmxmoney.com/account/login-register.php" target="_blank">TMX</a> | 
  <a href="https://stockchase.com/" target="_blank">StockChase</a> | 
  <a href="https://www.sedi.ca/sedi/SVTItdController" target="_blank"> SEDI </a> |
  <a href="https://simplywall.st/stocks/ca/real-estate" target="_blank">Simply Wall St</a> |
  <a href="https://https://finviz.com/" target="_blank">finviz</a> |
  <a href="https://finance.yahoo.com/" target="_blank">Yahoo Finance</a>
</h2>

<hr />
<h2>
  <a href="http://learn.idxbroker.com/" target="_blank">IDX Broker Learn |</a>
  <a href="https://support.idxbroker.com/support/s/" target="_blank">IDX Broker Support |</a>
  <a href="https://middleware.idxbroker.com/mgmt/login" target="_blank">IDX Dashboard Login |</a>
  <a href="https://developers.idxbroker.com/" target="_blank" rel="noopener noreferrer">IDX Dev |</a>
  <a href="https://myhometheme.zendesk.com/hc/en-us/articles/115004872273#table">IDX Broker Integration(MLS) | </a>
  <a href="https://wordpress.org/plugins/wp-listings/" target="_blank" rel="noopener noreferrer">Impress Import Feature Listings</a>
</h2>

<hr />
<h2>
  <a href="https://realhomes.io/documentation/" target = "_blank">Real Homes Docs</a>
</h2>

<hr>
<h2>
  <a href="https://portal.hostgator.com/login" target = "_blank">Hostgator Portal Login |</a>
</h2>

<form method = "POST" action = "<?php echo $_SERVER["PHP_SELF"] ?>">
  <label for="name">Name:</label>
  <input name="name" type="text">
  <input name="Submit" type="submit">
</form>

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
  echo do_shortcode("[wpdatatable id=4]");
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

