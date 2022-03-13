import { Connection, connection, Model } from "mongoose";

class databaseConnection {
    
    connection = connection
    DBName: string

    constructor(conn: Connection, DBName: string) {
        this.connection = conn
        this.DBName = DBName
    }

    getModel(name: string): Model<any, any, any, any> | undefined {
        const models = this.connection.models
        
        if (!models[name]) return
    
        return models[name];
    }
}

export default databaseConnection