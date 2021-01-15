const SAVE_URL_LOCAL =
  "http://localhost/pidrealty4/wp-content/themes/realhomes-child-3/db/saveStatData.php";
const SAVE_URL_REMOTE =
  "https://pidhomes.ca/wp-content/themes/realhomes-child-3/db/saveStatData.php";
// ERROR MESSAGES
const ERROR_MESSAGE_NO_DATA = "Warning: No StatsData, Try Again!";
const ERROR_MESSAGE_DATA_FATAL = "Fatal Error: StatsData Server Failed";
const ERROR_MESSAGE_DATA_FAILED = "DataRequest Error: StatsData Request Failed";
const ERROR_MESSAGE_NO_ERROR = "";
const ERROR_MESSAGE_DATA_OK = "StatsData Request Succeed";
const MSG_CORRECT_STAT_DATA = "Correct StatsData Returned";
const ERROR_MESSAGE_NO_STAT_DATA = "NO_STATS_DATA";
const REQUEST_TRIES = 1;
const MORE_DATA_REMAINING = "More DataParts Remaining";

// Stats Centre groupCodes for HPI
const groupCodes = ["#0=|", "#0=pt:2|", "#0=pt:8|", "#0=pt:4|"];
const propertyTypes = ["All", "Detached", "Townhouse", "Apartment"];

const getPropertyType = (groupCode) =>
  propertyTypes[groupCodes.indexOf(groupCode)];
