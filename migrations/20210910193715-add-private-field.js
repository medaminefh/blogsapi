module.exports = {
  async up(db) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    return await db
      .collection("blogs")
      .updateMany(
        { private: { $exists: false } },
        { $set: { private: false } }
      );
  },

  async down(db) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});

    return await db
      .collection("blogs")
      .updateMany(
        { private: { $exists: true } },
        { $unset: { private: false } }
      );
  },
};
