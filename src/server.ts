import { app } from "./app";

const port = app.get("port");

const vision = require("@google-cloud/vision");

const client = new vision.ImageAnnotatorClient({
    keyFilename: "./key.json",
});
import animals from "./animals";
client
    .objectLocalization("./bison.jpg")
    .then((results: any) => {
        const name = results[0].localizedObjectAnnotations[0].name;
        const isName = animals.includes(name);
        if (isName) {
            console.log("Animal found");
            console.log(name);
        } else {
            console.log("Animal not found: ", name);
        }
    })
    .catch((err: any) => {
        console.error("ERROR:", err);
    });

const server = app.listen(port, onListening);
server.on("error", onError);

function onError(error: NodeJS.ErrnoException) {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind =
        typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
}

export default server;
