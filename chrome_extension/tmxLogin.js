//window.alert("Hello");
console.log("test");

(function () {
  let countTimer = setInterval(checkComplete, 100);

  function checkComplete() {
    console.log("auto login to server:");
    if (
      document.querySelector(".qmod-account-loginButton") != undefined &&
      (document.querySelector("#qm-username").value || "").toLowerCase() ==
        "peterqu007"
    ) {
      clearInterval(countTimer);
      //document.getElementById('j_password').value='Inform69';
      //document.getElementById('j_username').value='v70898';
      document.forms[2].submit.click();
    }
  }
})();
