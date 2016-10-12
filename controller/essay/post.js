/**
 * Created by zeev on 2016/10/12 0012.
 */

var getPostInfo = function getPostInfo(req, rep) {
	var id = req.param("id");
	console.log(id);
	rep.render("essay/post", { title: id })
}

module.exports = {
	getPostInfo: getPostInfo
}