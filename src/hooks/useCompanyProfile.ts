import { useState, useEffect } from 'react';
import { CompanyProfile } from '../types';

const STORAGE_KEY = 'profitflow_company_profile_v2';

const defaultProfile: CompanyProfile = {
  name: 'Apotek Assyifa Farma Cideres',
  address: 'Jl. Raya Cideres-Kadipaten No. 45, Cideres, Majalengka',
  phone: '+6281234567890',
  email: 'admin@assyifafarma.com',
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
