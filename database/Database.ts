import path from "path";
import { ConnectOptions, createConnection } from "mongoose";
import getFiles from "getFiles";
import databaseConnection from "databaseConnection"; // Imports are incorrect, but if you look in the directory you can find some of them by name

let connections: { DBName: string, connection: databaseConnection }[] = []

const newConnection = (DBName: string, options: ConnectOptions = {}): databaseConnection => {
    options.keepAlive = true

    let oldConnection = connections.find(element => element.DBName === DBName) || null

    if (oldConnection) {
        return oldConnection.connection
    }

    const conn = createConnection(`uri`, options)

    const schemasPath = path.resolve(__dirname, "schemas")
    const schemas = getFiles(schemasPath, ".js")
    var schemaObjects = []

    for (const schemaPath of schemas) {
        let module = require(schemaPath)
        if (module.default) module = module.default

        let { name, schema, DatabaseName } = module

        if (DatabaseName == DBName) {
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

    const equalschemaobjects = schemaObjects.filter(obj => obj.isEqual == true)

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
    
    connections.push({DBName: DBName, connection: dbCon}) // This is so we dont have to connect all the time. Slowing down commands and bot.

    return dbCon;
}

const closeConnection = (connection: databaseConnection) => {
    let filtered = connections.filter(function(value, index, arr){
        return value.DBName != connection.DBName
    })

    connections = filtered

    connection.connection.close()
}

const closeAllConnections = () => {
    connections.forEach(connection => {
        connection.connection.connection.close() // lol
    })
}

export default { newConnection, closeConnection, closeAllConnections }