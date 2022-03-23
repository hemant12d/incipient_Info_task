import DB from "./DB.js"; DB();

import App from "./App.js";

// Server listing on local host
App.listen(process.env.APP_PORT * 1,  () => {
    console.log(`Local Host : http://127.0.0.1:${process.env.APP_PORT}/`);
});