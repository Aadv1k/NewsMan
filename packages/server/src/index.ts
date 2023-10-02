import server from "./server";
import client from "./models/client";

import UserModel from "./models/UserModel";
import KeyModel from "./models/KeyModel";


const PORT = 8080;

server.listen(PORT, async () => {
    await client.connect();

    await UserModel.init();
    await KeyModel.init();

    console.log(`Server listening at http://127.0.0.1:${PORT}`);
})
