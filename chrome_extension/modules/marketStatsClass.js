/***
 * User Interface Class for Market Stats Chrome Extension
 */
class MarketStatsUI {
  constructor() {
    this.htmlDiv = $("#infosparksTarget");
    this.htmlDivQuickStats = $("div.quickStats");
    this.htmlFooter = $("footer");
    this.htmlAcInput = $(`div.inputWrap input.acInput`)[0];
    this.htmlFooter.remove(); // remove the footer to increase visibility of useful contents

    // read monthly update status:
    chrome.storage.local.get(
      ["iAreaCodePointer", "areaQuantityEveryUpdate"],
      (xInfo) => {
        this.iAreaCodePointer = xInfo.iAreaCodePointer;
        this.areaQuantityEveryUpdate = xInfo.areaQuantityEveryUpdate
          ? xInfo.areaQuantityEveryUpdate
          : this.areaQuantityEveryUpdate;
      }
    );

    //Add Extension UI
    this.marketStatsUI();
    //Add Functionality to the Class
    this.marketStatsUpdate = new MarketStatsUpdate(SAVE_URL_LOCAL);
  }

  marketStatsUI() {
    //Monitor the DOM Tree of the main page of Stats Center
    $("body").on("DOMSubtreeModified", "div.quickStats", () => {
      if (!this.htmlDivQuickStats || this.htmlDivQuickStats.length == 0) {
        this.htmlDivQuickStats = $(`div.quickStats`);
      }
      let htmlAreaLabel = $(`<h5 id="pid_areaLabel">Area Name</h5>`);
      let htmlDivRadios = $(
        `<div id="pid_save_radios" style="display: block"></div>`
      );
      let htmlSaveForm = $(
        `<form name="pidSaveForm" style="display:block"></form`
      );
      let htmlSaveFieldSet = $(
        `<fieldset style="display: inline-block"></fieldset>`
      );
      let htmlRadioLocal = $(
        `<input type="radio" id="pid_save_stat_local" class="SaveRadios" name="SaveRadios" value="save local" checked="checked">
         <label for="pid_save_stat_local" class="SaveRadios">Save Local</label>
        `
      );
      let htmlRadioRemote = $(
        `<input type="radio" id="pid_save_stat_remote" class="SaveRadios" name="SaveRadios" value="save remote">
         <label for="pid_save_stat_remote" class="SaveRadios">Save Remote</label>
        `
      );
      let htmlCheckboxStop = $(
        `<input type="checkbox" id="pid_update_stat_stop" class="stopUpdateStats" name="StopUpdateStats" value="StopUpdateStats">
         <label for="pid_update_stat_stop" class="stopUpdateStats">Stop Monthly Update</label>
        `
      );
      // option: delete old data or not
      let htmlCheckboxReloadData = $(
        `<input type="checkbox" id="pid_reload_stats" class="stopUpdateStats" name="ReloadStats" value="ReloadStats">
         <label for="pid_reload_stats" class="stopUpdateStats">Reload Stats</label>
        `
      );
      // option: monthly updates start over, set pointer to 0
      let htmlResetAreaPointer = $(
        `<input type="button" id="pid_reset_area_pointer" value="Reset Area Pointer">`
      );
      let htmlResetAreaPointerNumber = $(
        `<input type="text" id="pid_reset_area_point_number" value="0">`
      );
      // option: set area quantity for every update
      let htmlAreaQuantityEveryUpdate = $(
        `<input type="text" id="pid_area_quantity_every_update" value=${this.areaQuantityEveryUpdate}>`
      );

      let htmlButtonAll = $(
        `<input type="button" id="pid_read_stat_All" value="Read All">`
      );
      let htmlButtonDetached = $(
        `<input type="button" id="pid_read_stat_Detached" value="Read Detached">`
      );
      let htmlButtonTownhouse = $(
        `<input type="button" id="pid_read_stat_Townhouse" value="Read Townhouse">`
      );
      let htmlButtonCondo = $(
        `<input type="button" id="pid_read_stat_Condo" value="Read Condo">`
      );
      let htmlButtonAllGroups = $(
        `<input type="button" id="pid_read_stat_All_Groups" value="Read All 4 Groups">`
      );
      let htmlButtonUpdate = $(
        `<input type="button" id="pid_update_stat" value="Monthly Update (${this.iAreaCodePointer} | ${AreaCodes.length})">`
      );

      if ($("#pid_save_radios").length == 0) {
        let htmlFormRow1 = $(`<div class = "formrow"></div>`);
        htmlFormRow1.append(htmlRadioLocal);
        htmlSaveFieldSet.append(htmlFormRow1);
        let htmlFormRow2 = $(`<div class = "formrow"></div>`);
        htmlFormRow2.append(htmlRadioRemote);
        htmlSaveFieldSet.append(htmlFormRow2);
        let htmlFormRow3 = $(`<div class = "formrow"></div>`);
        htmlFormRow3.append(htmlCheckboxStop);
        htmlSaveFieldSet.append(htmlFormRow3);
        let htmlFormRow4 = $(`<div class = "formrow"></div>`);
        htmlFormRow4.append(htmlCheckboxReloadData);
        htmlSaveFieldSet.append(htmlFormRow4);
        let htmlFormRow6 = $(
          `<div class = "formrow"><label for='pid_area_quantity_every_update'>Update # every time<label></div>`
        );
        htmlFormRow6.append(htmlAreaQuantityEveryUpdate);
        htmlSaveFieldSet.append(htmlFormRow6);
        let htmlFormRow7 = $(
          `<div class = "formrow"><label for='pid_reset_area_point_number'>Reset to AreaPointer #<label></div>`
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

        this.htmlDivQuickStats.append(htmlButtonAll);
        this.htmlDivQuickStats.append(htmlButtonDetached);
        this.htmlDivQuickStats.append(htmlButtonTownhouse);
        this.htmlDivQuickStats.append(htmlButtonCondo);
        this.htmlDivQuickStats.append(htmlButtonAllGroups);
        this.htmlDivQuickStats.append(htmlButtonUpdate);

        // Add events to the Controls
        this.marketStatsEvents();
      }
    });
  }

  marketStatsEvents() {
    let rads = document.getElementsByClassName("SaveRadios");
    for (var i = 0; i < rads.length; i++) {
      rads[i].addEventListener("change", (e) => {
        switch (e.target.value.trim()) {
          case "save local":
            this.marketStatsUpdate.saveURL = SAVE_URL_LOCAL;
            break;
          case "save remote":
            this.marketStatsUpdate.saveURL = SAVE_URL_REMOTE;
            break;
        }
      });
    }
    $("#pid_reset_area_pointer").on("click", () => {
      this.marketStatsUpdate.iAreaCodePointer = parseInt(
        $("#pid_reset_area_point_number").val()
      );
      chrome.storage.local.set(
        { iAreaCodePointer: this.marketStatsUpdate.iAreaCodePointer },
        () => {
          // move area pointer to 0 /beginning of the list
          // start over
          let htmlButtonUpdate = $("#pid_update_stat");
          htmlButtonUpdate.val(
            `Monthly Update (${this.marketStatsUpdate.iAreaCodePointer} | ${AreaCodes.length})`
          );
        }
      );
    });
    // option for delete old data or not
    $("#pid_reload_stats").click((e) => {
      if ($(e.target).is(":checked")) {
        this.marketStatsUpdate.deleteOldData = true;
      } else {
        this.marketStatsUpdate.deleteOldData = false;
      }
    });
    // option for how many areas in one stats update
    $("#pid_area_quantity_every_update").keypress((e) => {
      var keycode = e.keyCode ? e.keyCode : e.which;
      if (keycode == "13") {
        this.marketStatsUpdate.areaQuantityEveryUpdate = parseInt(
          $(e.target).val()
        );
        chrome.storage.local.set(
          {
            areaQuantityEveryUpdate: this.marketStatsUpdate
              .areaQuantityEveryUpdate,
          },
          () => {
            console.log(
              "New this.areaQuantityEveryUpdate Save to Local Storage"
            );
          }
        );
      }
    });

    // add functions for the command buttons
    // set event for 'Read All 4 Groups' Button
    $("#pid_read_stat_All_Groups").on("click", () => {
      let areaCode = this.getAreaCode();
      this.marketStatsUpdate.specAreaStatUpdate(
        StatsPeriod.max_update,
        areaCode
      );
    });
    // set event for 'Read All Property Type Group' Button
    $("#pid_read_stat_All").on("click", () => {
      let areaCode = this.getAreaCode();
      let groupCode = GetGroupCode("All");
      this.marketStatsUpdate.specGroupStatUpdate(
        StatsPeriod.max_update,
        areaCode,
        groupCode
      );
    });
    // set event for 'Read Detached' Button
    $("#pid_read_stat_Detached").on("click", () => {
      let areaCode = this.getAreaCode();
      let groupCode = GetGroupCode("Detached"); //"#0=pt:2|";
      this.marketStatsUpdate.specGroupStatUpdate(
        StatsPeriod.max_update,
        areaCode,
        groupCode
      );
    });
    // set event for 'Read Townhouse' Button
    $("#pid_read_stat_Townhouse").on("click", () => {
      let areaCode = this.getAreaCode();
      let groupCode = GetGroupCode("Townhouse");
      this.marketStatsUpdate.specGroupStatUpdate(
        StatsPeriod.max_update,
        areaCode,
        groupCode
      );
    });
    // set event for 'Read Condo' Button
    $("#pid_read_stat_Condo").on("click", () => {
      let areaCode = this.getAreaCode();
      let groupCode = GetGroupCode("Apartment"); //"#0=pt:4|";
      this.marketStatsUpdate.specGroupStatUpdate(
        StatsPeriod.max_update,
        areaCode,
        groupCode
      );
    });
    // set event for 'Monthly Update(#|#)' Button
    $("#pid_update_stat").on("click", () =>
      this.marketStatsUpdate.monthlyStatUpdate()
    );
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
            this.marketStatsUpdate.copyTextToClipboard(this.htmlAcInput.value);
            console.log(this.htmlAcInput.value);
          }
        }
      }
    }
  }

  getAreaCode() {
    // Read Area Code from the Selection Box on StatsCenter Web Page
    if (!this.htmlAcInput) {
      this.htmlAcInput = $(`div.inputWrap input.acInput`)[0];
    }
    let areaCode = this.htmlAcInput.value;
    let cityName = "";
    let areaCodeLastPosition = areaCode.indexOf("-");
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
}

class MarketStatsUpdate {
  constructor(saveURL) {
    this.statCodeInfo = ""; // an area code provide by statsCentre, data is stored in MYSQL table: wp_pid_stats_code
    this.areaCode = "";
    this.propertyType = "";
    this.deleteOldData = false;
    this.error = new Error(ERROR_MESSAGE_NO_ERROR);
    this.areaQuantityEveryUpdate = 1;
    this.statsPeriodLength = StatsPeriod.max_update; // 1:: 24 months; 3:: 48 months
    this.selectedOptions = {
      calc: "monthly",
      dq: "5035#0=|", // area code(statCode) + group code
      m: "hpi",
      min: 1,
      period: this.statsPeriodLength, // fetch 4 years / 48 months stats
      view: "100",
    };
    this.globalRequestParams = GlobalRequestParams;
    this.saveURL = saveURL;
    // read monthly update status:
    chrome.storage.local.get(
      ["iAreaCodePointer", "areaQuantityEveryUpdate"],
      (xInfo) => {
        this.iAreaCodePointer = xInfo.iAreaCodePointer;
        this.areaQuantityEveryUpdate = xInfo.areaQuantityEveryUpdate
          ? xInfo.areaQuantityEveryUpdate
          : this.areaQuantityEveryUpdate;
      }
    );
  }

  // update the stats data for a specific group of one selected Area
  async specGroupStatUpdate(statDataPeriod, areaCode, groupCode) {
    let propertyType = GetPropertyType(groupCode);
    let statData;
    console.group(
      `Update Spec Group[${propertyType}<${groupCode}>] of Area [${areaCode}]`
    );
    // 1. get statCode from MySQL Database table
    try {
      this.statCodeInfo = await this.searchStatCode(areaCode, groupCode);
      // if statCodeInfo.groupCode is true, go to update stat data
      // otherwise, bypass this groupCode and go to next groupCode
      if (this.statCodeInfo[propertyType] === "0") {
        console.warn(`${areaCode} ${propertyType} BYPASS STAT DATA Request`);
        return;
      }
    } catch (err) {
      this.error = err;
      console.error(areaCode, groupCode, err);
      return;
    }

    // 2. get the statData from stats Centre API
    try {
      this.areaCode = areaCode;
      this.selectedOptions.dq = this.statCodeInfo.stat_code + groupCode;
      this.selectedOptions.period = statDataPeriod;
      statData = await this.requestStatData(
        this.selectedOptions,
        this.globalRequestParams
      );
    } catch (err) {
      this.error = err;
      console.error(areaCode, groupCode, err.message);
      // if err.message === NO_DATA
      // update backend MySQL Table wp_pid_stat_code groupCode to 0
      if (
        this.statCodeInfo[propertyType] &&
        err.message === ERROR_MESSAGE_NO_STAT_DATA
      ) {
        this.updateStatCode(areaCode, propertyType, false);
      }
      return;
    }

    // 3. save the statData to MySql Database
    try {
      let saveDataResult = await this.saveStatData(statData);
      console.log(saveDataResult);
    } catch (err) {
      this.error = err;
      console.error(areaCode, groupCode, err);
      return;
    }

    console.groupEnd();
  }

  // stat data Update for all 4 groups of a specific areaCode
  async specAreaStatUpdate(statDataPeriod, areaCode) {
    console.log("Specific Area Update Button Clicked");

    this.error = new Error(ERROR_MESSAGE_NO_ERROR);
    for (let index = 0; index < GroupCodes.length; index++) {
      let groupCode = GroupCodes[index];
      await this.specGroupStatUpdate(statDataPeriod, areaCode, groupCode);
    }
  }

  //
  // NEW stat data monthly update
  monthlyStatUpdate() {
    console.log("Monthly Update Button Clicked");
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

    async function startMonthlyUpdates(xInfo) {
      iAreaCodePointer = xInfo.iAreaCodePointer ? xInfo.iAreaCodePointer : 0; // use to control the loop

      let areaCode = AreaCodes[i];
      this.error = new Error(ERROR_MESSAGE_NO_ERROR);

      // loop all AreaCodes
      for (let j = 0; j < areaQuantityEveryUpdate; j++) {
        areaCode = AreaCodes[iAreaCodePointer + j]; // j is used to move areaCode pointer, i is the base areaCode Pointer
        // Loop: go for next areaCode
        console.group(
          `AreaCode ${areaCode} Loop:#${j + 1} of ${areaQuantityEveryUpdate}`
        );
        //loop all groups
        await this.specAreaStatUpdate(StatsPeriod.monthly_update, areaCode);

        if (
          this.error.message === ERROR_MESSAGE_NO_ERROR ||
          this.error.message.indexOf("Fatal") === -1
        ) {
          // if there is no fatal errors, set next iAreaCodePointer to chrome local storage
          let saveAreaPointerResult = await saveAreaCodePointerPromise(
            iAreaCodePointer + 1 + j
          );
          // update the button message
          this.iAreaCodePointer++;
          let htmlButtonUpdate = $("#pid_update_stat");
          htmlButtonUpdate.val(
            `Monthly Update (${this.iAreaCodePointer} | ${AreaCodes.length})`
          );
        }
        console.groupEnd();
      }
      console.warn("Stats Data Request Task All Done!");
    }
  }

  async searchStatCode(areaCode, groupCode = "") {
    let statCode;
    // Translate the StatsCentre group code to Property type
    this.propertyType = GetPropertyType(groupCode);

    var AreaCodeInfo = {
      areaCode: areaCode,
      propertyType: this.propertyType,
      action: "Search Stat Code",
    };

    let statCodeInfo = await searchStatCodePromise.call(this, AreaCodeInfo);

    if (
      typeof statCodeInfo === "string" &&
      statCodeInfo.indexOf("error") > -1
    ) {
      // catch errors
      return Promise.reject(statCodeInfo);
    }
    // normalize the statCode
    statCode = statCodeInfo.stat_code;
    if (typeof statCode === "string") {
      statCode = statCode.replace(/[\W_]+/g, ""); // remove all non-word character[^a-zA-Z0-9_] and '_' from the result
    } else {
      statCode = statCode;
    }
    // return promise value
    return Promise.resolve(statCodeInfo);
  }

  async requestStatData(selectedOptions, globalRequestParams) {
    var requestData;
    var currentDataRequest;

    requestData = $.extend({ op: "d" }, selectedOptions, globalRequestParams);
    // Initial send request
    let statInfo;
    // Per Request_Tries, if stats data is not correct try once more
    for (let i = 0; i < REQUEST_TRIES; i++) {
      try {
        //statInfo = await sendRequest(requestData);
        statInfo = await ajaxStatDataPromise.call(
          this,
          requestData,
          currentDataRequest
        );
      } catch (err) {
        // fatal errors:
        console.log("ProcessDataRequest Fatal Error:", err.message);
        statInfo = new Error(ERROR_MESSAGE_DATA_FATAL);
      }

      statInfo = await processStatData.call(this, statInfo.Payload);

      if (statInfo.status === "OK") {
        // Stat Data Request and Process Succeed
        return Promise.resolve(statInfo);
      } else {
        if (statInfo.status === "NO_DATA") {
          if (i === REQUEST_TRIES - 1) {
            console.log(`Last DataRequest Try:`, statInfo.err.message);
            return Promise.reject(statInfo.err);
          } else {
            console.log(`[${i + 1}] Try More Requests:`, statInfo.err.message);
          }
        } else {
          return Promise.reject(statInfo.err);
        }
      }
    }
  }

  async saveStatData(statDataInfo) {
    if (!statDataInfo.statData) {
      console.log("stat read error!");
      return;
    }
    let saveStatDataResult = await sendMessagePromise(statDataInfo);
    return Promise.resolve(saveStatDataResult);
  }

  async updateStatCode(areaCode, propertyType, hasStatData) {
    let statCodeInfo = {
      areaCode: areaCode,
      propertyType: propertyType,
      hasStatData: hasStatData,
      action: "Update Stat Code",
    };
    let updateStatDataResult = await sendMessagePromise(statCodeInfo);
    return Promise.resolve(updateStatDataResult);
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
