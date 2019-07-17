/**
 * Create index on the characters collection.
 */
module.exports = {
  async up(db) {
    return db
      .collection('characters')
      .createIndex({ characterId: 1 }, { sparse: true, name: 'characterId_1' });
  },
  async down(db) {
    return db.collection('characters').dropIndex('characterId_1');
  },
};
