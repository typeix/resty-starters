import {pipeServer} from "@typeix/resty";
import {AppModule} from "./app.module";
import {createServer} from "http";

/**
 * Bootstraps server
 *
 * @function
 * @name pipeServer
 *
 */
async function bootstrap() {
  const server = createServer();
  await pipeServer(server, AppModule);
  server.listen(8080);
}

export default bootstrap();
