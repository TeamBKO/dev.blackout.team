import snakeCase from 'lodash/snakeCase';

/**
 * Sets roster form on the roster container component
 * @param {object} form
 */
export default function setRosterForm(form) {
  if (!form) {
    if (this.formID) this.formID = null;

    return;
  }
  this.formID = form.id;
}
