import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { MusicService } from './music/shared/music.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title;
  position;
  elapsed;
  duration
  tracks: any[] = [];
  filteredTracks: any[] = [];
  backgroundStyle;
  paused = true;

  constructor(
    private musicService: MusicService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit() {
    this.musicService.getPlaylistTracks().subscribe(tracks => {
      this.tracks = tracks;
      this.handleRandom();
    });

    this.musicService.audio.onended = this.handleEnded.bind(this);
    this.musicService.audio.ontimeupdate = this.handleTimeUpdate.bind(this);
  }

  handleRandom() {
    const randomTrack = this.musicService.randomTrack(this.tracks);

    this.playTrack(randomTrack);
  }

  composeBackgroundStyle(url) {
    return {
      width: '100%',
      height: '600px',
      backgroundSize: 'cover',
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${this.musicService.xlArtwork(url)})`
    }
  }

  handleEnded(e) {
    this.handleRandom();
  }

  handleTimeUpdate(e) {
    if (isNaN(this.musicService.audio.duration)) {
      return;
    }

    const elapsed = this.musicService.audio.currentTime;
    const duration = this.musicService.audio.duration;

    this.position = elapsed / duration;
    this.elapsed = this.musicService.formatTime(elapsed);
    this.duration = this.musicService.formatTime(duration);

    this.cdr.detectChanges();
  }

  handleQuery(payload) {
    this.musicService.findTracks(payload).subscribe(tracks => {
      this.filteredTracks = tracks;
    });
  }

  playTrack(track) {
    let backgroundImageUrl = track.artwork_url ? track.artwork_url : track.user.avatar_url;

    this.musicService.play(track.stream_url);
    this.title = track.title;
    this.backgroundStyle = this.composeBackgroundStyle(backgroundImageUrl);
  }

  handleUpdate(track) {
    this.playTrack(track);
  }

  handlePausePlay() {
    if (this.musicService.audio.paused) {
      this.paused = true;
      this.musicService.audio.play();
    } else {
      this.paused = false;
      this.musicService.audio.pause();
    }
  }

  handleStop() {
    this.musicService.audio.pause();
    this.musicService.audio.currentTime = 0;
    this.paused = false;
  }

  handleBackward() {
    let elapsed = this.musicService.audio.currentTime;

    console.log(elapsed);
    if (elapsed >= 5) {
      this.musicService.audio.currentTime = elapsed - 5;
    }
  }

  handleForward() {
    let elapsed = this.musicService.audio.currentTime;
    const duration = this.musicService.audio.duration;

    if (duration - elapsed >= 5) {
      this.musicService.audio.currentTime = elapsed + 5;
    }
  }
}
