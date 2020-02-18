import React from 'react';
import styled from 'styled-components';
import processRankImage from 'utils/processRankImage';
import formatServerRegion from 'utils/formatServerRegion';
import countriesData from 'data/countries.json';
import FlagIcon from 'components/FlagIcon/FlagIcon';
import cardbg from 'assets/cardbg.png';

const CardWrapper = styled.div`
  display: flex;
  box-shadow: 0px 3px 6px #000;
  border: 1px solid black;
  padding: 0.5rem 1rem;
  background-image: url(${cardbg});

  background-position: center center;
  background-repeat: no-repeat;
  transition: transform 0.2s ease-in-out;
  max-width: 1000px;
  margin: 0 auto;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardDetails = styled.div`
  flex: 2;
`;

const CardRank = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;

  img {
    max-width: 120px;
    width: 100%;
    max-height: 120px;
  }
`;

const SummonerName = styled.div`
  display: flex;
  align-items: center;
  color: #61b0ff;
  font-size: 19px;
  padding-bottom: 0.5rem;
  position: relative;

  &::after {
    content: '';
    display: block;
    height: 2px;
    width: 50%;
    background-color: #66fcf1;
    position: absolute;
    bottom: 6px;
  }
`;

const StyledLabel = styled.div`
  display: flex;
  color: #c5c6c7;
  flex: 1;
  font-size: 13px;
  align-items: center;
`;

const DetailsRow = styled.div`
  display: flex;
  max-width: 350px;
  justify-content: space-between;
  height: 30px;
  font-size: 13px;
`;

const PositionsContainer = styled.div`
  margin: 1rem 0 0;

  img {
    width: 30px;
    height: 30px;
    margin-right: 5px;
  }
`;

const RankTitle = styled.div`
  font-weight: 700;
  margin-top: 1rem;
  color: #c5c6c7;
  font-size: 13px;
`;

const PlayerCard = ({ playerData }) => {
  const { dob, nationality, primaryRole, secondaryRole, discordName, summonerProfile } = playerData;

  return (
    <CardWrapper>
      <CardDetails>
        <SummonerName>
          {nationality !== 'Not specified' && (
            <FlagIcon countryData={countriesData} countryName={nationality} />
          )}
          {summonerProfile.summonerName}
        </SummonerName>
        <StyledLabel>
          <strong>Positions:</strong>
        </StyledLabel>
        <PositionsContainer>
          {primaryRole !== 'Not specified' && (
            <img src={require(`assets/${primaryRole.toLowerCase()}.png`)} />
          )}
          {secondaryRole !== 'Not specified' && (
            <img src={require(`assets/${secondaryRole.toLowerCase()}.png`)} />
          )}
        </PositionsContainer>
        <DetailsRow>
          <StyledLabel>
            <strong>Nationality:</strong>
          </StyledLabel>
          <StyledLabel style={{ display: 'flex', alignItems: 'center' }}>
            {nationality}
            {nationality !== 'Not specified' && (
              <FlagIcon countryData={countriesData} countryName={nationality} />
            )}
          </StyledLabel>
        </DetailsRow>
        <DetailsRow>
          <StyledLabel>
            <strong>Summoner Region:</strong>
          </StyledLabel>
          <StyledLabel>{formatServerRegion(summonerProfile.summonerRegion)}</StyledLabel>
        </DetailsRow>
        <DetailsRow>
          <StyledLabel>
            <strong>Discord Name:</strong>
          </StyledLabel>
          <StyledLabel>{discordName}</StyledLabel>
        </DetailsRow>
      </CardDetails>
      <CardRank>
        {<img src={require('assets/ranks/' + processRankImage(summonerProfile.tierValue))} />}
        <RankTitle>{`${summonerProfile.tier} ${summonerProfile.rank}`}</RankTitle>
      </CardRank>
    </CardWrapper>
  );
};

export default PlayerCard;
