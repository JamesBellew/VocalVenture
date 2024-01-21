const express = require('express');
const app = express();
const port = 3001;

const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const path = require('path');
const cors = require('cors');
let globalClipLength = 0;

// Middleware to set the clip length in the response header
function setClipLengthHeader(req, res, next) {
    res.setHeader('X-Clip-Length', globalClipLength);
    next();
}
app.use(cors());
app.use('/clips', express.static(path.join(__dirname, 'clips')));
const songs = [

    {
        "path": "songs/silhouttes.mp3",
        "artist" : "Avicii",
        "genre" : "EDM",
        "level" : "easy",
        "name": "Silhouttes",
        "cover" : "https://i.scdn.co/image/ab67616d0000b273747c66e9b51da52d3bc4ca59",
        "album" : "Single"
    },
    {
        "path": "songs/wakemeup.mp3",
        "artist" : "Avicii",
        "genre" : "EDM",
        "level" : "easy",
        "name": "Wake Me Up",
        "cover" : "https://i.scdn.co/image/ab67616d0000b273e14f11f796cef9f9a82691a7",
        "album" : "True"
    }
    ,
    {
        "path": "songs/thenights.mp3",
        "artist" : "Avicii",
        "genre" : "EDM",
        "level" : "easy",
        "name": "The Nights",
        "cover" : "https://upload.wikimedia.org/wikipedia/en/6/64/The-Days-Nights-EP-by-Avicii.jpg",
        "album" : "The Nights / The Days"
    } ,
    {
        "path": "songs/waitingforlove.mp3",
        "artist" : "Avicii",
        "genre" : "EDM",
        "level" : "easy",
        "name": "Waiting For Love",
        "cover" : "https://i.pinimg.com/736x/43/4b/14/434b14107e440c9c0a4c715fffbd22b9.jpg",
        "album" : "Stories"
    },
    {
        "path": "songs/dearboyABA.mp3",
        "artist" : "Avicii",
        "level" : "medium",
        "genre" : "EDM",
        "name": "Dear Boy (Avicii By Avicii)",
        "cover" : "https://i.scdn.co/image/ab67616d0000b273182fe5b5d3e3c3fcc895a3c8",
        "album" : "True (Avicii By Avicii)"
    }
    ,   {
        "path": "songs/drowningAviciiRemix.mp3",
        "artist" : "Avicii",
        "genre" : "EDM",
        "cover" : "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Armin_van_Buuren_feat._Laura_V_-_Drowning.jpg/220px-Armin_van_Buuren_feat._Laura_V_-_Drowning.jpg",
        "level" : "hard",
        "name": "Drowning (Avicii Remix)",
        "album" : "Remix"
    }
];

// Set the path to the ffmpeg binary
ffmpeg.setFfmpegPath(ffmpegStatic);

// Function to generate a random start time
function getRandomStartTime(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Function to generate a random clip length
function getRandomClipLength(min, max) {
    const range = (max - min) + 0.1; // Adjust the range to include one decimal
    return Math.round((Math.random() * range + min) * 10) / 10;
}


// Function to select a random song from the given songs array
function getRandomSong(filteredSongs) {
    const randomIndex = Math.floor(Math.random() * filteredSongs.length);
    return filteredSongs[randomIndex];
}



// Function to extract a clip from a random MP3 file
// Function to extract a clip from a random MP3 file
function extractRandomClip(filteredSongs) {
    return new Promise((resolve, reject) => {
        const song = getRandomSong(filteredSongs); // Use the filtered songs array
        const inputFile = song.path;
        const outputFile = 'clip.mp3'; // You might want to generate a unique name here

        const startTime = getRandomStartTime(1, 100);
        const clipLength = getRandomClipLength(1.1, 2);
        globalClipLength = clipLength;
        const formattedStartTime = new Date(startTime * 1000).toISOString().substr(11, 8);
        const outputFilePath = path.join(__dirname, 'clips', outputFile);

        ffmpeg(inputFile)
            .setStartTime(formattedStartTime)
            .setDuration(clipLength)
            .output(outputFilePath)
            .on('end', function() {
                console.log('Clip has been created: ' + outputFile);
                resolve({ outputFile, song }); // Return both the file and song details
            })
            .on('error', function(err) {
                console.error('An error occurred: ' + err.message);
                reject(err);
            })
            .run();
    });
}
function extractShortClip(filteredSongs){
    return new Promise((resolve, reject) => {
        const song = getRandomSong(filteredSongs); // Use the filtered songs array
        const inputFile = song.path;
        const outputFile = 'clip.mp3'; // You might want to generate a unique name here

        const startTime = getRandomStartTime(1, 100);
        const clipLength =10;
        globalClipLength = clipLength;
        const formattedStartTime = new Date(startTime * 1000).toISOString().substr(11, 8);
        const outputFilePath = path.join(__dirname, 'clips', outputFile);

        ffmpeg(inputFile)
            .setStartTime(formattedStartTime)
            .setDuration(clipLength)
            .output(outputFilePath)
            .on('end', function() {
                console.log('Short Clip has been created: ' + outputFile);
                resolve({ outputFile, song }); // Return both the file and song details
            })
            .on('error', function(err) {
                console.error('An error occurred: ' + err.message);
                reject(err);
            })
            .run();
    });
}

app.get('/short-clip', async (req, res) => {
    const level = req.query.level;
    console.log(level);
    console.log(globalClipLength);
    try {
        const filteredSongs = level ? songs.filter(song => song.level === level) : songs;
        if (filteredSongs.length === 0) {
            return res.status(404).send('No songs found for the specified level');
        }
        const { outputFile, song } = await extractShortClip(filteredSongs); // Pass the filtered list to the function
        const clipUrl = `http://localhost:${port}/clips/${outputFile}`;
        const songName = "Sillhouttes";
        // const songLength = clipLength;
        const album = "Single";
        res.send({ clipPath: clipUrl , songName: song.name,
            album: song.album, songLength: globalClipLength, songCover: song.cover});
    } catch (error) {
        console.error('Error extracting random clip:', error);
        res.status(500).send('Error extracting random clip');
    }
});
app.get('/random-clip', async (req, res) => {
    const level = req.query.level;
    console.log(level);
    console.log(globalClipLength);
    try {
        const filteredSongs = level ? songs.filter(song => song.level === level) : songs;
        if (filteredSongs.length === 0) {
            return res.status(404).send('No songs found for the specified level');
        }
        const { outputFile, song } = await extractRandomClip(filteredSongs); // Pass the filtered list to the function
        const clipUrl = `http://localhost:${port}/clips/${outputFile}`;
        const songName = "Sillhouttes";
        // const songLength = clipLength;
        const album = "Single";
        res.send({ clipPath: clipUrl , songName: song.name,
            album: song.album, songLength: globalClipLength, songCover: song.cover});
    } catch (error) {
        console.error('Error extracting random clip:', error);
        res.status(500).send('Error extracting random clip');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
console.log(getRandomClipLength(1,60))
// Extract a clip from a random song
extractRandomClip(songs);
