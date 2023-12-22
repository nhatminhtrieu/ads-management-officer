import express from 'express'
import AccountService from '../services/AccountService.js'


const router = express.Router()
const service = new AccountService()

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
export default router