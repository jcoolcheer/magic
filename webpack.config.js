var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var isProd = process.env.NODE_ENV === 'production'
var cssDev = ['style-loader', 'css-loader', 'less-loader']
var cssProd = ExtractTextPlugin.extract({
	fallback: 'style-loader',
	use: ['css-loader', 'less-loader']
})
// http://7xrjka.com1.z0.glb.clouddn.com/Napalm%20Death%20-%20You%20Suffer.mp3
var cssConfig = isProd ? cssProd : cssDev

var glob = require('glob')
var PurifyCSSPlugin = require('purifycss-webpack')

module.exports = {
	entry: {
		main: './src/main.js'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js'
	},
	resolve: {
		extensions: ['.js', '.vue', '.json', '.less'],
		alias: {
		  'vue$': 'vue/dist/vue.esm.js'
		}
	},
	devServer: {
		contentBase: path.resolve(__dirname, 'dist'),
		port: 9090,
		open: true,
		hot: true,
		openPage: ''
	},
	module: {
		rules: [
		{
			test: /\.(js|jsx)$/, 
			exclude: /node_modules/,
			use: 'babel-loader' 
		},
		{
			test: /\.vue$/,
			use: ['vue-loader']
		},
		{
			test: /\.pug$/, 
			use: ['html-loader', 'pug-html-loader'] 
		},
		{
			test: /\.(less|css)$/, 
			use: cssConfig
		},
		{
			test: /\.jpg$/, 
			use: [
			'file-loader?name=imgs/[name].[ext]',						
			'image-webpack-loader'
			]
		},
		{ test: /\.(woff2?|svg|eot)$/, loader: 'url-loader?limit=10000' },
		{ test: /\.(ttf|eot)$/, loader: 'file-loader' }
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: 'index.html',
			chunks: 'main',
			hash: true
		}),
		new ExtractTextPlugin({
			filename: '[name].css',
			disable: !isProd
		})
	]
}