export const ActionTypePrefix = 'CHARACTERS.';

const ActionTypes = Object.freeze({
  ADD_CHARACTER: `${ActionTypePrefix}ADD_CHARACTER`,
  SET_SELECTED: `${ActionTypePrefix}SET_SELECTED`,
  SET_NAME: `${ActionTypePrefix}SET_NAME`,
});

export default ActionTypes;
