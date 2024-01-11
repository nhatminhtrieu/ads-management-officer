import { roleEnum } from "../utils/enum.js";

export default function (req, res, next) {
	req.session.isAuthenticated == true ? next() : res.redirect("/account/login");
	// req.session.isAuthenticated == true ? next() : next()
}

export function authDepartmentRole(req, res, next) {
	req.session.authUser?.role == roleEnum.departmentOfficial ? next() : res.redirect("/errors/403");
}

export function authNotDepartmentRole(req, res, next) {
	req.session.authUser?.role == roleEnum.departmentOfficial ? res.redirect("/errors/403") : next();
}
