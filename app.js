    const request = require('request')
    const rp = require('request-promise')
    const fs = require('fs')
    const newsUrl = 'https://way.jd.com/jisuapi/get?channel=%E5%A4%B4%E6%9D%A1&num=10&start=0&appkey=bdfd498d4f2b9a289dd683b400fb5b9b'
    const socket = require('socket.io')
    const express = require('express')
    const app = express()
    const http = require('http').Server(app)
    const io = require('socket.io')(http)
    const Sonus = require('./node_modules/sonus/index.js')
    const hotwords = [{ file: 'sound.pmdl', hotword: '混元霹雳手' }]

    http.listen(8002, function () {
        console.log('开始了')
    })

    app.use(express.static('dist'))
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*")
        res.setHeader('Content-Type','text/javascript;charset=UTF-8')
        next();
    })
    app.get('/getWeather', function (req, response) {
       rp('https://weatherapi.market.xiaomi.com/wtr-v3/weather/all?latitude=0&longitude=0&locationKey=weathercn%3A101010100&days=5&appKey=weather20151024&sign=zUFJoAR2ZVrDy1vF3D07&isGlobal=false&device=cancro&locale=zh_cn')
        .then(function (res) {
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

    io.on('connection', function (socket) {
        const sonus = Sonus.init({ hotwords })
        Sonus.start(sonus)
        rrr(socket, sonus)
        socket.on("disconnect", function () {
            Sonus.stop(sonus)
            socket.disconnect(true)
        })
    })

    function rrr(socket, sonus) {
        sonus.on('hotword', (index, keyword) => {
            console.log('node听到了我的名字')
            socket.emit('start', '我在呢')
        })
        socket.on('speakDone', (data) => {
            tuling.send({
                info: data,
            }).then(function(result) {
                console.log(result)
                io.sockets.emit('hasAnswer', result.text)   
                // io.sockets.connected[socketId].emit('hasAnswer', result.text)             
            })
        })
    }







