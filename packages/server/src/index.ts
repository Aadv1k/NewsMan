import server from "./server";
import client from "./models/client";

import UserModel from "./models/UserModel";
import KeyModel from "./models/KeyModel";

import newsCache from "./newsCache";

import * as NewsMan from "@newsman/core";


const PORT = 8080;

server.listen(PORT, async () => {

    try {
        await client.connect();

        await UserModel.init();
        await KeyModel.init();

        await NewsMan.fetchHeadlines({}, newsCache)

        console.log(`Server listening at http://127.0.0.1:${PORT}`);
    } catch (error: any) { 
        console.error("Database was not properly configured!", error.message);
        process.exit(1);
    }
});
