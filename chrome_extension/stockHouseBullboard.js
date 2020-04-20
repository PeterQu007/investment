//p$lt$zoneContent$SubContent$p$lt$zoneLeft$Stockhouse_CompanyBullboard$viewerForum$threadsElem$drpViewModeSelector
//p$lt$zoneContent$SubContent$p$lt$zoneLeft$Stockhouse_CompanyBullboard$viewerForum$threadsElem$drpViewModeSelector
//p$lt$zoneContent$SubContent$p$lt$zoneLeft$Stockhouse_CompanyBullboard$viewerForum$threadsElem$drpViewModeSelector
//p$lt$zoneContent$SubContent$p$lt$zoneLeft$Stockhouse_CompanyBullboard$viewerForum$threadElem$ForumViewModeSelector1$drpViewModeSelector
//javascript:setTimeout('__doPostBack(\'
//p$lt$zoneContent$SubContent$p$lt$zoneLeft$Stockhouse_CompanyBullboard$viewerForum$threadsElem$drpViewModeSelector\',\'\')', 0)

class stockhouse {
  constructor() {
    this.htmlSelect = $(
      '[name="p$lt$zoneContent$SubContent$p$lt$zoneLeft$Stockhouse_CompanyBullboard$viewerForum$threadsElem$drpViewModeSelector"]'
    );
    // this.htmlCheckBox = $(
    //   `<input type="checkbox" name="threaded" id="threadedCheck">`
    // );
    // this.htmlLabel = $(`<label for="threadedCheck">Threaded Check</label>`);
    // this.htmlLabel.insertAfter(this.htmlSelect);
    // this.htmlCheckBox.insertAfter(this.htmlSelect);

    // chrome.storage.local.get(["threadedChecked"], (xInfo) => {
    //   this.htmlCheckBox.prop("checked", xInfo.threadedChecked);
    //   if (xInfo.threadedChecked) {
    //     this.setSelectItem();
    //   }
    // });

    //hook up events:
    // this.htmlCheckBoxChange();
    //this.htmlSelectChange();
  }

  getSelectItem() {
    let htmlOption = this.htmlSelect.children("option:selected");
    console.log(htmlOption.val());
  }

  setSelectItem() {
    // let htmlOption1 = $(this.htmlSelect.children(`[value="NewestToOldest"]`));
    // htmlOption1.removeAttr("selected");
    // let htmlOption = $(this.htmlSelect.children(`[value="Threaded"]`));
    // htmlOption.attr("selected", "selected");
    // this.htmlSelect.val("Threaded").change();
    // location.reload();
    // htmlOption.val("Threaded").change();
    // let htmlOption = this.htmlSelect.children("[value=Threaded]");
    // htmlOption.attr("selected", "selected");
  }

  //add events
  // htmlCheckBoxChange() {
  //   this.htmlCheckBox.on("change", (e) => {
  //     let threadedChecked = $(e.target).is(":checked");
  //     chrome.storage.local.set({ threadedChecked: threadedChecked }, () => {
  //       if (threadedChecked) this.setSelectItem();
  //     });
  //   });
  // }

  // htmlCheckBoxChange() {
  //   this.htmlCheckBox.on("change", (e) => {
  //     let threadedChecked = $(e.target).is(":checked");
  //     if (threadedChecked) this.setSelectItem();
  //   });
  // }

  // htmlSelectChange() {
  //   this.htmlSelect.on("change", function () {
  //     console.log("content changed!");
  //   });
  // }
}

$(document).ready(function () {
  const sh = new stockhouse();
  // sh.setSelectItem();
});
