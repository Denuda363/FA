import { useState, useEffect } from 'react';
import { CompanyProfile } from '../types';

const STORAGE_KEY = 'profitflow_company_profile';

const defaultProfile: CompanyProfile = {
  name: 'PT ProfitFlow Nusantara',
  address: 'Jl. Sudirman Kav. 12, Jakarta Selatan, 12190',
  phone: '021-88997766',
  email: 'finance@profitflow.co.id',
};

export function useCompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfile>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  return {
    profile,
    updateProfile: (newProfile: CompanyProfile) => setProfile(newProfile),
  };
}
