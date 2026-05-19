import { useState, useRef, useEffect } from 'react';
import { Bell, Settings, LogOut, User, Shield, AlertTriangle, Info, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UseApp } from '../../providers/AppContext';
import { useNavigate } from 'react-router';

// interface HeaderProps {
//   activePage: string;
//   onNavigate: (page: string) => void;
// }

// interface Notification {
//   id: string;
//   title: string;
//   description: string;
//   time: string;
//   type: 'info' | 'success' | 'alert';
//   read: boolean;
//   details: string;
// }

const mockNotifications = [
  {
    id: '1',
    title: 'New Token Provisioned',
    description: 'Your API token for "Production Server" is now active.',
    time: '2m ago',
    type: 'success',
    read: false,
    details: 'The token nx_live_83k92m1... has been successfully generated and distributed to the Singapore (sg-1) hub. No further action is required.'
  },
  {
    id: '2',
    title: 'Cluster Optimization',
    description: 'The US-East-1 cluster has been optimized for lower latency.',
    time: '45m ago',
    type: 'info',
    read: true,
    details: 'Traffic re-routing completed. Average TTL reduced by 15ms. Global load balancer updated.'
  },
  {
    id: '3',
    title: 'Security Alert: Failed Login',
    description: 'A suspicious login attempt was blocked from IP 45.12.8.192.',
    time: '2h ago',
    type: 'alert',
    read: false,
    details: 'A brute-force attempt was detected on your account. The IP origin is Moscow, RU. Security protocols have automatically blacklisted this range for 24 hours.'
  }
];

export default function Header({ activePage, onNavigate }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const { appTitle} = UseApp();
  const navigate = useNavigate();
  
  const menuRef = useRef(null);
  const notificationsRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // window.location.href = './signout';
    navigate('/logout');
  };

  const handleNotificationClick = (notif) => {
    setSelectedNotification(notif);
    setIsNotificationsOpen(false);
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
  };

  return (
    <header className="bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 fixed top-0 z-50 flex justify-between items-center w-full px-margin h-16">
      <div className="flex items-center gap-gutter">
        <span 
          onClick={() => onNavigate('tokens')}
          className="text-2xl font-bold tracking-tighter text-primary cursor-pointer"
        >
          {appTitle} Auth
        </span>
        <nav className="hidden md:flex gap-margin">
          {[
            { id: 'tokens', label: 'Tokens' },
            { id: 'docs', label: 'Documentation' },
            { id: 'api', label: 'API Reference' },
            { id: 'support', label: 'Support' },
          ].map((item) => (
            <a
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`text-sm font-medium transition-colors cursor-pointer pb-1 ${
                activePage === item.id 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-base">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-on-primary text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 lg:w-96 glass-panel rounded-xl shadow-2xl overflow-hidden z-100"
              >
                <div className="px-4 py-3 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container">
                  <span className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-widest">Active Alerts</span>
                  <button 
                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                    className="text-[10px] text-primary hover:underline font-bold font-mono"
                  >
                    MARK ALL READ
                  </button>
                </div>
                
                <div className="max-h-100 overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`px-4 py-4 border-b border-outline-variant/10 hover:bg-primary/5 transition-colors cursor-pointer group flex gap-3 ${!notif.read ? 'bg-primary/[0.02]' : ''}`}
                      >
                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          notif.type === 'success' ? 'bg-tertiary/10 text-tertiary' :
                          notif.type === 'alert' ? 'bg-error/10 text-error' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {notif.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                          {notif.type === 'alert' && <AlertCircle className="w-4 h-4" />}
                          {notif.type === 'info' && <Info className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <p className={`text-xs font-bold truncate ${!notif.read ? 'text-on-surface' : 'text-on-surface-variant'}`}>{notif.title}</p>
                            <span className="text-[10px] text-outline font-mono shrink-0">{notif.time}</span>
                          </div>
                          <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                            {notif.description}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <Bell className="w-8 h-8 text-outline mx-auto mb-2 opacity-20" />
                      <p className="text-xs text-outline font-mono">No new alerts detected</p>
                    </div>
                  )}
                </div>
                
                <button className="w-full py-2 text-[10px] font-mono font-bold text-on-surface-variant hover:text-primary transition-colors bg-surface-container/50">
                  VIEW AUDIT HISTORY
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
          <Settings className="w-5 h-5" />
        </button> */}
        
        {/* User Account Menu */}
        <div className="ml-2 relative" ref={menuRef}>
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="relative cursor-pointer group focus:outline-none"
          >
            <img 
              alt="Developer Profile" 
              className={`w-8 h-8 rounded-full border border-outline-variant/50 object-cover transition-all ${isUserMenuOpen ? 'ring-2 ring-primary border-transparent' : 'group-hover:border-primary/50'}`}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpe-U1IsM7n6HnWSZfGEyuVVs9tWNb8afDazBDEVGBrHXCTmTXqDeJlpAwYHHF0A2fp-09h29iW6oap8_Q_X3v_PruqSSdLqt-NOcyOgNODotWG41n3uSeHFkxoht8eyO52Ga8q_LQ-C4bNEFruf7_WyBFcBpncDDE22MiI4XUPxiNshlm8M4hzjAe-uT5UI33usMMxeQ7yGSAmkRcR74CbQuXNqxOk8t4ZNpPmnbnjZ4bIUyHqWeXNtqjPh5YLZw_qGTzSFO9bq8"
              referrerPolicy="no-referrer"
            />
            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-tertiary border-2 border-surface rounded-full transition-transform ${isUserMenuOpen ? 'scale-0' : 'scale-100'}`}></div>
          </button>

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 glass-panel rounded-xl shadow-2xl overflow-hidden py-2 z-100"
              >
                <div className="px-4 py-3 border-b border-outline-variant/20 mb-1">
                  <p className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-widest leading-none mb-1">Current User</p>
                  <p className="text-sm font-bold truncate">Nexus Developer</p>
                </div>
                
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors text-left font-sans cursor-pointer">
                  <User className="w-4 h-4" /> Account Settings
                </button>
                <button 
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onNavigate('security-logs');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors text-left font-sans cursor-pointer"
                >
                  <Shield className="w-4 h-4" /> Security Logs
                </button>
                
                <div className="h-px bg-outline-variant/20 my-1 mx-2"></div>
                
                <button 
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/5 transition-colors text-left font-sans"
                >
                  <LogOut className="w-4 h-4" /> Signed Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Notification Details Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <div className="fixed inset-0 z-110 flex items-start justify-center p-gutter">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-surface/90 backdrop-blur-md"
              onClick={() => setSelectedNotification(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass-panel rounded-2xl max-w-lg w-full border border-outline-variant/30 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className={`h-1.5 w-full ${
                selectedNotification.type === 'success' ? 'bg-tertiary' :
                selectedNotification.type === 'alert' ? 'bg-error' :
                'bg-primary'
              }`}></div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      selectedNotification.type === 'success' ? 'bg-tertiary/10 text-tertiary' :
                      selectedNotification.type === 'alert' ? 'bg-error/10 text-error' :
                      'bg-primary/10 text-primary'
                    }`}>
                      {selectedNotification.type === 'success' && <CheckCircle2 className="w-6 h-6" />}
                      {selectedNotification.type === 'alert' && <AlertCircle className="w-6 h-6" />}
                      {selectedNotification.type === 'info' && <Info className="w-6 h-6" />}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{selectedNotification.title}</h2>
                      <p className="text-xs font-mono text-outline">{selectedNotification.time}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedNotification(null)}
                    className="p-2 text-on-surface-variant hover:text-on-surface transition-colors bg-surface-container rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 italic text-on-surface-variant leading-relaxed">
                    "{selectedNotification.description}"
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-widest">Detail Trace</p>
                    <p className="text-sm text-on-surface leading-loose">
                      {selectedNotification.details}
                    </p>
                  </div>
                  
                  {/* <div className="pt-6 border-t border-outline-variant/20 flex gap-3">
                    <button 
                      onClick={() => setSelectedNotification(null)}
                      className="flex-1 py-3 bg-surface-container text-on-surface-variant font-bold rounded-xl border border-outline-variant/30 hover:bg-surface-container-high transition-all cursor-pointer"
                    >
                      Dismiss Alert
                    </button>
                    <button className="flex-1 py-3 bg-primary-container text-on-primary-container font-bold rounded-xl hover:neon-glow-primary transition-all active:scale-95 cursor-pointer">
                      Investigate Node
                    </button>
                  </div> */}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-110 flex items-start justify-center p-gutter">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-surface/90 backdrop-blur-md"
              onClick={() => setShowLogoutConfirm(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass-panel p-8 rounded-2xl max-w-sm w-full text-center border border-outline-variant/30 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            >
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-error/20">
                <AlertTriangle className="w-8 h-8 text-error" />
              </div>
              <h2 className="text-xl font-bold mb-2">Confirm Sign Out</h2>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                Are you sure you want to terminate your active session in the global cluster? You will need to re-authenticate to access your tokens.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-error text-on-error font-bold rounded-xl transition-all hover:bg-error/90 active:scale-95"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-3 bg-surface-container font-bold rounded-xl border border-outline-variant/30 transition-all hover:bg-surface-container-high active:scale-95 text-on-surface-variant"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
