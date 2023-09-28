import server from "./server";

const PORT = 8080;

server.listen(PORT, () => {
    console.log(`Server listening at http://127.0.0.1:${PORT}`);
})
