import axios from 'axios';

/**
 * The default base URL for API actions. Update this when the
 * API major version changes.
 */
export const DEFAULT_BASE_URL = '/api/v0';

/**
 * Returns an action creator that creates async Axios actions. Intended
 * primarily for invoking the back-end API supplied with the application,
 * but can be used to call any service accessible by HTTP.
 *
 * Intended to parallel the `createAction` from `redux-actions`.
 *
 * @param {string} type
 *  The base type name of the action. The async action will dispatch
 *  actions with types of `${type}.REQUEST`, `${type}.RESPONSE`, or
 *  `${type}.ERROR` when the Axios request is started, completed, or
 *  failed, respectively.
 * @param {(...args:any[])=>any} payloadCreator
 *  Function that returns a payload for the actions that will be dispatched.
 *  The payload must contain a request property containing enough information
 *  to make a successful Axios call (save for `baseUrl`, which will be set
 *  to `DEFAULT_BASE_URL` if it is not supplied).
 * @param {(...args:any[])=>any} metaCreator
 *  Optional function that returns a meta object for the actions
 *  that will be dispatched.
 * @returns {(...args:any[])=>Function}
 *  Returns a generator method. Call the supplied method with the
 *  appropriate arguments to create an async action that can be
 *  dispatched.
 */
export function createApiAction(type, payloadCreator, metaCreator) {
  if (!payloadCreator || !(typeof payloadCreator === 'function')) {
    throw new Error('createApiAction must be called with a payloadCreator.');
  }

  return (...args) => async (dispatch) => {
    const payload = payloadCreator(...args);
    const meta = metaCreator && metaCreator(...args);

    dispatch({
      type: `${type}.REQUEST`,
      payload,
      meta,
    });

    try {
      const response = await axios({
        baseURL: DEFAULT_BASE_URL,
        ...payload.request,
      });
      dispatch({
        type: `${type}.RESPONSE`,
        payload: {
          ...payload,
          response,
        },
        meta,
      });
    } catch (error) {
      dispatch({
        type: `${type}.ERROR`,
        payload,
        meta,
        error,
      });
    }
  };
}

export function createApiActions() {
  throw new Error('Not yet implemented');
}
