<template>
	<section class="footer">
		<h3>
			{{greetWords}}！Zee
		</h3>
		<p v-if="news.length">
			{{ news[0].title }}
		</p>
	</section>
</template>
<script>
	export default {
		created () {
			// this.computeGreet()
			this.getNews()
		},
		data () {
			return {
				news: []
			}
		},
		props: ['hour'],
		methods: {
			getNews () {
				console.log(this.URL)
				const url = 'http://127.0.0.1:8002/getNews'
				fetch (url).then(
					 res => {
						return res.json()
					}
				).then(
					data => {
						this.handleNews(data)
					}
				)
			},
			handleNews (data) {
				if (data.code === '10000') {
					this.news = data.result.result.list
				}
			}
		},
		computed: {
			greetWords () {
				const hour = this.hour
				switch (true) {
					case hour >= 0 && hour < 6:
						return '夜深了'
					case hour >= 6 && hour < 8:
						return '早上好'
					case hour >= 8 && hour < 12:
						return '上午好'
					case hour >= 12 && hour < 14:
						return '中午好'
					case hour >= 14 && hour < 18:
						return '下午好'
					case hour >= 18 && hour < 24:
						return '晚上好'
				}
			}
		}
	}
</script>
<style lang="less">
.footer{
	color: #fff;
	text-align: center;
	letter-spacing: 1px;
	&>h3{
		font-size: 6rem;
		margin: 1.5rem 0;	
	}
	&>p{
		font-size: 1.5rem;
		font-weight: lighter;
	}
}
</style>