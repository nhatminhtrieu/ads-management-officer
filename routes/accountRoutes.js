import express from 'express'
import passport from 'passport'
import FacebookStrategy from 'passport-facebook'

import AccountService from '../services/AccountService.js'


const router = express.Router()
const service = new AccountService()

passport.use(new FacebookStrategy({
    clientID: "304889805870139",
    clientSecret: "8971ed8025628aea94a6542b056029f7",
    callbackURL: "http://localhost:3456/account/facebook/callback",
    profileFields: ['id', 'emails', 'name'] //This
},
    function (accessToken, refreshToken, profile, cb) {
        // const newAccount = {
        //     email: profile.emails[0].value,
        //     fullName: profile.displayName,
        //     password: "123456",
        //     role: 1
        // }
        console.log(profile)
        return cb(null, profile);
    }
));

router.get('/', (req, res) => {
    res.redirect('/account/login')
})

router.get('/login', (req, res) => {
    res.render('vwAccounts/login', { layout: false })
})

router.get('/register', (req, res) => {
    res.render('vwAccounts/signup', { layout: false })
})

router.get('/forgotPassword', async (req, res) => {
    res.render('vwAccounts/forgotPassword', { layout: false })
})

router.post('/forgotPassword', async (req, res) => {
    const otp = Object.values(req.body).join('')
    console.log(otp)
})
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const check = await service.verifyAccount(email, password)
    if (check) {
        req.session.isAuthenticated = true
        res.redirect('/static/html/map.html')
    } else {
        res.render('vwAccounts/login', { layout: false, err_message: 'Invalid email or password' })
    }
})

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/account/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/static/html/map.html');
    }
);
export default router