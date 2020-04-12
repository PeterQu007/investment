console.log("result");
// locate the view link on the result page
const x1 = $('[onclick = "return checkDoubleSubmit()"]'); //view link
const btn = $('[name="ATTRIB_NAV_TO_SC"]'); //button back to previous page
let insiderTradingFound = false;

//read the data from chrome.storage
chrome.storage.local.get(
  [
    "ticker",
    "insiderTradingTickerArray",
    "checkedTickerArray",
    "btnCheckClicked",
  ],
  function (xInfo) {
    //initialize tickerArray and checkedtickerArray
    if (xInfo.insiderTradingTickerArray == undefined) {
      xInfo.insiderTradingTickerArray = [];
    }
    if (xInfo.checkedTickerArray == undefined) {
      xInfo.checkedTickerArray = [];
    }
    //push ticker to checked array
    if (!xInfo.checkedTickerArray.includes(xInfo.ticker)) {
      xInfo.checkedTickerArray.push(xInfo.ticker);
    }
    //if the insider trading is found
    if (x1.is(":visible")) {
      insiderTradingFound = true;
      //push the ticker to both arrays
      if (!xInfo.insiderTradingTickerArray.includes(xInfo.ticker)) {
        xInfo.insiderTradingTickerArray.push(xInfo.ticker);
      }
    }
    //check if the loop is done
    //todo

    //send both arrays to the storage:
    chrome.storage.local.set(
      {
        insiderTradingTickerArray: xInfo.insiderTradingTickerArray,
        checkedTickerArray: xInfo.checkedTickerArray,
        insiderTrading: insiderTradingFound,
      },
      function () {
        console.log("done");
        if (xInfo.btnCheckClicked) {
          //return to previous page
          console.log("done::", xInfo.ticker);
          btn.click();
        }
      }
    );
  }
);
