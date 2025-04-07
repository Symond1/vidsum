import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import  Player  from 'lottie-react';

const NavBarContainer = styled.nav`
  background: linear-gradient(45deg, #1d2671, #c33764);
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: white;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  margin-left: 10px;
`;

const Navbar: React.FC = () => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch('/animation.json')
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error('Error loading animation:', error));
  }, []);

  return (
    <NavBarContainer>
      {animationData ? (
        <Player
          autoplay
          loop
          animationData={animationData}
          style={{ height: '50px', width: '50px' }}
        />
      ) : (
        <div>Loading animation...</div>
      )}
      <Title>VIDSUM</Title>
    </NavBarContainer>
  );
};

export default Navbar;
