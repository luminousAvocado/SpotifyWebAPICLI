const
    app = require('./app'),
    yargonaut = require('yargonaut')
        .helpStyle('green')
        .font('ANSI Shadow')
        .errorsStyle('red.bold'),
    yargs = require('yargs')


const flags = yargs.usage('$0: Usage <cmd> [options]')
    .command({
        command: "song <track>",
        desc: "search for a song",
        builder: (yargs) => {
            return yargs
                .option('l', {
                    alias: 'limit',
                    describe: 'limit track search'
                })
        },

        handler: (argv) => { app.searchSong(argv.track, argv.limit) }
    })
    .command({
        command: 'artist <artist>',
        desc: 'Search for artist by name',
        builder: (yargs) => {
            return yargs.option('l', {
                alias: 'limit',
                describe: 'search result count'
            })
        },
        handler: (argv) => { app.searchArtist(argv.artist, argv.limit) }
    })
    .command({
        command: 'album <album>',
        desc: 'Search for album',
        builder: (yargs) => {
            return yargs.option('l', {
                alias: 'limit',
                describe: 'search result count'
            })
        },
        handler: (argv) => { app.searchAlbum(argv.album, argv.limit) }
    })
    .command({
        command: 'playlist <playlist>',
        desc: 'Search for playlist',
        builder: (yargs) => {
            return yargs.option('l', {
                alias: 'limit',
                describe: 'search result count'
            })
        },
        handler: (argv) => { app.searchPlaylist(argv.playlist, argv.limit) }
    })
    .command({
        command: 'fetch <songID>',
        desc: "Fetch song data by song ID",
        handler: (argv) => { app.fetchBySongID(argv.songID) }
    })
    .command({
        command: 'ArtistAlbums <artist>',
        desc: 'Return a list of albums which will return a track list',
        builder: (yargs) => {
            return yargs.option('l', {
                alias: 'limit',
                describe: 'search result count'
            })
        },
        handler: (argv) => { app.getArtistAndAlbum(argv.artist, argv.limit) }
    })
    .command({
        command: 'searchGenreArtistsOrTracks <genre>',
        desc: 'get artists or tracks from certain genres',
        builder: (yargs) => {
            return yargs.option('g', {
                alias: 'tORa',
                describe: 'search for tracks or artists within a genre'
            }).option('l', {
                alias: 'limit',
                describe: 'search result count'
            })
        },
        handler: (argv) => { app.getGenre(argv.genre, argv.tORa, argv.limit) }
    })
    .example('$0 searchArtistAlbum \'Kanye\'')
    .help('help')
    .argv