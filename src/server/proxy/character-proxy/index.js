import uuid from 'uuidv4';
import DbClient from '../../client/db-client';

class CharacterProxy {
  constructor() {
    this.dbClient = new DbClient();
  }

  static getQueryFromCursor(cursor) {
    // 'cursor' is base64-encoded LE 48-bit value representing milliseconds
    return cursor
      ? {
        createdDate: { $gte: new Date(Buffer.from(cursor, 'base64').readIntLE(0, 6)) },
      }
      : {};
  }

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

  async getCharacterById(characterId) {
    return this.dbClient.getDatabase(db => db.collection('characters').findOne({ characterId }));
  }

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
}

export default CharacterProxy;
