import express from "express";
import cors from "cors";
import { engine } from "express-handlebars";
import hbs_sections from "express-handlebars-sections";
import session from "express-session";

import Connection from "./database/Connection.js";
import routesMdw from "./middleware/routes.js";
import auth from "./middleware/auth.js";

const app = express();
const port = 3456;
app.engine(
	"hbs",
	engine({
		extname: "hbs",
		defaultLayout: "main.hbs",
		helpers: {
			section: hbs_sections(),
		},
	})
);
app.set("view engine", "hbs");
app.set("views", "./views");
app.set("trust proxy", 1); // trust first proxy

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		secret: "JCXDC",
		resave: false,
		saveUninitialized: true,
		cookie: {},
	})
);

app.use(function (req, res, next) {
	if (typeof req.session.isAuthenticated === "undefined") {
		req.session.isAuthenticated = false;
		res.redirect("/account/login");
	} else {
		next();
	}
});

app.use("/static", auth, express.static("static"));
routesMdw(app);

app.listen(port, () => {
	console.log(`Example app listening on 127.0.0.1:${port}`);
});

Connection();
