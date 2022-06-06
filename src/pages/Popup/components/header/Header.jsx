import React, { useContext } from 'react';
import { translate } from '../../../../common/utils_global';
import { ThemeContext, UserContext } from '../../context/UserContext';
import { LoginButton } from './LoginButton';

const Header = () => {
  const userData = useContext(UserContext)[0];
  const loading = useContext(UserContext)[2];
  const isUserLogin = useContext(UserContext)[3];
  const [theme, setThemeToStateNStorage] = useContext(ThemeContext);

  const setTheme = (theme) => {
    setThemeToStateNStorage(theme);
  };

  return (
    <div>
      <div
        style={{ backgroundColor: 'red' }}
        onClick={() => {
          setTheme(theme === 'dark' ? 'light' : 'dark');
        }}
      >
        {theme}
      </div>
      Header Component
      {!isUserLogin ? (
        <LoginButton />
      ) : loading ? (
        translate('loading')
      ) : (
        <>
          {userData?.member_info.first_name}
          {userData.earning.life_time_earning}
        </>
      )}
      <br />
    </div>
  );
};

export default Header;
