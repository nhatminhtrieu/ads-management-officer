import express from "express";
import passport from "passport";
import FacebookStrategy from "passport-facebook";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

import AccountService from "../services/AccountService.js";

const router = express.Router();
const service = new AccountService();

passport.use(new FacebookStrategy({
    clientID: "304889805870139",
    clientSecret: "8971ed8025628aea94a6542b056029f7",
    callbackURL: "http://localhost:3456/account/facebook/callback",
    profileFields: ['id', 'emails', 'name', 'displayName']
},
    async function (accessToken, refreshToken, profile, cb) {
        const newAccount = {
            email: profile.emails[0].value,
            fullName: profile.displayName,
            password: "123456",
            provider: "facebook",
        }

        await service.createAccount(newAccount)
        return cb(null, profile);
    }
));

router.get("/", (req, res) => {
	res.redirect("/account/login");
});

router.get("/login", (req, res) => {
	res.render("vwAccounts/login", { layout: false });
});

router.get("/register", (req, res) => {
	res.render("vwAccounts/signup", { layout: false });
});

router.get("/forgotPassword", async (req, res) => {
	const email = req.session.authUser?.email;
	email ? res.render("vwAccounts/verifyOTP", { layout: false }) : res.render("vwAccounts/inputEmail", { layout: false });
});

router.post("/sendOTP", async (req, res) => {
    const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    if(Object.keys(req.body).length != 0 || req.session.authUser == undefined) {
        req.session.authUser = {};
        req.session.authUser.username = req.body.username;
        req.session.authUser.email = req.body.email;
    }

    const check = await service.findByUsername(req.session.authUser.username);
    if (!check) {
        res.render("vwAccounts/inputEmail", { layout: false, err_message: "Tài khoản không tồn tại" });
        return;
    }
	req.session.authUser.otp = otp;
	var transporter =  nodemailer.createTransport({ // config mail server
        service: 'Gmail',
        auth: {
            user: 'bddquan@gmail.com',
            pass: 'wjge iflg rmzs nghh'
        }
    });
    var mainOptions = {
        from: 'JCXDC Team',
        to: req.session.authUser.email,
        subject: 'Thay đổi mật khẩu',
        text: 'Bạn nhận được tin nhắn này từ đội ngũ phát triển website - JCXDC team ',
		html: '<p>Mã xác nhận của bạn là <b>' + otp + '</b>'
    }
    transporter.sendMail(mainOptions, (err, info) => {
        if(err) console.log(err);
        else {
            res.redirect("/account/verifyOTP")
        }
    })
})

router.get("/verifyOTP", async (req, res) => {
    res.render("vwAccounts/verifyOTP", { layout: false });
})

router.post("/verifyOTP", async (req, res) => {
	const otp = Object.values(req.body).join("");
	if (otp ==   req.session.authUser.otp) {
        res.redirect("/account/resetPassword");
    } else {
        res.render("vwAccounts/verifyOTP", { layout: false, err_message: "Mã OTP không đúng" });
    }
});

router.get("/resetPassword", async (req, res) => {
    res.render("vwAccounts/resetPassword", { layout: false });
})

router.post("/resetPassword", async (req, res) => {
    const password = req.body.password;
    const { username } = req.session.authUser;

    await service.updatePassword(username, password);
    res.redirect("/account/login");
})

router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const check = await service.verifyAccount(username, password);
	if (check) {
		req.session.isAuthenticated = true;
		req.session.authUser = check;
		res.redirect("/home");
	} else {
		res.render("vwAccounts/login", { layout: false, err_message: "Invalid email or password" });
	}
});

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
	"/facebook/callback",
	passport.authenticate("facebook", { failureRedirect: "/account/login" }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect("/static/html/map.html");
	}
);

router.get("/profile", (req, res) => {
	res.render("vwAccounts/profile");
});

router.post("/logout", (req, res) => {
	req.session.isAuthenticated = false;
	req.session.authUser = null;
	res.redirect("/account/login");
})
export default router;
