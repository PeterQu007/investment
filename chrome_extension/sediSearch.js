console.log("Hello SEDI Search");
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

var tbl = $("table");
tbl[0].width = "80%";
console.log(tbl[8]);

$(function () {
  $("#datepicker").datepicker();
});

var ticks = $('<div id="ticks" style="border-style:none"></div>');
var btnSearch = $(
  '<input id="xSearch" type="SUBMIT" name="Search" value="Search">'
);
var btnReturn = $(
  '<input id="xReturn" type="SUBMIT" name="Search" value="Return">'
);
var btnCheck = $(
  `<input id="xCheck" type="SUBMIT" name="Check" value="Check">`
);
var btnCheckDone = $(
  `<input id="xCheckDone" type="SUBMIT" name="CheckDone" value="CheckDone"><hr/>`
);
var dateSelect = $(`<div>
<label for="party">Choose your preferred party date and time:</label>
<input id="party" type="datetime-local" name="partydate"
        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" required>
<span class="validity"></span>
</div>`);
var datePicker = $('<span>Date: <input type="text" id="datepicker"></span>');
var dateSelect = $(`<select id="setNewDate">
                    <option value="lastDay">Last Day</option>
                    <option value="lastThreeDay">Last Three Day</option>
                    <option value="lastWeek">Last Week</option>
                    <option value="lastMonth">Last Month</option>
                    <option value="lastTwoMonth">Last Two Months</option>
                    <option value="lastThreeMonth">Last Three Months</option>
                    <option value="lastSixMonth">Last Six Months</option>
                    <option value="ytd">Year To Date</option>
                    <option value="lastYear">Last Year</option>
                </select><hr/>`);

ticks.append(btnSearch);
ticks.append(btnReturn);
ticks.append(btnCheck);
ticks.append(btnCheckDone);
ticks.append(datePicker);
ticks.append(dateSelect);

var xTick = $('[name="SELECT_TYPE_VALUE"]');

//send message to background
//fetch ticers from database/php file
var ticker = { ticker: "HOT.UN" };
var reits = {};

chrome.runtime.sendMessage(ticker, (res) => {
  reits = JSON.parse(res);
  console.log(reits);
  chrome.storage.local.get(
    [
      "ticker",
      "insiderTrading",
      "insiderTradingTickerArray",
      "checkedTickerArray",
      "btnCheckClicked",
    ],
    function (xInfo) {
      console.log(
        xInfo.ticker,
        xInfo.insiderTrading,
        xInfo.insiderTradingTickerArray,
        xInfo.checkedTickerArray,
        xInfo.btnCheckClicked
      );
      for (reit in reits) {
        // console.log(reits[reit]);
        let r = reits[reit];
        let mark = xInfo.ticker == r.ticker ? "[x]" : "";
        let color = "";
        if (xInfo.insiderTradingTickerArray != undefined) {
          if (xInfo.insiderTradingTickerArray.includes(r.ticker)) {
            color = "red";
          } else {
            color = "darkblue";
          }
        } else {
          color = "darkblue";
        }
        if (xInfo.checkedTickerArray == undefined) {
          xInfo.checkedTickerArray = [];
        }
        var tick1 = $(
          `<div><a id='${r.ticker.replace(
            ".",
            ""
          )}' href='#'> <span style="color: red">${mark}</span><span style="color: ${color}">  ${
            r.ticker
          }</span> :: ${r.desc} </a></div>`
        );
        ticks.append(tick1);

        //add events
        $(`#${r.ticker.replace(".", "")}`).click(function (e) {
          xTick.val(r.desc.replace("REIT", ""));
          var ts = new Date().getTime();
          chrome.storage.local.set(
            { tstamp: ts, ticker: r.ticker },
            function () {
              console.log("timestamp saved to chrome storage ", ts);
              // check if it is trigger by real user click
              if (e.hasOwnProperty("originalEvent")) {
                // this is a real click
                btnCheckDone.click();
              } else {
                // this is a fake click
              }
              btnSearch.click();
            }
          );
        });

        //if button check clicked, do the click
        if (
          xInfo.btnCheckClicked &&
          !xInfo.checkedTickerArray.includes(r.ticker)
        ) {
          let currentTicker = $(`#${r.ticker.replace(".", "")}`);
          if (r.ticker == "WIR.UN") {
            //xInfo.btnCheckClicked = false;
          }
          chrome.storage.local.set(
            { btnCheckClicked: xInfo.btnCheckClicked },
            function () {
              currentTicker.click();
            }
          );
        }
      }
    }
  );
});

$(tbl[8]).append(ticks);

var xForm = $('[name="form1"]');
$("#xSearch").click(function () {
  xForm.submit();
});

var intialOnce = false;
var today = new Date();
var lastWeek = getLastWeek();
var d = today.getDate();
var m = today.getMonth();
var y = today.getFullYear();

chrome.storage.local.set({ xD: d, xM: m, xY: y });
intialOnce = true;

//Set Identify INSIDER:
var x1 = $('[name="SELECT_TYPE"]');
x1.val("8");

//Set Identify Data Range:
var x2 = $('[name="DATE_RANGE_TYPE"]');
x2.val("2");
//Select Month Day Year
if (x2.is(":visible")) {
  chrome.storage.local.get(
    [
      "xD",
      "xM",
      "xY",
      "dateTag",
      "dateRangeTypeIndex",
      "ticker",
      "insiderTrading",
    ],
    function (xDate) {
      if (xDate.dateRangeTypeIndex) {
        x2.val(xDate.dateRangeTypeIndex);
      }
      //Select Month To Public
      var x6 = $('[name="MONTH_TO_PUBLIC"]');
      x6.val(xDate.xM.toString());
      var x7 = $('[name="YEAR_TO_PUBLIC"]');
      x7.val(xDate.xY.toString());
      var x8 = $('[name="DAY_TO_PUBLIC"]');
      x8.val(xDate.xD.toString());
      //Select Month From Public
      var x9 = $('[name="MONTH_FROM_PUBLIC"]');
      var x10 = $('[name="YEAR_FROM_PUBLIC"]');
      var x11 = $('[name="DAY_FROM_PUBLIC"]');
      switch (xDate.dateTag) {
        case "lastDay":
          x9.val(getLastWeek(1).getMonth().toString());
          x11.val(getLastWeek(1).getDate().toString());
          x10.val(getLastWeek(1).getFullYear().toString());
          break;
        case "lastThreeDay":
          x9.val(getLastWeek(3).getMonth().toString());
          x11.val(getLastWeek(3).getDate().toString());
          x10.val(getLastWeek(3).getFullYear().toString());
          break;
        case "lastWeek":
          x9.val(getLastWeek(7).getMonth().toString());
          x11.val(getLastWeek(7).getDate().toString());
          x10.val(getLastWeek(7).getFullYear().toString());
          break;
        case "lastMonth":
          x9.val(getLastMonth().getMonth().toString());
          x11.val(getLastMonth().getDate().toString());
          x10.val(getLastMonth().getFullYear().toString());
          break;
        case "lastTwoMonth":
          x9.val(getPassedMonth(2).getMonth().toString());
          x11.val(getPassedMonth(2).getDate().toString());
          x10.val(getPassedMonth(2).getFullYear().toString());
          break;
        case "lastThreeMonth":
          x9.val(getPassedMonth(3).getMonth().toString());
          x11.val(getPassedMonth(3).getDate().toString());
          x10.val(getPassedMonth(3).getFullYear().toString());
          break;
        case "lastSixMonth":
          x9.val(getPassedMonth(6).getMonth().toString());
          x11.val(getPassedMonth(6).getDate().toString());
          x10.val(getPassedMonth(6).getFullYear().toString());
          break;
        case "lastYear":
          x9.val(getPassedMonth(12).getMonth().toString());
          x11.val(getPassedMonth(12).getDate().toString());
          x10.val(getPassedMonth(12).getFullYear().toString());
          break;
        case "ytd":
          x9.val(getYTD().getMonth().toString());
          x11.val(getYTD().getDate().toString());
          x10.val(getYTD().getFullYear().toString());
          break;
        default:
          x9.val(lastWeek.getMonth().toString());
          x11.val(lastWeek.getDate().toString());
          x10.val(lastWeek.getFullYear().toString());
          break;
      }
      dateSelect.val(xDate.dateTag);
    }
  );
}

// var jsDateSelect = document.getElementById("setNewDate");
// jsDateSelect.addEventListener("change", function () {
//   console.log(jsDateSelect.value);
// });

dateSelect.on("change", function () {
  console.log($(this).children("option:selected").val());
  var dateSelected = $(this).children("option:selected").val();
  //Select Month To Public
  var x9 = $('[name="MONTH_FROM_PUBLIC"]');
  var x10 = $('[name="YEAR_FROM_PUBLIC"]');
  var x11 = $('[name="DAY_FROM_PUBLIC"]');
  switch (dateSelected) {
    case "lastDay":
      x9.val(getLastWeek(1).getMonth().toString());
      x11.val(getLastWeek(1).getDate().toString());
      x10.val(getLastWeek(1).getFullYear().toString());
      break;
    case "lastThreeDay":
      x9.val(getLastWeek(3).getMonth().toString());
      x11.val(getLastWeek(3).getDate().toString());
      x10.val(getLastWeek(3).getFullYear().toString());
      break;
    case "lastWeek":
      x9.val(lastWeek.getMonth().toString());
      x11.val(lastWeek.getDate().toString());
      x10.val(lastWeek.getFullYear().toString());
      break;
    case "lastMonth":
      x9.val(getLastMonth().getMonth().toString());
      x11.val(getLastMonth().getDate().toString());
      x10.val(getLastMonth().getFullYear().toString());
      break;
    case "lastTwoMonth":
      x9.val(getPassedMonth(2).getMonth().toString());
      x11.val(getPassedMonth(2).getDate().toString());
      x10.val(getPassedMonth(2).getFullYear().toString());
      break;
    case "lastThreeMonth":
      x9.val(getPassedMonth(3).getMonth().toString());
      x11.val(getPassedMonth(3).getDate().toString());
      x10.val(getPassedMonth(3).getFullYear().toString());
      break;
    case "lastSixMonth":
      x9.val(getPassedMonth(6).getMonth().toString());
      x11.val(getPassedMonth(6).getDate().toString());
      x10.val(getPassedMonth(6).getFullYear().toString());
      break;
    case "lastYear":
      x9.val(getPassedMonth(12).getMonth().toString());
      x11.val(getPassedMonth(12).getDate().toString());
      x10.val(getPassedMonth(12).getFullYear().toString());
      break;
    case "ytd":
      x9.val(getYTD().getMonth().toString());
      x11.val(getYTD().getDate().toString());
      x10.val(getYTD().getFullYear().toString());
      break;
  }
  chrome.storage.local.set({ dateTag: dateSelected });
});

// dateSelect.change(function () {
//   var selectedDate = $(this).children("option:selected").val();
//   console.log(selectedDate);
// });

function getLastWeek(i = 7) {
  var today = new Date();
  var lastWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - i
  );
  return lastWeek;
}

function getPassedMonth(i) {
  //month number as arg
  var today = new Date();
  var lastPassedMonth_timeStamp =
    today.getTime() - 1000 * 60 * 60 * 24 * 30 * i;
  var fromDate = new Date(lastPassedMonth_timeStamp);
  return fromDate;
}
function getLastMonth() {
  return getPassedMonth(1);
}

function getYTD() {
  var today = new Date();
  var YTD = new Date(today.getFullYear(), 0, 1);
  return YTD;
}

//Select All Equity
var x4 = $("[onclick=\"selectSecurities('Equity');\"]");
x4.click();

x2.change(function () {
  let selected = x2.children("option:selected").val();
  chrome.storage.local.set({ dateRangeTypeIndex: selected });
  console.log("Data Range Type has been persisted to local storage");
});

//Check Insider Trading
btnCheck.on("click", function () {
  console.log("start to check the insider trading", reits);
  chrome.storage.local.remove("insiderTradingTickerArray", function () {
    chrome.storage.local.set(
      {
        btnCheckClicked: true,
        checkedTickerArray: [],
        insiderTradingTickerArray: [],
      },
      function () {
        console.log("Button Check Clicked!");
        let ticker0 = $("#APUN");
        ticker0.click();
      }
    );
  });
});

//add CheckDone event
btnCheckDone.on("click", function () {
  chrome.storage.local.set({ btnCheckClicked: false }, function () {
    console.log("Remove the Check Clicked Sign");
  });
});
