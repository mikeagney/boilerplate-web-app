import DbClient from '../../client/db-client';

class CharacterProxy {
  constructor() {
    this.dbClient = new DbClient();
  }

  async getCharacterIds() {
    return this.dbClient.getDatabase(db =>
      db
        .collection('characters')
        .find({})
        .hint('dateIdName')
        .sort({ createdDate: 1 })
        .project({ characterId: true, name: true, _id: false })
        .toArray());
  }

  async getCharacterById(characterId) {
    return this.dbClient.getDatabase(db => db.collection('characters').findOne({ characterId }));
  }
}

export default CharacterProxy;
