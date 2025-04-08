# vidsum

✨ **vidsum** ✨ helps you automatically generate summaries for YouTube videos, calculate total viewing duration at various playback speeds (from 0.5x to 2x), and display engaging video thumbnails—all in one powerful tool!

> **Features:**
> - 🎬 **Video Summarization:** Quickly extract the key points of any YouTube video.

![Screenshot 2025-04-08 022028](https://github.com/user-attachments/assets/64d955dd-787b-4505-a9b1-db9487afc7fa)

> - ⏱️ **Duration Calculator:** Determine how long a video will take to watch at speeds ranging from slow (0.5x) to fast (2x).


![Screenshot 2025-04-07 144232](https://github.com/user-attachments/assets/9c45438d-e705-46fe-9d60-719cd8866d34)
![Screenshot 2025-04-08 022824](https://github.com/user-attachments/assets/3a7309d7-a76a-4fed-96bd-348556694d84)


> - 🖼️ **Thumbnail Extraction:** Automatically fetch and display video thumbnails for a quick visual preview.


![Screenshot 2025-04-08 022835](https://github.com/user-attachments/assets/1411fb7b-4256-4a7f-b0f2-586c87b82dac)

## Introduction

In our fast-paced digital era, watching entire videos isn’t always feasible. **vidsum** is designed for users who want to get the gist of a YouTube video without spending hours watching it. By combining modern web technologies with powerful APIs, **vidsum** not only generates detailed summaries but also calculates viewing durations at different speeds—letting you plan your watch time efficiently. Whether you need just a quick overview or plan to dive deep into the content, **vidsum** makes it easy and fun.

## Prerequisites

Before getting started, ensure you have the following installed and configured:

- **Node.js and npm**: Required for running both the backend and client applications.
- **Python 3.8+**: Necessary for running the video processing module.
- **API Access:**
  - **YouTube Data API v3**: Used to fetch video details, including thumbnails. (Make sure you have a valid API key and configure it in your environment.)
- **Uvicorn**: For serving the FastAPI-based Python application. (Typically installed via pip.)
- **Transformers** :For advanced NLP-based summarization, you may consider using Hugging Face’s Transformers.


## Installation

Each component of **vidsum** runs in its own terminal. Follow the instructions below for setting up each part:

### Backend Setup

1. **Open a new terminal window and navigate to the `backend` folder:**
   ```bash
   cd backend
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Start the backend service in development mode:**
   ```bash
   npm run dev
   ```
   The backend service will start on the configured port as specified in your environment settings.

### Client Setup

1. **Open another terminal window and navigate to the `client` folder:**
   ```bash
   cd client
   ```

2. **Install the client dependencies:**
   ```bash
   npm install
   ```

3. **Start the client application:**
   ```bash
   npm run dev
   ```
   The client will launch (usually in your browser) and allow you to interact with the **vidsum** interface.

### Python Module Setup

1. **Open a new terminal window and navigate to the `python` folder:**
   ```bash
   cd python
   ```

2. **Create and activate a virtual environment (optional but recommended):**
   
   - On Windows:
     ```bash
     python -m venv venv
     venv\Scripts\activate.ps1
     ```



4. **Start the Python video processing service using Uvicorn:**
   ```bash
   uvicorn main:app --reload --port 5000
   ```

## Usage

Once all the components are running:

- **On the Client:**  
  Enter the URL of a YouTube video.  
- **Backend Coordination:**  
  The backend service receives your request and coordinates with the Python module.
- **Video Processing:**  
  The Python module uses the YouTube Data API to fetch video details (including thumbnails) and then generates a summary and calculates the total duration at different speeds.
- **Result Display:**  
  The client application shows you the summary of the video, the calculated durations (from 0.5x to 2x playback speeds), and the video thumbnails for quick reference.

