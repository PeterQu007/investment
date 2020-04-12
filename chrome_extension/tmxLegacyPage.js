console.log("tmx Legacy pages");
//refresh the page every 10 seconds
(function () {
  let countTimer = setInterval(checkComplete, 45000);
  var chkReload = $(
    `<input type="checkbox" id="chkReload">
      Reload
    </input>`
  );
  var siteUser = document.getElementsByClassName("site-user");
  var chkReloadState = false;
  var i = 2;
  chkReload.insertAfter(siteUser);
  chkReload.on("change", () => {
    chkReloadState = chkReload.is(":checked");
    console.log("chkbox clicked:: ", chkReloadState);
    chrome.storage.sync.set({ chkReloadState: chkReloadState }, () => {
      console.log("check box state persisted!");
    });
    if (chkReloadState) {
      countTimer = setInterval(checkComplete, 45000);
    }
  });
  chrome.storage.sync.get(["chkReloadState"], (res) => {
    console.log("chkReload Fetched!");
    chkReloadState = res.chkReloadState;
    chkReload.prop("checked", chkReloadState);
    if (!chkReloadState) {
      clearInterval(countTimer);
    }
  });

  function checkComplete() {
    chkReloadState = chkReload.is(":checked");
    chrome.storage.sync.set({ chkReloadState: chkReloadState }, () => {
      console.log("reload the page:");
    });
    if (i-- > 0) {
      return;
    }
    if (chkReloadState) {
      console.log("chkReload Saved!");
      location.reload();
    } else {
      clearInterval(countTimer);
    }
  }
})();
