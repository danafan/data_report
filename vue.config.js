const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {	
	devServer: {
		proxy: {
			'/api': {
				target: 'http://csidc.gxk8090.com',
				ws: true,
				changOlrigin: true,		//是否跨域
			}
		}
	},
	lintOnSave: true,
	chainWebpack: (config)=>{
		config.resolve.alias
		.set('vendor',resolve('./src/vendor'))
	}
	// assetsDir: "admin"
}