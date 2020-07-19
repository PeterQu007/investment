var contextMenuItem = {
  id: "spendMoney",
  title: "SpendMoney",
  contexts: ["selection"],
};

chrome.contextMenus.create(contextMenuItem);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.ticker) {
    $.ajax({
      url:
        //"http://investment.local/wp-content/themes/investment/searchTicker.php",
        "https://investment.pidhome.ca/wp-content/themes/investment/searchTicker.php",
      method: "post",
      data: request,
      success: function (res) {
        console.log("res::", JSON.stringify(res));
        sendResponse(res);
      },
    });
  }
  if (request.postID) {
    $.ajax({
      url:
        "https://pidhomes.ca/wp-content/themes/realhomes-child-2/db/data.php",
      method: "post",
      data: request,
      success: function (res) {
        console.log(res);
        $('input[name="textbox"]').val(
          JSON.stringify(res) + ":: connect to MySQL successfully!"
        );
        sendResponse(res);
      },
      error: function (e) {
        sendResponse("error");
      },
    });
  }
  if (request.areaCode) {
    $.ajax({
      url:
        "http://localhost/pidrealty3/wp-content/themes/realhomes-child/db/data.php",
      method: "post",
      data: request,
      success: function (res) {
        console.log(res);
        sendResponse(res);
      },
    });
  }
  if (request.saveData) {
    $.ajax({
      url: request.saveURL,
      method: "post",
      data: request,
      success: function (res) {
        console.log(res);
        sendResponse(res);
      },
    });
  }
  return true;
});

var GoogleFinRefreshCounter = 0;
//reset the Counter::
chrome.storage.local.set(
  { GoogleFinRefreshCounter: GoogleFinRefreshCounter },
  () => {
    console.log(GoogleFinRefreshCounter);
  }
);
