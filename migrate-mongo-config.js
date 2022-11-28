import dotenv from "dotenv";
dotenv.config();

const config = {
    mongodb: {
        // TODO Change (or review) the url to your MongoDB:
        //url: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
        url: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWD}@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:${process.env.DB_PORT},n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:${process.env.DB_PORT}/${process.env.DB_NAME}?replicaSet=rs0`,

        // TODO Change this to your database name:
        //databaseName: `${process.env.DB_NAME}`,

        options: {
            useNewUrlParser: true, // removes a deprecation warning when connecting
            useUnifiedTopology: true, // removes a deprecating warning when connecting
            //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
            //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
        }
    },

    // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
    migrationsDir: "src/migrations",

    // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
    changelogCollectionName: "migrations",

    // The file extension to create migrations and search for in migration dir
    migrationFileExtension: ".js",

    // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determin
    // if the file should be run.  Requires that scripts are coded to be run multiple times.
    useFileHash: false,

    // Don't change this, unless you know what you're doing
    moduleSystem: 'esm',
};

export default config;