import DbClient from '../../client/db-client';

class CharacterProxy {
  constructor() {
    this.dbClient = new DbClient();
  }

  async getCharacterIds() {
    return this.dbClient.getCollection('characters', collection =>
      collection
        .find({})
        .project({ characterId: true })
        .map(character => character.characterId)
        .toArray());
  }

  async getCharacterById(characterId) {
    return this.dbClient.getCollection('characters', collection =>
      collection.findOne({ characterId }, { fields: { characterId: true, name: true } }));
  }
}

export default CharacterProxy;
