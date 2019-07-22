import axios from 'axios';
import { DEFAULT_BASE_URL, createApiAction, createApiActions } from './api.action-creator';

jest.mock('axios');

describe('Axios action creators', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createApiAction', () => {
    const payload = { request: { method: 'get' } };
    const payloadCreator = jest.fn();
    const meta = { foo: 'bar' };
    const metaCreator = jest.fn();
    const mockResponse = {};

    beforeEach(() => {
      axios.mockResolvedValue(mockResponse);
      payloadCreator.mockReturnValue(payload);
      metaCreator.mockReturnValue(meta);
    });

    it('will fail if there is no payloadCreator method', () => {
      // Arrange
      // Act
      // Assert
      expect(() => createApiAction('TEST')).toThrow('must be called with a payloadCreator.');
    });

    it('will fail if payloadCreator is not a function', () => {
      // Arrange
      // Act
      // Assert
      expect(() => createApiAction('TEST', 'notAFunction')).toThrow(
        'must be called with a payloadCreator.',
      );
    });

    it('will succeed if there is no metaCreator method', async () => {
      // Arrange
      const actionCreator = createApiAction('TEST', payloadCreator);
      const thunk = actionCreator('foo', 'bar');
      const dispatch = jest.fn();

      // Act
      await thunk(dispatch);

      // Assert
      expect(dispatch).toHaveBeenCalledWith({ type: 'TEST.REQUEST', payload, meta: undefined });
    });

    it('will dispatch REQUEST and RESPONSE actions when axios succeeds', async () => {
      // Arrange
      const actionCreator = createApiAction('TEST', payloadCreator, metaCreator);
      const thunk = actionCreator('foo', 'bar');
      const dispatch = jest.fn();

      // Act
      await thunk(dispatch);

      // Assert
      expect(axios).toHaveBeenCalledWith({ baseURL: DEFAULT_BASE_URL, method: 'get' });
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith({ type: 'TEST.REQUEST', payload, meta });
      expect(dispatch).toHaveBeenCalledWith({
        type: 'TEST.RESPONSE',
        payload: { ...payload, response: mockResponse },
        meta,
      });
    });

    it('will dispatch REQUEST and ERROR actions when axios fails', async () => {
      // Arrange
      const actionCreator = createApiAction('TEST', payloadCreator, metaCreator);
      const thunk = actionCreator('foo', 'bar');
      const dispatch = jest.fn();
      const error = { baz: 'quux' };
      axios.mockRejectedValue(error);

      // Act
      await thunk(dispatch);

      // Assert
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith({ type: 'TEST.REQUEST', payload, meta });
      expect(dispatch).toHaveBeenCalledWith({
        type: 'TEST.ERROR',
        payload,
        meta,
        error,
      });
    });
  });

  describe('createApiActions', () => {
    it('will throw because it is not yet implemented', () => {
      // Arrange
      // Act
      // Assert
      expect(() => createApiActions()).toThrow();
    });
  });
});
