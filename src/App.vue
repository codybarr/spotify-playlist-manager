<template>
	<div class="page-container">
		<md-app md-mode="reveal">
			<md-app-toolbar class="md-primary">
				<h3 class="md-title" style="flex: 1">
					Spotify Playlist Manager
				</h3>
				<md-button
					v-if="!loggedIn"
					class="md-primary"
					@click.prevent="login"
					>Login</md-button
				>
				<md-button v-else class="md-primary" @click.prevent="logout"
					>Logout</md-button
				>
				<md-button class="md-primary" @click.prevent="$router.push('/')"
					>Home</md-button
				>
				<md-button
					class="md-icon-button"
					@click="menuVisible = !menuVisible"
				>
					<md-icon>menu</md-icon>
				</md-button>
			</md-app-toolbar>

			<md-app-drawer :md-active.sync="menuVisible" :md-right="true">
				<md-toolbar class="md-transparent" md-elevation="0"
					>Navigation</md-toolbar
				>

				<md-list>
					<router-link to="/">Home</router-link>
					<router-link to="/about">About</router-link>
					<router-link to="/callback">Callback</router-link>

					<md-list-item>
						<md-icon>home</md-icon>
						<router-link to="/" class="md-list-item-text"
							>Home</router-link
						>
					</md-list-item>

					<md-list-item>
						<md-icon>send</md-icon>
						<span class="md-list-item-text">Sent Mail</span>
					</md-list-item>

					<md-list-item>
						<md-icon>delete</md-icon>
						<span class="md-list-item-text">Trash</span>
					</md-list-item>

					<md-list-item>
						<md-icon>error</md-icon>
						<span class="md-list-item-text">Spam</span>
					</md-list-item>
				</md-list>
			</md-app-drawer>
			<md-app-content>
				<router-view />
			</md-app-content>
		</md-app>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	data: () => ({
		menuVisible: false,
	}),
	async mounted() {
		const routers = { router: this.$router, route: this.$route }
		// check for auth token hash in query / localstorage / attempt to login
		await this.$store.dispatch('checkAuth', routers)
	},
	methods: {
		login() {
			this.$store.dispatch('auth')
		},
		logout() {
			this.$store.dispatch('logout', { router: this.$router })
		},
	},
	computed: {
		...mapGetters([
			// map this.count to store.state.count
			'loggedIn',
		]),
	},
}
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav {
	padding: 30px;
}

#nav a {
	font-weight: bold;
	color: #2c3e50;
}

#nav a.router-link-exact-active {
	color: #42b983;
}
</style>
