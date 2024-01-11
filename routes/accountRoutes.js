import express from "express";
import passport from "passport";
import FacebookStrategy from "passport-facebook";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import moment from "moment";
import { config } from "dotenv";

import { statusAuthenticated } from "../utils/enum.js";
import { formatDate } from "../utils/time.js";
import auth from "../middleware/auth.js";
import AccountService from "../services/AccountService.js";
import WardService from "../services/WardService.js";
import DistrictService from "../services/DistrictService.js";

config()
const router = express.Router();
const service = new AccountService();
const districtService = new DistrictService();
const wardService = new WardService();

passport.use(new FacebookStrategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: process.env.FB_CALLBACK_URL,
    profileFields: ['id', 'emails', 'name', 'displayName'],
    passReqToCallback: true
},
    async function (req, accessToken, refreshToken, profile, done) {
        const existedAccount = await service.findByLinkAccount(profile.id);
        var data = {
            ...profile,
            authUser: req.session.authUser,
        }
        if (existedAccount) {
            return done(null, { ...data, status: statusAuthenticated["authenticated"] });
        }

        return done(null, { ...data, status: statusAuthenticated["not authenticated"] });
    }
));

router.get("/", (req, res) => {
    res.redirect("/account/login");
});

router.get("/login", (req, res) => {
    const linkAccount = req.session?.linkAccount;
    res.render("vwAccounts/login", {
        err_message: linkAccount,
        layout: false
    });
});

router.get("/forgotPassword", async (req, res) => {
    const email = req.session.authUser?.email;
    email ? res.render("vwAccounts/verifyOTP", { layout: false }) : res.render("vwAccounts/inputEmail", { layout: false });
});

router.get("/verifyOTP", async (req, res) => {
    res.render("vwAccounts/verifyOTP", { layout: false });
})

router.get("/resetPassword", async (req, res) => {
    res.render("vwAccounts/resetPassword", { layout: false });
})

router.get("/profile", auth, async (req, res) => {
    const { district, role } = req.session.authUser;
    const wardList = (await wardService.getAllWardsByDistrict(district)).map((item) => item.toObject());

    res.render("vwAccounts/infor", {
        layout: "profile",
        wardList: role == 2 ? wardList : null,
        lengthWardList: wardList.length,
    });
});

router.get("/link", auth, (req, res) => {
    const linkAccount = req.session?.linkAccount;
    res.render("vwAccounts/link", {
        err_message: linkAccount,
        layout: "profile.hbs",
    });
})

router.get("/changePassword", auth, (req, res) => {
    res.render("vwAccounts/changePassword", {
        layout: "profile.hbs",
    });
})

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
    "/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/account/login" }),
    async function (req, res) {
        const { status, authUser, id } = req.user;
        if (status == statusAuthenticated["not authenticated"]) {
            if (typeof authUser != "undefined") {
                const { _id } = authUser
                await service.updateLinkAccount(_id, id);
                var user = (await service.findById(_id)).toObject();
                if (user.dob != null) {
                    user.dob = formatDate(user.dob);
                }
                req.session.isAuthenticated = true;
                req.session.authUser = { ...authUser, ...user };
                return res.redirect("/account/link");
            }
            req.session.linkAccount = "Tài khoản chưa được liên kết"
            return res.redirect("/account/login");
        }

        var user = (await service.findByLinkAccount(id)).toObject();
        if (user.dob != null) {
            user.dob = formatDate(user.dob);
        }
        if (typeof authUser != "undefined") {
            if (user._id != authUser._id) {
                req.session.isAuthenticated = true;
                req.session.authUser = authUser;
                req.session.linkAccount = "Tài khoản facebook của bạn đã được liên kết với tài khoản khác"
                return res.redirect("/account/link");
            }
        }

        req.session.isAuthenticated = true;
        const districtInfo = await districtService.getDistrictById(user.district);
        const wardInfo = await wardService.getWardById(user.ward);
        const data = { ...user, districtInfo, wardInfo };
        req.session.authUser = data;
        res.redirect("/home");
    }
);

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    var check = await service.verifyAccount({ username, status: 1 }, password);
    if (check) {
        req.session.isAuthenticated = true;
        if (check.dob != null) {
            check.dob = formatDate(check.dob);
        }
        const districtInfo = await districtService.getDistrictById(check.district);
        const wardInfo = await wardService.getWardById(check.ward);
        const data = { ...check, districtInfo, wardInfo };

        req.session.authUser = data
        res.redirect("/home");
    } else {
        res.render("vwAccounts/login", { layout: false, err_message: "Invalid email or password" });
    }
});

router.post("/sendOTP", async (req, res) => {
    const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    if (Object.keys(req.body).length != 0 || req.session.authUser == undefined) {
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
    var transporter = nodemailer.createTransport({ // config mail server
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
        html:
            '<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">' +
            '<div style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">' +
            '<a href="#" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600;">JCXDC team</a>' +
            '</div>' +
            '<p style="font-size: 1.1em;">Xin chào,</p>' +
            '<p>Cảm ơn bạn đã sử dụng sản phẩm của chúng tôi. Sử dụng mã OTP dưới đây để xác nhận cài đặt lại mật khẩu của tài khoản.</p>' +
            '<div style="background: #00466a; margin: 20px auto; width: fit-content; padding: 10px 20px; color: #fff; border-radius: 4px; font-size: 1.4em;">' +
            otp +
            '</div>' +
            '<p style="font-size: 0.9em;">Trân trọng,<br />JCXDC team</p>' +
            '<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />' +
            '<div style="font-size: 0.8em; color: #aaa; line-height: 1.5; font-weight: 300;">' +
            '<p>JCXDC team</p>' +
            '<p>HCM City</p>' +
            '</div>' +
            '</div>'
    };
    transporter.sendMail(mainOptions, (err, info) => {
        if (err) console.log(err);
        else {
            res.redirect("/account/verifyOTP")
        }
    })
})


router.post("/verifyOTP", async (req, res) => {
    const otp = Object.values(req.body).join("");
    if (otp == req.session.authUser.otp) {
        res.redirect("/account/resetPassword");
    } else {
        res.render("vwAccounts/verifyOTP", { layout: false, err_message: "Mã OTP không đúng" });
    }
});

router.post("/resetPassword", async (req, res) => {
    const password = req.body.password;
    const { username } = req.session.authUser;

    const account = await service.findByUsername(username);
    if (!account) {
        res.render("vwAccounts/inputEmail", { layout: false, err_message: "Tài khoản không tồn tại" });
        return;
    }

    const _id = account._id;
    await service.updatePassword(_id, password);
    res.redirect("/account/login");
})

router.post("/changePassword", auth, async (req, res) => {
    const { _id } = req.session.authUser;
    const { currentPassword, newPassword } = req.body;

    const check = await service.verifyAccount({ _id }, currentPassword);
    if (check) {
        await service.updatePassword(_id, newPassword);
        res.render("vwAccounts/changePassword", { layout: "profile.hbs", success_message: "Đổi mật khẩu thành công" });
    } else {
        res.render("vwAccounts/changePassword", { layout: "profile.hbs", err_message: "Mật khẩu không đúng" });
    }
})

router.post("/changeInfo", auth, async (req, res) => {
    const { _id } = req.session.authUser;
    const { email, fullname, phone, rawDob, address, fav_list_raw } = req.body;

    const dob = (rawDob == '__/__/____' || rawDob == "") ? null : moment.utc(rawDob, "DD/MM/YYYY").toDate();
    const fav_list = !fav_list_raw ? [] : (fav_list_raw[0] == 'on' ? fav_list_raw.slice(1) : fav_list_raw);

    await service.updateProfile(_id, { email, fullname, phone, dob, address, fav_list });

    const user = (await service.findById(_id)).toObject();
    if (user.dob != null) {
        user.dob = moment(user.dob).format("DD/MM/YYYY");
    }
    req.session.authUser = { ...req.session.authUser, ...user };
    res.redirect("/account/profile");
})

router.post("/changeStatus/:id", async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    await service.updateStatus(id, status);
    res.redirect("/admin/officer/" + id);
})


router.post("/logout", auth, (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/account/login");
        }
    });
})
export default router;
