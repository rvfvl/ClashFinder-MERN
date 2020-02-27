import React, { useState } from 'react';
import styled from 'styled-components';
import device from 'theme/queries';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { verifySummonerProfile } from 'actions/profileActions';
import Input from 'components/Input/Input';
import Select from 'components/Select/Select';
import Button from 'components/Button/Button';
import Badge from 'components/Badge/Badge';
import SelectNew from 'components/SelectNew/SelectNew';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const PageWrapper = styled.div`
  background-color: #0b0c10;
  padding: 2rem;
  border-radius: 45px;
  margin-top: 3rem;

  .backBtn {
    margin: 3rem 0 0;
    padding: 10px;
    cursor: pointer;
    border: 1px solid #fff;
    border-radius: 5px;
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    color: #fff;

    svg {
      margin-right: 5px;
    }
  }

  form {
    @media ${device.tablet} {
      width: 50%;
    }

    span {
      display: block;
      margin-bottom: 1rem;
    }
  }
`;

const StyledButton = styled(Button)`
  margin: 0;
  width: 150px;
`;

const StyledLabel = styled.label`
  font-size: 19px;
  margin-bottom: 1rem;
  display: block;
`;

const VerifyProfilePage = () => {
  const { register, handleSubmit, errors } = useForm();
  const dispatch = useDispatch();
  const partyId = useSelector(state => String(state.auth.user._id).substring(0, 8));
  const isSummonerVerified = useSelector(
    state => state.profile.currentProfile.summonerProfile.summonerVerified
  );
  const [summonerName, setSummonerName] = useState('');
  const [summonerRegion, setSummonerRegion] = useState('ru');
  const [partyCode, setPartyCode] = useState({ value: partyId, copied: false });

  const onSubmit = data => {
    dispatch(verifySummonerProfile(data));
  };

  if (isSummonerVerified) {
    return <Redirect to="/profile" />;
  }
  return (
    <PageWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <span>
          <StyledLabel htmlFor="summonerName">Summoner Name:</StyledLabel>
          <Input
            type="text"
            name="summonerName"
            value={summonerName}
            onChange={e => setSummonerName(e.target.value)}
            ref={register({ required: true })}
          />
          {errors.summonerName && (
            <Badge className="danger" style={{ display: 'block' }}>
              Please enter your Summoner name.
            </Badge>
          )}
        </span>
        <span>
          <StyledLabel htmlFor="summonerName">Summoner Region:</StyledLabel>
          <SelectNew
            name="summonerRegion"
            ref={register({ required: true })}
            value={summonerRegion}
            onChange={e => setSummonerRegion(e.target.value)}
          >
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
          </SelectNew>
        </span>
        <span>Enter this code into your League of Legends account client.</span>
        <CopyToClipboard
          text={partyCode.value}
          onCopy={() => setPartyCode(state => ({ ...state, copied: true }))}
        >
          <span style={{ cursor: 'pointer', border: '1px solid #66FCF1', padding: '10px' }}>
            <strong>{partyCode.value}</strong>
          </span>
        </CopyToClipboard>
        {partyCode.copied && <span style={{ color: 'red' }}>Copied to clipboard.</span>}
        <StyledButton type="submit" value="Verify" />
      </form>
      <Link to="/profile" className="backBtn">
        <IoMdArrowBack size={20} />
        Back to profile
      </Link>
    </PageWrapper>
  );
};

export default VerifyProfilePage;
