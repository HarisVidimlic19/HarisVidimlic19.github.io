const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const CssMinimizerWebpack = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const glob = require('glob');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const FontminPlugin = require('fontmin-webpack');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");


module.exports = {
    entry: './docs/js/app.js',
    mode: 'production',
    output: {
        path: __dirname + "/dist",
        filename: '[name].bundle.js',
    },
    plugins: [
        new BundleAnalyzerPlugin(),
        new MiniCssExtractPlugin(),
        new PurgeCSSPlugin({
            paths: glob.sync(`./docs/**/*`, { nodir: true, exclude: [] }),
        }),
        new FontminPlugin({
            autodetect: true, // automatically subset all fonts in the output directory
            glyphs: ['\uf277', '\ue0cd', '\uf1d8', '\uf0ac', '\uf09b', '\uf0e1', '\uf178', '\uf041', '\uf095', '\uf0e0', '\uf102', '\uf106', '\uf104', '\ue5d2'] // additional glyphs to keep
        })
    ],
    module: {
        rules: [
            {
                test: /\.(css)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: () => [
                                    require('autoprefixer')
                                ]
                            }
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.(webp)$/i,
                type: "asset",
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name]-optimized.[ext]",
                        outputPath: "images/",
                    },
                },
            },
        ]
    },
    optimization: {
        usedExports: true,
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`,
        },
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
            }),
            new CssMinimizerWebpack(),
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.sharpMinify,
                },
            }),
        ],
        splitChunks: {
            chunks: 'all',
        },
    },


}