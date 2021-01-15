"use strict";

// Promise Wrapper for chrome.storage.local.set
// Save state to storage.local
function saveAreaCodePointerPromise(i) {
  return new Promise((res, rej) => {
    chrome.storage.local.set({ iAreaCodePointer: i }, (response) => {
      res(response);
    });
  });
}

// Promise Functions Wrapper for chrome.runtime.sendMessage
// Look up Stat_Code in terms of AreaCode from backend MySQL table wp_pid_stat_code
function searchStatCodePromise(AreaCodeInfo) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(AreaCodeInfo, async (statCodeInfo) => {
      // statCodeInfo include fields: stat_code and All, Detached, Townhouse, Apartment (stat data availabilities)
      if ("stat_code" in statCodeInfo || stateCodeInfo.stat_code) {
        resolve(statCodeInfo);
      } else {
        reject("error: AreaCode - StatCode Could not be find!");
      }
    });
  });
}

// Promise wrapper for chrome.runtime.sendMessage()
function sendMessagePromise(requestInfo) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(requestInfo, (res) => {
      resolve(res);
    });
  });
}

// Promise Wrapper for ajax call
// Fetch Stat Data from Stats Centre API
function ajaxStatDataPromise(requestData, currentDataRequest) {
  if (currentDataRequest) currentDataRequest.abort();
  const backendDataUrl = "/infoserv/sparks";
  let moreDataParts = [];

  let ajaxCall = new Promise((res, rej) => {
    currentDataRequest = $.ajax({
      type: "POST",
      url: backendDataUrl,
      dataType: "json",
      data: requestData,
      async: true, //enable/disable async ajax call
      success: (data, textStatus, jqXHR) =>
        ajaxResolve(data, textStatus, jqXHR, requestData, moreDataParts, res),
      error: (jqXHR, textStatus, error) =>
        ajaxReject(jqXHR, textStatus, error, requestData, moreDataParts, rej),
    });
  });

  return ajaxCall;
}

async function ajaxResolve(
  data,
  textStatus,
  jqXHR,
  requestData,
  moreDataParts,
  res
) {
  if (data.ResponseType === "MULTIPART") {
    var nextPart = data.TotalParts - data.RemainingParts;

    for (let i = data.RemainingParts; i > 0; i--) {
      console.warn(`${MORE_DATA_REMAINING}: ${data.RemainingParts}`);

      var newRequestData = $.extend(
        {
          nxt: nextPart,
          rid: data.ResponseID,
        },
        requestData
      );

      // Send request for more data
      moreDataParts = moreDataParts.concat(data.Payload);
      let moreDataPart = await ajaxStatDataPromise(newRequestData);
      moreDataParts = moreDataParts.concat(moreDataPart.Payload);
      // RemainingParts will passed from the inner call, its state is used to break the Loop
      if (moreDataPart.RemainingParts === 0) {
        data.Payload = moreDataParts;
        break;
      }
    }
    // resolve the assembled data
    res(data);
  }
}

// Function for handling fatal error
function ajaxReject(jqXHR, textStatus, error, requestData, moreDataParts, rej) {
  if (textStatus !== "abort") {
    var response = jQuery.parseJSON(jqXHR.responseText);
    let errMsg = ERROR_MESSAGE_DATA_FATAL;
    let err = new Error(errMsg);
    rej(err); // to do list: no callback any more
  }
}

// Process Stat Data
function processStatData(statDataParts) {
  let statDataInfo;

  // check if statInfoTemp contains data: status "OK" or "NO_DATA"?
  // status is inside Type: "SERIES_DATA"
  // 4 Types are: "SERIES_DATA","SERIES_CATEGORIES","DATA_PARTS","QUICKSTATS"
  // Loop to get Type SERIES_DATA
  let SERIES_DATA = statDataParts.filter(
    (statItem) => statItem.Type === "SERIES_DATA"
  );
  // data status should be "OK" for a normal request
  let status =
    SERIES_DATA.length > 0 ? SERIES_DATA[0].Status : ERROR_MESSAGE_NO_STAT_DATA;
  let areaName =
    SERIES_DATA.length > 0 ? SERIES_DATA[0].Name : ERROR_MESSAGE_NO_STAT_DATA;
  let seriesData = SERIES_DATA.length > 0 ? SERIES_DATA[0].Data : [];
  // precess the data payload
  // contains 4 arrays - normal state
  // contains 2 arrays - if no summary data, normal state
  // contains 2 arrays - but only summary data, error occurs
  let returnDataLength = statDataParts.length;
  statDataInfo = {
    saveData: true,
    areaCode: this.areaCode,
    propertyType: this.propertyType,
    saveURL: this.saveURL,
    statData: statDataParts, // wrap stat data
    deleteOldData: this.deleteOldData,
    action: "Save Stat Data",
    status: status,
    err: new Error(ERROR_MESSAGE_NO_ERROR),
  };
  console.log(statDataInfo.propertyType, areaName, status, seriesData);

  return new Promise((res, rej) => {
    if (
      ((returnDataLength === 2 && statDataParts[1].Type === "SERIES_DATA") ||
        returnDataLength === 4) &&
      status === "OK"
    ) {
      console.log(MSG_CORRECT_STAT_DATA);
      res(statDataInfo); // resolved promise
    } else {
      // server does not return correct stats data
      // do not send reject error info, try again
      if (status === "NO_DATA") {
        statDataInfo.err = new Error(ERROR_MESSAGE_NO_STAT_DATA);
        console.warn(
          `${statDataInfo.propertyType}: ${statDataInfo.err.message}`
        );
        res(statDataInfo);
      }
    }
  });
}
