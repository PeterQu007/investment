console.log('test');

$(document).ready(function () {
  // var htmlSearchBox = $('#realbox');
  // var htmlContainer = $('#realbox-container');

  // var htmlTaxoDiv = $('<div>Tax</div>');
  // htmlContainer.append(htmlTaxoDiv);
  var htmlInput = $('.gLFyf')[0];
  console.log($(htmlInput).val());
  var category = 'Default';
  var search = $(htmlInput).val();
  // if search == undefined, do not save to database;
  if (!search) {
    return;
  }

  var searchRegex = /([^\s]+)\s(.+)/;
  var searchMatches = [];
  if (searchRegex.test(search)) {
    searchMatches = search.match(searchRegex);
    category = (searchMatches[1]).toUpperCase();
    search = capitalizeFirstLetter(searchMatches[2]);
  }


  // saveGoogleSearch(category, search);

  function saveGoogleSearch(category, search) {
    // Use WP Ajax Module
    // remote uri: https://investment.pidhome.ca/wp-content/themes/investment/db/saveGoogleSearch.php
    // local uri: http://localhost/pidrealty4/wp-content/themes/realhomes-child-3/db/saveGoogleSearch.php
    let uploadUrl = ""
    // uploadUrl = "http://localhost/pidrealty4/wp-content/themes/realhomes-child-3/db/saveGoogleSearch.php";
    uploadUrl = "https://investment.pidhome.ca/wp-content/themes/investment/db/saveGoogleSearch.php";

    var form_data = new FormData();
    form_data.append("category", category);
    form_data.append("search", search);

    $.ajax({
      url: uploadUrl, // point to server-side PHP script
      dataType: "text", // what to expect back from the PHP script, if anything
      cache: false,
      contentType: false,
      processData: false,
      data: form_data,
      type: "post",
      success: function (php_script_response) {
        // alert(php_script_response); // display response from the PHP script, if any
        php_script_response = php_script_response.split(",")[0];
        console.log(php_script_response);
      },
    });
  }

  function capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

})