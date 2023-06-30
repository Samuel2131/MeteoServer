
import { dbConnection } from "./dbConnection";
import "dotenv/config";

export const startServer = async () => {
    dbConnection();
    console.log(`Server is running in ${process.env.DB === "UserDB" ? "development" : "test"} mode`);
};