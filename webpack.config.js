import path from "path";
import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import { WebpackSweetEntry } from "@sect/webpack-sweet-entry";

const sourcePath = path.join(__dirname, 'src');
const buildPath = path.join(__dirname, 'dist');

module.exports = {
    plugins: [ 
        new webpack.ProvidePlugin({ 
            "jQuery": "jquery", 
            "window.jQuery": "jquery", 
            "jquery": "jquery", 
            "window.jquery": "jquery", 
            "$": "jquery", 
            "window.$": "jquery" ,
        }) 
    ],
    
    entry: WebpackSweetEntry(
        path.resolve(sourcePath, 'js/**/*.js*'), 
        'js', 'js'),
    output: {
        path: path.resolve(buildPath, 'dist/js'),
        filename: '[name].js',
    },

    optimization: {
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              parse: {
                ecma: 8
              },
              compress: {
                ecma: 5,
                warnings: false,
                comparisons: false,
                inline: 2
              },
              mangle: {
                safari10: true
              },
              output: {
                ecma: 5,
                comments: false,
                ascii_only: true
              }
            },
            parallel: true,
            cache: true,
            sourceMap: true
          })
        ]
      },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: require.resolve("babel-loader"),
                    query: {
                        presets: [
                            ["@babel/preset-env", { modules: false }]
                        ]
                    }
                }
            }
        ]
    },

    resolve: {
        alias: {
            "%modules%": path.resolve(__dirname, "src/blocks/modules")
        }
    }
};
