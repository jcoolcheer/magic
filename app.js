    const Sonus = require('./node_modules/sonus/index.js')
    const hotwords = [{ file: 'sound.pmdl', hotword: '混元霹雳手' }]
    const sonus = Sonus.init({ hotwords })
    var request = require('request')
    var rp = require('request-promise')
    var newsUrl = 'https://way.jd.com/jisuapi/get?channel=%E5%A4%B4%E6%9D%A1&num=10&start=0&appkey=bdfd498d4f2b9a289dd683b400fb5b9b'
    var socket = require('socket.io')
    var express = require('express')
    var app = express()
    var fs= require('fs')
    var server = app.listen(8002, function () {
        console.log('链接开始了。')
    })
    Sonus.start(sonus)
    app.use(express.static('dist'))
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*")
        res.setHeader('Content-Type','text/javascript;charset=UTF-8')
        next();
    })
    sonus.on('data', () => {
        console.log('jjj')
    })
    app.get('/getWeather', function (req, response) {
       rp('https://weatherapi.market.xiaomi.com/wtr-v3/weather/all?latitude=0&longitude=0&locationKey=weathercn%3A101010100&days=5&appKey=weather20151024&sign=zUFJoAR2ZVrDy1vF3D07&isGlobal=false&device=cancro&locale=zh_cn')
        .then(function (res) {
            console.log(11111111111)
            response.end(res)
        })
        .catch(function (err) {
            // Crawling failed...
        });
    })
    app.get('/getMusic', function (req, response) {
        const url = req.query.url
        response.set({
            "Content-Type": "audio/mpeg"
        })
        request(url).pipe(response)
    })
    app.get('/getNews', function (req, response) {
        rp(newsUrl).then(
            function (res) {
                response.end(res)
            }
        )
    })
    /*图灵模块*/
    var TULING = require('tuling');
    var tuling = new TULING({key: '4b55e4d2d4f8400ba3f201a4225f1863'});
    /*图灵模块结束*/    

    var socketId = ''
    var io = socket(server)
    io.on('connection', function (socket) {
        socketId = socket.id
        sonus.on('hotword', (index, keyword) => {
            console.log('node听到了我的名字')
            // socket.broadcast.emit('start', 'a')
            socket.emit('start', '我在呢')

        })
        socket.on('speakDone', (data) => {
            console.log('收到了问题' + data)
            tuling.send({
                info: data,
            }).then(function(result) {
                console.log(result)
                // io.sockets.emit('hasAnswer', result.text)   
                io.sockets.connected[socketId].emit('hasAnswer', result.text)             
            })
        })
    })









