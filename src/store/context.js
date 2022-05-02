import React from 'react';
import { useState } from 'react';

const Context = React.createContext({
  date: '',
  isDark: false,
  changeDate: (date) => {},
  toggleDarkMode: () => {},
  matches: [],
  loadMatches: (matches) => {},
});

export const ContextProvider = (props) => {
  const [date, setDate] = useState('');
  const [matches, setMatches] = useState([]);
  const [isDark, setIsDark] = useState(
    document.body.classList.contains('dark')
  );

  const changeDate = (date) => {
    setDate(date);
  };

  const loadMatches = (matches) => {
    setMatches(matches);
  }

  const toggleDarkMode = () => {
    if (isDark) {
      document.body.classList.remove('dark');
    } else if (!isDark) {
      document.body.classList.add('dark');
    }
    setIsDark(!isDark);
  };

  return (
    <Context.Provider
      value={{
        date,
        isDark,
        changeDate,
        toggleDarkMode,
        matches,
        loadMatches,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default Context;
