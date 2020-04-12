//p$lt$zoneContent$SubContent$p$lt$zoneLeft$Stockhouse_CompanyBullboard$viewerForum$threadsElem$drpViewModeSelector
//p$lt$zoneContent$SubContent$p$lt$zoneLeft$Stockhouse_CompanyBullboard$viewerForum$threadsElem$drpViewModeSelector

class stockhouse {
  constructor() {
    this.name = "test";
    this.htmlSelect = $(
      '[name="p$lt$zoneContent$SubContent$p$lt$zoneLeft$Stockhouse_CompanyBullboard$viewerForum$threadsElem$drpViewModeSelector"]'
    );
  }
  getName() {
    console.log("hello ", this.name);
  }
  getSelectItem() {
    let htmlOption = this.htmlSelect.children("option:selected");
    console.log(htmlOption.val());
  }
  setSelectItem() {
    let htmlOption = this.htmlSelect.children("option:selected");
    htmlOption.val("Threaded");
  }
}

const sh = new stockhouse();
sh.setSelectItem();
