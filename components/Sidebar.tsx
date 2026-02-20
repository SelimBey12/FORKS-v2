
import React from 'react';
import { Key, LogOut, User, CheckCircle, PlusCircle, Folder, Settings as SettingsIcon, Home as HomeIcon, ShieldCheck, Users, UserPlus, LucideIcon } from 'lucide-react';
import { ViewState, AuthState } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onNavigate: (view: string) => void;
  currentView: ViewState;
  isVerified: boolean;
  auth: AuthState;
}

// Added MenuItem interface to fix Property 'badge' does not exist on type errors
interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  className?: string;
  badge?: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onNavigate, currentView, isVerified, auth }) => {
  const isAdmin = auth.type === 'ADMIN';

  const userMenuItems: MenuItem[] = [
    { id: 'home', label: 'Ana Sayfa', icon: HomeIcon },
    { id: 'product-key', label: 'Ürün Anahtarım', icon: Key },
    { id: 'account', label: 'Hesabım', icon: User },
    { id: 'verify', label: 'Hesabımı Doğrula', icon: isVerified ? ShieldCheck : CheckCircle, badge: isVerified ? 'DOĞRULANDI' : null },
    { id: 'create-fork', label: 'Bir FORK Oluştur', icon: PlusCircle },
    { id: 'my-forks', label: 'FORK\'larım', icon: Folder },
    { id: 'settings', label: 'Ayarlar', icon: SettingsIcon },
    { id: 'logout', label: 'Log Out', icon: LogOut, className: 'text-red-400 hover:bg-red-950/30' },
  ];

  const adminMenuItems: MenuItem[] = [
    { id: 'admin-accounts', label: 'Hesap Yönetimi', icon: Users },
    { id: 'admin-create', label: 'Yeni Hesap Oluştur', icon: UserPlus },
    { id: 'logout', label: 'Admin Çıkışı', icon: LogOut, className: 'text-red-400 hover:bg-red-950/30' },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <aside className={`
      fixed top-0 left-0 h-full w-72 border-r z-50 transform transition-transform duration-300 ease-in-out shadow-2xl
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      ${isAdmin ? 'bg-slate-900 border-slate-800' : 'bg-slate-800 border-slate-700'}
    `}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${isAdmin ? 'bg-amber-600 shadow-amber-500/20' : 'bg-indigo-600 shadow-indigo-500/20'}`}>
            <span className="text-xl font-bold italic">F</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Forks</h1>
            {isAdmin && <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase -mt-1 block">Admin Console</span>}
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? (isAdmin ? 'bg-amber-600/10 text-amber-400 border border-amber-600/20' : 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20') 
                    : item.className || 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-100'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? (isAdmin ? 'text-amber-400' : 'text-indigo-400') : ''}`} />
                <span className="font-medium flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isAdmin ? 'bg-amber-950/20 border-amber-900/30' : 'bg-slate-900/50 border-slate-700/50'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isAdmin ? 'bg-amber-700 text-amber-100' : 'bg-slate-700 text-slate-300'}`}>
            {isAdmin ? 'AD' : (auth.type === 'USER' ? auth.account.fullName.substring(0, 2).toUpperCase() : '??')}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{isAdmin ? 'Administrator' : (auth.type === 'USER' ? auth.account.fullName : 'Guest')}</p>
            <p className="text-[10px] text-slate-500 uppercase">
              {isAdmin ? 'System Root' : (isVerified ? 'Verified Member' : 'Standard User')}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
