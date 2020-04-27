var contextMenuItem = {
  id: "spendMoney",
  title: "SpendMoney",
  contexts: ["selection"],
};

chrome.contextMenus.create(contextMenuItem);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  $.ajax({
    url:
      "http://investment.local/wp-content/themes/investment/searchTicker.php",
    method: "post",
    data: request,
    success: function (res) {
      console.log("res::", JSON.stringify(res));
      sendResponse(res);
    },
  });
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
