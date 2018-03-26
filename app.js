const
    spotify = require('api-spotify'),
    inquirer = require('inquirer'),
    Table = require('cli-table2'),
    chalk = require('chalk')
const selectChoice = (choiceList) => {
    return inquirer.prompt([{
        type: 'checkbox',
        message: 'Select a choice',
        name: 'choice',
        choices: choiceList,
        validate: (answer) => {
            if (answer.length < 1) {
                return 'You must choose one'
            }
            return true
        }
    }])
}
const searchSong = (trackName, sizeLimit = 5) => {
    // must always call to get an access token
    spotify.init((err, res) => {
        // access token is used for all requests
        const token = JSON.parse(res.body).access_token
        // search for a specific track and get artists with that track
        spotify.searchTrack(trackName, sizeLimit, token)
            .then(res => {
                let choiceList = []
                //console.log(res.tracks.items[0])
                // Push each result as obj with display 'name' and actual 'value'
                res.tracks.items.forEach(track => {
                    let artistsName = []
                    for (let i = 0; i < track.artists.length; i++) {
                        artistsName.push(track.artists[i].name)
                    }
                    choiceList.push({
                        name: `${chalk.red('Title:')} ${track.name} ${chalk.red('Artist:')} ${artistsName.toString()}`,
                        value: track.id
                    })
                })
                // Calls prompt function, sends the results of search
                selectChoice(choiceList)
                    .then(selected => {
                        counter2 = selected.choice.length
                        // After getting chosen song, gets song data by ID
                        selected.choice.forEach(song => {
                            fetchSongByID(song, token)
                        })
                        //fetchBySongID(selected.choice[0])
                    })
                    .catch(error => console.log(error))
            })
            .catch(error => console.log(error))
    })
}
// Creates new table with 'head' containing columns titles
let table = new Table({
    head: ['Track Title', 'Artist', 'Album', 'Explicit', 'Duration (minutes)', 'Popularity', 'Release Date', 'url', 'Song ID']
})
let counter = 0
let counter2 = 0
const fetchSongByID = (songID, token) => {
        spotify.fetchSongID(songID, token)
            .then(res => {
                counter++
                let isExplicit = res.explicit
                let theDuration = (res.duration_ms / 1000 / 60)
                if (isExplicit == false) {
                    isExplicit = "No"
                }
                else if (isExplicit == true) {
                    isExplicit = "Yes"
                }
                let artistsName = []
                for (let i = 0; i < res.artists.length; i++) {
                    artistsName.push(res.artists[i].name)
                }
                // Adds new entry to table with data in same order as table
                table.push([res.name, artistsName.toString(), res.album.name, isExplicit, theDuration.toFixed(2), res.popularity, res.album.release_date, res.album.external_urls.spotify, res.id])
                if (counter == counter2) {
                    console.log(table.toString())
                }
                else if (counter2 == 0) {
                    console.log(table.toString())
                }
            })
            .catch(error => console.log(error))
}
const fetchBySongID = (songID) => {
    spotify.init((err, res) => {
        const token = JSON.parse(res.body).access_token
        spotify.fetchSongID(songID, token)
            .then(res => {
                let fetchTable = new Table({
                    head: ['Track Title', 'Artist', 'Album', 'Explicit', 'Duration (seconds)', 'Popularity', 'url']
                })
                let isExplicit = res.explicit
                let theDuration = Math.ceil(res.duration_ms / 1000)
                if (isExplicit == false) {
                    isExplicit = "No"
                }
                else if (isExplicit == true) {
                    isExplicit = "Yes"
                }
                let artistsName = []
                for (let i = 0; i < res.artists.length; i++) {
                    artistsName.push(res.artists[i].name)
                }
                // Adds new entry to table with data in same order as table
                fetchTable.push([res.name, artistsName.toString(), res.album.name, isExplicit, theDuration, res.popularity, res.album.external_urls.spotify])
                console.log(fetchTable.toString())
            })
            .catch(error => console.log(error))
    })
}
const searchArtist = (artistName, sizeLimit = 5) => {
    spotify.init((err, res) => {
        const token = JSON.parse(res.body).access_token
        spotify.searchArtist(artistName, sizeLimit, token)
            .then(res => {
                //console.log(res.artists)
                let table = new Table({
                    head: ['Artist', 'Popularity', 'Genres', 'Followers', 'Artist ID'],
                })
                res.artists.items.forEach(artist => {
                    table.push([artist.name, artist.popularity, artist.genres.toString(), artist.followers.total, artist.id])
                })
                console.log(table.toString())
            })
            .catch(error => console.log(error))
    })
}
const searchAlbum = (albumName, sizeLimit = 5) => {
    spotify.init((err, res) => {
        const token = JSON.parse(res.body).access_token
        spotify.searchAlbum(albumName, sizeLimit, token)
            .then(res => {
                // console.log(res.albums.items[0])
                let table = new Table({
                    head: ['Album', 'Artist', 'Album Type', 'Release Date', 'url', 'Album ID'],
                })
                //console.log(res.albums.items[0].artists)
                res.albums.items.forEach(album => {
                    let artistsName = []
                    for (let i = 0; i < album.artists.length; i++) {
                        artistsName.push(album.artists[i].name)
                    }
                    table.push([album.name, artistsName.toString(), album.album_type, album.release_date, album.external_urls.spotify, album.id])
                })
                console.log(table.toString())
            })
            .catch(error => console.log(error))
    })
}
const searchPlaylist = (playlistName, sizeLimit = 5) => {
    spotify.init((err, res) => {
        const token = JSON.parse(res.body).access_token
        spotify.searchPlaylist(playlistName, sizeLimit, token)
            .then(res => {
                //console.log(res.playlists)
                // res.playlists.items.forEach(playlist => {
                //     console.log(playlist.name)
                //     console.log(playlist.owner.display_name)
                //     console.log(playlist.id)
                //     console.log('*******************************')
                // })
                let table = new Table({
                    head: ['Playlist', 'Owner', 'Tracks', 'url', 'Album ID'],
                })
                res.playlists.items.forEach(playlist => {
                    table.push([playlist.name, playlist.owner.display_name, playlist.tracks.total, playlist.external_urls.spotify, playlist.id])
                })
                console.log(table.toString())
            })
            .catch(error => console.log(error))
    })
}
let albumTable = new Table({
    head: ['Track #', 'Track Title',   'Duration (seconds)', 'Explicit', 'Url', 'Track ID']
})
const getAlbum = (id, token) => {
    spotify.getAlbum(id, token)
        .then(res => {
            //total tracks of album
            counter2 = res.tracks.total
            //this loop returns the details for track
            res.tracks.items.forEach(track => {
                let isExplicit = track.explicit
                let theDuration = (track.duration_ms / 1000)/60
                //pushes details into table
                //track #, name, duration, explicit, url, track id
                albumTable.push([track.track_number, track.name,  theDuration.toFixed(2), isExplicit, track.external_urls.spotify, track.id])
                counter++
                //keeps table into one track. 
                if (counter == counter2) {
                    //prints details
                    console.log(albumTable.toString())
                    //below for next table
                    counter = 0
                    albumTable = new Table({
                        head: ['Track #', 'Track Title',  'Duration (seconds)', 'Explicit', 'Url', 'Track ID']
                    })
                }
            })
        })
        .catch(er => console.log(er))
}
const getAlbumID = (album, sizeLimit, token) => {
    //gets album ID
    spotify.searchAlbum(album, sizeLimit, token)
        .then(res => {
            //use album id to get album details
            getAlbum(res.albums.items[0].id, token)
        })
        .catch(error => console.log(error))
}
const getArtistAndAlbum = (artistName, sizeLimit = 5) => {
    //token
    spotify.init((err, res) => {
        const token = JSON.parse(res.body).access_token
        spotify.getArtist(artistName, token)
            // artist object
            .then(res => {
                let choiceList = []
                //gets id of first artist that matches
                id = res.artists.items[0].id
                spotify.getArtistAlbums(id, sizeLimit, token)
                    .then(ress => {
                        //responds with artist's albums
                        ress.items.forEach(album => {
                            choiceList.push(album)
                        })
                        //pass in album list into inquirer prompt
                        selectChoice(choiceList)
                            .then(selected => {
                                //every album that selected we call getAlbumID
                                selected.choice.forEach(album => {
                                    getAlbumID(album, sizeLimit, token)
                                })
                            })
                            .catch(error => console.log(error))
                    })
                    .catch(err => console.log(err))
            })
            .catch(error => console.log(error))
    })
}
const getTrackID = (track, token) => {
    spotify.searchTrack(track, limit = 1, token)
        .then(res => {
            getTrackDetails(res.tracks.items[0].id, token)
        })
        .catch(error => console.log(error))
}
const getTrackDetails = (TrackId, token) => {
    spotify.fetchSongID(TrackId, token)
        .then(res => {
            const x = (res.duration_ms / 0000166667)
            let table = new Table({
                head: ['Song Title', 'Artist', 'Album', 'Length(minutes)', 'Track ID']
            })
            table.push([res.name, res.artists[0].name, res.album.name, x.toFixed(2), res.id])
            console.log(table.toString())
        })
        .catch(error => console.log(error))
}
const getArtistsDetails = (ArtistId, token) => {
    spotify.getArtist2(ArtistId, token)
        .then(res => {
            let table = new Table({
                head: ['Artist Name', 'Popularity', 'Followers', 'Artist ID']
            })
            table.push([res.name, res.popularity, res.followers.total, res.id])
            console.log(table.toString())
        })
        .catch(error => console.log(error))
}
const getArtistID = (artist, token) => {
    spotify.searchArtist(artist, limit = 1, token)
        .then(res => {
            getArtistsDetails(res.artists.items[0].id, token)
        })
        .catch(error => console.log(error))
}
const getGenre = (genre, t_OR_a = 'track', limit = 5) => {
    let genre_tracks_or_artists = []
    spotify.init((err, res) => {
        const token = JSON.parse(res.body).access_token
        spotify.searchGenre(genre, t_OR_a, limit, token)
            .then(res => {
                if (t_OR_a === "track") {
                    res.tracks.items.forEach(track => {
                        genre_tracks_or_artists.push(track)
                    })
                }
                else {
                    res.artists.items.forEach(artist => {
                        genre_tracks_or_artists.push(artist)
                    })
                }
                return selectChoice(genre_tracks_or_artists)
            })
            .then(res1 => {
                if (t_OR_a === "track") {
                    getTrackID(res1.choice[0], token)
                }
                else {
                    getArtistID(res1.choice[0], token)
                }
            })
            .catch(error => console.log(error))
    })
}
// Takes a song name
// searchSong('Take On Me')
module.exports = {
    searchSong,
    searchArtist,
    searchAlbum,
    searchPlaylist,
    fetchBySongID,
    getArtistAndAlbum,
    getGenre
}