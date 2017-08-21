const nickname = '混元霹雳手'
const speech = new Speech({
    lang: 'cmn-Hans-CN', // Mandarin Chinese, default is English.
    debugging: true, // will console.log all results
    continuous: false, // will not stop after one sentence
    interimResults: true, // trigger events on iterim results
    autoRestart: true, // recommended when using continuous:true
})

module.exports = speech
