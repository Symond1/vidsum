require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

app.use(cors());
app.use(express.json());

// Initialize YouTube API client
const youtube = google.youtube({
  version: "v3",
  auth: API_KEY,
});

// Convert ISO8601 duration to seconds
const isoDurationToSeconds = (isoDuration) => {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = isoDuration.match(regex);

  const hours = parseInt(matches[1] || 0, 10);
  const minutes = parseInt(matches[2] || 0, 10);
  const seconds = parseInt(matches[3] || 0, 10);

  return hours * 3600 + minutes * 60 + seconds;
};

// Format seconds into H:M:S
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return { hours, minutes, seconds: remainingSeconds };
};

// Main function to calculate playlist duration and metrics
const calculateDuration = async (req, res) => {
  try {
    const { playlistUrl, speed = 1 } = req.body;

    if (!playlistUrl || !playlistUrl.includes("list=")) {
      return res.status(400).json({ status: "fail", message: "Invalid playlist URL" });
    }

    const playlistId = playlistUrl.split("list=")[1].split("&")[0];
    let allVideoIds = [];
    let nextPageToken = "";

    // Fetch all video IDs in the playlist
    do {
      const response = await youtube.playlistItems.list({
        part: ["contentDetails"],
        maxResults: 50,
        playlistId,
        pageToken: nextPageToken,
      });

      const ids = response.data.items.map(item => item.contentDetails.videoId);
      allVideoIds.push(...ids);
      nextPageToken = response.data.nextPageToken || "";
    } while (nextPageToken);

    const videoChunks = [];
    for (let i = 0; i < allVideoIds.length; i += 50) {
      videoChunks.push(allVideoIds.slice(i, i + 50));
    }

    let totalSeconds = 0;
    let thumbs = [];

    // Fetch video details
    for (const chunk of videoChunks) {
      const videoResponse = await youtube.videos.list({
        part: ["contentDetails", "statistics", "snippet"],
        id: chunk.join(","),
      });

      videoResponse.data.items.forEach(video => {
        const { contentDetails, statistics, snippet } = video;

        totalSeconds += isoDurationToSeconds(contentDetails.duration);

        thumbs.push({
          title: snippet.title,
          thumbnail: snippet.thumbnails.medium.url,
        });
      });
    }

    // Fetch playlist info
const infoResponse = await youtube.playlists.list({
  part: ["snippet"],
  id: playlistId,
});

if (!infoResponse.data.items || infoResponse.data.items.length === 0) {
  return res.status(404).json({
    status: "fail",
    message: "Playlist not found or invalid ID",
  });
}

const playlistSnippet = infoResponse.data.items[0].snippet;
const title = playlistSnippet.title;
const description = playlistSnippet.description;


const channelId = playlistSnippet.channelId;
const channelInfo = await youtube.channels.list({
  part: ["snippet"],
  id: channelId,
});
const channelTitle = channelInfo.data.items[0]?.snippet?.title || "Unknown Channel";


    // Durations by common playback speeds
    const speeds = [0.5, 1, 1.25, 1.5, 2];
    const durationsBySpeed = {};

    speeds.forEach(s => {
      const adjusted = parseInt(totalSeconds / s);
      durationsBySpeed[`${s}x`] = formatDuration(adjusted);
    });

    // Duration for requested speed
    const requestedDuration = parseInt(totalSeconds / speed);
    const { hours, minutes, seconds } = formatDuration(requestedDuration);

    res.status(200).json({
      status: "success",
      data: {
        numberOfVideos: allVideoIds.length,
        title,
        description,
        channelTitle,
        duration: requestedDuration,
        hours,
        minutes,
        seconds,
        durationsBySpeed,
        thumbs,
      },
    });
  } catch (e) {
    res.status(500).json({ status: "fail", message: e.message });
  }
};


// Route
app.post("/api/calculate", calculateDuration);

// Start server
app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
