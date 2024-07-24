
import mongoose from "mongoose";

class DbConnection {

    private _url: string;
    private _databaseConnection: mongoose.Connection | null = null;

    constructor() {
        this._url = `mongodb://maxDb:27017/maxDatabase`;
    }

    public createConnection(): boolean {
        mongoose.connect(this._url);
        this._databaseConnection = mongoose.connection;
        this._databaseConnection.on("error", (e) => {
            console.log(`Error [${e}]`);
        });
        return true;
    }

    public getConnection(): mongoose.Connection | null {
        return this._databaseConnection;
    }
};

export default DbConnection;