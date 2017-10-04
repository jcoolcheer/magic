<template>
  <section class="player">
    <transition name="slide-fade">
      <section class="player"  >
        <div class="wrapper flex">
          <section class="cover" :style='{backgroundImage: "url(" + songInfo.album+")"}'>
            
          </section>
          <section class="about flex" v-loading='isLoading'>
            <h4 class="song-name">
              {{ songInfo.name }}
            </h4>
            <p class="singer">
              {{ songInfo.singer }}
            </p>
          </section>
          <!-- <audio :src="songInfo.url" autoplay></audio> -->
        </div>
      </section>
    </transition>
  </section>
</template>
<script>
  export default {
    created () {
      this.songInfo.url && this.init(this.songInfo.url)
    },
    beforeDestroy () {
      this.act.close()
    },
    data () {
      return {
        WIDTH: document.body.offsetWidth,
        HEIGHT: 400,
        canvasCtx: null,
        xhr: null,
        act: null,
        isLoading: false
      }
    },
    props: ['songInfo'],
    computed: {
      url () {
        return this.songInfo && this.songInfo.url
      }
    },
    methods: {
      init(src) {
        this.xhr = new XMLHttpRequest
        this.act = new window.AudioContext
        this.isLoading = true 
        this.load('http://127.0.0.1:8002/getMusic?url='+src).then(
          response => {
            this.isLoading = false             
            this.afterLoadMusic(response)
          },
          error => {
            this.isLoading = false
          }
        )
      },
      load (url) {
          var xhr = this.xhr
          xhr.open('get', url)
          xhr.responseType = 'arraybuffer'
          xhr.send()
          return new Promise((res, rej) => {
            xhr.onload = () => {
              res(xhr.response)
            }
            xhr.onerror = () => {
              rej()
            }
          })
      },
      afterLoadMusic (response) {
        var act = this.act
        act.decodeAudioData(response, (buffer) => {
          var bufferSource = act.createBufferSource()
          bufferSource.buffer = buffer
          bufferSource.connect(act.destination)
          bufferSource[bufferSource.start ? "start" : "noteOn"](0)
          bufferSource.onended = res => {
            this.$emit('update:FUNC', false)
            this.$emit('update:songInfo', null)
          }
        }, error => {
          console.log(error)
        })
      }
    },
    watch: {
      'url': (n) => {
        // this.init && this.init(n)
      }
    }
  }
</script>
<style lang="less">
  .playing-music{
    position: fixed;
    left: 0;
    bottom: 0;
  }
  	.player{
		.wrapper{
			width: 50rem;
			margin: 0 auto;
			border-radius: 10px;
			overflow: hidden;
			box-shadow: 0 0 5px #1491FF;
			.cover{
				width: 15rem;
				height: 15rem;
				background-size: cover;
				background-position: center;
				background-image: url(http://p1.music.126.net/87xBoilZP9PUfi5nmSHbzw==/7722969673635338.jpg);
			}
			.about{
				width: calc(~'100% - '15rem);
				padding: 0 2rem;
				.song-name{
					font-size: 3rem;
					width: 100%;
				}
				.singer{
					font-size: 2rem;
					width: 100%;
					color: #9b9b9b;
					line-height: 3;
				}
			}
		}
	}
	.slide-fade-enter-active {
	  transition: all .6s ease;
	}
	.slide-fade-leave-active {
	  transition: all .6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}
	.slide-fade-enter, .slide-fade-leave-to{
	  transform: translateY(450px) scale(0.3) rotateY(60deg);
	  opacity: 0;
	}
  

</style>