console.log("tmx Legacy pages");
//refresh the page every 10 seconds
$(document).ready(
  (function () {
    var refreshInterval = randomIntFromInterval(35000, 65000);

    let countTimer = setInterval(checkComplete, refreshInterval);
    let countTimer2 = setInterval(updateRefreshInterval, 1000);
    let iCounter = 1;

    var chkReload = $(`<input type="checkbox" id="chkReload">`);
    var spanReload = $(`<span>Reload</span>`);
    var siteUser = document.getElementsByClassName("site-user");
    var chkReloadState = false;
    var i = 2;
    const htmlTSXchange = document.getElementById("TSXchange");

    spanReload.insertAfter(siteUser);
    chkReload.insertAfter(siteUser);

    spanReload.text(refreshInterval);

    chkReload.on("change", () => {
      chkReloadState = chkReload.is(":checked");
      console.log("chkbox clicked:: ", chkReloadState);
      chrome.storage.sync.set({ chkReloadState: chkReloadState }, () => {
        console.log("check box state persisted!");
      });
      if (chkReloadState) {
        checkComplete(); // go to refresh the page
      }
    });
    chrome.storage.sync.get(["chkReloadState"], (res) => {
      console.log("chkReload Fetched!");
      chkReloadState = res.chkReloadState;
      chkReload.prop("checked", chkReloadState);
      //If no need to refresh the page, reset/clear the 2 countertimers:
      if (!chkReloadState) {
        clearInterval(countTimer);
        countTimer = null;
      }
    });

    function checkComplete() {
      chkReloadState = chkReload.is(":checked");
      chrome.storage.sync.set({ chkReloadState: chkReloadState }, () => {
        console.log("reload the page:");
      });
      if (chkReloadState) {
        console.log("chkReload Saved!");
        location.reload();
      } else {
        clearInterval(countTimer);
        countTimer = null;
      }
    }

    function updateRefreshInterval() {
      chkReloadState = chkReload.is(":checked");
      if (chkReloadState) {
        spanReload.text(refreshInterval - 1000 * iCounter++);
      } else {
        spanReload.text(refreshInterval - 1000 * iCounter++);
        spanReload.toggleClass("stopCounter");
      }
    }

    function randomIntFromInterval(min, max) {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    htmlTSXchange.addEventListener("DOMSubtreeModified", (e) => {
      console.log("index changed: ", e.target.textContent);
      let timeTag = new Date();
      timeLiteral = `${timeTag.getHours()}:${timeTag.getMinutes()}`;
      document.title = `[${timeLiteral}]${e.target.textContent}`;
    });
  })()
);
