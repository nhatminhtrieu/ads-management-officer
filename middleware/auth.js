export default function (req, res, next) {
    req.session.isAuthenticated == true ? next() : next() 
}