/**
 * Add createdDate column (which will be used to sort character IDs).
 * Add an index that includes createdDate, characterId, and name so that
 * retrieving all character IDs with character names can be done with a
 * covered query.
 */
module.exports = {
  async up(db) {
    // Add index on created date first, then character ID and name.
    // Name is added to the index so that searching for character IDs and names
    // ordered by createdDate is a covered query.
    //
    // Those three fields, plus the to-be-added user ID field, are intended to
    // be the primary key for a much larger character document.
    await db.collection('characters').createIndex(
      {
        createdDate: 1,
        characterId: 1,
        name: 1,
        _id: 1,
      },
      { sparse: true, name: 'dateIdName' },
    );

    await db.collection('characters').updateOne(
      { characterId: 'a1', createdDate: { $exists: false } },
      {
        $set: { createdDate: new Date(2019, 0, 1, 12, 0, 0) },
      },
    );
    await db.collection('characters').updateOne(
      { characterId: 'b2', createdDate: { $exists: false } },
      {
        $set: { createdDate: new Date(2019, 0, 1, 13, 0, 0) },
      },
    );
  },
  async down(db) {
    await db.collection('characters').dropIndex('dateIdName');
    // Leave any existing created dates.
  },
};
