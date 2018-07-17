module.exports = {
  dbcreate: function (projectId,instanceId,databaseId,callback){
    var status = "";
    const Spanner = require('@google-cloud/spanner');
    const spanner = new Spanner({
      projectId: projectId,
    });
    const instance = spanner.instance(instanceId);
    const request = {
      schema: [
        `CREATE TABLE Singers (
          SingerId    INT64 NOT NULL,
          FirstName   STRING(1024),
          LastName    STRING(1024),
          SingerInfo  BYTES(MAX)
        ) PRIMARY KEY (SingerId)`,
        `CREATE TABLE Albums (
          SingerId    INT64 NOT NULL,
          AlbumId     INT64 NOT NULL,
          AlbumTitle  STRING(MAX)
        ) PRIMARY KEY (SingerId, AlbumId),
        INTERLEAVE IN PARENT Singers ON DELETE CASCADE`,
      ],
    };
    // Creates a database
    instance
      .createDatabase(databaseId, request)
      .then(results => {
        const database = results[0];
        const operation = results[1];

        console.log(`Waiting for operation on ${database.id} to complete...`);
        return operation.promise();
      })
      .then(() => {
        console.log(`Created database ${databaseId} on instance ${instanceId}.`);
        status = `Created database ${databaseId} on instance ${instanceId}.`;
      })
      .catch(err => {
        console.error('ERROR:', err);
        status = err;
      });
      callback(status);
      return
  },
  dbinsert: function (projectId,instanceId,databaseId,callback) {
    var status = "";
    // Imports the Google Cloud client library
    const Spanner = require('@google-cloud/spanner');
    // Creates a client
    const spanner = new Spanner({
      projectId: projectId,
    });

    const instance = spanner.instance(instanceId);
    const database = instance.database(databaseId);
    const singersTable = database.table('Singers');
    const albumsTable = database.table('Albums');

    // Inserts rows into the Singers table
    // Note: Cloud Spanner interprets Node.js numbers as FLOAT64s, so
    // they must be converted to strings before being inserted as INT64s
    singersTable
      .insert([
        {SingerId: '1', FirstName: 'Marc', LastName: 'Richards'},
        {SingerId: '2', FirstName: 'Catalina', LastName: 'Smith'},
        {SingerId: '3', FirstName: 'Alice', LastName: 'Trentor'},
        {SingerId: '4', FirstName: 'Lea', LastName: 'Martin'},
        {SingerId: '5', FirstName: 'David', LastName: 'Lomond'},
      ])
      .then(() => {
        // Inserts rows into the Albums table
        return albumsTable.insert([
          {SingerId: '1', AlbumId: '1', AlbumTitle: 'Total Junk'},
          {SingerId: '1', AlbumId: '2', AlbumTitle: 'Go, Go, Go'},
          {SingerId: '2', AlbumId: '1', AlbumTitle: 'Green'},
          {SingerId: '2', AlbumId: '2', AlbumTitle: 'Forever Hold your Peace'},
          {SingerId: '2', AlbumId: '3', AlbumTitle: 'Terrified'},
        ]);
      })
      .then(() => {
        console.log('Inserted data.');
        status = "Inserted Data";
      })
      .catch(err => {
        console.error('ERROR:', err);
        status = "ERROR:"+ err;
      })
      .then(() => {
        // Close the database when finished.
       database.close();
       callback(status);
       return;
      });

  },
  dbquery: function (projectId,instanceId,databaseId,callback) {
    // Imports the Google Cloud client library
      var start_time = new Date().getTime();
      const Spanner = require('@google-cloud/spanner');
      // Creates a client
      const spanner = new Spanner({
        projectId: projectId,
      });
      // Gets a reference to a Cloud Spanner instance and database
      const instance = spanner.instance(instanceId);
      const database = instance.database(databaseId);
      const query = {
        sql: 'SELECT SingerId, AlbumId, AlbumTitle FROM Albums',
      };
      // Queries rows from the Albums table
      database
        .run(query)
        .then(results => {
          const rows = results[0];

          rows.forEach(row => {
            const json = row.toJSON();
            console.log(`SingerId: ${json.SingerId}, AlbumId: ${json.AlbumId}, AlbumTitle: ${json.AlbumTitle}`);
              status +=`SingerId: ${json.SingerId}, AlbumId: ${json.AlbumId}, AlbumTitle: ${json.AlbumTitle}`;
          });
        })
        .catch(err => {
          console.error('ERROR:', err);
          status = "Error"+err;
        })
        .then(() => {
          // Close the database when finished.
          database.close();
          var request_time = new Date().getTime() - start_time;
          status +="::Query Time:"+request_time;
          callback(status);
          //return ;
        });
  }
};
