import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Navbar from './Navbar';

interface Duration {
  hours: number;
  minutes: number;
  seconds: number;
}

interface Thumbnail {
  title: string;
  thumbnail: string;
}

interface DurationsBySpeed {
  [key: string]: Duration;
}

interface ApiResponse {
  status: string;
  data?: {
    numberOfVideos: number;
    title: string;
    channelTitle: string;
    duration: number;
    hours: number;
    minutes: number;
    seconds: number;
    durationsBySpeed: DurationsBySpeed;
    thumbs: Thumbnail[];
  };
  message?: string;
}

const Container = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 20px 0;
  background: #fff5f5;
  min-height: 100vh;
  width: 100%;
`;

const FormContainer = styled.form`
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  margin: 30px 0;
  width: 100%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const ResultContainer = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  margin: 30px 0;
  width: 100%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const SummaryContainer = styled(ResultContainer)`
  h2 {
    margin-bottom: 15px;
  }
`;

const SummaryContent = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
`;

const PlaylistHeader = styled.div`
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;

  h2 {
    margin-bottom: 5px;
    color: #333;
  }

  p {
    margin: 0;
    color: #666;
    font-size: 1rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 2px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.3s;
  &:focus {
    border-color: #6c63ff;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 2px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.3s;
  &:focus {
    border-color: #6c63ff;
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  flex: 1;
  padding: 10px;
  background: white;
  color: red;
  border: 2px solid red;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;

  &:hover {
    background: red;
    color: white;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #eee;
    color: #aaa;
    cursor: not-allowed;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 15px;
  margin: 20px 0;

  & > div:nth-child(1) {
    background: #fffbea;
  }
  & > div:nth-child(2) {
    background: #eafff3;
  }
  & > div:nth-child(3) {
    background: #eaeaff;
  }
`;

const StatItem = styled.div`
  flex: 1 1 30%;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  span.stat-icon {
    display: block;
    font-size: 1.5rem;
    margin-bottom: 5px;
  }

  h4 {
    margin-bottom: 5px;
    font-size: 1rem;
    color: #333;
    font-weight: bold;
  }

  p {
    margin: 0;
    font-size: 1rem;
    color: #666;
    word-wrap: break-word;
  }
`;

const SpeedList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 20px;
  margin: 15px 0;
`;

const SpeedItem = styled.div`
  background: #ffebec;
  border: 1px solid #ffd4d6;
  border-radius: 8px;
  padding: 10px 15px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  font-size: 0.9rem;
  font-weight: bold;
  color: #d9534f;
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    margin-bottom: 5px;
    font-size: 1.1rem;
  }
`;

const ThumbnailsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px 0;
`;

const ThumbnailCard = styled.div`
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  text-align: center;

  img {
    width: 100%;
    border-radius: 4px;
  }
  p {
    margin-top: 10px;
    font-weight: bold;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const ErrorMessage = styled.p`
  color: red;
  animation: ${fadeIn} 0.5s ease-in;
`;

const Home: React.FC = () => {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [speed, setSpeed] = useState(1);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playlistUrl, speed }),
      });

      const data: ApiResponse = await response.json();

      if (data.status === 'success') {
        setResult(data);
      } else {
        setError(data.message || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSummary = async () => {
    setLoading(true);
    setError('');
    setSummary('');
    try {
      const response = await fetch('http://localhost:5000/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: playlistUrl }), 
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSummary(data.summary);
      } else {
        setError(data.message || 'Failed to summarize');
      }
    } catch (err) {
      setError('Error contacting summary API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Navbar />
      <FormContainer onSubmit={handleCalculate}>
        <FormGroup>
          <Label>Playlist URL</Label>
          <Input 
            type="text" 
            value={playlistUrl} 
            onChange={e => setPlaylistUrl(e.target.value)} 
            required 
          />
        </FormGroup>
        <FormGroup>
          <Label>Playback Speed</Label>
          <Select 
            value={speed} 
            onChange={e => setSpeed(parseFloat(e.target.value))}
          >
            {[1, 1.25, 1.5, 1.75, 2].map(s => (
              <option key={s} value={s}>{s}x</option>
            ))}
          </Select>
        </FormGroup>
        <ButtonGroup>
          <Button 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Calculating...' : 'Calculate'}
          </Button>
          <Button 
            type="button" 
            onClick={handleSummary} 
            disabled={loading || !playlistUrl}
          >
            Summarize
          </Button>
        </ButtonGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </FormContainer>

      {result && result.data && (
        <ResultContainer>
          <PlaylistHeader>
            <p>Channel: {result.data.title}</p>
          </PlaylistHeader>
          <StatsContainer>
            <StatItem>
              <span className="stat-icon">🎞️</span>
              <h4>Total Videos</h4>
              <p>{result.data.numberOfVideos}</p>
            </StatItem>
            <StatItem>
              <span className="stat-icon">⏱️</span>
              <h4>Total Duration</h4>
              <p>{result.data.hours}h {result.data.minutes}m {result.data.seconds}s</p>
            </StatItem>
            <StatItem>
              <span className="stat-icon">⚡</span>
              <h4>Duration by Speed</h4>
              <SpeedList>
                {Object.entries(result.data.durationsBySpeed).map(([sp, dur]) => (
                  <SpeedItem key={sp}>
                    <span>{sp}x</span>
                    <span>{dur.hours}h {dur.minutes}m {dur.seconds}s</span>
                  </SpeedItem>
                ))}
              </SpeedList>
            </StatItem>
          </StatsContainer>
          <ThumbnailsContainer>
            {result.data.thumbs.map((thumb, idx) => (
              <ThumbnailCard key={idx}>
                <img src={thumb.thumbnail} alt={thumb.title} />
                <p>{thumb.title}</p>
              </ThumbnailCard>
            ))}
          </ThumbnailsContainer>
        </ResultContainer>
      )}

      {summary && (
        <SummaryContainer>
          <h2>Video Summary</h2>
          <SummaryContent>{summary}</SummaryContent>
        </SummaryContainer>
      )}
    </Container>
  );
};

export default Home;