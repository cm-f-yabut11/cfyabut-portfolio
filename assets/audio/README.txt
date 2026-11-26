MUSIC FOLDER
============

Put your MP3 files in this folder, then list them in playlist.json (same folder).

Simplest version, file names only:

{
  "tracks": ["my-first-song.mp3", "another-song.mp3"]
}

The title shown in the player is made from the file name, so "late-night-coding.mp3"
shows as "late night coding".

If you want to choose the title yourself:

{
  "tracks": [
    { "title": "Late Night Coding", "file": "late-night-coding.mp3" },
    { "title": "Another Song", "file": "another-song.mp3" }
  ]
}

How it behaves
- While "tracks" is empty, the music player is hidden.
- Music never starts by itself. Visitors press play, and it keeps playing as they move between pages.
- Tracks play in order and loop back to the start.

Tips
- Keep it light: about 1 MB per minute at 128 kbps is plenty. Aim for under 10 MB in total.
- Only use music you made or have the right to share publicly. Streaming-service tracks cannot be used here.
- File names are case-sensitive on the server: "Song.mp3" and "song.mp3" are different files.
- Test on your computer by running a local server in the site folder (for example: npx serve .),
  because browsers block audio features when you open index.html straight from disk.
