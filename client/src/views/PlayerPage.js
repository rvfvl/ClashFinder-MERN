import React, { useEffect } from 'react';
import styled from 'styled-components';
import countriesData from 'data/countries.json';
import device from 'theme/queries';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { getAllProfiles } from 'actions/profileActions';
import PlayerCard from 'components/PlayerCard/PlayerCard';
import { addSearchCriteria } from 'actions/searchActions';
import Button from 'components/Button/Button';
import Select from 'components/Select/Select';
import FilterableSelect from 'components/FilterableSelect/FilterableSelect';
import RoleCheckbox from 'components/RoleCheckbox/RoleCheckbox';

const PlayerPageWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media ${device.tablet} {
    flex-direction: row;
  }
`;

const SearchContainer = styled.div`
  padding: 1rem 2rem;
  flex: 1;
  background-color: #1f2833;
  box-shadow: 0px 3px 6px #000000;
  margin-bottom: 1rem;

  @media ${device.tablet} {
    margin-right: 1rem;
    margin-bottom: 0;
  }

  ul {
    width: 100%;
  }

  input:not([type='submit']) {
    width: 100%;
  }

  label {
    font-size: 16px;
    padding: 10px 0;
    margin: 0.5 0;
    display: block;
  }

  .checkbox_section {
    justify-content: flex-start;

    img {
      width: 35px;
      height: 35px;
      margin: 0 0.5rem 0;
    }
  }
`;

const ResultsContainer = styled.div`
  background-color: #1f2833;
  box-shadow: 0px 3px 6px #000000;
  flex: 2;
  padding: 1rem 2rem;
`;

const PlayerPage = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.profile.loading);
  const profiles = useSelector(state => state.profile.profiles);
  const searchCriteria = useSelector(state => state.search);

  const { register, handleSubmit, watch, errors } = useForm();

  useEffect(() => {
    dispatch(getAllProfiles());
  }, []);

  const onSubmit = data => {
    const roles = [];

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'boolean') {
        if (value) roles.push(key.toString());
      }
    }

    const nationality = data.nationality !== '' ? data.nationality : null;
    const region = data.region !== 'all' ? data.region : null;

    dispatch(
      addSearchCriteria({
        minRank: parseInt(data.minRank, 10),
        maxRank: parseInt(data.maxRank, 10),
        roles,
        nationality,
        region
      })
    );
  };

  if (isLoading) {
    return <div>Loading</div>;
  }

  const showProfiles = () => {
    if (profiles.length) {
      let profileList = [...profiles];

      profileList = profiles.filter(
        profile =>
          profile.summonerProfile.summonerRank.tierValue >= searchCriteria.minRank &&
          profile.summonerProfile.summonerRank.tierValue <= searchCriteria.maxRank
      );

      profileList = profileList.filter(
        profile =>
          searchCriteria.roles.includes(profile.primaryRole) ||
          searchCriteria.roles.includes(profile.secondaryRole)
      );

      if (searchCriteria.region) {
        profileList = profileList.filter(
          profile => profile.summonerProfile.summonerRegion === searchCriteria.region
        );
      }

      if (searchCriteria.nationality) {
        profileList = profileList.filter(
          profile => profile.nationality === searchCriteria.nationality
        );
      }

      if (profileList.length) {
        return profileList.map(profile => (
          <PlayerCard
            playerData={{
              dob: profile.dob,
              nationality: profile.nationality,
              primaryRole: profile.primaryRole,
              secondaryRole: profile.secondaryRole,
              discordName: profile.discordName,
              summonerProfile: {
                ...profile.summonerProfile.summonerRank,
                summonerName: profile.summonerProfile.summonerName,
                summonerRegion: profile.summonerProfile.summonerRegion
              }
            }}
          />
        ));
      } else {
        return <div>No Profiles found.</div>;
      }
    } else {
      return <div>No Profiles found.</div>;
    }
  };

  return (
    <PlayerPageWrapper>
      <SearchContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="region">Summoner Region:</label>
          <Select
            name="region"
            ref={register({ required: true })}
            initialValue={searchCriteria.region ? searchCriteria.region : 'all'}
          >
            <option value="all">All</option>
            <option value="ru">Russia</option>
            <option value="kr">Korea</option>
            <option value="br1">Brazil</option>
            <option value="oc1">Oceania</option>
            <option value="jp1">Japan</option>
            <option value="na1">North America</option>
            <option value="eun1">Europe Nordic & East</option>
            <option value="euw1">Europe West</option>
            <option value="tr1">Turkey</option>
            <option value="la1">LAS</option>
            <option value="la2">LAN</option>
          </Select>
          <label htmlFor="region">Nationality:</label>
          <FilterableSelect
            className={errors.nationality && 'missing'}
            initialValue={searchCriteria.nationality ? searchCriteria.nationality : ''}
            options={countriesData}
            ref={register({
              validate: value =>
                countriesData.map(country => country.name).indexOf(value) !== -1 || value === ''
            })}
          />
          <div>
            <div>
              <label htmlFor="minRank">Minimum Summoner Rank:</label>
              <Select
                name="minRank"
                ref={register({ required: true })}
                initialValue={searchCriteria.minRank ? searchCriteria.minRank : '1'}
              >
                <option value="1">Iron</option>
                <option value="2">Bronze</option>
                <option value="3">Silver</option>
                <option value="4">Gold</option>
                <option value="5">Platinum</option>
                <option value="6">Diamond</option>
              </Select>
            </div>
            <div>
              <label htmlFor="maxRank">Maximum Summoner Rank:</label>
              <Select
                name="maxRank"
                ref={register({ required: true })}
                initialValue={searchCriteria.maxRank ? searchCriteria.maxRank : '6'}
              >
                <option value="1">Iron</option>
                <option value="2">Bronze</option>
                <option value="3">Silver</option>
                <option value="4">Gold</option>
                <option value="5">Platinum</option>
                <option value="6">Diamond</option>
              </Select>
            </div>
          </div>
          <label>Positions:</label>
          <RoleCheckbox type="checkbox" ref={register} />
          <Button type="submit" value="Search" />
        </form>
      </SearchContainer>
      <ResultsContainer>
        <h1>Find Players:</h1>
        {showProfiles()}
      </ResultsContainer>
    </PlayerPageWrapper>
  );
};

export default PlayerPage;
