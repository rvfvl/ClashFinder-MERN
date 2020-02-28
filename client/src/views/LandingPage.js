import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import processRankImage from 'utils/processRankImage';
import styled from 'styled-components';
import device from 'theme/queries';
import RankSelect from 'components/RankSelect/RankSelect';
import RoleCheckbox from 'components/RoleCheckbox/RoleCheckbox';
import Button from 'components/Button/Button';
import { useForm } from 'react-hook-form';

import { addSearchCriteria } from 'actions/searchActions';

const MainContentWrapper = styled.div`
  text-align: center;

  h1 {
    font-size: 48px;

    @media ${device.tablet} {
      font-size: 66px;
    }
  }

  p {
    text-shadow: 1px 3px 6px #000000;
    font-size: 18px;

    @media ${device.tablet} {
      font-size: 22px;
    }
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const SearchForm = styled.form`
  display: flex;
  background: #000000c2 0% 0%;
  border-radius: 45px;
  box-shadow: 0px 3px 6px #00000066;
  flex-direction: column;

  @media ${device.tablet} {
    max-width: 900px;
    flex-direction: row;
    padding: 2rem;
  }
`;

const SearchLabel = styled.div`
  display: block;
  text-align: center;
  padding: 1rem 0 0.5rem;
  font-size: 23px;

  @media ${device.tablet} {
    font-size: 27px;
    padding: 0;
  }
`;

const SearchSection = styled.div`
  margin: 0 1rem;
  text-align: center;

  .checkbox_section {
    margin-top: 1rem;
  }

  .select_section {
    display: flex;

    span {
      position: relative;
      top: 20px;
    }

    .select_container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      margin: 10px;

      select {
        width: 130px;

        @media ${device.tablet} {
          width: 150px;
        }
      }

      img {
        width: 120px;
        height: 120px;
      }
    }
  }
`;

const LandingPage = () => {
  const { register, handleSubmit, watch, errors } = useForm();
  const minRank = useSelector(state => state.search.minRank);
  const maxRank = useSelector(state => state.search.maxRank);
  const dispatch = useDispatch();
  const history = useHistory();

  const [minSkill, setMinSkill] = useState(minRank);
  const [maxSkill, setMaxSkill] = useState(maxRank);

  const onSubmit = data => {
    const roles = [];

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'boolean') {
        if (value) roles.push(key.toString());
      }
    }

    dispatch(
      addSearchCriteria({
        minRank: parseInt(data.minRank, 10),
        maxRank: parseInt(data.maxRank, 10),
        roles
      })
    );
    history.push('/players');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
      <div>
        <MainContentWrapper>
          <h1>Welcome</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </p>
        </MainContentWrapper>
        <SearchWrapper>
          <h2>Find Player</h2>
          <SearchForm onSubmit={handleSubmit(onSubmit)}>
            <SearchSection>
              <SearchLabel>Skill Tier</SearchLabel>
              <div className="select_section">
                <div className="select_container">
                  <RankSelect name="minRank" ref={register} minSkill={{ minSkill, setMinSkill }} />
                  {<img src={require('assets/ranks/' + processRankImage(minSkill))} />}
                </div>
                <span>-</span>
                <div className="select_container">
                  <RankSelect name="maxRank" ref={register} maxSkill={{ maxSkill, setMaxSkill }} />
                  {<img src={require('assets/ranks/' + processRankImage(maxSkill))} />}
                </div>
              </div>
            </SearchSection>
            <SearchSection>
              <SearchLabel>Positions</SearchLabel>
              <RoleCheckbox type="checkbox" ref={register} />
              <Button type="submit" value="Search" />
            </SearchSection>
          </SearchForm>
          <p>Current version: Beta 0.1</p>
        </SearchWrapper>
      </div>
    </div>
  );
};

export default LandingPage;
