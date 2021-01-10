$(document).ready(() => {
  let readHandle = 0;

  readHandle = setInterval(function () {
    history.go(-1);
    clearInterval(readHandle);
  }, 3000);
});
