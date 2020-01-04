import React, { useState } from "react";

const useToggle = initalValue => {
  const [isOpen, setIsOpen] = useState(initalValue);
  return {
    isOpen,
    setIsOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(!isOpen)
  };
};

const ToggleCtxProvider = () => {
  const MyContext = React.createContext();

  const MyProvider = props => {
    const {
      isOpen: menuOpenState,
      toggle,
      setIsOpen: setMenuOpenState
    } = useToggle(false);

    return (
      <MyContext.Provider
        value={{
          isMenuOpen: menuOpenState,
          toggleMenu: () => toggle(),
          stateChangeHandler: newState => setMenuOpenState(newState.isOpen)
        }}
      >
        {props.children}
      </MyContext.Provider>
    );
  };

  return [MyContext, MyProvider];
};

export { useToggle, ToggleCtxProvider };
