import { config } from "dotenv";
config();

import express from "express";
import cors from "cors";
import { engine } from "express-handlebars";
import hbs_sections from "express-handlebars-sections";
import session from "express-session";
import passport from "passport";

import Connection from "./database/Connection.js";
import CreateFirstAccount from "./database/CreateFirstAccount.js";
import routesMdw from "./middleware/routes.js";
import auth from "./middleware/auth.js";

import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";

const app = express();
const port = process.env.PORT;
app.engine(
	"hbs",
	engine({
		extname: "hbs",
		defaultLayout: "main.hbs",
		handlebars: allowInsecurePrototypeAccess(Handlebars),
		helpers: {
			section: hbs_sections(),

			inc(value) {
				return parseInt(value) + 1;
			},

			ifCond(v1, operator, v2, options) {
				return eval(`${v1} ${operator} ${v2}`) ? options.fn(this) : options.inverse(this);
			},

			json: function (obj) {
				return JSON.stringify(obj);
			},
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
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: {},
	})
);

app.use(function (req, res, next) {
	// if (typeof req.session.isAuthenticated === "undefined") {
	// 	req.session.isAuthenticated = false;
	// 	res.redirect("/account/login");
	// } else {
	// 	if (req.session.authUser) {
	// 		res.locals.authUser = req.session.authUser;
	// 	}
	// 	next();
	// }
	next();
});

app.use("/static", auth, express.static("static"));
routesMdw(app);

app.listen(port, () => {
	console.log(`Example app listening on http://127.0.0.1:${port}`);
});

await Connection();
await CreateFirstAccount();
