from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from transformers import pipeline
import re

app = FastAPI()

origins = [
    "http://localhost:5173",  # Frontend
]

#  Apply CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            
    allow_credentials=True,
    allow_methods=["*"],              
    allow_headers=["*"],              
)

# Summarizer pipeline
summarizer = pipeline("summarization", model="t5-small")

class VideoRequest(BaseModel):
    videoUrl: str

def extract_video_id(url: str) -> str:
    pattern = r"(?:v=|youtu\.be/)([a-zA-Z0-9_-]{11})"
    match = re.search(pattern, url)
    if not match:
        raise ValueError("Invalid YouTube video URL.")
    return match.group(1)

@app.post("/summarize")
def summarize_video(req: VideoRequest):
    try:
        video_id = extract_video_id(req.videoUrl)
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        full_text = " ".join([entry['text'] for entry in transcript])
        summary_list = summarizer(full_text, max_length=512, min_length=30, do_sample=False)
        summary = summary_list[0]['summary_text']

        return {
            "status": "success",
            "transcript": full_text,
            "summary": summary
        }
    except TranscriptsDisabled:
        raise HTTPException(status_code=403, detail="Transcripts are disabled for this video.")
    except NoTranscriptFound:
        raise HTTPException(status_code=404, detail="Transcript not available for this video.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
