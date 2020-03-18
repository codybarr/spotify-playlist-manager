<template>
	<div>
		<h1>Playlist</h1>
		<div v-if="loading" class="loading">
			Loading...
		</div>

		<div v-if="error" class="error">
			{{ error }}
		</div>

		<md-button class="md-raised md-accent" @click.prevent="reversePlaylist"
			>Reverse It!</md-button
		>

		<div v-if="playlist" class="content">
			<div v-if="playlist.tracks.items.length">
				<md-table
					md-sort="id"
					md-sort-order="asc"
					v-model="playlist.tracks.items"
					class="md-primary"
					md-card
				>
					<md-table-toolbar>
						<h1 class="md-title">{{ playlist.name }}</h1>
						<p>{{ playlist.description }}</p>
					</md-table-toolbar>

					<md-table-row
						slot="md-table-row"
						slot-scope="{ item, index }"
					>
						<md-table-cell md-label="ID" md-sort-by="index">{{
							index
						}}</md-table-cell>
						<md-table-cell
							md-label="Name"
							md-sort-by="track.name"
							>{{ item.track.name }}</md-table-cell
						>
						<md-table-cell
							md-label="Artist"
							md-sort-by="track.artists[0].name"
							>{{ item.track.artists[0].name }}</md-table-cell
						>
						<md-table-cell
							md-label="Album"
							md-sort-by="track.album.name"
							>{{ item.track.album.name }}</md-table-cell
						>
						<md-table-cell
							md-label="Added At"
							md-sort-by="added_at"
							>{{ item.added_at }}</md-table-cell
						>
					</md-table-row>
				</md-table>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			loading: false,
			playlist: null,
			error: null,
		}
	},
	created() {
		// fetch the data when the view is created and the data is
		// already being observed
		this.fetchData()
	},
	methods: {
		async fetchData() {
			this.error = this.playlist = null
			this.loading = true

			var myHeaders = new Headers()
			myHeaders.append('Accept', 'application/json')
			myHeaders.append('Content-Type', 'application/json')
			myHeaders.append(
				'Authorization',
				`Bearer ${this.$store.state.access_token}`
			)

			var requestOptions = {
				method: 'GET',
				headers: myHeaders,
				redirect: 'follow',
			}

			try {
				const res = await fetch(
					`https://api.spotify.com/v1/playlists/${this.$route.params.id}`,
					requestOptions
				)
				if (res.ok) {
					const playlist = await res.json()
					this.playlist = playlist
					this.loading = false
				} else {
					throw new Error(
						'Sorry, there was an error fetching the playlist'
					)
				}
			} catch (err) {
				this.error = err
			}
		},
		async reversePlaylist() {
			const createPlaylistBody = JSON.stringify({
				name: `${this.playlist.name} - (reversed)`,
				description: this.playlist.description,
				public: true,
			})

			const createNewPlaylistOptions = {
				method: 'POST',
				headers: this.$store.getters.authHeaders,
				body: createPlaylistBody,
				redirect: 'follow',
			}

			const createNewPlaylistResponse = await fetch(
				'https://api.spotify.com/v1/users/codybarr/playlists',
				createNewPlaylistOptions
			)

			if (createNewPlaylistResponse.ok) {
				console.log('created new playlist!')
			}

			const newPlaylist = await createNewPlaylistResponse.json()

			/* Add Tracks to New Playlist */

			const addTracksBody = JSON.stringify({
				uris: this.playlist.tracks.items
					.map(item => item.track.uri)
					.reverse(),
			})

			const addTracksOptions = {
				method: 'POST',
				headers: this.$store.getters.authHeaders,
				body: addTracksBody,
				redirect: 'follow',
			}

			const addTracks = await fetch(
				`https://api.spotify.com/v1/playlists/${newPlaylist.id}/tracks`,
				addTracksOptions
			)

			if (addTracks.ok) {
				console.log('tracks added!!!!')
			}
		},
	},
}
</script>
