import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/404');
})

router.get('/404', (req, res) => {
    res.render('vwErrors/404', {
        layout: 'error',
    });
})

router.get('/403', (req, res) => {
    res.render('vwErrors/403', {
        layout: 'error',
    });
})

export default router;