/**
 * Create two entries in the character database for testing purposes.
 */
module.exports = {
  async up(db) {
    return db
      .collection('characters')
      .insertMany([
        { characterId: 'a1', name: 'John Doe' },
        { characterId: 'b2', name: 'Jane Doe' },
      ]);
  },
  async down(db) {
    await db.collection('characters').deleteMany({
      characterId: { $in: ['a1', 'b2'] },
    });
  },
};
