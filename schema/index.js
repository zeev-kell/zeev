/**
 * Created by Administrator on 2016/5/8 0008.
 */

var mongoose = require("mongoose");

/**  Schema  不具备数据库的操作能力
 *              var PersonSchema = new mongoose.Schema({
                    name:String   //定义一个属性name，类型为String
                });
 *   Model   由Schema发布生成的模型，具有抽象属性和行为的数据库操作对
 *              var PersonModel = db.model('Person',PersonSchema);
 *
 *   Entity  由Model创建的实体，他的操作也会影响数据库
 *              var personEntity = new PersonModel({name:'Krouky'});
 */
/*
	.populate({
		path: 'fans',
		match: { age: { $gte: 21 }},
		select: 'name -_id',
		options: { limit: 5 }
	})

	{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
	populate
	virtual
	validateBeforeSave

	.aggregate([
     {
        $group : {
           _id : { month: { $month: "$date" }, day: { $dayOfMonth: "$date" }, year: { $year: "$date" } }, //-- 按照 年月日 分组
           totalPrice: { $sum: { $multiply: [ "$price", "$quantity" ] } }, //-- 计算  $price * $quantity 总和
           averageQuantity: { $avg: "$quantity" },//-- 计算平均值
           count: { $sum: 1 }//-- 条数
        }
      }
   ])

*/
mongoose.model("User", require("./user"));
mongoose.model("Message", require("./message"));
mongoose.model("Visitor", require("./visitor"));
mongoose.model("Log", require("./log"));
mongoose.model("Post", require("./post"));
mongoose.model("Tag", require("./tag"));

var _getModel = function (type) {
	return mongoose.model(type);
}

module.exports = {
	getModel : function (type) {
		return _getModel(type);
	},
	getSchema: function (type) {
		return require("./" + type);
	}
}
