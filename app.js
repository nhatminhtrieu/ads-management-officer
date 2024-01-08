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
import ResidentRouter from "./routes/residentRoutes.js";
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
				switch (operator) {
					case "==":
						return v1 == v2 ? options.fn(this) : options.inverse(this);
					case "===":
						return v1 === v2 ? options.fn(this) : options.inverse(this);
					case "!=":
						return v1 != v2 ? options.fn(this) : options.inverse(this);
					case "!==":
						return v1 !== v2 ? options.fn(this) : options.inverse(this);
					case "<":
						return v1 < v2 ? options.fn(this) : options.inverse(this);
					case "<=":
						return v1 <= v2 ? options.fn(this) : options.inverse(this);
					case ">":
						return v1 > v2 ? options.fn(this) : options.inverse(this);
					case ">=":
						return v1 >= v2 ? options.fn(this) : options.inverse(this);
					case "&&":
						return v1 && v2 ? options.fn(this) : options.inverse(this);
					case "||":
						return v1 || v2 ? options.fn(this) : options.inverse(this);
					default:
						return options.inverse(this);
				}
			},

			json: function (obj) {
				return JSON.stringify(obj);
			},

			debugger(value) {
				console.log("Value: ", value);
				return;
			},
		},
	})
);
app.set("view engine", "hbs");
app.set("views", "./views");
app.set("trust proxy", 1); // trust first proxy

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Expose API use for residents
app.use("/resident", ResidentRouter);

// Authentication and authorization
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: {},
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, cb) {
	cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
	cb(null, obj);
});
app.use(function (req, res, next) {
	if (typeof req.session.isAuthenticated === "undefined") {
		req.session.isAuthenticated = false;
		res.redirect("/account/login");
	} else {
		if (req.session.authUser) {
			res.locals.authUser = req.session.authUser;
		}
		next();
	}
});

// Private routes
app.use("/static", auth, express.static("static"));
routesMdw(app);

// SSL and HTTPS configuration
import fs from "fs";
import https from "https";

const privateKey = fs.readFileSync("./sslcert/private.key", "utf8");
const certificate = fs.readFileSync("./sslcert/certificate.crt", "utf8");
const ca = fs.readFileSync("./sslcert/ca_bundle.crt", "utf8");

const credentials = { key: privateKey, cert: certificate, ca: ca };
const httpsServer = https.createServer(credentials, app);

Connection().then(() => {
	httpsServer.listen(port, () => {
		console.log(`App is running on https://127.0.0.1:${port}`);
	});
});