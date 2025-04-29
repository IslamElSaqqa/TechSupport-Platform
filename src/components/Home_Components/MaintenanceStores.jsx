import React from 'react';
import HelpDesk from './HelpDesk';
import HomeStores from './HomeStores';

const MaintenanceStores = () => {
  return (
    <div className="stores-container">
      <div className="header-section">
      </div>
      <HomeStores />
      <br></br>
      <HelpDesk />
    </div>
  );
};

export default MaintenanceStores;