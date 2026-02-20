
export interface ForkFile {
  id: string;
  name: string;
  size: number;
  type: string;
  data: string; // Base64 encoded content
  createdAt: number;
}

export interface VerificationData {
  phone: string;
  email: string;
  dob: string;
  fullName: string;
}

export interface AppSettings {
  askProductKey: boolean;
  isVerified: boolean;
  verificationData?: VerificationData;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  productKey: string;
  createdAt: number;
  isActivated: boolean;
}

export type AuthState = 
  | { type: 'NONE' }
  | { type: 'USER'; account: UserAccount }
  | { type: 'ADMIN' };

export type ViewState = 
  | 'home' 
  | 'product-key' 
  | 'account' 
  | 'verify' 
  | 'create-fork' 
  | 'my-forks' 
  | 'settings'
  | 'admin-accounts'
  | 'admin-create';
