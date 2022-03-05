import capitalize from 'lodash/capitalize';

const emailPattern =
  /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
const alphaPattern = /^[a-zA-Z0-9\-\s]+$/;
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\&])(?=.{8,})/;

export const isRequired = function (fieldName) {
  return (v) => !!v || `${capitalize(fieldName)} is required.`;
};

export const hasLowerCase = function (fieldName) {
  return (v) =>
    /^(?=.*[a-z])/.test(v) ||
    `${capitalize(fieldName)} must contain atleast 1 lowercase character`;
};

export const hasUpperCase = function (fieldName) {
  return (v) =>
    /^(?=.*[A-Z])/.test(v) ||
    `${capitalize(fieldName)} must contain atleast 1 uppercase character`;
};

export const hasNumericCharacter = function (fieldName) {
  return (v) =>
    /^(?=.*[0-9])/.test(v) ||
    `${capitalize(fieldName)} must contain atleast 1 numeric character`;
};

export const hasSpecialCharacter = function (fieldName) {
  return (v) =>
    /(?=.*[!@#$%&_])/.test(v) ||
    `${capitalize(fieldName)} must contain atleast 1 special character`;
};

export const hasSelected = function (requiredSelected) {
  return (v) =>
    v.length >= requiredSelected || `You must select at least one option`;
};

export const tooManySelected = function (requiredSelected) {
  return (v) =>
    (v.length && v.length <= requiredSelected) ||
    `You've selected too many items`;
};

export const minLength = function (fieldName, length) {
  return (v) =>
    (v && v.length >= length) ||
    `${capitalize(
      fieldName
    )} must be equal to or longer than ${length} characters.`;
};

export const maxLength = function (fieldName, length) {
  return (v) =>
    (v && v.length <= length) ||
    `${capitalize(
      fieldName
    )} must be equal to or less than ${length} characters.`;
};

export const isNotPast = function (date, fieldName) {
  return (v) =>
    (v && !this.$dayjs(this.$dayjs(v)).isBefore(this.$dayjs(date))) ||
    `${capitalize(fieldName)} cannot be in the past.`;
};

export const isNotAfter = function (date, fieldName) {
  return (v) =>
    (v && !this.$dayjs(this.$dayjs(v)).isAfter(this.$dayjs(date))) ||
    `${capitalize(fieldName)} cannot be after end date.`;
};

export const isAlphanumeric = function (fieldName) {
  return (v) =>
    alphaPattern.test(v) || `${capitalize(fieldName)} must be alphanumeric.`;
};

export const isEmail = function (fieldName) {
  return (v) =>
    emailPattern.test(v) ||
    `${capitalize(fieldName)} must be a valid email address.`;
};

export const isValidPassword = function (fieldName) {
  return (v) =>
    passwordPattern.test(v) ||
    `${capitalize(fieldName)} must meet the criteria.`;
};

export default {
  isRequired,
  isNotPast,
  isNotAfter,
  isAlphanumeric,
  isEmail,
  isValidPassword,
  hasLowerCase,
  hasUpperCase,
  hasNumericCharacter,
  hasSpecialCharacter,
  hasSelected,
  minLength,
  maxLength,
  tooManySelected,
};
