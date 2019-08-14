import uuid from 'uuidv4';
import fromPairs from 'lodash/fromPairs';
import toPairs from 'lodash/toPairs';
import DbClient from '../../client/db-client';

/**
 * @typedef {Object} Character
 * @property {string} characterId
 * @property {string} name
 * @property {Date} createdDate
 */

/**
 * Backing store requests for the characters collection.
 */
class CharacterProxy {
  constructor() {
    this.dbClient = new DbClient();
  }

  /**
   * Gets a MongoDB query based on the cursor value.
   * @param {string} cursor
   *  A cursor value indicating the start of a new page of results.
   * @returns {any}
   *  A MongoDB query object that will start searching from the specified cursor.
   */
  static getQueryFromCursor(cursor) {
    // 'cursor' is base64-encoded LE 48-bit value representing milliseconds
    return cursor
      ? {
        createdDate: { $gte: new Date(Buffer.from(cursor, 'base64').readIntLE(0, 6)) },
      }
      : {};
  }

  /**
   * Gets a cursor string that will represent searching from the specified object.
   * @param {any} element
   *  The collection element that should be returned first by a cursor query.
   * @returns {string}
   *  An opaque string that will represent a search that will return the element first.
   */
  static getCursorFromElement(element) {
    if (!element) {
      return null;
    }
    const { createdDate } = element;
    if (!createdDate) {
      return null;
    }

    const buffer = Buffer.alloc(6);
    buffer.writeIntLE(createdDate.getTime(), 0, 6);
    return buffer.toString('base64');
  }

  /**
   * Gets a collection of character IDs.
   * @param {number} limit
   *  The maximum number of elements to return.
   * @param {string} cursor
   *  An opaque string indicating where the collection should start,
   *  or nothing to start from the beginning.
   * @returns {{items:{id:string,name:string}[],nextCursor:string}}
   *  An object containing the collection of character IDs with their corresponding
   *  names, and a cursor value that will get the next page of results.
   */
  async getCharacterIds(limit, cursor) {
    return this.dbClient.getDatabase(async (db) => {
      const query = CharacterProxy.getQueryFromCursor(cursor);
      const results = db
        .collection('characters')
        .find(query)
        .hint('dateIdName')
        .sort({ createdDate: 1 })
        .project({
          characterId: true,
          name: true,
          createdDate: true,
          _id: false,
        })
        .limit(limit + 1);
      const characters = await results.toArray();
      const nextCharacter = characters.length > limit && characters.pop();
      return {
        items: characters.map(({ characterId, name }) => ({
          id: characterId,
          name,
        })),
        nextCursor: CharacterProxy.getCursorFromElement(nextCharacter),
      };
    });
  }

  /**
   * Gets the specified character.
   * @param {string} characterId
   *  The character ID to search for.
   * @returns {Character}
   *  The character with the specified ID, or nothing if no character exists with that ID.
   */
  async getCharacterById(characterId) {
    return this.dbClient.getDatabase(db => db.collection('characters').findOne({ characterId }));
  }

  /**
   * Creates a character.
   * @param {Character} character
   *  The character to create.
   * @returns {Character}
   *  The character that was created, with the character ID and created date filled in.
   */
  async createCharacter(character) {
    return this.dbClient.getDatabase(async (db) => {
      const characterId = uuid();
      const characterRecord = {
        ...character,
        characterId,
        createdDate: new Date(),
      };

      const response = await db.collection('characters').insertOne(characterRecord);
      return response.ops[0];
    });
  }

  /**
   * Updates fields of a character.
   * The `character` parameter will be interpreted with patch semantics; any fields
   * that are not in the document will be left unchanged, and any fields in the document
   * explicitly set to `null` will cause the corresponding fields in the backing store to
   * be removed.
   * The `characterId` and `createdDate` properties will be ignored as they cannot be changed;
   * instead, the `characterId` parameter of the method will be used to locate the record
   * to update.
   * @param {string} characterId
   *  The character ID of the character to update.
   * @param {Character} character
   *  A patch document representing the character fields to change.
   * @returns {boolean}
   *  Whether the character with the specified character ID exists.
   */
  async patchCharacter(characterId, character) {
    const CONSTANT_FIELDS = ['createdDate', 'characterId'];
    const updateOp = {};
    const fields = toPairs(character).filter(([key]) => CONSTANT_FIELDS.indexOf(key) < 0);
    const setFields = fields.filter(([, value]) => value !== null);
    const unsetFields = fields.filter(([, value]) => value === null);
    if (setFields.length > 0) {
      updateOp.$set = fromPairs(setFields);
    }
    if (unsetFields.length > 0) {
      updateOp.$unset = fromPairs(unsetFields);
    }
    return this.dbClient.getDatabase(async (db) => {
      const response = await db.collection('characters').updateOne({ characterId }, updateOp);
      return response.matchedCount === 1;
    });
  }

  /**
   * Changes all fields of a character.
   * The `characterId` and `createdDate` properties will be ignored as they cannot be changed;
   * instead, the `characterId` parameter of the method will be used to locate the record
   * to update.
   * @param {string} characterId
   *  The character ID of the character to update.
   * @param {Character} character
   *  A patch document representing the character fields to change.
   * @returns {boolean}
   *  Whether the character with the specified character ID exists.
   */
  async replaceCharacter(characterId, character) {
    const CONSTANT_FIELDS = ['createdDate', 'characterId'];
    const fields = toPairs(character).filter(([key]) => CONSTANT_FIELDS.indexOf(key) < 0);
    const updateOp = { $set: fromPairs(fields) };
    return this.dbClient.getDatabase(async (db) => {
      const response = await db.collection('characters').updateOne({ characterId }, updateOp);
      return response.matchedCount === 1;
    });
  }

  /**
   * Deletes a character.
   * @param {string} characterId
   *  The character ID of the character to delete.
   * @returns {boolean}
   *  Whether the character was successfully deleted.
   */
  async deleteCharacter(characterId) {
    return this.dbClient.getDatabase(async (db) => {
      const response = await db.collection('characters').deleteOne({ characterId });
      return response.deletedCount === 1;
    });
  }
}

export default CharacterProxy;
