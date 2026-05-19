/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Header from './components/layouts/Header';
import Sidebar from './components/layouts/Sidebar';
import RegistrationForm from './components/forms/RegistrationForm';
import SidebarWidgets from './components/SidebarWidgets';
import SuccessModal from './components/SuccessModal';
import ApiReference from './components/ApiReferecne';
import Documentation from './components/Documentation';
import Support from './components/Support';
import SecurityLogs from './components/SecurityLogs';

// import './assets/app.css';

export default function App() {
  const [activePage, setActivePage] = useState('tokens');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <Header activePage={activePage} onNavigate={setActivePage} />
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      
      <main className="md:pl-[240px] pt-16 min-h-screen shadow-2xl">
        <div className="max-w-6xl mx-auto px-margin py-12">
          {activePage === 'tokens' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Heading Section */}
              <div className="mb-12">
                <h1 className="text-5xl font-bold text-on-surface mb-2 tracking-tight">
                  Register for API Access
                </h1>
                <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
                  Fill out the details below to generate your secure API token. Our systems use advanced encryption to protect your environment credentials.
                </p>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-start">
                <RegistrationForm onGenerate={() => setIsModalOpen(true)} />
                <SidebarWidgets />
              </div>
            </div>
          )}

          {activePage === 'api' && <ApiReference />}
          {activePage === 'docs' && <Documentation />}
          {activePage === 'support' && <Support />}
          {activePage === 'security-logs' && <SecurityLogs />}
          
          {['status', 'logout'].includes(activePage) && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-6 border border-outline-variant/30">
                <span className="text-2xl">⏳</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Module Under Development</h2>
              <p className="text-on-surface-variant">The {activePage} module is being provisioned in the global cluster.</p>
              <button 
                onClick={() => setActivePage('tokens')}
                className="mt-8 text-primary hover:underline font-mono text-sm"
              >
                &lt; Return to Tokens
              </button>
            </div>
          )}
        </div>
      </main>

      <SuccessModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
