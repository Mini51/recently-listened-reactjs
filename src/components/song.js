import { Component } from "react";
import '../app.css';

export default class Song extends Component { 

    render(props) {
        return ( 
            <div className="song">
                <img src={this.props.albumArt} alt="album art" />
                <div className="song-info">
                    <a href={this.props.songUrl}><h3>{this.props.name}</h3></a>
                    <h4>{this.props.albumName} - {this.props.artist}</h4>
                </div>  
            </div>
        ) 
    }
}