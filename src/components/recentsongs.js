import { Component } from "react";
import Song from "./song";
import '../app.css';

export default class RecentSongs extends Component {
    state = { 
        songs : []
    }


    componentDidMount() { 
        fetch('/recents')
        .then(response => response.json())
        .then(data => this.setState({ songs: data }))
    }



    render() { 
        return (
            <div className="recentSongs">
                <h1>Recent Songs</h1>
                <ul>
                    {this.state.songs.map(song => (
                        <Song key={song.songID} name={song.songName} albumName={song.albumName} artist={song.artistName} songUrl={song.songUrl} albumArt={song.albumArt} />
                    ))}
                </ul>
            </div>
        ) 
    }
} 