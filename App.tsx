
import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { ForkFile, AppSettings, ViewState, AuthState, UserAccount } from './types';
import { ADMIN_PRODUCT_KEY, STORAGE_BUCKET } from './constants';
import Sidebar from './components/Sidebar';
import Home from './views/Home';
import ProductKeyView from './views/ProductKeyView';
import AccountView from './views/AccountView';
import VerifyView from './views/VerifyView';
import CreateFork from './views/CreateFork';
import MyForks from './views/MyForks';
import SettingsView from './views/SettingsView';
import AdminAccountsView from './views/AdminAccountsView';
import AdminCreateView from './views/AdminCreateView';
import SecurityGate from './components/SecurityGate';
import VerificationErrorView from './views/VerificationErrorView';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [auth, setAuth] = useState<AuthState>({ type: 'NONE' });
  const [allAccounts, setAllAccounts] = useState<UserAccount[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ askProductKey: true, isVerified: false });
  const [forks, setForks] = useState<ForkFile[]>([]);
  const [loading, setLoading] = useState(false);

  // Sync data from Supabase
  const fetchData = async () => {
    if (auth.type === 'USER') {
      setLoading(true);
      // Fetch account details & settings (stored in 'accounts' table)
      const { data: accData } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', auth.account.id)
        .single();

      if (accData) {
        setSettings({
          askProductKey: accData.ask_product_key,
          isVerified: accData.is_verified,
          verificationData: accData.verification_data
        });
        // Update local auth account if cloud name changed
        setAuth({ type: 'USER', account: { ...auth.account, fullName: accData.full_name, isActivated: accData.is_activated } });
      }

      // Fetch user files
      const { data: fileData } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', auth.account.id);

      if (fileData) {
        const mappedForks: ForkFile[] = fileData.map(f => ({
          id: f.id,
          name: f.name,
          size: f.size,
          type: f.type,
          data: f.storage_path, // Storage URL/Path
          createdAt: new Date(f.created_at).getTime()
        }));
        setForks(mappedForks);
      }
      setLoading(false);
    } else if (auth.type === 'ADMIN') {
      const { data } = await supabase.from('accounts').select('*');
      if (data) {
        setAllAccounts(data.map(d => ({
          id: d.id,
          fullName: d.full_name,
          email: d.email,
          productKey: d.product_key,
          createdAt: new Date(d.created_at).getTime(),
          isActivated: d.is_activated
        })));
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [auth.type]);

  const handleLogin = async (key: string) => {
    if (key === ADMIN_PRODUCT_KEY) {
      setAuth({ type: 'ADMIN' });
      return true;
    }
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('product_key', key)
      .single();

    if (data && !error) {
      setAuth({ 
        type: 'USER', 
        account: {
          id: data.id,
          fullName: data.full_name,
          email: data.email,
          productKey: data.product_key,
          createdAt: new Date(data.created_at).getTime(),
          isActivated: data.is_activated
        } 
      });
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    if (window.confirm("Oturumu kapatmak istediğinize emin misiniz?")) {
      setAuth({ type: 'NONE' });
      setIsSidebarOpen(false);
    }
  };

  const handleNameChange = async (newName: string) => {
    if (auth.type === 'USER') {
      await supabase
        .from('accounts')
        .update({ full_name: newName })
        .eq('id', auth.account.id);
      
      setAuth({ ...auth, account: { ...auth.account, fullName: newName } });
    }
  };

  const updateAccountActivation = async (id: string, isActivated: boolean) => {
    await supabase
      .from('accounts')
      .update({ is_activated: isActivated })
      .eq('id', id);
    fetchData();
  };

  const handleVerify = async (data: any) => {
    if (auth.type === 'USER') {
      await supabase
        .from('accounts')
        .update({ 
          is_verified: true, 
          verification_data: data 
        })
        .eq('id', auth.account.id);
      setSettings(prev => ({ ...prev, isVerified: true, verificationData: data }));
    }
  };

  const addFork = async (newFork: ForkFile) => {
    // Note: The actual file upload is handled in CreateFork view via Supabase Storage
    // This just updates the UI list, but fetchData would sync it anyway
    fetchData();
    setCurrentView('my-forks');
  };

  const deleteFork = async (id: string) => {
    if (auth.type === 'USER') {
      const fileToDelete = forks.find(f => f.id === id);
      if (fileToDelete) {
        // Delete from Storage
        const fileName = fileToDelete.data.split('/').pop();
        await supabase.storage.from(STORAGE_BUCKET).remove([`${auth.account.id}/${fileName}`]);
        // Delete from DB
        await supabase.from('files').delete().eq('id', id);
        setForks(prev => prev.filter(f => f.id !== id));
      }
    }
  };

  const deleteAllForks = async () => {
    if (window.confirm("Tüm dosyalar silinecek. Emin misiniz?")) {
      // Admin policy or loop through deletions
      for (const fork of forks) {
        await deleteFork(fork.id);
      }
    }
  };

  if (auth.type === 'NONE') {
    return <SecurityGate onUnlock={handleLogin} />;
  }

  if (auth.type === 'USER' && !auth.account.isActivated) {
    return <VerificationErrorView accountName={auth.account.fullName} onLogout={handleLogout} />;
  }

  const renderView = () => {
    if (auth.type === 'ADMIN') {
      switch (currentView) {
        case 'admin-accounts': 
          return <AdminAccountsView 
            accounts={allAccounts} 
            onDelete={async (id) => {
                await supabase.from('accounts').delete().eq('id', id);
                fetchData();
            }} 
            onToggleActivation={updateAccountActivation}
          />;
        case 'admin-create': 
          return <AdminCreateView 
            onAdd={async (acc) => {
              await supabase.from('accounts').insert({
                full_name: acc.fullName,
                email: acc.email,
                product_key: acc.productKey,
                is_activated: false
              });
              fetchData();
              setCurrentView('admin-accounts');
            }} 
          />;
        default: return <AdminAccountsView accounts={allAccounts} onDelete={() => {}} onToggleActivation={updateAccountActivation} />;
      }
    }

    switch (currentView) {
      case 'home': return <Home forks={forks} userName={auth.account.fullName} />;
      case 'product-key': return <ProductKeyView productKey={auth.account.productKey} />;
      case 'account': return <AccountView settings={settings} account={auth.account} onUpdateName={handleNameChange} />;
      case 'verify': return (
        <VerifyView 
          settings={settings} 
          onVerify={handleVerify} 
        />
      );
      case 'create-fork': return <CreateFork onUpload={addFork} userId={auth.account.id} />;
      case 'my-forks': return <MyForks forks={forks} onDelete={deleteFork} loading={loading} />;
      case 'settings': return (
        <SettingsView 
          settings={settings} 
          onUpdateSettings={async (s) => {
            await supabase.from('accounts').update({ ask_product_key: s.askProductKey }).eq('id', auth.account.id);
            setSettings(s);
          }} 
          onDeleteAll={deleteAllForks}
          onGoToAccount={() => setCurrentView('account')}
          productKey={auth.account.productKey}
        />
      );
      default: return <Home forks={forks} userName={auth.account.fullName} />;
    }
  };

  return (
    <div className={`flex h-screen text-slate-100 overflow-hidden relative ${auth.type === 'ADMIN' ? 'bg-slate-950' : 'bg-slate-900'}`}>
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg shadow-lg border border-slate-700 transition-all active:scale-95"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        currentView={currentView}
        isVerified={auth.type === 'USER' ? settings.isVerified : true}
        auth={auth}
        onNavigate={(view) => {
          if (view === 'logout') {
            handleLogout();
          } else {
            setCurrentView(view as ViewState);
            setIsSidebarOpen(false);
          }
        }} 
      />

      <main className="flex-1 overflow-auto pt-16 px-4 md:px-8 pb-8">
        <div className="max-w-5xl mx-auto h-full">
          {renderView()}
        </div>
      </main>

      <div className="fixed bottom-4 right-4 text-slate-500 text-[10px] font-mono uppercase tracking-widest pointer-events-none">
        {auth.type === 'ADMIN' ? 'FORKS ADMIN CONSOLE' : 'Forks v2.0 Cloud Sync'}
      </div>
    </div>
  );
};

export default App;
