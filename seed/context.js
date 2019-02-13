'use strict';

const { MongoClient, ObjectID } = require('mongodb');

class Context {
  constructor(url, enableLogging) {
    this.client = new MongoClient(url, { useNewUrlParser: true });
    this.enableLogging = enableLogging;
    this.db = {};
  }

  log(message) {
    if (this.enableLogging) {
      console.info(message);
    }
  }

  async connect(dbName) {
    this.log('Connecting to the database...');
    const server = await this.client.connect();
    this.db = server.db(dbName);
  }

  prepareObjectIDs(documents) {
    documents.forEach((document) => {
      Object.keys(document).forEach((key) => {
        const value = document[key];

        if (value.$oid) {
          /* eslint-disable no-param-reassign */
          document[key] = ObjectID.createFromHexString(value.$oid);
        }
      });
    });
  }

  async insertDocuments(collectionName, documents) {
    this.prepareObjectIDs(documents);

    const collection = this.db.collection(collectionName);

    this.log(`Removing all documents from the '${collectionName}' collection...`);
    await collection.deleteMany();

    this.log(`Inserting documents into the '${collectionName}' collection...`);
    await collection.insertMany(documents);
  }
}

module.exports = Context;
