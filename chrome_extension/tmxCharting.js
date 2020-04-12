console.log("Hello Charting");
var TypeOptionClicked = false;
var countTimer = setInterval(checkComplete, 100);
var countTimer2 = setInterval(checkComplete2, 250);

function checkComplete() {
  //var xOptions = $(".v-input__icon");
  var xChart = $(".highcharts-scrollbar-button");
  var xTypeOptions = $(".v-list__tile__title");
  console.log(xChart[1]);
  if ($(xChart[1]).position().top > 0 && xTypeOptions[16] != undefined) {
    clearInterval(countTimer);
    console.log("About to click type options");
    //xOptions[4].click();
    xTypeOptions[16].click();
    TypeOptionClicked = true;
    return true;
  } else {
    return false;
  }
}

function checkComplete2() {
  var xInterval = $("a.v-tabs__item");
  var xChart = $(".highcharts-scrollbar-button");
  console.log(xInterval[0]);
  if (
    $(xInterval[0]).is(":visible") &&
    $(xChart[1]).position().top > 0 &&
    TypeOptionClicked
  ) {
    clearInterval(countTimer2);
    console.log("About to click Interval Options");
    xInterval[0].click();
  }
}

$(document).ready(function () {
  checkComplete();
  checkComplete2();
});