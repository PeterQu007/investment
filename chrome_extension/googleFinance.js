console.log("Google!");

$(document).ready(
  (function () {
    var refreshInterval = randomIntFromInterval(45000, 75000); //45 seconds
    console.log(refreshInterval);
    var htmlSpan = document.getElementsByTagName("span")[0];
    console.log(htmlSpan);
    var htmlSpanChange = document.querySelector('[jsname="qRSVye"]');
    console.log(htmlSpanChange);
    document.title = htmlSpanChange.textContent;
    var htmlRefreshCheck = document.createElement("input");
    htmlRefreshCheck.type = "checkbox";
    htmlRefreshCheck.name = "refresh";
    htmlRefreshCheck.value = "checked";
    htmlRefreshCheck.id = "refreshGoogleFinance";
    var htmlDiv = document.getElementsByClassName("fpNm8c bH5zSd")[0];
    htmlDiv.appendChild(htmlRefreshCheck);
    var htmlSpanInterval = document.createElement("span");
    htmlSpanInterval.innerText = refreshInterval;
    htmlDiv.appendChild(htmlSpanInterval);

    var refreshTimer;
    var GoogleFinRefreshCounter = 0;

    chrome.storage.local.get(
      ["refreshGoogleFin", "GoogleFinRefreshCounter"],
      (xInfo) => {
        GoogleFinRefreshCounter = ++xInfo.GoogleFinRefreshCounter
          ? xInfo.GoogleFinRefreshCounter
          : 0;
        let timeTag = new Date();
        htmlSpanInterval.innerText = `[${GoogleFinRefreshCounter}]::${refreshInterval}::[${timeTag.getHours()}:${timeTag.getMinutes()}:${timeTag.getSeconds()}]`;
        if (xInfo.refreshGoogleFin) {
          htmlRefreshCheck.checked = true;
          refreshTimer = setInterval(refreshGoogleFinance, refreshInterval);
        } else {
          htmlRefreshCheck.checked = false;
          if (refreshTimer) {
            clearInterval(refreshTimer);
            refreshTimer = null;
          }
        }
      }
    );

    function refreshGoogleFinance() {
      if (htmlRefreshCheck.checked) {
        console.log("refresh google finance!");
        let refreshDelay = GoogleFinRefreshCounter > 18 ? 60000 : 1000;
        chrome.storage.local.set(
          {
            GoogleFinRefreshCounter:
              GoogleFinRefreshCounter > 18 ? 0 : GoogleFinRefreshCounter,
          },
          () => {
            console.log(
              `refreshDay: ${refreshDelay} ; GoogleFinRefreshCounter: ${GoogleFinRefreshCounter}`
            );
            setTimeout(() => {
              location.reload();
            }, refreshDelay);
          }
        );
      }
    }

    function randomIntFromInterval(min, max) {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    htmlRefreshCheck.addEventListener("click", (e) => {
      let refreshClicked = e.target.checked;
      console.log(refreshClicked);
      chrome.storage.local.set({ refreshGoogleFin: refreshClicked }, () => {
        console.log("refresh setting saved: ", refreshClicked);
        if (refreshClicked) {
          if (!refreshTimer) {
            refreshTimer = setInterval(refreshGoogleFinance, refreshInterval);
          }
          location.reload();
        } else {
          if (refreshTimer) {
            clearInterval(refreshTimer);
            refreshTimer = null;
          }
        }
      });
    });

    htmlSpanChange.addEventListener("DOMSubtreeModified", (e) => {
      console.log("index changed: ", e.target.textContent);
      document.title = e.target.textContent;
    });

    ////New feature
    var vis = (function () {
      var stateKey,
        eventKey,
        keys = {
          hidden: "visibilitychange",
          webkitHidden: "webkitvisibilitychange",
          mozHidden: "mozvisibilitychange",
          msHidden: "msvisibilitychange",
        };
      for (stateKey in keys) {
        if (stateKey in document) {
          eventKey = keys[stateKey];
          break;
        }
      }
      return function (c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
      };
    })();

    var visible = vis(); // gives current state

    vis(refreshVisible); // registers a handler for visibility changes

    function refreshVisible() {
      if (vis()) {
        location.reload();
      }
    }
  })()
);
