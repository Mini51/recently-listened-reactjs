const express = require('express');
const querystring = require('querystring'); 
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node'); 
const path = require('path')
const config = require('./config.json')

const port = process.env.PORT || 3000;

//setup app and spotify api
const app = express();
app.use(express.static(path.resolve(__dirname, '../build')));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());

const scopes = ['user-read-recently-played'];
const spotifyApi = new SpotifyWebApi({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    redirectUri: config.redirectUri,
});



app.get('/', (req, res) => { 
    res.sendFile(path.resolve(__dirname, '../build/index.html'));
});


app.get('/login', (req, res) => {

    //blocks people from doing a second login so no one can overwrite the songs to there songs
    if (spotifyApi.getAccessToken()) {
        return res.send('this is not allowed');
    }

    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});


app.get('/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;
  
    if (error) {
      console.error('Callback Error:', error);
      res.send(`Callback Error: ${error}`);
      return;
    }
  
    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];
  
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
  
        console.log('access_token:', access_token);
        console.log('refresh_token:', refresh_token);
  
        console.log(`Sucessfully retreived access token. Expires in ${expires_in} s.`);
        res.send('Success! You can now close the window.');
  
        setInterval(async () => {
          const data = await spotifyApi.refreshAccessToken();
          const access_token = data.body['access_token'];
  
          console.log('The access token has been refreshed!');
          console.log('access_token:', access_token);
          console.log('refresh_token:', refresh_token);

          //put the refesh accsess token in the config file
          spotifyApi.setAccessToken(access_token);
        }, expires_in / 2 * 1000);
      })
      .catch(error => {
        console.error('Error getting Tokens:', error);
        res.send(`Error getting Tokens: ${error}`);
      });
  });


  app.get('/recents', (req, res) => { 
    (async () => {
        let recents = await spotifyApi.getMyRecentlyPlayedTracks();

        let songs = [];

        for (let i = 0; i < recents.body.items.length; i++) {
            let song = {};
            song.songID = i;
            song.songName = recents.body.items[i].track.name;
            song.artistName = recents.body.items[i].track.artists[0].name;
            song.albumName = recents.body.items[i].track.album.name;
            song.albumArt = recents.body.items[i].track.album.images[0].url;
            song.songUrl = recents.body.items[i].track.external_urls.spotify;
            songs.push(song);
        }

        res.send(songs);

      })().catch(e => {
        res.send('there was an error getting your recents');
        console.error(e);
      });
});



function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}



app.get('*', (req, res) => { 
    res.send('404');
});


app.listen(port, () => console.log(`Listening on port ${port}`));