import React from "react";

// Context Providers
import { AuthContextProvider } from "../../context/AuthContext/AuthContext";
import { TechnicianContextProvider } from "../../context/AuthContext/TechnicianAuthContext";
import { WindowsErrorsContextProvider } from "../../context/WindowsErrors/windowsErrorsContext";
import { RepairShopsContextProvider } from "../../context/RepairShops/repairShopsContext";
import { ScraperProvider } from "../../context/ScrapingContext/ScraperContext";
import { OnlineServiceContextProvider } from "../../context/OnlineServicing/onlineServicingContext";
import { CommunityContextProvider } from "../../context/Community/communityContext";

const Providers = ({ children }) => {
    return (
        <AuthContextProvider>
        <TechnicianContextProvider>
            <WindowsErrorsContextProvider>
            <RepairShopsContextProvider>
                <ScraperProvider>
                <OnlineServiceContextProvider>
                    <CommunityContextProvider>
                        {children}
                    </CommunityContextProvider>
                </OnlineServiceContextProvider>
                </ScraperProvider>
            </RepairShopsContextProvider>
            </WindowsErrorsContextProvider>
        </TechnicianContextProvider>
        </AuthContextProvider>
    );
};

export default Providers;
