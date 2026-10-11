/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingView } from './views/LandingView';
import { OnboardingView } from './views/OnboardingView';
import { DashboardView } from './views/DashboardView';
import { SimulatorView } from './views/SimulatorView';
import { CompareView } from './views/CompareView';
import { FutureSelfView } from './views/FutureSelfView';
import { TrackerView } from './views/TrackerView';
import { MemoryView } from './views/MemoryView';
import { SettingsView } from './views/SettingsView';

function MainRouter() {
  const { userProfile } = useApp();

  // If user has visited and onboarded, start on dashboard, else start on landing
  const [currentView, setCurrentView] = useState<string>(() => {
    return userProfile.isOnboarded ? 'dashboard' : 'landing';
  });

  const [simulatorQuery, setSimulatorQuery] = useState<string>('');
  const [futureSelfContext, setFutureSelfContext] = useState<string>('');

  const navigateTo = (view: string, extra?: any) => {
    if (extra?.query) {
      setSimulatorQuery(extra.query);
    }
    if (extra?.context) {
      setFutureSelfContext(extra.context);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartOnboarding = () => {
    setCurrentView('onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreDemo = () => {
    setSimulatorQuery('What could happen if I practise programming for one hour every day for 90 days?');
    setCurrentView('simulator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDashboardExplore = (query: string) => {
    setSimulatorQuery(query);
    setCurrentView('simulator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToFutureSelf = (context: string) => {
    setFutureSelfContext(context);
    setCurrentView('future-self');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090e] text-slate-100 selection:bg-violet-500/30 selection:text-violet-200">
      {/* Navigation Bar */}
      <Navbar currentView={currentView} onNavigate={navigateTo} />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingView
            onStart={handleStartOnboarding}
            onExploreDemo={handleExploreDemo}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'onboarding' && (
          <OnboardingView onComplete={() => navigateTo('dashboard')} />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            onNavigate={navigateTo}
            onExploreQuery={handleDashboardExplore}
          />
        )}

        {currentView === 'simulator' && (
          <SimulatorView
            initialQuery={simulatorQuery}
            onNavigateToFutureSelf={handleNavigateToFutureSelf}
          />
        )}

        {currentView === 'compare' && <CompareView />}

        {currentView === 'future-self' && (
          <FutureSelfView initialContext={futureSelfContext} />
        )}

        {currentView === 'tracker' && <TrackerView />}

        {currentView === 'memory' && <MemoryView />}

        {currentView === 'settings' && <SettingsView />}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
