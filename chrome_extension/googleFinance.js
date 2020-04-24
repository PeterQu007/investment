console.log("Google!");

$(document).ready(
  (function () {
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
    var refreshTimer;

    chrome.storage.local.get(["refreshGoogleFin"], (xInfo) => {
      if (xInfo.refreshGoogleFin) {
        htmlRefreshCheck.checked = true;
        refreshTimer = setInterval(refreshGoogleFinance, 10000);
      } else {
        htmlRefreshCheck.checked = false;
        if (refreshTimer) {
          clearInterval(refreshTimer);
          refreshTimer = null;
        }
      }
    });

    function refreshGoogleFinance() {
      if (htmlRefreshCheck.checked) {
        console.log("refresh google finance!");
        location.reload();
      }
    }

    htmlRefreshCheck.addEventListener("click", (e) => {
      let refreshClicked = e.target.checked;
      console.log(refreshClicked);
      chrome.storage.local.set({ refreshGoogleFin: refreshClicked }, () => {
        console.log("refresh setting saved: ", refreshClicked);
        if (refreshClicked) {
          if (!refreshTimer) {
            refreshTimer = setInterval(refreshGoogleFinance, 10000);
          }
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
  })()
);
