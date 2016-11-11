/**
 * Created by zeev on 2016/11/11 0011.
 */

var router = require("express").Router();

router.get("/chat", function (req, res, next) {
	res.render("project/chat", { title: "聊天系统" })
})

module.exports =  router;