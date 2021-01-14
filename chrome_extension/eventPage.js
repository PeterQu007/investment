var contextMenuItem = {
  id: "spendMoney",
  title: "SpendMoney",
  contexts: ["selection"],
};

chrome.contextMenus.create(contextMenuItem);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.ticker) {
    $.ajax({
      url:
        //"http://investment.local/wp-content/themes/investment/searchTicker.php",
        "https://investment.pidhome.ca/wp-content/themes/investment/searchTicker.php",
      method: "post",
      data: request,
      success: function (res) {
        console.log("res::", JSON.stringify(res));
        sendResponse(res);
      },
    });
  }
  if (request.postID) {
    $.ajax({
      url:
        "https://pidhomes.ca/wp-content/themes/realhomes-child-2/db/data.php",
      method: "post",
      data: request,
      success: function (res) {
        console.log(res);
        $('input[name="textbox"]').val(
          JSON.stringify(res) + ":: connect to MySQL successfully!"
        );
        sendResponse(res);
      },
      error: function (e) {
        sendResponse("error");
      },
    });
  }
  if (request.areaCode && !request.saveData) {
    // if (!request.saveData) {
    //   $.ajax({
    //     url: "http://localhost/pidrealty4/wp-content/themes/realhomes-child-3/db/data.php",
    //     method: "post",
    //     data: request,
    //     success: function (res) {
    //       console.log(res);
    //       sendResponse(res);
    //     },
    //   });
    // }
    getStatCode(request).then((res) => sendResponse(res));
  }
  if (request.saveData) {
    if (request.saveData) {
      // $.ajax({
      //   url: request.saveURL,
      //   method: "post",
      //   data: request,
      //   success: function (res) {
      //     console.log(res);
      //     sendResponse(res);
      //   },
      // });

      saveStatData(request).then((res) => sendResponse(res));
    }
  }
  if (request.action && request.action === "updateStatCode") {
    updateStatCode(request).then((res) => sendResponse(res));
  }
  return true;
});

async function getStatCode(postData) {
  //areaCode -> statCode, example: VPMCP -> 5243
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  };
  const url =
    "http://localhost/pidrealty4/wp-content/themes/realhomes-child-3/db/data.php";
  const res = await fetch(url, options);
  const statCode = await res.json();
  return Promise.resolve(statCode);
}

async function updateStatCode(postData) {
  //areaCode, groupCode -> statCode Availability, example: All -> 0
  const options = {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  };
  const url =
    "http://localhost/pidrealty4/wp-content/themes/realhomes-child-3/db/updateStatCode.php";
  const res = await fetch(url, options);
  const updateResult = await res.json();
  return Promise.resolve(updateResult);
}

async function saveStatData(postData) {
  // place the stat data from StatsCentre to MySQL Database Table
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  };
  const url = postData.saveURL;
  let res = await fetch(url, options); // PHP should return json object, by json_decode()
  const saveDataResult = await res.json();
  console.log(
    `${postData.areaCode}:${postData.propertyGroup}:${saveDataResult}`
  );
  return Promise.resolve(saveDataResult);
}

chrome.browserAction.onClicked.addListener(function (activeTab) {
  chrome.tabs.create(
    {
      url: chrome.runtime.getURL("newtab.html"),
    },
    function (tab) {
      chrome.tabs.executeScript(tab.id, {
        code: 'document.body.style.backgroundColor="green"',
      });
    }
  );
});

var GoogleFinRefreshCounter = 1;
//reset the Counter::
chrome.storage.local.set(
  {
    GoogleFinRefreshCounter: GoogleFinRefreshCounter,
  },
  () => {
    console.log(GoogleFinRefreshCounter);
  }
);
