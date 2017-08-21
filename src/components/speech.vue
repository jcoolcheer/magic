<template>
	<section class="assistant-zone">
		<div class="loading-wraper">
			<div class="loading listening" v-show="userSpeaking">
				<div class="loader" >
					<div class="loader-inner ball-scale-ripple-multiple">
						<div></div>
						<div></div>
						<div></div>
					</div>
				</div>
			</div>
		</div>
		<!-- <player v-if="!userSpeaking" :songInfo="songInfo"/> -->
		<p class="speech-words" v-if="!FUNC">
			{{ speechWords }}
		</p>
		<audio :src="speechAnswer" id="audio" autoplay="true" v-if="!FUNC"></audio>
		<div class="light" :class='[assistantSpeaking ? "fast" : ""]'>
		</div>
		<playMusic :songInfo.sync='songInfo' :FUNC.sync='FUNC' v-if="songInfo && FUNC" />	
	</section>
</template>
<script>
	var socket = require('../socket')
	var speech = require('../speech/speech.js')
	var rules = require('../config/rules').rules
	var functions = require('../config/functions')
	import playMusic from './playingMusic.vue'
	export default {
		data () {
			return {
				speechAnswer: '',
				ttsUrl: 'http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&text=',
				speechWords: 'Hello',
				userSpeaking: false,
				assistantSpeaking: false,
				clock: null,
				rules: rules,
				audio: null,
				songInfo: null,
				FUNC: false
			}
		},
		mounted () {
			this.init()
			this.speechAddEvent()
		},
		components: {
			playMusic
		},
		methods: {
			init () {
				const audio = document.querySelector('#audio')
				this.audio = audio
				this.audioAddEvent(audio)
				socket.on('start',  data => {
					this.songInfo = null
					this.FUNC = false
					this.speechWords = data
					this.speechAnswer = `${this.ttsUrl}${data}`
					setTimeout(() => {
						audio.play()
					}, 10)
				})
				socket.on('hasAnswer', data => { 
					this.speechWords = data
					this.speechAnswer = `${this.ttsUrl}${data}`
				})
			},
			audioAddEvent (audio) {
				audio.addEventListener('play', () => {
					this.assistantSpeaking = true
					this.userSpeaking = false  
					speech.stop()  
				})
				audio.addEventListener('ended', () => {
					this.assistantSpeaking = false
					this.speechAnswer = null
					this.songInfo = null
					speech.start()
				})
			},
			speechAddEvent () {
				speech
			    .on('start', () => {
						this.inCaseNoEmit()
			    	this.userSpeaking = true
						this.speechWords = '开始说话...'
						console.log('begin')
			    })
			    .on('end', () => {
						this.userSpeaking = false
						this.assistantSpeaking = false
						console.log('endd')
			    })
			    .on('error', event => {
			        this.speechWords= 'Hello'
							this.userSpeaking = false 
							console.log(event)
			    })
			    .on('interimResult', (msg) => {
						this.inCaseNoEmit()						
						this.speechWords = msg
						console.log('detecting')
			    })
			    .on('finalResult', (msg) => {
						this.clock && clearTimeout(this.clock)
						this.speechWords = msg || 'Hello'
						this.handeInstructions(msg)
			    })
			},
			inCaseNoEmit () {
				this.clock && clearTimeout(this.clock)
				this.clock = setTimeout( () => {
					speech.stop()
					this.userSpeaking = false
					this.speechWords = 'Hello'
				}, 5000)
			},
			handeInstructions (data) {
				const rules = this.rules
				for (let key of rules) {
					if (data.search(key.rule) > -1) {
						var promise = functions[key.func](data)
						promise.then(
							data => {
								speech.stop()
								this.speechWords = 'Hello'
								this.songInfo = data
								this.FUNC = true
							}
						)
						return
					}
				}
				if (data !== '混元霹雳手'){
					socket.emit('speakDone', data)
				}
			}
		},
		watch: {
			'songInfo': (n) => {
				if (n) {
					this.userSpeaking = false
				}
			}
		}
	}
</script>
<style lang="less">
@listeningSize: 200px;
.assistant-zone{
	.loading-wraper{
		width: @listeningSize;
		height: @listeningSize;
		margin: 0 auto;
	}
	.loading.listening{
		width: 100%;
		height: 100%;
	}
	.speech-words{
		font-size: 4.5rem;
		letter-spacing: 1px;
		text-align: center;
		margin-top: 3rem;
	}
}	
@keyframes ball-scale-ripple-multiple {
	0% {
		transform: scale(0.1);
		opacity: 1; 
	}

	70% {
		transform: scale(1);
		opacity: 0.7; 
	}

	100% {
		opacity: 0.0; 
	} 
}
.light{
	height: 100px;
	width: 95%;
	border-radius: 20%;
	background:  #1491FF;
	filter: blur(60px);
	position: fixed;
	bottom: -120px;
	left: 50%;
	transform: translateX(-50%);
	animation: blurme 3s infinite;
	&.fast{
		animation: blurme 0.3s infinite;
	}
}

@keyframes blurme{
	0%{
		filter: blur(60px);
	}
	40%{
		filter: blur(80px);
	}
	60%{
		filter: blur(80px);
	}
	100%{
		filter: blur(60px);
	}
}
.ball-scale-ripple-multiple {
	position: relative;
}
.ball-scale-ripple-multiple > div:nth-child(0) {
	animation-delay: -0.2s; 
}
.ball-scale-ripple-multiple > div:nth-child(1) {
	animation-delay: 0s; 
}
.ball-scale-ripple-multiple > div:nth-child(2) {
	animation-delay: 0.2s; 
}
.ball-scale-ripple-multiple > div:nth-child(3) {
	animation-delay: 0.4s; 
}
.ball-scale-ripple-multiple > div {
	animation-fill-mode: both;
	position: absolute;
	top: 0;
	left: 0;
	width: @listeningSize;
	height: @listeningSize;
	border-radius: 100%;
	border: 2px solid #fff;
	animation: ball-scale-ripple-multiple 1.25s 0s infinite cubic-bezier(.21, .53, .56, .8); 
}
</style>