const webpack = require( 'webpack' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' ); // CSS loader for styles specific to block editing.
const glob = require( 'glob' );
const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' );

// Configuration for the ExtractTextPlugin.
const extractConfig = {
	use: [
		{
			loader: 'css-loader',
			options: {
				importLoaders: 1,
			},
		},
		{
			loader: 'postcss-loader',
			options: {
				plugins: [
					require( 'autoprefixer' ),
				],
			},
		},
		{
			loader: 'sass-loader',
			query: {
				outputStyle: 'production' === process.env.NODE_ENV ? 'compressed' : 'nested',
			},
		},
	],
};

const editBlocksCSSPlugin = new ExtractTextPlugin( {
	filename: './blocks/build/blocks.editor.build.css',
} );

// CSS loader for styles specific to blocks in general.
const blocksCSSPlugin = new ExtractTextPlugin( {
	filename: './blocks/build/blocks.style.build.css',
} );

const externals = {
	react: 'React',
	'react-dom': 'ReactDOM',
	'react-dom/server': 'ReactDOMServer',
	tinymce: 'tinymce',
	moment: 'moment',
	jquery: 'jQuery',
	'@wordpress/components': 'wp.components', // Not really a package.
};

module.exports = {
	entry: {
		blocks: glob.sync( './blocks/*/blocks.js' ),
	},
	output: {
		filename: 'blocks/build/blocks.build.js',
		path: __dirname,
	},
	externals,
	resolve: {
		modules: [
			__dirname,
			'node_modules',
		],
	},
	module: {
		rules: [
			{
				test: /.js?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /style\.s?css$/,
				include: [
					/block/,
				],
				use: blocksCSSPlugin.extract( extractConfig ),
			},
			{
				test: /editor\.s?css$/,
				include: [
					/block/,
				],
				use: editBlocksCSSPlugin.extract( extractConfig ),
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin( {
			'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV || 'development' ),
		} ),
		blocksCSSPlugin,
		editBlocksCSSPlugin,
	],
};

if ( process.env.NODE_ENV === 'production' ) {
	module.exports.plugins = ( module.exports.plugins || [] ).concat( [
		new UglifyJsPlugin( {
			sourceMap: true,
			uglifyOptions: {
				ecma: 8,
				compress: {
					warnings: false,
				},
			},
		} ),
	] );
}
