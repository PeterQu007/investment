const SAVE_URL_LOCAL =
  "http://localhost/pidrealty4/wp-content/themes/realhomes-child-3/db/saveStatData.php";
const SAVE_URL_REMOTE =
  "https://pidhomes.ca/wp-content/themes/realhomes-child-3/db/saveStatData.php";
// ERROR MESSAGES
const ERROR_MESSAGE_NO_DATA = "warning: no stats data, try again!";
const ERROR_MESSAGE_DATA_FATAL = "fatal error: data server fatal error";
const ERROR_MESSAGE_DATA_FAILED = "dataRequest error: data request failed";
const ERROR_MESSAGE_NO_ERROR = "";
const ERROR_MESSAGE_DATA_OK = "data request succeed";
const ERROR_MESSAGE_NO_STAT_DATA = "NO_STATS_DATA";

class MarketStats {
  constructor() {
    this.statCode = ""; // an area code provide by statsCentre, data is stored in MYSQL table: wp_pid_stats_code
    this.areaCode = "";
    this.propertyGroup = "";
    this.deleteOldData = false;
    this.error = new Error(ERROR_MESSAGE_NO_ERROR);
    this.areaQuantityEveryUpdate = 1;
    this.htmlDiv = $("#infosparksTarget");
    this.htmlDivQuickStats = $("div.quickStats");
    this.htmlFooter = $("footer");
    this.htmlAcInput = $(`div.inputWrap input.acInput`)[0];
    this.htmlFooter.remove();
    this.selectedOptions = {
      calc: "monthly",
      dq: "5035#0=|", // area code(statCode) + group code
      m: "hpi",
      min: 1,
      period: "3",
      view: "100",
    };
    this.selectedOptions_monthly_Update = {
      calc: "monthly",
      dq: "5035#0=|",
      m: "hpi",
      min: 1,
      period: "1",
      view: "100",
    };
    this.globalRequestParams = {
      ac: "f7b8525e800647a5aab99bfa9c2bb2f7",
      cid: "D6CFF8B05780494FB914B1A270A55F0F",
      s: "b23a1bcecaa648dea9ce46946b16d062",
    };
    this.saveURL = "";
    // read monthly update status:
    chrome.storage.local.get(
      ["iAreaCodePointer", "areaQuantityEveryUpdate"],
      (xInfo) => {
        this.iAreaCodePointer = xInfo.iAreaCodePointer;
        this.areaQuantityEveryUpdate = xInfo.areaQuantityEveryUpdate
          ? xInfo.areaQuantityEveryUpdate
          : this.areaQuantityEveryUpdate;
        // set events
        this.ms_events_options();
        this.ms_events_loadStats();
      }
    );
  }

  // events
  ms_events_options() {
    $("body").on("DOMSubtreeModified", "div.quickStats", () => {
      if (!this.htmlDivQuickStats || this.htmlDivQuickStats.length == 0) {
        this.htmlDivQuickStats = $(`div.quickStats`);
      }
      var htmlAreaLabel = $(`<h5 id="pid_areaLabel">Area Name</h5>`);
      var htmlDivRadios = $(
        `<div id="pid_save_radios" style="display: block"></div>`
      );
      var htmlSaveForm = $(
        `<form name="pidSaveForm" style="display:block"></form`
      );
      var htmlSaveFieldSet = $(
        `<fieldset style="display: inline-block"></fieldset>`
      );
      var htmlRadioLocal = $(
        `<input type="radio" id="pid_save_stat_local" class="SaveRadios" name="SaveRadios" value="save local" checked="checked">`
      );
      var htmlRadioLocalLabel = $(
        `<label for="pid_save_stat_local" class="SaveRadios">Save Local</label>`
      );
      var htmlRadioRemote = $(
        `<input type="radio" id="pid_save_stat_remote" class="SaveRadios" name="SaveRadios" value="save remote">`
      );
      var htmlRadioRemoteLabel = $(
        `<label for="pid_save_stat_remote" class="SaveRadios">Save Remote</label>`
      );
      var htmlCheckboxStop = $(
        `<input type="checkbox" id="pid_update_stat_stop" class="stopUpdateStats" name="StopUpdateStats" value="StopUpdateStats">`
      );
      var htmlCheckboxStopLabel = $(
        `<label for="pid_update_stat_stop" class="stopUpdateStats">Stop Monthly Update</label>`
      );
      // option: delete old data or not
      let htmlCheckboxReloadData = $(
        `<input type="checkbox" id="pid_reload_stats" class="stopUpdateStats" name="ReloadStats" value="ReloadStats">`
      );
      let htmlCheckboxReloadDataLabel = $(`<label for="pid_reload_stats" class="stopUpdateStats">Reload Stats</label>
      `);
      // option: monthly updates start over, set pointer to 0
      let htmlResetAreaPointer = $(
        `<input type="button" id="pid_reset_area_pointer" value="Reset Area Pointer">`
      );

      let htmlAreaQuantityEveryUpdate = $(
        `<input type="text" id="pid_area_quantity_every_update" value=${this.areaQuantityEveryUpdate}>`
      );
      let htmlResetAreaPointerNumber = $(
        `<input type="text" id="pid_reset_area_point_number" value="0">`
      );

      if ($("#pid_save_radios").length == 0) {
        let htmlFormRow = $(`<div class = "formrow"></div>`);
        htmlFormRow.append(htmlRadioLocal);
        htmlFormRow.append(htmlRadioLocalLabel);
        htmlSaveFieldSet.append(htmlFormRow);
        let htmlFormRow2 = $(`<div class = "formrow"></div>`);
        htmlFormRow2.append(htmlRadioRemote);
        htmlFormRow2.append(htmlRadioRemoteLabel);
        htmlSaveFieldSet.append(htmlFormRow2);
        let htmlFormRow3 = $(`<div class = "formrow"></div>`);
        htmlFormRow3.append(htmlCheckboxStop);
        htmlFormRow3.append(htmlCheckboxStopLabel);
        htmlSaveFieldSet.append(htmlFormRow3);
        let htmlFormRow4 = $(`<div class = "formrow"></div>`);
        htmlFormRow4.append(htmlCheckboxReloadData);
        htmlFormRow4.append(htmlCheckboxReloadDataLabel);
        htmlSaveFieldSet.append(htmlFormRow4);
        let htmlFormRow6 = $(
          `<div class = "formrow"><label for='pid_area_quantity_every_update'>Update # every time<label></div>`
        );
        htmlFormRow6.append(htmlAreaQuantityEveryUpdate);
        htmlSaveFieldSet.append(htmlFormRow6);
        let htmlFormRow7 = $(
          `<div class = "formrow"><label for='pid_reset_area_point_number'>Reset to Pointer #<label></div>`
        );
        htmlFormRow7.append(htmlResetAreaPointerNumber);
        htmlSaveFieldSet.append(htmlFormRow7);
        let htmlFormRow5 = $(`<div class = "formrow"></div>`);
        htmlFormRow5.append(htmlResetAreaPointer);
        htmlSaveFieldSet.append(htmlFormRow5);

        htmlSaveForm.append(htmlSaveFieldSet);
        htmlDivRadios.append(htmlAreaLabel);
        htmlDivRadios.append(htmlSaveForm);
        this.htmlDivQuickStats.append(htmlDivRadios);
        this.saveURL = SAVE_URL_LOCAL;
        var rad = document.getElementsByClassName("SaveRadios");
        for (var i = 0; i < rad.length; i++) {
          rad[i].addEventListener("change", (e) => {
            switch (e.target.value.trim()) {
              case "save local":
                this.saveURL = SAVE_URL_LOCAL;
                break;
              case "save remote":
                this.saveURL = SAVE_URL_REMOTE;
                break;
            }
            console.log(this.saveURL);
          });
        }
      }
      // add reset area pointer event
      $("#pid_reset_area_pointer").on("click", () => {
        this.iAreaCodePointer = parseInt(
          $("#pid_reset_area_point_number").val()
        );
        chrome.storage.local.set(
          { iAreaCodePointer: this.iAreaCodePointer },
          () => {
            // move area pointer to 0 /beginning of the list
            // start over
            let htmlButtonUpdate = $("#pid_update_stat");
            htmlButtonUpdate.val(
              `Monthly Update (${this.iAreaCodePointer} | ${AreaCodes.length})`
            );
          }
        );
      });
      // option for delete old data or not
      $("#pid_reload_stats").click((e) => {
        if ($(e.target).is(":checked")) {
          this.deleteOldData = true;
        } else {
          this.deleteOldData = false;
        }
      });
      // option for how many areas in one stats update
      $("#pid_area_quantity_every_update").keypress((e) => {
        var keycode = e.keyCode ? e.keyCode : e.which;
        if (keycode == "13") {
          this.areaQuantityEveryUpdate = parseInt($(e.target).val());
          chrome.storage.local.set(
            { areaQuantityEveryUpdate: this.areaQuantityEveryUpdate },
            () => {
              console.log(
                "New this.areaQuantityEveryUpdate Save to Local Storage"
              );
            }
          );
        }
      });
    });
  }
  // set up request stats buttons: Read All, Read Detached, Read Townhouse, Read Condo, Monthly Update
  ms_events_loadStats() {
    $("body").on("DOMSubtreeModified", "div.quickStats", () => {
      if (!this.htmlDivQuickStats || this.htmlDivQuickStats.length == 0) {
        this.htmlDivQuickStats = $(`div.quickStats`);
      }

      var htmlButtonAll = $(
        `<input type="button" id="pid_read_stat_All" value="Read All">`
      );
      var htmlButtonDetached = $(
        `<input type="button" id="pid_read_stat_Detached" value="Read Detached">`
      );
      var htmlButtonTownhouse = $(
        `<input type="button" id="pid_read_stat_Townhouse" value="Read Townhouse">`
      );
      var htmlButtonCondo = $(
        `<input type="button" id="pid_read_stat_Condo" value="Read Condo">`
      );

      var htmlButtonUpdate = $(
        `<input type="button" id="pid_update_stat" value="Monthly Update (${this.iAreaCodePointer} | ${AreaCodes.length})">`
      );

      if ($("#pid_read_stat_All").length == 0) {
        this.htmlDivQuickStats.append(htmlButtonAll);
        // set event for 'Real All' Button
        $("#pid_read_stat_All").on("click", () => {
          console.log("ms clicked");
          let areaCode = this.getAreaCode();
          let groupCode = "#0=|";
          this.searchStatCode(areaCode, groupCode);
        });
      }
      if ($("#pid_read_stat_Detached").length == 0) {
        this.htmlDivQuickStats.append(htmlButtonDetached);
        // set event for 'Read Detached' Button
        $("#pid_read_stat_Detached").on("click", () => {
          console.log("ms clicked");
          var areaCode = this.getAreaCode();
          var groupCode = "#0=pt:2|";
          this.searchStatCode(areaCode, groupCode);
        });
      }
      if ($("#pid_read_stat_Townhouse").length == 0) {
        this.htmlDivQuickStats.append(htmlButtonTownhouse);
        // set event for 'Read Townhouse' Button
        $("#pid_read_stat_Townhouse").on("click", () => {
          console.log("ms clicked");
          var areaCode = this.getAreaCode();
          var groupCode = "#0=pt:8|";
          this.searchStatCode(areaCode, groupCode);
        });
      }
      if ($("#pid_read_stat_Condo").length == 0) {
        this.htmlDivQuickStats.append(htmlButtonCondo);
        // set event for 'Read Condo' Button
        $("#pid_read_stat_Condo").on("click", () => {
          console.log("ms clicked");
          var areaCode = this.getAreaCode();
          var groupCode = "#0=pt:4|";
          this.searchStatCode(areaCode, groupCode);
        });
      }
      if ($("#pid_update_stat").length == 0) {
        this.htmlDivQuickStats.append(htmlButtonUpdate);
        // set event for 'Monthly Update(#|#)' Button
        $("#pid_update_stat").on("click", () => this.monthlyStatUpdate());
      }
      // area code change
      if ($(`div.inputWrap input.acInput`).length > 0) {
        if (!this.htmlAcInput) {
          this.htmlAcInput = $(`div.inputWrap input.acInput`)[0];
          $(this.htmlAcInput).on(
            "input change keydown keypress keyup mousedown click mouseup focusout",
            (e) => {
              // console.log("area code changed: ", e.target.value);
            }
          );
        } else {
          if ($("#pid_areaLabel")) {
            if ($("#pid_areaLabel").text() != this.htmlAcInput.value) {
              $("#pid_areaLabel").text(this.htmlAcInput.value);
              this.copyTextToClipboard(this.htmlAcInput.value);
              console.log(this.htmlAcInput.value);
            }
          }
        }
      }
    });
  }

  // stat data monthly update
  monthlyStatUpdate() {
    console.log("update button clicked");
    const groupCodes = ["#0=|", "#0=pt:2|", "#0=pt:8|", "#0=pt:4|"];
    let i = 0;
    let iAreaCodePointer = 0;
    let areaQuantityEveryUpdate = parseInt(
      $("#pid_area_quantity_every_update").val()
    );

    // 1. get the current iAreaCodePointer from chrome.storage.local
    // 2. start monthly stats update process
    chrome.storage.local.get(["iAreaCodePointer"], (res) =>
      startMonthlyUpdates.call(this, res)
    );

    function sendMessagePromise(i) {
      return new Promise((res, rej) => {
        chrome.storage.local.set({ iAreaCodePointer: i }, (response) => {
          res(response);
        });
      });
    }

    async function startMonthlyUpdates(xInfo) {
      iAreaCodePointer = xInfo.iAreaCodePointer ? xInfo.iAreaCodePointer : 0; // use to control the loop

      let areaCode = AreaCodes[i];
      this.error = new Error(ERROR_MESSAGE_NO_ERROR);

      // loop all AreaCodes
      for (let j = 0; j < areaQuantityEveryUpdate; j++) {
        areaCode = AreaCodes[iAreaCodePointer + j]; // j is used to move areaCode pointer, i is the base areaCode Pointer

        //loop all groups
        for (let index = 0; index < groupCodes.length; index++) {
          let groupCode = groupCodes[index];
          let statData;
          // 1. get statCode from MySQL Database table
          try {
            this.statCode = await this.searchStatCodeForMonthlyUpdate(
              areaCode,
              groupCode
            );
          } catch (err) {
            this.error = err;
            console.log(areaCode, groupCode, err);
            continue;
          }

          this.areaCode = areaCode;
          this.selectedOptions_monthly_Update.dq = this.statCode + groupCode;
          // 2. get the statData from stats Centre API
          try {
            statData = await this.processDataRequest_new(
              this.selectedOptions_monthly_Update,
              this.globalRequestParams
            );
          } catch (err) {
            this.error = err;
            console.log(areaCode, groupCode, err.message);
            continue;
          }

          // 3. save the statData to MySql Database
          try {
            let saveDataResult = await this.saveData(statData);
            console.log(saveDataResult);
          } catch (err) {
            this.error = err;
            console.log(areaCode, groupCode, err);
            continue;
          }
        }

        // Loop: go for next areaCode
        console.log("Loop Counter: ", j);
        if (
          this.error.message === ERROR_MESSAGE_NO_ERROR ||
          this.error.message.indexOf("fatal") === -1
        ) {
          // if there is no fatal errors, set next iAreaCodePointer to chrome local storage
          let saveAreaPointerResult = await sendMessagePromise(
            iAreaCodePointer + 1 + j
          );
          // update the button message
          this.iAreaCodePointer++;
          let htmlButtonUpdate = $("#pid_update_stat");
          htmlButtonUpdate.val(
            `Monthly Update (${this.iAreaCodePointer} | ${AreaCodes.length})`
          );
        }
      }
      console.log("Stats Data Request Task All Done!");
    }
  }
  // methods
  getAreaCode() {
    // Read Area Code from the Selection Box on StatsCenter Web Page
    if (!this.htmlAcInput) {
      this.htmlAcInput = $(`div.inputWrap input.acInput`)[0];
    }
    var areaCode = this.htmlAcInput.value;
    var cityName = "";
    var areaCodeLastPosition = areaCode.indexOf("-");
    if (areaCodeLastPosition > 0) {
      cityName = areaCode
        .substr(
          areaCodeLastPosition + 1,
          areaCode.length - areaCodeLastPosition
        )
        .trim();
      areaCode = areaCode.substr(0, areaCodeLastPosition - 1).trim();
    }
    // Correct some areaCode
    // Burnaby & Vancouver City code VBU , VVA
    if (areaCode == "V") {
      areaCode = "V" + cityName.substr(0, 2);
      areaCode = areaCode.toUpperCase();
    }
    // Abbotsford City Code F70 -> F70A ( F70 for Polar Langley)
    if (areaCode == "F70" && cityName == "Abbotsford") {
      areaCode = "F70A";
    }
    // Langley City Code F60 -> F60A ( F60 for MurrayVille Langley)
    // 1: update wp_pid_cities
    // 2: update wp_pid_stats_code
    // 3: update wp_pid_neighborhoods
    if (areaCode == "F60" && cityName == "Langley") {
      areaCode = "F60A";
    }
    // Mission F80 -> F80A
    if (areaCode == "F80" && cityName == "Mission") {
      areaCode = "F80A";
    }
    // repair white Rock, F54 -> F54A
    if (areaCode == "F54" && cityName == "White Rock") {
      areaCode = "F54A";
    }
    console.log(areaCode);
    return areaCode;
  }

  processDataRequest(selectedOptions, callback, globalRequestParams) {
    var requestData;
    var currentDataRequest;
    var backendDataUrl = "/infoserv/sparks";
    var self = this;

    requestData = $.extend({ op: "d" }, selectedOptions, globalRequestParams);

    // Function for sending request to statsCentre API
    var sendRequest = function (params) {
      if (currentDataRequest) currentDataRequest.abort();

      currentDataRequest = $.ajax({
        type: "POST",
        url: backendDataUrl,
        dataType: "json",
        data: params,
        success: handleResult,
      }).fail(function (jqXHR, textStatus, errorThrown) {
        if (textStatus !== "abort") {
          var response = jQuery.parseJSON(jqXHR.responseText);
          callback(null, true, response);
        }
      });
    };

    // Function for handling result
    var handleResult = function (data) {
      if (data.ResponseType === "MULTIPART") {
        var nextPart = data.TotalParts - data.RemainingParts;

        if (data.RemainingParts !== 0) {
          var newRequestData = $.extend(
            {
              nxt: nextPart,
              rid: data.ResponseID,
            },
            requestData
          );

          // Send request for more data
          sendRequest(newRequestData);
        } else {
          currentDataRequest = null;
        }
      }

      // Call callback with payload (if defined)
      var statData = {
        saveData: true,
        areaCode: self.areaCode,
        propertyGroup: self.propertyGroup,
        saveURL: self.saveURL,
        statData: data.Payload,
        deleteOldData: self.deleteOldData,
      };

      if (callback) {
        callback(statData, currentDataRequest == null);
      }
    };

    // Initial send request
    sendRequest(requestData);
  }

  showData(data) {
    console.log(data);
  }

  postData(data) {
    if (!data) {
      console.log("stat read error!");
    }
    console.log(data);
    var title = "test";
    var id = "100";
    // var ticker = { ticker: "HOT.UN" };
    // var reits = {};
    var marketData = { postTitle: title, postID: id };
    chrome.runtime.sendMessage(marketData, (res) => {
      console.log(res);
    });
  }

  // Search Stat Code by Area Code
  searchStatCode(areaCode, groupCode = "") {
    switch (groupCode) {
      case "#0=|":
        this.propertyGroup = "All";
        break;
      case "#0=pt:2|":
        this.propertyGroup = "Detached";
        break;
      case "#0=pt:8|":
        this.propertyGroup = "Townhouse";
        break;
      case "#0=pt:4|":
        this.propertyGroup = "Apartment";
        break;
    }
    var AreaCode = {
      areaCode: areaCode,
      propertyType: this.propertyGroup,
      saveData: false,
    };
    chrome.runtime.sendMessage(AreaCode, (res) => {
      console.log(res, ",", AreaCode.areaCode);
      this.statCode = res.replace(/[\W_]+/g, "");
      this.areaCode = AreaCode.areaCode;
      if (this.statCode) {
        this.selectedOptions.dq = this.statCode + groupCode;
        this.processDataRequest(
          this.selectedOptions,
          this.saveData.bind(this),
          this.globalRequestParams
        );
      }
    });
  }

  async searchStatCodeForMonthlyUpdate(areaCode, groupCode = "") {
    let date = new Date();
    let statCode;
    // Translate the StatsCentre group code to Property type
    switch (groupCode) {
      case "#0=|":
        this.propertyGroup = "All";
        break;
      case "#0=pt:2|":
        this.propertyGroup = "Detached";
        break;
      case "#0=pt:8|":
        this.propertyGroup = "Townhouse";
        break;
      case "#0=pt:4|":
        this.propertyGroup = "Apartment";
        break;
    }
    var AreaCode = {
      areaCode: areaCode,
      propertyType: this.propertyGroup,
      monthlyUpdate: true,
      statMonth: date.getMonth(),
      statYear: date.getFullYear(),
      saveData: false,
    };

    let searchRes = await sendMessagePromise.call(this, AreaCode);

    if (typeof searchRes === "string" && searchRes.indexOf("error") > -1) {
      // catch errors
      return Promise.reject(searchRes);
    }
    // normalize the statCode
    if (typeof searchRes === "string") {
      statCode = searchRes.replace(/[\W_]+/g, ""); // remove all non-word character[^a-zA-Z0-9_] and '_' from the result
    } else {
      statCode = searchRes;
    }
    // return promise value
    return Promise.resolve(statCode);

    // Promise Functions Wrapper for chrome.runtime.sendMessage
    function sendMessagePromise(AreaCode) {
      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(AreaCode, async (res) => {
          if (res > 0) {
            resolve(res);
          } else {
            reject("error: AreaCode - StatCode Could not be find!");
          }
        });
      });
    }
  }

  async processDataRequest_new(selectedOptions, globalRequestParams) {
    const backendDataUrl = "/infoserv/sparks";
    var requestData;
    var currentDataRequest;
    var self = this;
    var statData;

    requestData = $.extend({ op: "d" }, selectedOptions, globalRequestParams);
    // Initial send request
    let statInfo;
    let statInfoTemp = [];
    let requestTries = 2; // two tries: 0 , 1
    try {
      // set 3 tries, if stats data is not correct try once more
      for (let i = 0; i < requestTries; i++) {
        statInfoTemp = [];
        statInfo = await sendRequest(requestData);
        if (statInfo instanceof Error) {
          if (i === requestTries - 1) {
            statInfo.message = ERROR_MESSAGE_DATA_FAILED;
            console.log(`Last DataRequest Try:`, statInfo.message);
          } else {
            console.log(`[${i + 1}] DataRequest Try:`, statInfo.message);
          }
        } else {
          console.log(ERROR_MESSAGE_DATA_OK);
          break; // if no error, jump out the Loop
        }
      }
    } catch (err) {
      // fatal errors:
      console.log("ProcessDataRequest Fatal Error:", err.message);
      statInfo = new Error(ERROR_MESSAGE_DATA_FATAL);
    }

    return new Promise((resolve, reject) => {
      if (statInfo instanceof Error) {
        this.error = new Error(ERROR_MESSAGE_DATA_FAILED);
        reject(statInfo);
      } else {
        resolve(statInfo);
      }
    });

    //#region Support Functions
    // Function for sending request to statsCentre API
    function sendRequest(postData) {
      if (currentDataRequest) currentDataRequest.abort();

      return new Promise((res, rej) => {
        currentDataRequest = $.ajax({
          type: "POST",
          url: backendDataUrl,
          dataType: "json",
          data: postData,
          async: true, //inhibit async ajax call
          success: ajaxResolve,
          error: ajaxReject,
        });

        // Function for handling result of multiparts
        async function ajaxResolve(data, textStatus, jqXHR) {
          if (data.ResponseType === "MULTIPART") {
            var nextPart = data.TotalParts - data.RemainingParts;

            if (data.RemainingParts !== 0) {
              var newRequestData = $.extend(
                {
                  nxt: nextPart,
                  rid: data.ResponseID,
                },
                requestData
              );

              // Send request for more data
              statInfoTemp = statInfoTemp.concat(data.Payload);
              let moreDataPart = await sendRequestForMoreData(newRequestData);
              console.log(moreDataPart);
              statInfoTemp = statInfoTemp.concat(moreDataPart.Payload);
            } else {
              // close the data request connection
              currentDataRequest = null;
              // concat last data part
              statInfoTemp = statInfoTemp.concat(data.Payload);
            }
          }

          // check if statInfoTemp contains data: status "OK" or "NO_DATA"?
          // status is inside Type: "SERIES_DATA"
          // 4 Types are: "SERIES_DATA","SERIES_CATEGORIES","DATA_PARTS","QUICKSTATS"
          // Loop to get Type SERIES_DATA
          let SERIES_DATA = statInfoTemp.filter(
            (statInfo) => statInfo.Type === "SERIES_DATA"
          );
          // data status should be "OK" for a normal request
          let status =
            SERIES_DATA.length > 0
              ? SERIES_DATA[0].Status
              : ERROR_MESSAGE_NO_STAT_DATA;
          let areaName =
            SERIES_DATA.length > 0
              ? SERIES_DATA[0].Name
              : ERROR_MESSAGE_NO_STAT_DATA;
          let seriesData = SERIES_DATA.length > 0 ? SERIES_DATA[0].Data : [];
          // precess the data payload
          // contains 4 arrays - normal state
          // contains 2 arrays - if no summary data, normal state
          // contains 2 arrays - but only summary data, error occurs
          let returnDataLength = statInfoTemp.length;
          statData = {
            saveData: true,
            areaCode: self.areaCode,
            propertyGroup: self.propertyGroup,
            saveURL: self.saveURL,
            statData: statInfoTemp, // wrap stat data
            deleteOldData: self.deleteOldData,
          };
          console.log(
            statData.areaCode,
            areaName,
            statData.propertyGroup,
            status,
            seriesData
          );

          if (
            ((returnDataLength === 2 &&
              statInfoTemp[1].Type === "SERIES_DATA") ||
              returnDataLength === 4) &&
            status === "OK"
          ) {
            console.log("resolve stat data");
            res(statData); // resolved promise
          } else {
            // server does not return correct stats data
            // do not send reject error info, try again
            statInfoTemp = []; // rest statInfoTemp container
            let err = new Error(ERROR_MESSAGE_NO_DATA);
            console.warn("No Data Returned");
            res(err);
          }
        }

        // Function for handling fatal error
        function ajaxReject(jqXHR, textStatus, errorThrown) {
          if (textStatus !== "abort") {
            var response = jQuery.parseJSON(jqXHR.responseText);
            let errMsg = ERROR_MESSAGE_DATA_FATAL;
            let err = new Error(errMsg);
            rej(err); // to do list: no callback any more
          }
        }
      });
    }

    function sendRequestForMoreData(postData) {
      if (currentDataRequest) currentDataRequest.abort();

      return new Promise((res, rej) => {
        currentDataRequest = $.ajax({
          type: "POST",
          url: backendDataUrl,
          dataType: "json",
          data: postData,
          async: true, //inhibit async ajax call
          success: ajaxResolve,
          error: ajaxReject,
        });

        // Function for handling result of multiparts
        async function ajaxResolve(data, textStatus, jqXHR) {
          res(data);
        }

        // Function for handling fatal error
        function ajaxReject(jqXHR, textStatus, errorThrown) {
          if (textStatus !== "abort") {
            var response = jQuery.parseJSON(jqXHR.responseText);
            let errMsg = ERROR_MESSAGE_DATA_FATAL;
            let err = new Error(errMsg);
            rej(err); // to do list: no callback any more
          }
        }
      });
    }

    //#endregion
  }

  async saveData(statData) {
    if (!statData.statData) {
      console.log("stat read error!");
      return;
    }
    let saveResult = await sendMessagePromise(statData);
    return Promise.resolve(saveResult);

    // Promise wrapper for chrome.runtime.sendMessage()
    function sendMessagePromise(statData) {
      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(statData, (res) => {
          res = res.trim();
          resolve(res);
        });
      });
    }
  }

  copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(
      function () {
        console.log("Async: Copying to clipboard was successful!");
      },
      function (err) {
        console.log("Async: Could not copy text: ", err);
      }
    );
  }
}

$(document).ready(function () {
  const ms = new MarketStats();
});

const AreaCodes = [
  "FVREB",
  "REBGV",
  "F10",
  "F20",
  "F30",
  "F30A",
  "F40",
  "F50",
  "F54A",
  "F60",
  "F70A",
  "F80A",
  "VBU",
  "VVA",
  "VBD",
  "VBE",
  "VBN",
  "VBS",
  "VCQ",
  "VIS",
  "VLD",
  "VMR",
  "VNV",
  "VNW",
  "VPE",
  "VPI",
  "VPM",
  "VPQ",
  "VRI",
  "VSC",
  "VSQ",
  "VTW",
  "VVE",
  "VVW",
  "VWH",
  "VWV",
  "F6A",
  "F11",
  "F12",
  "F13",
  "F14",
  "F21",
  "F22",
  "F23",
  "F24",
  "F25",
  "F26",
  "F27",
  "F28",
  "F31",
  "F32",
  "F34",
  "F36",
  "F37",
  "F38",
  "F39",
  "F41",
  "F42",
  "F43",
  "F51",
  "F52",
  "F53",
  "F54",
  "F55",
  "F56",
  "F57",
  "F58",
  "F59",
  "F60",
  "F61",
  "F62",
  "F63",
  "F64",
  "F65",
  "F66",
  "F67",
  "F68",
  "F69",
  "F70",
  "F71",
  "F72",
  "F73",
  "F74",
  "F75",
  "F76",
  "F77",
  "F78",
  "F80",
  "F81",
  "F82",
  "F83",
  "F84",
  "F85",
  "F86",
  "F87",
  "F88",
  "VBDBD",
  "VBEBE",
  "VBECR",
  "VBEED",
  "VBNBP",
  "VBNCA",
  "VBNCB",
  "VBNCH",
  "VBNFH",
  "VBNGR",
  "VBNMO",
  "VBNOK",
  "VBNPC",
  "VBNSD",
  "VBNSF",
  "VBNSH",
  "VBNSI",
  "VBNVH",
  "VBNWH",
  "VBNWR",
  "VBSBB",
  "VBSBH",
  "VBSBK",
  "VBSBL",
  "VBSCP",
  "VBSDL",
  "VBSDP",
  "VBSFG",
  "VBSGT",
  "VBSGV",
  "VBSHG",
  "VBSME",
  "VBSOL",
  "VBSSC",
  "VBSSS",
  "VBSUD",
  "VCQBM",
  "VCQCC",
  "VCQCE",
  "VCQCH",
  "VCQCS",
  "VCQCW",
  "VCQCY",
  "VCQER",
  "VCQHC",
  "VCQHO",
  "VCQHP",
  "VCQMB",
  "VCQML",
  "VCQNC",
  "VCQNH",
  "VCQPR",
  "VCQRP",
  "VCQRS",
  "VCQSC",
  "VCQSV",
  "VCQUE",
  "VCQWP",
  "VCQWS",
  "VISGB",
  "VISGL",
  "VISMA",
  "VISOT",
  "VISPE",
  "VISSS",
  "VISST",
  "VLDDM",
  "VLDEA",
  "VLDHA",
  "VLDHO",
  "VLDLA",
  "VLDLE",
  "VLDNG",
  "VLDPG",
  "VLDTB",
  "VLDWI",
  "VMRAL",
  "VMRCO",
  "VMREC",
  "VMRNE",
  "VMRNO",
  "VMRNW",
  "VMRSV",
  "VMRSW",
  "VMRTH",
  "VMRWB",
  "VMRWC",
  "VMRWH",
  "VNVBD",
  "VNVBL",
  "VNVBR",
  "VNVCA",
  "VNVCL",
  "VNVCV",
  "VNVCY",
  "VNVDC",
  "VNVDE",
  "VNVDO",
  "VNVED",
  "VNVFH",
  "VNVGW",
  "VNVHS",
  "VNVIA",
  "VNVIR",
  "VNVLL",
  "VNVLV",
  "VNVLY",
  "VNVMC",
  "VNVNG",
  "VNVNL",
  "VNVPH",
  "VNVPN",
  "VNVPP",
  "VNVQU",
  "VNVRP",
  "VNVSY",
  "VNVTE",
  "VNVUD",
  "VNVUL",
  "VNVWL",
  "VNVWP",
  "VNVWS",
  "VNVWT",
  "VNWCH",
  "VNWDT",
  "VNWFV",
  "VNWGN",
  "VNWMP",
  "VNWNA",
  "VNWQB",
  "VNWQP",
  "VNWQY",
  "VNWSA",
  "VNWTH",
  "VNWUP",
  "VNWWE",
  "VPEBI",
  "VPEDE",
  "VPEDY",
  "VPEIL",
  "VPELL",
  "VPEMC",
  "VPEOR",
  "VPEPC",
  "VPEPE",
  "VPEPM",
  "VPEWE",
  "VPICM",
  "VPIMM",
  "VPINM",
  "VPISM",
  "VPIWM",
  "VPMAN",
  "VPMBL",
  "VPMBS",
  "VPMCP",
  "VPMGL",
  "VPMHM",
  "VPMHW",
  "VPMIO",
  "VPMMM",
  "VPMNS",
  "VPMPM",
  "VPQBL",
  "VPQCE",
  "VPQCI",
  "VPQGL",
  "VPQLM",
  "VPQLP",
  "VPQMH",
  "VPQOH",
  "VPQRD",
  "VPQWA",
  "VRI10",
  "VRI11",
  "VRI12",
  "VRI13",
  "VRI20",
  "VRI21",
  "VRI22",
  "VRI23",
  "VRI30",
  "VRI31",
  "VRI32",
  "VRI40",
  "VRI41",
  "VRI42",
  "VRI43",
  "VRI50",
  "VRI51",
  "VRI52",
  "VRI53",
  "VRI54",
  "VRI60",
  "VRI61",
  "VRI62",
  "VRI70",
  "VRI71",
  "VRI72",
  "VRI80",
  "VRI81",
  "VRI90",
  "VSCGB",
  "VSCGM",
  "VSCHB",
  "VSCKE",
  "VSCNE",
  "VSCPE",
  "VSCRC",
  "VSCSD",
  "VSQBB",
  "VSQBC",
  "VSQBR",
  "VSQDT",
  "VSQDV",
  "VSQGE",
  "VSQGH",
  "VSQHH",
  "VSQNY",
  "VSQPL",
  "VSQPV",
  "VSQRC",
  "VSQSR",
  "VSQTA",
  "VSQUH",
  "VSQUS",
  "VSQVC",
  "VTWBB",
  "VTWBG",
  "VTWCD",
  "VTWCT",
  "VTWEB",
  "VTWPH",
  "VTWTE",
  "VTWTN",
  "VVECH",
  "VVECO",
  "VVEDT",
  "VVEFR",
  "VVEFV",
  "VVEGW",
  "VVEHA",
  "VVEKL",
  "VVEKN",
  "VVEMN",
  "VVEMP",
  "VVERE",
  "VVERH",
  "VVESM",
  "VVEST",
  "VVESU",
  "VVESV",
  "VVEVI",
  "VVWAR",
  "VVWCA",
  "VVWCB",
  "VVWDT",
  "VVWDU",
  "VVWFA",
  "VVWFC",
  "VVWKE",
  "VVWKT",
  "VVWMH",
  "VVWMP",
  "VVWMR",
  "VVWOA",
  "VVWPG",
  "VVWQU",
  "VVWSC",
  "VVWSG",
  "VVWSH",
  "VVWSL",
  "VVWSW",
  "VVWUL",
  "VVWWE",
  "VVWYA",
  "VWHAM",
  "VWHAV",
  "VWHBA",
  "VWHBE",
  "VWHBH",
  "VWHBR",
  "VWHBT",
  "VWHCC",
  "VWHCE",
  "VWHCH",
  "VWHCR",
  "VWHEE",
  "VWHFJ",
  "VWHGL",
  "VWHNE",
  "VWHNO",
  "VWHRW",
  "VWHSC",
  "VWHSG",
  "VWHVI",
  "VWHWE",
  "VWHWG",
  "VWHWW",
  "VWVAL",
  "VWVAM",
  "VWVBP",
  "VWVBR",
  "VWVCA",
  "VWVCB",
  "VWVCD",
  "VWVCE",
  "VWVCP",
  "VWVCW",
  "VWVCY",
  "VWVDR",
  "VWVDU",
  "VWVEH",
  "VWVER",
  "VWVFC",
  "VWVGL",
  "VWVGM",
  "VWVHB",
  "VWVHS",
  "VWVLB",
  "VWVOC",
  "VWVPA",
  "VWVPR",
  "VWVPV",
  "VWVQU",
  "VWVRR",
  "VWVSC",
  "VWVSH",
  "VWVUC",
  "VWVWB",
  "VWVWC",
  "VWVWE",
  "VWVWH",
  "VWVWM",
];

/**
 * 

 */
