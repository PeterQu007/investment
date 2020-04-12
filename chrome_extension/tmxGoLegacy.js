console.log("go Legacy");

(function() {
  let countTimer = setInterval(checkComplete, 100);

  function checkComplete() {
    console.log("auto login to server:");
    if (
      $("a[href='https://web.tmxmoney.com/account/legacy-portfolio.php']")[0]
    ) {
      clearInterval(countTimer);
      $(
        "a[href='https://web.tmxmoney.com/account/legacy-portfolio.php']"
      )[0].click();
    }
  }
})();
