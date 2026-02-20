
import React from 'react';

interface VerificationErrorViewProps {
  accountName: string;
  onLogout: () => void;
}

const VerificationErrorView: React.FC<VerificationErrorViewProps> = ({ accountName, onLogout }) => {
  return (
    <div className="fixed inset-0 bg-[#1e272e] flex h-screen w-screen overflow-hidden text-[#d2dae2] font-sans z-[9999]">
      <style>{`
        #sidebar-error {
            width: 250px;
            background-color: #0f1519;
            height: 100%;
            position: fixed;
            left: 0; 
            top: 0;
            z-index: 1000;
            padding-top: 60px;
            box-shadow: 2px 0 10px rgba(0,0,0,0.5);
        }
        #sidebar-error ul { list-style: none; }
        #sidebar-error ul li { 
            padding: 15px 20px; 
            border-bottom: 1px solid #2f3640; 
            color: #7f8c8d;
            cursor: default; 
        }
        #sidebar-error ul li.active-error {
            background-color: #2f3640;
            color: white;
            border-left: 4px solid #6c5ce7;
        }
        .top-bar-error {
            position: absolute; top: 0; left: 0; width: 100%; height: 60px;
            display: flex; align-items: center; padding: 0 20px;
            background-color: rgba(30, 39, 46, 0.95); z-index: 900; border-bottom: 1px solid #2f3640;
            padding-left: 270px;
        }
        .app-title-error { font-size: 24px; font-weight: bold; color: #6c5ce7; }
        #main-content-error {
            margin-left: 250px;
            width: calc(100% - 250px);
            height: 100%;
            padding-top: 60px; 
            padding-left: 60px;
            padding-right: 40px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            background-color: #0078D7; 
            color: white;
            animation: fadeInBSOD 0.8s ease-in-out;
        }
        @keyframes fadeInBSOD { from { opacity: 0; } to { opacity: 1; } }
        .bsod-container {
            width: 100%;
            max-width: 900px;
            text-align: left; 
        }
        .sad-face {
            font-size: 160px;
            font-weight: normal;
            display: block;
            margin-bottom: 20px;
            font-family: 'Segoe UI Light', 'Segoe UI', sans-serif;
            margin-left: -10px;
        }
        .error-title {
            font-size: 32px;
            font-weight: 300;
            margin-bottom: 30px;
            line-height: 1.3;
        }
        .error-desc {
            font-size: 18px;
            margin-bottom: 40px;
            opacity: 0.9;
            max-width: 800px;
            line-height: 1.6;
        }
        .stop-code {
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 14px;
            opacity: 0.7;
            margin-top: 20px;
        }
      `}</style>

      {/* Menü (Sabit Görünüm) */}
      <div id="sidebar-error">
          <ul>
              <li>Ana Sayfa</li>
              <li>Ürün Anahtarım</li>
              <li>Hesabım</li>
              <li className="active-error">Hesabımı Doğrula</li>
              <li>Bir FORK Oluştur</li>
              <li>FORK'larım</li>
              <li 
                onClick={onLogout} 
                style={{ color: '#ff7675', marginTop: '50px', cursor: 'pointer' }}
              >
                Log Out
              </li>
          </ul>
      </div>

      {/* Üst Bar */}
      <div className="top-bar-error">
          <div className="app-title-error">Forks</div>
      </div>

      {/* BSOD Alanı */}
      <div id="main-content-error">
          <div className="bsod-container">
              <span className="sad-face">:(</span>
              
              <div className="error-title">
                  Hesabınız doğrulanamadı. Gerekli ödeme planı aktif değil.
              </div>

              <div className="error-desc">
                  <strong>{accountName}</strong> adlı hesabınızı doğrulamak ve bu özelliği kullanabilmek için abonelik ücretinin ödenmiş olması gerekmektedir. Sistemimizde hesabınıza bağlı geçerli bir ödeme kaydı bulunamadı. <br/><br/>
                  Lütfen faturalandırma birimiyle iletişime geçin veya ödemenizi tamamlayıp tekrar deneyin.
              </div>

              <div className="stop-code">
                  DURDURMA KODU: PAYMENT_REQUIRED_MISSING_FUNDS <br/>
                  HATA KAYNAĞI: account_billing_service.sys
              </div>
          </div>
      </div>
    </div>
  );
};

export default VerificationErrorView;
