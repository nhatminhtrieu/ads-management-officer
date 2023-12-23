import express from "express";
import cors from "cors";
import { engine } from "express-handlebars";
import hbs_sections from "express-handlebars-sections";
import session from "express-session";

import Connection from "./database/Connection.js";
import routesMdw from "./middleware/routes.js";

// import AccountService from "./services/AccountService.js";

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
	// const service = new AccountService();
	// const newAccount = {
	// 	fullName: "Lê Vũ Ngân Trúc",
	// 	email: "lvntruc21@clc.fitus.edu.vn",
	// 	password: "12345678",
	// 	createdBy: "department",
	// 	createdAt: new Date(),
	// 	phoneNumber: "0939074483",
	// 	birthday: new Date(),
	// 	role: 1,
	// };
	// await service.createAccount(newAccount);
	if (typeof req.session.isAuthenticated === "undefined") {
		req.session.isAuthenticated = false;
		res.redirect("/account/login");
	} else {
		next();
	}
});

app.use("/static", auth, express.static("static"));
routesMdw(app, auth);

app.listen(port, () => {
	console.log(`Example app listening on 127.0.0.1:${port}`);
});

Connection();
