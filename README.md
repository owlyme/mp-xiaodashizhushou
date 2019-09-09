## 介绍
> 开发工作: [WeApp-Workflow](https://github.com/Jeff2Ma/WeApp-Workflow)
> UI: [weui](https://github.com/Tencent/weui-wxss)

## 业务组件
> 公共组建：1、 基本信息 2、消息类型过滤  3、tabs  4、 顶部  5. loading 6、搜索  7、折叠面板
> 会话组件：1、图文消息 2、模板消息 3、文件 4、会话或者粉丝异常状态的处理组件 5、富文本编辑 6、粉丝标识

## 图片静态资源引用
> %ASSETS_IMG% 会被替换
> <image src="%ASSETS_IMG%/images/123.jpg" />
> 									|
> <image src="http:127.0.0.1:8000/images/123.jpg" />
			placeholder="{{ placeholder }}"
			placeholder-style="{{ placeholderStyle }}"
			placeholder-class="{{ error ? 'van-field__placeholder--error' : 'van-field__placeholder' }}"
			confirm-type="{{ confirmType }}"
			confirm-hold="{{ confirmHold }}"
			cursor-spacing="{{ cursorSpacing }}"
			adjust-position="{{ adjustPosition }}"


## wx stroage
小程序Store全局变量字段
userInfo    从微信获取到的微信用户信息
sessionId    前端生成的sessionId值，用于登录与用户身份验证
companyId  进入企业时存入Store，解绑session时将该值置空（当前仅用于验证用户是否进入了企业）
company   完整的公司信息
user     进入公司时，后端返回的用户信息