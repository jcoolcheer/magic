const getIdUrl = 'http://127.0.0.1:3000/search?keywords='
const getSong = 'http://127.0.0.1:3000/music/url?id='
function player(data) {
	var pro = new Promise((res, rej) => {
		const song = {}
		const name = data.split('播放')[1]
		fetch(getIdUrl + name).then(
			res => {
				return res.json()
			}
		).then(
			data => {
				if (data.code === 200) {
					const id = data.result.songs[0].id
					song.name = data.result.songs[0].name
					song.singer = data.result.songs[0].artists[0].name
					song.album = data.result.songs[0].album.blurPicUrl
					fetch(`${getSong}${id}`).then(
						res => res.json()
					).then(
						data => {
							if (data.code == 200) {
								song.url = data.data[0].url
								res(song)
							}
						}
					)
				}
			}
			)
	})
	return pro
}


module.exports = player