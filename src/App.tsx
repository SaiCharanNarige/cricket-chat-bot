import React from 'react';
import './App.css';
import { UserProvider, useUser } from './contexts/UserContext';
import LoginPage from './Components/LoginPage';
import Chat from './Components/chat';

const AppContent: React.FC = () => {
  const { isLoggedIn, login } = useUser();

  return (
    <>
      {isLoggedIn ? <Chat /> : <LoginPage onLogin={login} />}
    </>
  );
};

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
