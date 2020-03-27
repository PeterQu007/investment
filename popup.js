$(function() {
  console.log("Hello Popup");
  // $("#hotun").click(function() {
  //   console.log("HOT Clicked");
  //   window.opener.open(
  //     "https://web.tmxmoney.com/quote.php?qm_exchange=TSX&qm_page=54851&qm_symbol=HOT.UN"
  //   );
  // });
  window.addEventListener("DOMContentLoaded", function() {
    // your button here
    var link = document.getElementById("hotun");
    // onClick's logic below:
    link.addEventListener("click", function() {
      var newURL =
        "https://web.tmxmoney.com/quote.php?qm_exchange=TSX&qm_page=54851&qm_symbol=HOT.UN";
      chrome.tabs.create({ url: newURL });
    });
  });
});
