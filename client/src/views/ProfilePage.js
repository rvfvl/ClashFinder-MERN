import React, { useState, useEffect } from 'react';
import axios from 'axios';
import device from 'theme/queries';
import { useHistory } from 'react-router-dom';
import { GoVerified, GoUnverified } from 'react-icons/go';
import {
  getCurrentUserProfile,
  setProfileVisibilityAction,
  unverifySummonerProfile
} from 'actions/profileActions';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { setAlert } from 'actions/alertActions';
import formatRoleName from 'utils/formatRoleName';
import formatServerRegion from 'utils/formatServerRegion';
import FlagIcon from 'components/FlagIcon/FlagIcon';
import moment from 'moment';
import styled from 'styled-components';
import StyledInput from 'components/Input/Input';
import Select from 'components/Select/Select';
import ProfileForm from 'components/ProfileForm/ProfileForm';
import countriesData from 'data/countries.json';
import FilterableSelect from 'components/FilterableSelect/FilterableSelect';
import RoleCheckbox from 'components/RoleCheckbox/RoleCheckbox';
import Button from 'components/Button/Button';
import Badge from 'components/Badge/Badge';
import Toggle from 'react-toggle';

import 'react-toggle/style.css';

const PageWrapper = styled.div`
  background-color: #0b0c10;
  padding: 1rem;

  @media ${device.tablet} {
    padding: 2rem;
  }
`;

const TopPanel = styled.div`
  padding: 1rem 0;
  margin-bottom: 1rem;

  .userTitle {
    font-size: 18px;

    @media ${device.tablet} {
      font-size: 23px;
    }
  }

  border-bottom: 1px solid #707070;
`;

const StyledButton = styled(Button)`
  width: 100%;
  margin: 0;
  font-size: 12px;
  padding: 0.5rem;

  @media ${device.tablet} {
    width: unset;
    margin: 1rem 10px;
    padding: 1rem;
    font-size: 1rem;
  }
`;

const DobWrapper = styled.div`
  display: flex;
  /* width: 160px; */

  select {
    width: 45px !important;
  }

  @media ${device.tablet} {
    select {
      width: 100% !important;
    }
  }

  div + div {
    margin-left: 10px;
  }
`;

const ProfilePage = () => {
  const [isEditableProfile, setIsEditableProfile] = useState(false);
  const history = useHistory();

  const { register, handleSubmit, errors } = useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUserProfile());
  }, []);

  const profile = useSelector(state => state.profile);
  const user = useSelector(state => state.auth.user || '');

  const onSubmit = async data => {
    const { nationality, day, month, year, gender, discordName, primaryRole, secondaryRole } = data;

    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    };

    const preparedData = JSON.stringify({
      dob: `${day}/${month}/${year}`,
      nationality,
      gender,
      discordName,
      primaryRole,
      secondaryRole
    });

    try {
      await axios.put('/api/v1/profile', preparedData, config);
      setIsEditableProfile(!isEditableProfile);
      dispatch(getCurrentUserProfile());
      dispatch(setAlert('success', 'Profile successfuly updated.'));
    } catch (error) {
      dispatch(setAlert('danger', 'There was an error while trying to update profile.'));
    }
  };

  const getDobYears = () => {
    const yearsOptions = [];

    for (let i = new Date().getFullYear(); i > 1900; i--) {
      yearsOptions.push(i);
    }

    return yearsOptions;
  };

  if (!profile.currentProfile) {
    return <div>Loading</div>;
  }

  const handleToggleChange = () => {
    dispatch(setProfileVisibilityAction(!profile.currentProfile.profileVisibility));
  };

  return (
    <PageWrapper>
      <TopPanel>
        <div className="userTitle">Hello, {user.email}</div>
      </TopPanel>
      <div>
        <label
          id="profile-visibility"
          style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-end' }}
        >
          <span style={{ marginRight: '0.5rem' }}>Profile Visibility:</span>
          <Toggle
            id="profile-visibility"
            defaultChecked={profile.currentProfile.profileVisibility}
            onChange={handleToggleChange}
          />
        </label>
        <ProfileForm type="Profile" isEditable={{ isEditableProfile, setIsEditableProfile }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <strong>Nationality:</strong>
                  </td>
                  <td>
                    {isEditableProfile ? (
                      <FilterableSelect
                        className={errors.nationality && 'missing'}
                        initialValue={profile.currentProfile.nationality}
                        options={countriesData}
                        ref={register({
                          required: true,
                          validate: value =>
                            countriesData.map(country => country.name).indexOf(value) !== -1
                        })}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {profile.currentProfile.nationality !== 'Not specified' && (
                          <FlagIcon
                            countryData={countriesData}
                            countryName={profile.currentProfile.nationality}
                          />
                        )}
                        <span>{profile.currentProfile.nationality}</span>
                      </div>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Date of birth:</strong>
                  </td>
                  <td>
                    {isEditableProfile ? (
                      <DobWrapper>
                        <Select
                          name="day"
                          initialValue={moment(profile.currentProfile.dob).format('D')}
                          ref={register({
                            required: true,
                            validate: value => value !== 'ns'
                          })}
                          className={errors.day && 'missing'}
                        >
                          <option value="ns">DD</option>
                          {Array.from(Array(31)).map((option, index) => (
                            <option key={option} value={index + 1}>
                              {index + 1}
                            </option>
                          ))}
                        </Select>
                        <Select
                          name="month"
                          initialValue={moment(profile.currentProfile.dob).format('M')}
                          ref={register({
                            required: true,
                            validate: value => value !== 'ns'
                          })}
                          className={errors.month && 'missing'}
                        >
                          <option value="ns">MM</option>
                          {Array.from(Array(12)).map((option, index) => (
                            <option key={option} value={index + 1}>
                              {index + 1}
                            </option>
                          ))}
                        </Select>
                        <Select
                          name="year"
                          initialValue={moment(profile.currentProfile.dob).format('YYYY')}
                          ref={register({
                            required: true,
                            validate: value => value !== 'ns'
                          })}
                          className={errors.year && 'missing'}
                        >
                          <option value="ns">YYYY</option>
                          {getDobYears().map(option => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Select>
                      </DobWrapper>
                    ) : (
                      profile.currentProfile.dob
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Gender:</strong>
                  </td>
                  <td>
                    {isEditableProfile ? (
                      <Select
                        name="gender"
                        initialValue={profile.currentProfile.gender}
                        ref={register({ required: true, validate: value => value !== 'ns' })}
                        className={errors.gender && 'missing'}
                      >
                        <option value="ns">Please Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </Select>
                    ) : (
                      <span style={{ textTransform: 'capitalize' }}>
                        {profile.currentProfile.gender}
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Discord Name:</strong>
                  </td>
                  <td>
                    {isEditableProfile ? (
                      <StyledInput
                        type="text"
                        name="discordName"
                        defaultValue={profile.currentProfile.discordName}
                        ref={register({ pattern: /^$|((.+?)#\d{4})/ })}
                      />
                    ) : (
                      profile.currentProfile.discordName
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Primary Role:</strong>
                  </td>
                  <td>
                    {isEditableProfile ? (
                      <RoleCheckbox
                        type="radio"
                        name="primaryRole"
                        role={profile.currentProfile.primaryRole}
                        ref={register({ required: true })}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {profile.currentProfile.primaryRole !== 'Not specified' && (
                          <img
                            style={{ width: '30px', height: '30px', marginRight: '5px' }}
                            src={require(`assets/${profile.currentProfile.primaryRole.toLowerCase()}.png`)}
                          />
                        )}
                        <span>{formatRoleName(profile.currentProfile.primaryRole)}</span>
                      </div>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Secondary Role:</strong>
                  </td>
                  <td>
                    {isEditableProfile ? (
                      <RoleCheckbox
                        type="radio"
                        name="secondaryRole"
                        role={profile.currentProfile.secondaryRole}
                        ref={register({ required: true })}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {profile.currentProfile.secondaryRole !== 'Not specified' && (
                          <img
                            style={{ width: '30px', height: '30px', marginRight: '5px' }}
                            src={require(`assets/${profile.currentProfile.secondaryRole.toLowerCase()}.png`)}
                          />
                        )}
                        <span>{formatRoleName(profile.currentProfile.secondaryRole)}</span>
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            {Object.keys(errors).length > 0 && (
              <Badge className="danger">
                Please complete all highlighted fields and select your role.
              </Badge>
            )}
            {isEditableProfile && <Button type="submit" name="submit" value="Update" />}
          </form>
        </ProfileForm>
        <ProfileForm type="Summoner Profile">
          <table>
            <tbody>
              {profile.currentProfile.summonerProfile.summonerVerified ? (
                <>
                  <tr>
                    <td>
                      <strong>Status:</strong>
                    </td>
                    <td style={{ display: 'flex', alignItems: 'center' }}>
                      <GoVerified fill="green" size={24} />
                      <span style={{ marginLeft: '5px' }}>Verified</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Summoner Name:</strong>
                    </td>
                    <td>{profile.currentProfile.summonerProfile.summonerName}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Summoner Region:</strong>
                    </td>
                    <td>
                      {formatServerRegion(profile.currentProfile.summonerProfile.summonerRegion)}
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  <tr>
                    <td>Status:</td>
                    <td style={{ display: 'flex', alignItems: 'center' }}>
                      <GoUnverified fill="red" size={24} />
                      <span style={{ marginLeft: '5px' }}>Not Verified</span>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
          {profile.currentProfile.summonerProfile.summonerVerified ? (
            <StyledButton
              type="button"
              value="Unverify account here"
              onClick={() => dispatch(unverifySummonerProfile())}
            />
          ) : (
            <StyledButton
              type="button"
              value="Verify your account"
              onClick={() => history.push('/profile/verify')}
            />
          )}
        </ProfileForm>
      </div>
      <StyledButton
        type="button"
        value="Edit Profile"
        onClick={() => history.push('/profile/edit')}
      />
    </PageWrapper>
  );
};

export default ProfilePage;
