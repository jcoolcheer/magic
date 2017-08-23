<template>
	<section class="show-infos" v-if="weather">
		<section class="date-weather">
			<p class="time">
				{{ hour }}:{{ minute }}
			</p>
			<p class="detail">
				{{month}}月{{date}}日 {{digitalDayToWord}} {{ getCurrentWeatherDescribe() }}
			</p>
			<ul class="weather-forecast">
				<li v-for="(item, index) in 5" v-if = "index !== 0">
					<i class="wi" :class="getIcon(index)">
					</i>
					<p>
						{{ forecastDaily.temperature.value[index].to }}
						/
						{{ forecastDaily.temperature.value[index].from}}
					</p>
				</li>
			</ul>
			<hr>
		</section>
		<section class="function-zone">
			<ul>
				<li class="thermometer">
					<i class="wi wi-thermometer">

					</i>
					<span class="index">
						{{currentWeather.temperature.value}}度
					</span>

				</li>
				<li>
					<i class="iconfont bigger">
						&#xe657;
					</i>
					<span>
						暂无待办事项
					</span>
				</li>
			</ul>
		</section>
		<hr>
	</section>
</template>
<script>
	export default {
		created () {
			this.getWeather()
		},
		data () {
			return {
				weather: null,
				weatherIcons: [

					{
						value: 'wi-day-sunny',
						title: '晴天'
					},
					{
						value: 'wi-cloudy',
						title: '多云'
					},
					{
						value: 'wi-cloud',
						title: '阴天'
					},
					{
						value: 'wi-rain',
						title: '阵雨'
					},
					{
						value: 'wi-storm-showers',
						title: '雷阵雨'
					},
					{
						value: 'wi-thunderstorm',
						title: '雷阵雨并伴有冰雹'
					},
					{
						value: 'wi-rain-mix',
						title: '雨夹雪'
					},
					{
						value: 'wi-sprinkle',
						title: '小雨'
					},
					{
						value: 'wi-rain-wind',
						title: '中雨'
					},
					{
						value: 'wi-rain',
						title: '大雨'
					},
					{
						value: 'wi-storm-showers',
						title: '暴雨'
					},
					{
						value: 'wi-storm-showers',
						title: '大暴雨'
					},
					{
						value: 'wi-storm-showers',
						title: '特大暴雨'
					},
					{
						value: 'wi-snow-wind',
						title: '阵雪'
					},
					{
						value: 'wi-snow-wind',
						title: '小雪'
					},
					{
						value: 'wi-snow-wind',
						title: '中雪'
					},
					{
						value: 'wi-snow-wind',
						title: '大雪'
					},
					{
						value: 'wi-snow-wind',
						title: '暴雪'
					},
					{
						value: 'wi-fog',
						title: '雾'
					},
					{
						value: 'wi-sleet',
						title: '冻雨'
					},

					{
						value: 'wi-sandstorm',
						title: '沙尘暴'
					},

					{
						value: 'wi-sprinkle',
						title: '小雨-中雨'
					},
					{
						value: 'wi-rain-wind',
						title: '中雨-大雨'
					},
					{
						value: 'wi-storm-showers',
						title: '大雨-暴雨'
					},
					{
						value: 'wi-storm-showers',
						title: '暴雨-大暴雨'
					},
					{
						value: 'wi-storm-showers',
						title: '大暴雨-特大暴雨'
					},

					{
						value: 'wi-snow',
						title: '小雪-中雪'
					},
					{
						value: 'wi-snow-wind',
						title: '中雪-大雪'
					},
					{
						value: 'wi-snow-wind',
						title: '大雪-暴雪'
					},
					{
						value: 'wi-dust',
						title: '浮沉'
					},
					{
						value: '扬沙',
						title: 'wi-sandstorm'
					},					
					{
						value: 'wi-sandstorm',
						title: '强沙尘暴'
					},
					{
						value: 'wi-hurricane-warning',
						title: '飑'
					},
					{
						value: 'wi-tornado',
						title: '龙卷风'
					},
					{
						value: 'wi-snowflake-cold',
						title: '若高吹雪'
					},
					{
						value: 'wi-fog',
						title: '轻雾'
					},
					{
						value: 'wi-smog',
						title: '雾霾'
					},
					{
						value: 'wi-na',
						title: '未知'
					}
				]
			}
		},
		props: ['hour', 'minute', 'month', 'date', 'day'],
		computed: {
			currentWeather () {
				return this.weather && this.weather.current
			},
			forecastDaily () {
				return this.weather && this.weather.forecastDaily
			},
			digitalDayToWord () {
				const day = this.day
				switch (day) {
					case 0: 
						return '周日'
					case 1:
						return '周一'
					case 2: 
						return '周二'
					case 3:
						return '周三'
					case 4:
						return '周四'
					case 5: 
						return '周五'
					case 6:
						return '周六'
				}
			}
		},
		methods: {
			getWeather () {
				const url = `${this.URL}getWeather`
				fetch('http://127.0.01:8002/getWeather').then(
				    res => {
				        return res.json()
				    }
				).then(
					data => {
						this.weather = data
					}
				)
			},
			getIcon (index) {
				const i = this.forecastDaily.weather.value[index].to - 0
				return this.weatherIcons[i].value
			},
			getCurrentWeatherDescribe () {
				return this.weatherIcons[this.currentWeather.weather - 0].title
			}
		}
	}
</script>
<style lang="less">
.flex{
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
}
.show-infos{
	.date-weather{
		text-align: center;
		.time{
			color: #fff;
			font-size: 12rem;
		}
		.detail{
			font-size: 2rem;
			font-weight: lighter;
			margin-bottom: 2rem;
		}
	}
}
.weather-forecast{
	text-align: center;
	.flex;
	li{
		&:not(:last-child){
			margin-right: 3rem;
		}
	}
	.wi{
		font-size: 4rem;
		display: block;
	}
	p{
		font-size: 1.4rem;
		margin-top: 1.5rem;
		color: #ccc;
	}
}
.function-zone{
	width: 90%;
	margin: 0 auto;
	ul{
		font-size: 3rem;
		color: #ccc;
		li{
			&:not(:last-child){
				margin-bottom: 1.5rem;
			}
			display: flex;
			align-items: center;
			&>i{
				display: inline-block;
				width: 30px;
				text-align: center;
				margin-right: 2rem;
			}
			&>span{
				font-size: 1.7rem;
			}
		}
		.thermometer{
			.wi{
				font-size: 2.5rem;
			}
		}
	}
}
</style>