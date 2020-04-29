console.log("tmx Legacy pages");
//refresh the page every 10 seconds
$(document).ready(
  (function () {
    var refreshInterval = randomIntFromInterval(15000, 45000);

    let countTimer = setInterval(checkComplete, refreshInterval);
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
