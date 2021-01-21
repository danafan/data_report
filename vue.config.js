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
	// assetsDir: "admin"
}