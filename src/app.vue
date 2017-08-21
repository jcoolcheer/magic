<template>
	<div class="mirror">
		<infos :hour = 'hour' 
					 :minute = 'minute' 
					 :month = 'month' 
					 :date = 'date' 
					 :day = 'day'/>
		<speech />
		<greet :hour = 'hour'/>
	</div>
</template>
<script>
	import infos from './components/infos'
	import speech from './components/speech'
	import greet from './components/greet'
	export default {
		created () {
			this.initDateAndTime()
		},
		data () {
			return {
				hour: 0,
				minute: 0
			}
		},
		components: {
			infos,
			speech,
			greet
		},
		methods: {
			initDateAndTime () {
				const date = new Date()
				this.hour = date.getHours()
				this.minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes()
				this.month = date.getMonth() + 1
				this.date = date.getDate()
				this.day = date.getDay()
				this.updateTime()
			},
			updateTime () {
				this.clock = setInterval(this.updateTimeFunc, 6000)
			},
			updateTimeFunc () {
				const date = new Date()
				const min = date.getMinutes()
				this.hour = date.getHours()
				this.minute = min < 10 ? '0' + min : '' + min
			}
		}
	}
</script>