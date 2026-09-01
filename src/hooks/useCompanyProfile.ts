import { useState, useEffect } from 'react';
import { CompanyProfile } from '../types';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const defaultProfile: CompanyProfile = {
  name: 'Apotek Assyifa Farma Cideres',
  address: 'Jl. Raya Cideres-Kadipaten No. 45, Cideres, Majalengka',
  phone: '+6281234567890',
  email: 'admin@assyifafarma.com',
};

export function useCompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profileRef = doc(db, 'profiles', 'shared-profile');
    
    // Use onSnapshot for real-time updates
    const unsubscribeSnapshot = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data() as CompanyProfile);
      } else {
        // Document doesn't exist, use default and save it
        setDoc(profileRef, defaultProfile).catch(err => console.error("Error saving default profile:", err));
        setProfile(defaultProfile);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching profile:", error);
      setLoading(false);
    });
    
    return () => unsubscribeSnapshot();
  }, []);

  const updateProfile = async (newProfile: CompanyProfile) => {
    try {
      const profileRef = doc(db, 'profiles', 'shared-profile');
      await setDoc(profileRef, newProfile);
      // setProfile is handled by onSnapshot
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return { profile, updateProfile, loading };
}
