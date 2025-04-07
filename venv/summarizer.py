from youtube_transcript_api import YouTubeTranscriptApi
import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

def get_transcript(video_id):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        full_text = " ".join([item['text'] for item in transcript])
        return full_text
    except Exception as e:
        raise Exception(f"Transcript error: {str(e)}")

def summarize_text(text):
    try:
        prompt = f"Summarize the following YouTube video transcript:\n{text}"
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        return response['choices'][0]['message']['content']
    except Exception as e:
        raise Exception(f"Summarization error: {str(e)}")
