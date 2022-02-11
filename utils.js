const moment = require("moment");

function dateToNumber(date) {
  if (!isNaN(Number(date))) {
    return date;
  }

  return new Date(date).valueOf();
}

function resolveDate(date) {
  return validateDate(date) ? new Date(date).valueOf() : Date.now()
}

function validateDate(date) {
  return /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(date);
}

function validateUserId(id) {
  return /^[A-Za-z\d\-\_]{21}$/.test(id);
}

function validateLimit(limit) {
  return /^(\d+)?$/.test(limit);
}

function formatUnixToStringDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

module.exports = {
  dateToNumber,
  validateDate,
  formatUnixToStringDate,
  resolveDate,
  validateUserId,
  validateLimit
};