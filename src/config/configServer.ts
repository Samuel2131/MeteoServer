
import { checkDatabaseTime } from "../utils/utils";
import { clearNotVerifiedUsers } from "./clearNotVerifiedUsers";
import { dbConnection } from "./dbConnection";

export const startServer = async () => {
    dbConnection();
    console.log(`Server is running in ${process.env.DB === "UserDB" ? "development" : "test"} mode`);
    if(process.env.DB === "UserDB") setInterval(clearNotVerifiedUsers, checkDatabaseTime);
};