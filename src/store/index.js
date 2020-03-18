import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const CLIENT_ID = `77436ee871d14d1e88e340159e4d8740`
const SCOPES = `user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public`
const REDIRECT_URI = `http://localhost:8080`

const ACCESS_TOKEN_REGEX = /\/access_token=([^&]+)&/

export default new Vuex.Store({
	state: {
		access_token: localStorage.getItem('access_token') || null,
		user: (localStorage.user && JSON.parse(localStorage.user)) || null,
		playlists: [],
	},
	getters: {
		loggedIn: state => !!state.user,
		authHeaders(state) {
			const headers = new Headers()
			headers.append('Accept', 'application/json')
			headers.append('Content-Type', 'application/json')
			headers.append('Authorization', `Bearer ${state.access_token}`)
			return headers
		},
	},
	mutations: {
		setToken(state, token) {
			console.log('setting token...')
			state.access_token = token
			localStorage.setItem('access_token', token)
		},
		removeToken(state) {
			state.access_token = null
			localStorage.removeItem('access_token')
		},
		setUser(state, user) {
			console.log('setting user...')
			state.user = user
			localStorage.setItem('user', JSON.stringify(user))
		},
		removeUser(state) {
			state.user = null
			localStorage.removeItem('access_token')
		},
		setPlaylists(state, playlists) {
			state.playlists = playlists
		},
	},
	actions: {
		auth() {
			let URL =
				`https://accounts.spotify.com/authorize` +
				`?response_type=token` +
				`&client_id=${CLIENT_ID}` +
				`&scope=${encodeURIComponent(SCOPES)}` +
				`&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
				`&show_dialog=true` +
				`&state=123`

			window.open(URL, '_self')
		},
		logout({ commit }, { router }) {
			commit('removeToken')
			commit('removeUser')
			commit('setPlaylists', [])
			router.push('/')
		},
		async login({ commit, dispatch, state }, { router }) {
			console.log('attempting to fetch user')
			try {
				const myHeaders = new Headers()
				myHeaders.append('Accept', 'application/json')
				myHeaders.append('Content-Type', 'application/json')
				myHeaders.append(
					'Authorization',
					`Bearer ${state.access_token}`
				)

				const requestOptions = {
					method: 'GET',
					headers: myHeaders,
					redirect: 'follow',
				}

				const res = await fetch(
					'https://api.spotify.com/v1/me',
					requestOptions
				)

				if (res.ok) {
					const user = await res.json()

					commit('setUser', user)
					router.push('/user')
				} else {
					throw new Error('Token Expired')
				}
			} catch (err) {
				console.log('Sorry, there was an error.', { error: err })
				dispatch('logout')
			}
		},
		async checkAuth({ commit, dispatch, state }, routers) {
			console.log('checking for token hash in route...')
			const { route } = routers
			if (ACCESS_TOKEN_REGEX.test(route.path)) {
				let access_token = route.path.match(ACCESS_TOKEN_REGEX)[1]
				commit('setToken', access_token)
			}

			console.log('checking for access_token in local storage')
			if (state.access_token) {
				dispatch('login', routers)
			}
		},
		async fetchUserPlaylists({ commit, dispatch, state }) {
			try {
				const myHeaders = new Headers()
				myHeaders.append('Accept', 'application/json')
				myHeaders.append('Content-Type', 'application/json')
				myHeaders.append(
					'Authorization',
					`Bearer ${state.access_token}`
				)

				const requestOptions = {
					method: 'GET',
					headers: myHeaders,
					redirect: 'follow',
				}

				const res = await fetch(
					'https://api.spotify.com/v1/me/playlists',
					requestOptions
				)

				if (res.ok) {
					const playlists = await res.json()
					commit('setPlaylists', playlists.items)
				} else {
					throw new Error('Token Expired')
				}
			} catch (err) {
				console.log('Sorry, there was an error.', { error: err })
				dispatch('logout')
			}
		},
	},
	modules: {},
})
