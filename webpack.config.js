const path = require('path');

// 處理CSS的外掛程式
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const CopyWebpackPlugin = require("copy-webpack-plugin");

const webpack = require("webpack"); // 用於訪問內置插件

const HtmlWebpackPlugin = require("html-webpack-plugin");

const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 它能帮我们在打包之前 自动删除 dist打包目录及其目录下所有文件，不用我们手动进行删除

const EncodingPlugin = require('webpack-encoding-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  context: path.resolve(__dirname, "./src"),
  devServer: {
    compress: true,
    port: 4000,
    historyApiFallback: true,
    hot: true,
    open: true,
    proxy: {
      "/CheckToken": {
        "target": "http://backend.wedding-pass.com/WebService_System_Ryan.asmx",
        "changeOrigin": true
      },
      "/*": {
        "target": "http://backend.wedding-pass.com/WebService_SF_WEDDING_PASS.asmx",
        "changeOrigin": true
      }
    }
  },
  //devtool: 'cheap-module-eval-source-map',
  entry: {
    index: './js/index.js',
    language: './js/language.js',
    start: './js/start.js',
    main: './js/main.js',
    edm: './js/edm.js', // 電子邀請函
    senddemo: './js/senddemo', // Send Demo
    information: './js/information.js',  // 婚禮基本資料編緝
    webregistrationsetup: './js/webregistrationsetup.js', // 婚禮報名網站設定
    listmgr: './js/listmgr.js', // 完整名單管理
    notifymgr: './js/notifymgr.js', // 報到簡訊通知
    send: './js/send.js', // Email 電子邀請函發送
    sendMMS: './js/sendMMS.js', // MMS 電子邀請函發送
    sendSMS: './js/sendSMS.js', // SMS 電子邀請函發送
    sticker: './js/sticker.js', // 傳統喜帖 QRC 貼紙索取
    datachart: './js/datachart.js', // 賓客資料分析圖
    checkinchart: './js/checkinchart.js', // 賓客報到分析圖
    congratulation: './js/congratulation.js', // 賓客賀詞
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: './js/[name].js?[fullhash:8]',
  },
  module: {
    rules: [
      // 字型檔
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              //limit: 100000,
              //outputPath: 'css/fonts/',
              name: '[name].[ext]',
            }
          }
        ]
      },
      /*
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',
            }
          }
        ]
      },
      */
      // JPG, JPEG, PNG, GIF
      {
        test: /\.(jpe?g|svg|png|gif)$/i, 
        type: 'asset/resource'
      },
      // ICO
      { 
        test: /\.ico$/, 
        loader: 'file-loader', 
        options: {
          name: '[name].[ext]'
        }
      },
      // CSS, SASS, SCSS
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => {
                return path.relative(path.dirname(resourcePath), context) + "/";
              },
            },
          },
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ]
      },
      // JS
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
    new EncodingPlugin({
      encoding: 'utf-8'
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public" },
        { from: "fonts", to: "fonts" },
        { from: "assets", to: "assets" },
        { from: "images", to: "images" }
      ],
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new HtmlWebpackPlugin({
      title: 'WeddingPass｜讓婚禮輕鬆一點',
      filename: 'index.html',
      template: 'html/index.html',
      viewport: 'width=device-width, initial-scale=1.0',
      //description: '',
      //Keywords: '',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      title: 'Language',
      filename: 'language.html',
      template: 'html/language.html',
      viewport: 'width=device-width, initial-scale=1.0',
      //description: '',
      //Keywords: '',
      chunks: ['language']
    }),
    new HtmlWebpackPlugin({
      title: '開始體驗',
      filename: 'start.html',
      template: 'html/language.html',
      viewport: 'width=device-width, initial-scale=1.0',
      //description: '',
      //Keywords: '',
      chunks: ['start']
    }),
    new HtmlWebpackPlugin({
      title: 'WEDDING PASS',
      filename: 'main.html',
      template: 'html/main.html',
      viewport: 'width=device-width, initial-scale=1.0',
      //description: '',
      //Keywords: '',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      title: '電子喜帖邀請函產生',
      filename: 'edm.html',
      template: 'html/main.html',
      viewport: 'width=device-width, initial-scale=1.0',
      //description: '',
      //Keywords: '',
      chunks: ['edm']
    }),
    new HtmlWebpackPlugin({
      title: '婚宴資料編輯',
      filename: 'information.html',
      template: 'html/main.html',
      viewport: 'width=device-width, initial-scale=1.0',
      //description: '',
      //Keywords: '',
      chunks: ['information']
    }),
    new HtmlWebpackPlugin({
      title: '婚禮報名網站設定',
      filename: 'webregistrationsetup.html',
      template: 'html/main.html',
      viewport: 'width=device-width, initial-scale=1.0',
      //description: '',
      //Keywords: '',
      chunks: ['webregistrationsetup']
    }),
    new HtmlWebpackPlugin({
      title: '賓客名單建立',
      filename: 'listmgr.html',
      template: 'html/main.html',
      viewport: 'width=device-width, initial-scale=1.0',
      //description: '',
      //Keywords: '',
      chunks: ['listmgr']
    }),
    new HtmlWebpackPlugin({
      title: '報到簡訊通知',
      filename: 'notifymgr.html',
      template: 'html/main.html',
      viewport: 'width=device-width, initial-scale=1.0',
      //description: '',
      //Keywords: '',
      chunks: ['notifymgr']
    }),
    new HtmlWebpackPlugin({
      title: 'Email 電子邀請函發送',
      filename: 'send.html',
      template: 'html/main.html',
      viewport: 'width=device-width, initial-scale=1.0',
      //description: '',
      //Keywords: '',
      chunks: ['send']
    }),
    new HtmlWebpackPlugin({
      title: 'MMS 電子邀請函發送',
      filename: 'SendMMS.html',
      template: 'html/main.html',
      viewport: 'width=device-width, initial-scale=1.0',
      //description: '',
      //Keywords: '',
      chunks: ['sendMMS']
    }),
    new HtmlWebpackPlugin({
      title: 'SMS 電子邀請函發送',
      filename: 'SendSMS.html',
      template: 'html/main.html',
      viewport: 'width=device-width, initial-scale=1.0',
      //description: '',
      //Keywords: '',
      chunks: ['sendSMS']
    }),
    new HtmlWebpackPlugin({
      title: '賓客專屬QRCode索取貼紙',
      filename: 'sticker.html',
      template: 'html/main.html',
      viewport: 'width=device-width, initial-scale=1.0',
      //description: '',
      //Keywords: '',
      chunks: ['sticker']
    }),
    new HtmlWebpackPlugin({
      title: '賓客資料分析圖',
      filename: 'datachart.html',
      template: 'html/main.html',
      viewport: 'width=device-width, initial-scale=1.0',
      //description: '',
      //Keywords: '',
      chunks: ['datachart']
    }),
    new HtmlWebpackPlugin({
      title: '賓客報到分析圖',
      filename: 'checkinchart.html',
      template: 'html/main.html',
      viewport: 'width=device-width, initial-scale=1.0',
      //description: '',
      //Keywords: '',
      chunks: ['checkinchart']
    }),
    new HtmlWebpackPlugin({
      title: '賓客賀詞',
      filename: 'Congratulation.html',
      template: 'html/main.html',
      viewport: 'width=device-width, initial-scale=1.0',
      //description: '',
      //Keywords: '',
      chunks: ['congratulation']
    }),
    new HtmlWebpackPlugin({
      title: '測試發送電子邀請函',
      filename: 'senddemo.html',
      template: 'html/main.html',
      viewport: 'width=device-width, initial-scale=1.0',
      //description: '',
      //Keywords: '',
      chunks: ['senddemo']
    }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    //minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        test: /\.css$/i,
      }),
    ],
  },
}