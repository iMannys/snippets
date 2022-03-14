import path from "path";
import { createConnection } from "mongoose";
import getFiles from "getFiles";
import databaseConnection from "databaseConnection"; // Imports are incorrect, but if you look in the directory you can find some of them by name

let connections = []

const newConnection = (DBName, options = {}) => {
    options.keepAlive = true

    let oldConnection = connections.find(element => element.DBName === DBName) || null

    if (oldConnection) { // We dont want to create new connections and spend resources on that if the an old connection is still active. 
        return oldConnection.connection
    }

    const conn = createConnection(`uri`, options)

    const schemasPath = path.resolve(__dirname, "schemas")
    const schemas = getFiles(schemasPath, ".js") // Get all file paths within a directory
    var schemaObjects = []

    for (const schemaPath of schemas) {
        let module = require(schemaPath)
        if (module.default) module = module.default

        let { name, schema, DatabaseName } = module

        if (DatabaseName == DBName) { // Certain schemas have a database name. We wont create the collection if the database name doesnt match.
            schemaObjects.push({
                name,
                schema,
                isEqual: true
            })
        } else if (DatabaseName.length == 0) {
            schemaObjects.push({
                name,
                schema,
                isEqual: false
            })
        }
    }

    const equalschemaobjects = schemaObjects.filter(obj => obj.isEqual == true) // Checking through what i said earlier

    if (equalschemaobjects.length == 0) {
        schemaObjects.forEach(obj => {
            conn.model(obj.name, obj.schema)
        })
    } else {
        equalschemaobjects.forEach(obj => {
            conn.model(obj.name, obj.schema)
        })
    }

    let dbCon = new databaseConnection(conn, DBName)
    
    connections.push({DBName: DBName, connection: dbCon}) // This is so we dont have to connect all the time. Slowing down commands and bot. (Top of the function)

    return dbCon;
}

const closeConnection = (connection) => {
    let filtered = connections.filter(function(value, index, arr){ // Find the connection as in the parameter
        return value.DBName != connection.DBName
    })

    connections = filtered // Set the new filtered array to the old one.

    connection.connection.close()
}

const closeAllConnections = () => {
    connections.forEach(connection => {
        connection.connection.connection.close()
    })
}

export default { newConnection, closeConnection, closeAllConnections }