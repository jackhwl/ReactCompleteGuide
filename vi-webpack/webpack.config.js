var path = require("path");
const webpack = require("webpack")

module.exports = [
	{
		name: "vendor",
		mode: "production",
		entry: ["./vendor", "./vendor2"],
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "vendor_[chunkhash].js",
			//library: "vendor_[chunkhash]"
		},
		plugins: [
			new webpack.DllPlugin({
				name: "vendor_[chunkhash]",
				path: path.resolve(__dirname, "dist/manifest.json")
			})
		]
	}

	// {
	// 	name: "app",
	// 	// mode: "development || "production",
	// 	dependencies: ["vendor"],
	// 	entry: {
	// 		pageA: "./pageA",
	// 		pageB: "./pageB",
	// 		pageC: "./pageC"
	// 	},
	// 	output: {
	// 		path: path.join(__dirname, "dist"),
	// 		filename: "[name].js"
	// 	},
	// 	plugins: [
	// 		new webpack.DllReferencePlugin({
	// 			manifest: path.resolve(__dirname, "dist/manifest.json")
	// 		})
	// 	]
	// }
]