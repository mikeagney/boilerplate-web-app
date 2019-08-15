import axios from 'axios';

/**
 * The default base URL for API actions. Update this when the
 * API major version changes.
 */
export const DEFAULT_BASE_URL = '/api/v0';

/**
 * An object for specifying additional thunks to apply to the Axios request lifecycle.
 * The Axios API action creator uses these fields; action implementors are free to add
 * additional meta values if they would be useful in the reducer.
 *
 * The thunks documented in this call are invoked after the relevant actions are
 * dispatched, meaning that they can count on the Redux state being updated accordingly.
 *
 * These thunks may be used to perform any action not readily expressible in the reducer.
 *
 * @typedef {Object} AxiosActionMeta
 * @property {(dispatch:Function,getState:function,response:any)=>void} onRequest
 *   If present, call this method before making the Axios request.
 * @property {(dispatch:Function,getState:function,response:any)=>void} onResponse
 *   If present, call this method after the Axios request completes, passing the
 *   response from the Axios call.
 * @property {(dispatch:Function,getState:function,error:any)=>void} onError
 *   If present, call this method after the Axios request fails, passing the
 *   error from the Axios call.
 */

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
 * @param {(...args:any[])=>AxiosActionMeta} metaCreator
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

  return (...args) => async (dispatch, getState) => {
    const payload = payloadCreator(...args);
    const meta = metaCreator && metaCreator(...args);
    const { onRequest = null, onResponse = null, onError = null } = meta || {};

    dispatch({
      type: `${type}.REQUEST`,
      payload,
      meta,
    });
    if (onRequest) {
      onRequest(dispatch, getState);
    }

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
      if (onResponse) {
        onResponse(dispatch, getState, response);
      }
    } catch (error) {
      // TODO: Uncomment the bits to get the server error message into the state?
      // const { response: { data: errorResponseData } = {} } = error;
      dispatch({
        type: `${type}.ERROR`,
        payload: {
          ...payload,
          error,
          // error: errorResponseData || error,
        },
        meta,
        error: true,
      });
      if (onError) {
        onError(dispatch, getState, error);
      }
    }
  };
}

export function createApiActions() {
  throw new Error('Not yet implemented');
}
