const
    config = require('./config'),
    superagent = require('superagent'),
    request = require('request')

const _fetch = (command, token) => {
    return superagent.get(`${config.url}/${command}`)
        .set({
            Authorization: 'Bearer ' + token
        })
        .then(response => response.body)
        .catch(error => error.response.body)
}

exports.init = (callback) => {
    // returns an access token to the callback
    return request({
        url: 'https://accounts.spotify.com/api/token',
        method: 'POST',
        auth: {
            user: config.client_id,
            pass: config.client_secret
        },
        form: {
            grant_type: 'client_credentials'
        }
    }, callback)
}

exports.searchTrack = (track, limit, token) => {
    // we can make it so the limit and offset are user entered too
    return _fetch(`v1/search?q=${track}&type=track&limit=${limit}&offset=0`, token)
}

exports.searchArtist = (artist, limit, token) => {
    return _fetch(`v1/search?q="${artist}"&type=artist&limit=${limit}&offset=0`, token)
}

exports.searchAlbum = (album, limit, token) => {
    return _fetch(`v1/search?q="${album}"&type=album&limit=${limit}&offset=0`, token)
}

exports.searchPlaylist = (playlist, limit, token) => {
    return _fetch(`v1/search?q="${playlist}"&type=playlist&limit=${limit}&offset=0`, token)
}

exports.searchGenre = (genre,trackORartist, limit, token) => {

    return _fetch(`v1/search?q=${genre}&type=${trackORartist}&limit=${limit}&offset=5`, token)
}

exports.fetchSongID = (songID, token) => {
    return _fetch(`v1/tracks/${songID}`, token)
}

exports.getArtistAlbums = (artistID, limit, token) =>{
    return _fetch(`v1/artists/${artistID}/albums?market=US&include_groups=album&limit=${limit}`,token)
}

exports.getAlbum =(id, token)=>{
    return _fetch(`v1/albums/${id}`, token)
}

exports.getArtist = (artist, token) => {
    return _fetch(`v1/search/?q="${artist}"&type=artist&limit=1&offset=0`, token)
}

exports.getArtist2 = (artist, token) => {
    return _fetch(`v1/artists/${artist}`, token)
}