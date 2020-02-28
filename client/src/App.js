import React, { useEffect } from 'react';
import 'normalize.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from 'actions/authActions';
import PrivateRoute from 'routes/PrivateRoute';

// Import views
import ProfilePage from 'views/ProfilePage';
import LandingPage from './views/LandingPage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import PlayerPage from './views/PlayerPage';
import VerifyProfilePage from './views/VerifyProfilePage';
import EditProfilePage from './views/EditProfilePage';

// Import components
import Navbar from './components/Navbar/Navbar';
import Container from './components/Container/Container';
import Badge from './components/Badge/Badge';

import theme from './theme/theme';
import background from './assets/background.jpg';

const GlobalStyle = createGlobalStyle`
  html {
    min-height: 100%;
    position: relative;
  }
  
  body {
    font-family: 'Exo 2', sans-serif;
    color: #fff;
    height: 100%;
    background-size: cover;
    background: url(${background}) no-repeat center center fixed;
    
    * {
      box-sizing: border-box;
    }
  }
`;

const NotificationContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 450px;
  z-index: 1;
`;

function App() {
  const dispatch = useDispatch();
  const alerts = useSelector(state => state.alerts);

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Navbar />
        <Container>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/register" component={RegisterPage} />
            <Route exact path="/players" component={PlayerPage} />
            <PrivateRoute exact path="/profile" component={ProfilePage} />
            <PrivateRoute exact path="/profile/verify" component={VerifyProfilePage} />
            <PrivateRoute exact path="/profile/edit" component={EditProfilePage} />
          </Switch>
        </Container>
      </BrowserRouter>
      <NotificationContainer>
        {alerts.map(alert => (
          <Badge className={`${alert.type}`} key={alert.id}>
            {alert.msg}
          </Badge>
        ))}
      </NotificationContainer>
      <GlobalStyle />
    </ThemeProvider>
  );
}

export default App;
