const {
  dateToNumber,
  resolveDate,
  validateDate,
  validateLimit,
  validateUserId,
  formatUnixToStringDate,
} = require('./utils');

test('dateToNumber', () => {
  expect(dateToNumber('2022-01-01')).toBe(1640995200000);
  expect(dateToNumber(1640995200000)).toBe(1640995200000);
});

test('resolveDate', () => {
  expect(resolveDate('2022-01-01')).toBe(1640995200000);
  expect(resolveDate()).toBe(new Date().valueOf());
});

test('validateDate', () => {
  expect(validateDate('2022-01-01')).toBe(true);
  expect(validateDate('2022-31-01')).toBe(false);
  expect(validateDate('2022-01-31')).toBe(true);
});

test('validateLimit', () => {
  expect(validateLimit('')).toBe(true);
  expect(validateLimit('1')).toBe(true);
  expect(validateLimit('99')).toBe(true);
  expect(validateLimit('99a')).toBe(false);
});

test('validateUserId', () => {
  expect(validateUserId('123456789abcdEFGHIJ_-')).toBe(true);
  expect(validateUserId('123456789abcdEFGHIJ_')).toBe(false);
  expect(validateUserId('123456789abcdEFGHIJ_-_')).toBe(false);
  expect(validateUserId('123456789abcdEFGHIJ_!')).toBe(false);
});

test('formatUnixToStringDate', () => {
  expect(formatUnixToStringDate(1640995200000)).toBe('2022-01-01');
});
