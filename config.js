
console.log(process.env.NODE_ENV)
// env
// %API_PATH%
// %ASSETS_IMG%
const prodEnv = {
	rootApi: 'https://api.xiaodashi.com', // 请求地址
	assetsUrl: "https://api.xiaodashi.com", // 静态资源地址 待定
	Bucket: 'xds-10-1-1255528578',
	Region: 'ap-shanghai',
	buildDir: 'distprod',
	webViewUrl: 'https://h5.xiaodashi.com'
}
const testEnv = {
	rootApi: 'https://api.xingke100.com', // 请求地址
	assetsUrl: "https://api.xingke100.com", // 静态资源地址 待定
	Bucket: 'xds-10-2-1255528578',
	Region: 'ap-shanghai',
	buildDir: 'dist',
	webViewUrl: 'https://h5.xingke100.com'
}
const devEnv = {
	rootApi: 'http://127.0.0.1:8091',
	assetsUrl: 'http://127.0.0.1:8000',
	Bucket: 'xds-10-2-1255528578',
	Region: 'ap-shanghai',
	buildDir: 'dist',
	webViewUrl: 'https://h5.xingke100.com'
}
const ENV = process.env.NODE_ENV === 'production' ? prodEnv :
				process.env.NODE_ENV === 'testing' ? testEnv : devEnv

module.exports = {
	...ENV,
	"enabledQcloud": false, //是否开启腾讯云COS 上传功能
	// 腾讯云COS 上传功能配置表
	"qcloud": {
		"appid": "1111111",
		"secretId": "xxx",
		"secretKey": "xxxxx",
		"bucket": "xxxx",
		"region": "sh",
		"prefix": "what-ever/you-want",
		"overWrite": true,
		"headers": {
			"Cache-Control": "max-age=5184000"
		}
	},
	// 静态资源CDN 域名，配合CDN 功能实用，线上请确保在mp管理端已经注册域名
	"assetsCDN": "https://res.jianhui.org/",
};
