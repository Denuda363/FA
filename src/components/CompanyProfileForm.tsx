import React, { useState } from 'react';
import { CompanyProfile } from '../types';
import { Building2, MapPin, Phone, Mail, Save, CheckCircle2 } from 'lucide-react';

interface CompanyProfileFormProps {
  profile: CompanyProfile;
  onSave: (profile: CompanyProfile) => void;
}

export function CompanyProfileForm({ profile, onSave }: CompanyProfileFormProps) {
  const [formData, setFormData] = useState<CompanyProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">Profil Perusahaan</h2>
          <p className="text-sm text-slate-500 mt-1">Identitas ini akan digunakan sebagai Kop Surat pada laporan PDF dan Excel.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Building2 size={16} className="text-indigo-500" />
                Nama Perusahaan
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                placeholder="PT Nama Perusahaan"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <MapPin size={16} className="text-indigo-500" />
                Alamat Lengkap
              </label>
              <textarea
                required
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none resize-none"
                placeholder="Jl. Contoh Alamat No. 123..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Phone size={16} className="text-indigo-500" />
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  placeholder="021-xxxxxxx"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Mail size={16} className="text-indigo-500" />
                  Email Perusahaan
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  placeholder="email@perusahaan.com"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            {isSaved ? (
              <span className="flex items-center gap-2 text-emerald-600 font-medium text-sm animate-in fade-in">
                <CheckCircle2 size={18} />
                Profil berhasil disimpan!
              </span>
            ) : (
              <span className="text-sm text-slate-400">Pastikan data sudah benar.</span>
            )}
            
            <button
              type="submit"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm shadow-indigo-600/20 active:scale-[0.98]"
            >
              <Save size={18} />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
