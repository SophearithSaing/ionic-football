import React from "react";
import { useState } from "react";

const Context = React.createContext({
  date: '',
  changeDate: (date) => { },
});

export const ContextProvider = (props) => {
  const [date, setDate] = useState('');

  const changeDate = (date) => {
    setDate();
  }

  return (
    <Context.Provider
      value={{
        date,
        changeDate
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default Context;