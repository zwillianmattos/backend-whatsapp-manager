import dotenv from "dotenv";
import App from "./App";
import routes from "./routes/Routes";

dotenv.config();

const port = process.env.SERVER_PORT || 8080;
App.getInstance().server.listen(port, () => {
    console.log(`Listening: ${port}`);

    App.getInstance().app.use(routes);
});
