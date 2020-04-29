console.log("HSBC");

class HSBCFIN {
  constructor() {
    this.message = "hello";

    // document.addEventListener("DOMContentLoaded", function () {
    //   this.logMessage();
    //   this.createStockList();
    //   this.expandHoldings();
    // });
  }

  //methods
  logMessage() {
    console.log(this.message);
  }

  createStockList() {
    if (
      document.URL.indexOf(
        "https://investdirecttrading.hsbc.ca/srbp/stock/?wireFrom=external&locale=en_CA"
      ) == -1
    ) {
      return;
    }
    let htmlStockListDiv = document.createElement("div");
    let htmlStockList = document.createElement("ul");
    let htmlStockListItem = document.createElement("li");
    htmlStockListItem.innerText = "HOT.UN";
    htmlStockList.appendChild(htmlStockListItem);
    htmlStockListDiv.appendChild(htmlStockList);

    let htmlHSBCDiv = document.getElementById("innerPage");
    let htmlHSBCPage = document.getElementsByClassName("grid-slin")[0];
    htmlHSBCDiv.insertBefore(htmlStockListDiv, htmlHSBCPage);
  }

  expandHoldings() {
    if (document.URL.indexOf("currentholdings") == -1) {
      return;
    }
    let htmlLink = document.getElementsByClassName("accordionHeading")[0];
    $(htmlLink).click();
  }
}

$(document).ready(function () {
  // Select the node that will be observed for mutations
  const targetNode = document.getElementsByClassName("innerPage-skin")[0];
  //col0_360 col1_160 col2_160 groupedTable
  //const targetNode = document.getElementsByClassName("grid-skin")[0];

  // Options for the observer (which mutations to observe)
  const config = {
    attributes: true,
    childList: true,
    subtree: true,
  };

  var link;

  // Callback function to execute when mutations are observed
  const callback = function (mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (let mutation of mutationsList) {
      if (
        mutation.type === "childList" &&
        mutation.target.tagName == "TH" &&
        mutation.target.className.toUpperCase() == "FIRST COL0"
      ) {
        // console.log("A child node has been added or removed.", mutation);
        link = $(mutation.target).find("a.accordionHeading");
        // console.log(link);
        if (link.length > 0) {
          setTimeout(function () {
            console.log(link);
            let content = $("div.accordionContent.in.collapse");
            if (content.length == 0) {
              $("a.accordionHeading")[0].click();
            }
          }, 1000);
          return;
        }
      } else if (mutation.type === "attributes") {
        //console.log(
        //   "The " + mutation.attributeName + " attribute was modified."
        // );
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

  // Later, you can stop observing
  //observer.disconnect();
});
