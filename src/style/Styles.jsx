import React, { useContext } from 'react';
import { ThemeContext } from '../pages/Popup/context/UserContext';

const Styles = () => {
  const theme = useContext(ThemeContext)[0];
  if (theme === 'dark') {
    return <DarkThemeCustomStyle />;
  } else if (theme === 'light') {
    return <LightThemeCustomStyle />;
  } else {
    return <LightThemeCustomStyle />;
  }
};

export const rawSetTheme = (rawTheme) => {
  const root = window.document.documentElement;
  const isDark = rawTheme === 'dark';
  root.classList.remove(isDark ? 'light' : 'dark');
  root.classList.add(rawTheme);
};

const DarkThemeCustomStyle = () => {
  return <style>{``}</style>;
};

const LightThemeCustomStyle = () => {
  return <style>{``}</style>;
};

export default Styles;
