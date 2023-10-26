const path = require('path');
function resolve (dir) {
	return path.join(__dirname, dir)
}
module.exports = {	
	devServer: {
		proxy: {
			'/api': {
				// target: 'http://csidc.92nu.com:65316',
				target: 'http://csidc.92nu.com',
				// target: 'http://bi_new.92nu.com',
				ws: true,
				changOlrigin: true,		
			}
		}
	},
	assetsDir: "web",
	lintOnSave: true,
	chainWebpack: (config)=>{
		config.resolve.alias
		.set('vendor',resolve('./src/vendor'))
	},
	configureWebpack: {
		devtool: process.env.NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
	}


}