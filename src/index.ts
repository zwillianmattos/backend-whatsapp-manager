import App from "./App";
import routes from "./routes/Routes";

const port = process.env.PORT || process.env.SERVER_PORT || 9001;
App.getInstance().server.listen(port, () => {
    console.log(`Listening: ${port}`);

    App.getInstance().app.use(routes);
});
