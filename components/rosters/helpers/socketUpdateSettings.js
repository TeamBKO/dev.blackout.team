import setRosterForm from './setRosterForm.js';
export default function socketUpdateSettings(settings) {
  this.rosterInfo = Object.assign(this.rosterInfo, settings);
  setRosterForm.call(this, settings.roster_form);
}
