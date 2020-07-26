class Location {
  constructor() {
    this.htmlForm = $("#addtag"); // document.forms[2];
    let addLocationButton = $(
      `<input id ='fillnewlocation' type='button' value='Fill New Location'>`
    );
    this.htmlForm.append(addLocationButton);
    this.htmlFillButton = $("#fillnewlocation");
    this.htmlDescription = $("#tag-description");
    this.htmlName = $("#tag-name");
    this.htmlSlug = $("#tag-slug");
    this.htmlNeighborCode = document.getElementById("acf-field_5f0258b6c3fa0"); // $("#acf-field_5f0258b6c3fa0");
    this.htmlMapLocation = $("input.search");
    this.events();
  }

  events() {
    this.htmlFillButton.on("click", () => {
      console.log(this.htmlDescription);
      let des = this.htmlDescription.val().trim();
      let nbhCode = des.substring(0, des.indexOf("-"));
      nbhCode = nbhCode.trim();
      let nbhName = des.substring(des.indexOf("-") + 1);
      nbhName = nbhName.trim();
      let nbhSlug = nbhName.trim().split(" ").join("-");
      nbhSlug = nbhSlug.toLowerCase();
      this.htmlName.val(nbhName);
      this.htmlSlug.val(nbhSlug);
      this.htmlNeighborCode = document.getElementById(
        "acf-field_5f0258b6c3fa0"
      ); // $("#acf-field_5f0258b6c3fa0");
      this.htmlMapLocation = $("input.search");
      this.htmlNeighborCode.value = nbhCode;
      this.htmlMapLocation.val(nbhName);
    });
    this.htmlDescription.on("change", () => {
      console.log("test");
      this.htmlFillButton.click();
    });
  }
}

$(document).ready(function () {
  console.log("test");
  const loc = new Location();
});
