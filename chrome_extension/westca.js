$(document).ready(() => {
  let myLink = $('a[href$="Forums/viewtopic/t=1183840/lang=schinese.html"]');
  let clickCounter = 0;
  chrome.storage.local.get(["clickCounter", "startCounter"], function (
    westcaInfo
  ) {
    clickCounter = westcaInfo.clickCounter;
    startCounter = westcaInfo.startCounter;
    if (clickCounter == undefined) {
      clickCounter = 0;
    }
    if (startCounter == undefined) {
      startCounter = clickCounter;
    }
  });
  let clickHandle = setInterval(function () {
    if (clickCounter - startCounter >= 100) {
      chrome.storage.local.set(
        { clickCounter: clickCounter, startCounter: clickCounter },
        function () {
          clearInterval(clickHandle);
          return;
        }
      );
    } else {
      chrome.storage.local.set(
        { clickCounter: ++clickCounter, startCounter: startCounter },
        function () {
          console.log(clickCounter);
          myLink[0].click();
        }
      );
    }
  }, 3000);
});
