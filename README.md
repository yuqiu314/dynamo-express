# dynamo-express
This is a demo of AWS dynamo db client. It can connect to DynamoDB and do basic operations.

# English Notes
## First of all
You need to have [nodejs](https://nodejs.org/) installed.

## How to start
Enter the source code root directory. Then input the following commands.

`npm install`

`npm run serve`

## How to see
When you see "[Web Server]listerning for request..."

Open your browser and go to `http://localhost:4000`

# Chinese Notes
## 配置方法：
打开aws.js文件，主要修改options.endpoint即可，也可以修改sqs、sns的链接地址。
![](https://github.com/yuqiu314/dynamo-express/blob/master/raw/Picture1.png)

## 启动方法：
`npm install`

`npm run serve`

看到如下界面说明启动成功：
![](https://github.com/yuqiu314/dynamo-express/blob/master/raw/Picture2.png)

## 使用方法：
在浏览器中输入“localhost:4000”，就可以看到所链接的DynamoDB的所有表格。
可以点击查看、删除、新建表格。（Export还没来得及做）
![](https://github.com/yuqiu314/dynamo-express/blob/master/raw/Picture3.png)

点击表格查看以后，可以对表格进行增删改查。时间不够，做的比较粗糙，json还是需要自己写的。
![](https://github.com/yuqiu314/dynamo-express/blob/master/raw/Picture4.png)
![](https://github.com/yuqiu314/dynamo-express/blob/master/raw/Picture5.png)

点击Enable Stream以后就会打开一个child process进行监听，并将消息发送给sqs进程，格式化打印。
![](https://github.com/yuqiu314/dynamo-express/blob/master/raw/Picture6.png)

## 基本要点：
*	基于nodejs+express的简单网站，完成包括tables和items的增删改查基本功能，提供编辑json的界面
*	主要程序逻辑参看index.js，过程如下： 
    *	首先启动sqs监听的child process
    *	然后遍历所有table，找到enable stream的表格，然后每个启动单独的child process进行dynamodb的监听
    *	最后在主进程中启动web服务器
*	页面渲染采用swig模版
*	前台UI主要靠bootstrap和codemirror完成
*	后台使用了lodash，使用了ES6的原生Promise.all
*	主要逻辑在api.js中，包含http的api和两个主要页面渲染逻辑
*	渲染的页面中，tables.html是所有tables的汇总，页面逻辑存在于tables.js中
*	渲染的页面中，table.html是特定table的内容展示，页面逻辑存在于table.js中
*	渲染页面共同继承自layout.html
*	js规范用eslint进行检查，遵循airbnb规则
