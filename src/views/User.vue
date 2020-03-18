<template>
	<div>
		<md-button
			@click.prevent="openSpotify"
			class="md-fab md-accent open-spotify-button"
			:md-ripple="true"
		>
			<md-icon>music_note</md-icon>
		</md-button>
		<h1>{{ user.display_name }}</h1>
		<img :src="user.images[0].url" />
		<md-list v-if="playlists.length">
			<md-list-item v-for="playlist of playlists" :key="playlist.id">
				<md-button
					:to="`/user/playlist/${playlist.id}`"
					class="md-primary"
					>{{ playlist.name }}</md-button
				>
			</md-list-item>
		</md-list>
	</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
	methods: {
		openSpotify() {
			window.open(this.user.external_urls.spotify)
		},
	},
	mounted() {
		this.$store.dispatch('fetchUserPlaylists')
	},
	computed: {
		...mapState(['user', 'playlists']),
	},
}
</script>

<style scoped>
.open-spotify-button {
	position: fixed;
	top: 100vh;
	left: 100vw;
	margin-left: -100px;
	margin-top: -100px;
}
</style>
