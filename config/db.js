/**
 * Created by zeev on 2016/10/12 0012.
 */
module.exports = {
	mysql  : {
		host    : 'rdsne6qtaofnoeesy8e12.mysql.rds.aliyuncs.com',
		user    : 'r8jlip4y4x1s01i3',
		password: '13078272498',
		database: 'r8jlip4y4x1s01i3',
		port    : 3306
	},
	mongodb: process.env.NODE_ENV == 'development' ? 'mongodb://127.0.0.1:27017/zeev' : 'mongodb://zeev:5575127@115.28.213.111:27017/zeev'
//	mongodb: 'mongodb://127.0.0.1:27017/zeev'
}
;