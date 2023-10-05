import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import GlobalContext from "./GlobalContext";

import HomePage from "./pages/Home"

import { useState } from "react";

function App() {
   const [globalUser, setGlobalUser] = useState({
        userLoggedIn: false,
   })

  return (
      <GlobalContext.Provider value={globalUser}>
          <Router>
              <div className="max-w-5xl mx-auto">
                  <Routes>
                      <Route path="/" element={<HomePage />} />
                  </Routes>
              </div>
          </Router>
      </GlobalContext.Provider>
  );
}

export default App;
