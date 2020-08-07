const SAVE_URL_LOCAL =
  "http://localhost/pidrealty4/wp-content/themes/realhomes-child-3/db/saveStatData.php";
const SAVE_URL_REMOTE =
  "https://pidhomes.ca/wp-content/themes/realhomes-child-3/db/saveStatData.php";

class MarketStats {
  constructor() {
    this.statCode = "";
    this.areaCode = "";
    this.propertyGroup = "";
    this.deleteOldData = false;
    this.error = "";
    this.htmlDiv = $("#infosparksTarget");
    this.htmlDivQuickStats = $("div.quickStats");
    this.htmlFooter = $("footer");
    this.htmlAcInput = $(`div.inputWrap input.acInput`)[0];
    this.htmlFooter.remove();
    this.selectedOptions = {
      calc: "monthly",
      dq: "5035#0=|",
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
    chrome.storage.local.get(["iAreaCodePointer"], (xInfo) => {
      this.iAreaCodePointer = xInfo.iAreaCodePointer;
      // set events
      this.ms_events_options();
      this.ms_events_loadStats();
    });
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
        this.iAreaCodePointer = 0;
        chrome.storage.local.set({ iAreaCodePointer: 0 }, () => {
          // move area pointer to 0 /beginning of the list
          // start over
          let htmlButtonUpdate = $("#pid_update_stat");
          htmlButtonUpdate.val(
            `Monthly Update (${this.iAreaCodePointer} | ${areaCodes.length})`
          );
        });
      });

      $("#pid_reload_stats").click((e) => {
        if ($(e.target).is(":checked")) {
          this.deleteOldData = true;
        } else {
          this.deleteOldData = false;
        }
      });
    });
  }

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
        `<input type="button" id="pid_update_stat" value="Monthly Update (${this.iAreaCodePointer} | ${areaCodes.length})">`
      );

      if ($("#pid_read_stat_All").length == 0) {
        this.htmlDivQuickStats.append(htmlButtonAll);

        $("#pid_read_stat_All").on("click", () => {
          console.log("ms clicked");
          let areaCode = this.getAreaCode();
          let groupCode = "#0=|";
          this.searchStatCode(areaCode, groupCode);
        });
      }
      if ($("#pid_read_stat_Detached").length == 0) {
        this.htmlDivQuickStats.append(htmlButtonDetached);

        $("#pid_read_stat_Detached").on("click", () => {
          console.log("ms clicked");
          var areaCode = this.getAreaCode();
          var groupCode = "#0=pt:2|";
          this.searchStatCode(areaCode, groupCode);
        });
      }
      if ($("#pid_read_stat_Townhouse").length == 0) {
        this.htmlDivQuickStats.append(htmlButtonTownhouse);

        $("#pid_read_stat_Townhouse").on("click", () => {
          console.log("ms clicked");
          var areaCode = this.getAreaCode();
          var groupCode = "#0=pt:8|";
          this.searchStatCode(areaCode, groupCode);
        });
      }
      if ($("#pid_read_stat_Condo").length == 0) {
        this.htmlDivQuickStats.append(htmlButtonCondo);

        $("#pid_read_stat_Condo").on("click", () => {
          console.log("ms clicked");
          var areaCode = this.getAreaCode();
          var groupCode = "#0=pt:4|";
          this.searchStatCode(areaCode, groupCode);
        });
      }
      if ($("#pid_update_stat").length == 0) {
        this.htmlDivQuickStats.append(htmlButtonUpdate);

        $("#pid_update_stat").on("click", () => {
          console.log("update button clicked");
          let groupCodes = ["#0=|", "#0=pt:2|", "#0=pt:8|", "#0=pt:4|"];
          // let groupCodes = ["#0=|"];
          let i = 0;
          let iAreaCodePointer = 0;
          chrome.storage.local.get(["iAreaCodePointer"], (xInfo) => {
            i = xInfo.iAreaCodePointer ? xInfo.iAreaCodePointer : 0;
            iAreaCodePointer = xInfo.iAreaCodePointer
              ? xInfo.iAreaCodePointer
              : 0;

            let areaCode = areaCodes[i];
            this.error = "";
            let loadTimer = setInterval(() => {
              let htmlCheckboxStop = $("input#pid_update_stat_stop");
              console.log("loadTimer");
              if (!htmlCheckboxStop[0].checked) {
                let groupCode = groupCodes.pop();
                if (groupCode) {
                  htmlCheckboxStop.prop("checked", true); //disable load next
                  this.searchStatCode_for_monthly_update(areaCode, groupCode);
                } else {
                  //clear timer
                  if (++i - iAreaCodePointer < 1) {
                    areaCode = areaCodes[i];
                    groupCodes = ["#0=|", "#0=pt:2|", "#0=pt:8|", "#0=pt:4|"];
                    htmlCheckboxStop.prop("checked", false);
                  } else {
                    if (i >= areaCodes.length) {
                      i = 0;
                    }
                    chrome.storage.local.set({ iAreaCodePointer: i }, () => {
                      console.log(i, " save to chrome storage!");
                    });
                    let htmlButtonUpdate = $("#pid_update_stat");
                    htmlButtonUpdate.val(
                      "Monthly Update:(" + i + "|" + areaCodes.length + ")"
                    );
                    clearInterval(loadTimer);
                  }
                }
              } else {
                let htmlCheckboxStop = $("input#pid_update_stat_stop");
                // if errors happened, stop timer
                if (this.error.indexOf("No Stats In the Array Data") == 0) {
                  // NO HPI Data Found for this group
                  // 1: StatsCenter Return 4 Data Collections, however current month HPI is null
                  // 2: StatsCenter Return 4 Data Collections, however all HPI is ""
                  // 3: StatsCenter Return 2 Data Collections, there is no Series Data included
                  htmlCheckboxStop.prop("checked", false); //contintue next data request
                } else if (this.error !== "") {
                  clearInterval(loadTimer); //stop timer
                  htmlCheckboxStop.prop("checked", true); //stop data process
                  console.error(this.error); // report error
                }
              }
            }, 1000);
          });
        });
      }
      // area code change
      if ($(`div.inputWrap input.acInput`).length > 0) {
        if (!this.htmlAcInput) {
          this.htmlAcInput = $(`div.inputWrap input.acInput`)[0];
          $(this.htmlAcInput).on(
            "input change keydown keypress keyup mousedown click mouseup focusout",
            (e) => {
              console.log("area code changed: ", e.target.value);
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
    console.log(areaCode);
    return areaCode;
  }

  processDataRequest(selectedOptions, callback, globalRequestParams) {
    var requestData;
    var currentDataRequest;
    var backendDataUrl = "/infoserv/sparks";
    var self = this;

    requestData = $.extend({ op: "d" }, selectedOptions, globalRequestParams);

    // Function for sending request
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

  searchStatCode_for_monthly_update(areaCode, groupCode = "") {
    let date = new Date();

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
    chrome.runtime.sendMessage(AreaCode, (res) => {
      console.log(res);
      this.statCode = res.replace(/[\W_]+/g, "");
      this.areaCode = areaCode;
      if (this.statCode) {
        this.selectedOptions_monthly_Update.dq = this.statCode + groupCode;
        this.processDataRequest(
          this.selectedOptions_monthly_Update,
          this.saveData.bind(this),
          this.globalRequestParams
        );
      }
    });
  }

  saveData(statData) {
    if (!statData.statData) {
      console.log("stat read error!");
      return;
    } else {
      console.log(statData);
    }
    let saveDataCallback = function (res) {
      res = res.trim();
      console.log(res);
      let htmlCheckboxStop = document.getElementById("pid_update_stat_stop");
      if (res.trim() != "Stats Inserted to DB!") {
        $(htmlCheckboxStop).prop("checked", true); // stop loading next neighborhood / property type
        this.error = res;
      } else {
        $(htmlCheckboxStop).prop("checked", false); // Continue loading next neighborhood / property type
      }
    };
    chrome.runtime.sendMessage(statData, saveDataCallback.bind(this));
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
        console.error("Async: Could not copy text: ", err);
      }
    );
  }
}

$(document).ready(function () {
  const ms = new MarketStats();
});

areaCodes = [
  "FVREB",
  "REBGV",
  "F10",
  "F20",
  "F30",
  "F30A",
  "F40",
  "F50",
  "F60",
  "F70A",
  "F80A",
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
