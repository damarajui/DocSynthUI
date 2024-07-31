import React, { createContext, useState, useContext } from 'react';

const GuideContext = createContext();

export const useGuideContext = () => useContext(GuideContext);

export const GuideProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  const updateHistory = (newItem) => {
    setHistory((prevHistory) => [...prevHistory, newItem]);
  };

  return (
    <GuideContext.Provider value={{ history, setHistory, updateHistory }}>
      {children}
    </GuideContext.Provider>
  );
};
