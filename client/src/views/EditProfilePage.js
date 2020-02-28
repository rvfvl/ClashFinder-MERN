import React, { useState } from 'react';
import styled from 'styled-components';
import device from 'theme/queries';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from 'actions/alertActions';
import { loadUser } from 'actions/authActions';
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

const EditProfilePage = () => {
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    errors: errorsEmail
  } = useForm();
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    errors: errorsPassword
  } = useForm();

  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user || '');

  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);

  const [emailForm, setEmailForm] = useState({ email: '', currentPassword: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const onSubmitEmail = async data => {
    const { email, currentPassword } = data;

    try {
      const response = await axios.put('/api/v1/auth/updateemail', {
        email,
        password: currentPassword
      });

      dispatch(loadUser());
      setIsEmailFormOpen(false);
      dispatch(setAlert('success', response.data.msg));
    } catch (error) {
      dispatch(setAlert('danger', error.response.data.errors.msg));
    }
  };

  const onSubmitPassword = async data => {
    try {
      const response = await axios.put('/api/v1/auth/updatepassword', {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword
      });

      setIsPasswordFormOpen(false);
      dispatch(setAlert('success', response.data.msg));
    } catch (error) {
      dispatch(setAlert('danger', error.response.data.errors.msg));
    }
  };

  return (
    <PageWrapper>
      <h1>Email:</h1>
      {isEmailFormOpen ? (
        <div>
          <form onSubmit={handleSubmitEmail(onSubmitEmail)}>
            <span>
              <StyledLabel htmlFor="email">Email:</StyledLabel>
              <Input
                type="text"
                name="email"
                value={emailForm.email}
                onChange={e => setEmailForm({ ...emailForm, [e.target.name]: e.target.value })}
                ref={registerEmail({
                  required: true,
                  pattern: /^([\w\d._\-#])+@([\w\d._\-#]+[.][\w\d._\-#]+)+$/
                })}
              />
              {errorsEmail.email && (
                <Badge className="danger" style={{ display: 'block' }}>
                  Please enter correct email address.
                </Badge>
              )}
            </span>
            <span>
              <StyledLabel htmlFor="currentPassword">Current password:</StyledLabel>
              <Input
                type="password"
                name="currentPassword"
                value={emailForm.currentPassword}
                onChange={e => setEmailForm({ ...emailForm, [e.target.name]: e.target.value })}
                ref={registerEmail({ required: true })}
              />
              {errorsEmail.currentPassword && (
                <Badge className="danger" style={{ display: 'block' }}>
                  Please enter current password.
                </Badge>
              )}
            </span>
            <StyledButton type="submit" value="Change Email" />
            <StyledButton
              type="button"
              value="Cancel"
              onClick={() => setIsEmailFormOpen(!isEmailFormOpen)}
            />
          </form>
        </div>
      ) : (
        <div>
          <p>{user.email}</p>
          <StyledButton
            type="button"
            value="Edit Email"
            onClick={() => setIsEmailFormOpen(!isEmailFormOpen)}
          />
        </div>
      )}
      <h1>Password:</h1>
      {isPasswordFormOpen ? (
        <div>
          <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
            <span>
              <StyledLabel htmlFor="currentPassword">Current password:</StyledLabel>
              <Input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={e =>
                  setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
                }
                ref={registerPassword({ required: true })}
              />
              {errorsPassword.currentPassword && (
                <Badge className="danger" style={{ display: 'block' }}>
                  Please enter current password.
                </Badge>
              )}
            </span>
            <span>
              <StyledLabel htmlFor="newPassword">New password:</StyledLabel>
              <Input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={e =>
                  setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
                }
                ref={registerPassword({ required: true, minLength: 5 })}
              />
              {errorsPassword.newPassword && (
                <Badge className="danger" style={{ display: 'block' }}>
                  Password needs to be at least 5 characters long.
                </Badge>
              )}
            </span>
            <span>
              <StyledLabel htmlFor="confirmNewPassword">Confirm new password:</StyledLabel>
              <Input
                type="password"
                name="confirmNewPassword"
                value={passwordForm.confirmNewPassword}
                onChange={e =>
                  setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
                }
                ref={registerPassword({
                  required: true,
                  validate: value => value === passwordForm.newPassword
                })}
              />
              {errorsPassword.confirmNewPassword && (
                <Badge className="danger" style={{ display: 'block' }}>
                  Password does not match.
                </Badge>
              )}
            </span>
            <StyledButton type="submit" value="Change Password" />
            <StyledButton
              type="button"
              value="Cancel"
              onClick={() => setIsPasswordFormOpen(!isPasswordFormOpen)}
            />
          </form>
        </div>
      ) : (
        <div>
          <StyledButton
            type="button"
            value="Edit Password"
            onClick={() => setIsPasswordFormOpen(!isPasswordFormOpen)}
          />
        </div>
      )}
      <div>
        <Link to="/profile" className="backBtn">
          <IoMdArrowBack size={20} />
          Back to profile
        </Link>
      </div>
    </PageWrapper>
  );
};

export default EditProfilePage;
