import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import device from '../theme/queries';
import { useForm } from 'react-hook-form';
import { setAlert } from '../actions/alertActions';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import Input from 'components/Input/Input';
import Button from 'components/Button/Button';
import Badge from 'components/Badge/Badge';
import ResetPasswordForm from 'components/DefaultForm/ResetPasswordForm';

const PageWrapper = styled.div`
  padding: 1rem;
  height: calc(100vh - 120px);
  position: relative;

  @media ${device.tablet} {
    padding: 2rem;
  }
`;

const ResetPasswordPage = props => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const { register, handleSubmit, watch, errors } = useForm();
  const [passwordChangeState, setPasswordChangeState] = useState({ state: null, msg: '' });

  const history = useHistory();

  const onSubmit = async data => {
    setPasswordChangeState(prevState => ({ ...prevState, state: null }));
    const resetToken = props.match.params.resettoken;

    try {
      const response = await axios.put(
        `/api/v1/auth/resetpassword/${resetToken}`,
        JSON.stringify({ password: data.password }),
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      setPasswordChangeState({ state: true, msg: response.data.msg });
      //dispatch(setAlert('success', response.data.msg));
    } catch (error) {
      setPasswordChangeState({ state: false, msg: error.response.data.errors.msg });
      //dispatch(setAlert('danger', error.response.data.errors.msg));
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/profile" />;
  }

  return (
    <PageWrapper>
      <ResetPasswordForm title="Set new password" onSubmit={handleSubmit(onSubmit)}>
        <span>
          <label htmlFor="password">New Password:</label>
          <Input
            type="password"
            name="password"
            ref={register({
              required: true,
              minLength: 5
            })}
          />
          {errors.password && (
            <Badge className="danger" style={{ display: 'block' }}>
              Password needs to be at least 5 characters long.
            </Badge>
          )}
        </span>
        <span>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <Input
            type="password"
            name="confirmPassword"
            ref={register({
              required: true,
              validate: value => value === watch().password
            })}
          />
          {errors.confirmPassword && (
            <Badge className="danger" style={{ display: 'block' }}>
              Password does not match.
            </Badge>
          )}
        </span>
        {passwordChangeState.state && (
          <Badge className="success" style={{ display: 'block' }}>
            {passwordChangeState.msg}
          </Badge>
        )}
        {passwordChangeState.state !== null && !passwordChangeState.state && (
          <Badge className="danger" style={{ display: 'block' }}>
            {passwordChangeState.msg}
          </Badge>
        )}

        <Button type="submit" value="Change password." />
      </ResetPasswordForm>
    </PageWrapper>
  );
};

export default ResetPasswordPage;
