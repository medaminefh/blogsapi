module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    return await db
      .collection("blogs")
      .updateMany({ img_url: { $exists: false } }, { $set: { img_url: "" } });
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    return await db
      .collection("blogs")
      .updateMany({ img_url: { $exists: true } }, { $unset: { img_url: "" } });
  },
};
