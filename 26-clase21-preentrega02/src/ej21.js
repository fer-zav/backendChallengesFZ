import Server from "./services/server.js";
import {Config} from "./config/config.js";

const port = Config.PORT;
Server.listen(port, () => console.log(`Servidor HTTP escuchado @ puerto ${port}`))
.on("error", (error) => console.log(`SERVER ERROR!: ${error}`));
