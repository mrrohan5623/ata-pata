import React, { useState } from 'react';
import { Save, CheckCircle2, RefreshCw, AlertTriangle, Phone, Mail, MessageSquare } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { SettingsService, resetAllData } from '../../services/storageService';

export const AdminSettingsTab: React.FC = () => {
  const { settings, refreshSettings, refreshProducts } = useShop();

  const [storeName, setStoreName] = useState(settings.storeName);
  const [phoneNumber, setPhoneNumber] = useState(settings.phoneNumber);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.freeShippingThreshold);
  const [defaultShippingFee, setDefaultShippingFee] = useState(settings.defaultShippingFee);
  const [announcementText, setAnnouncementText] = useState(settings.announcementText);
  const [instagram, setInstagram] = useState(settings.socialLinks?.instagram || '');
  const [facebook, setFacebook] = useState(settings.socialLinks?.facebook || '');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    SettingsService.update({
      storeName,
      phoneNumber,
      whatsappNumber,
      contactEmail,
      freeShippingThreshold: Number(freeShippingThreshold),
      defaultShippingFee: Number(defaultShippingFee),
      announcementText,
      socialLinks: {
        instagram,
        facebook
      }
    });

    refreshSettings();
    setFeedback('Store settings updated successfully.');
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all data back to the default Pakistani perfume catalog, sample orders, and reviews? This will reset custom edits.'
      )
    ) {
      resetAllData();
      refreshSettings();
      refreshProducts();
      setFeedback('Store database re-seeded with fresh catalog and sample COD orders.');
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="bg-[#131319] p-6 rounded-xl border border-[#23232c]">
        <h3 className="font-cinzel text-lg font-bold text-[#fbfaf8] mb-1">
          Store Configuration & Pakistani COD Logistics
        </h3>
        <p className="text-xs text-[#8e8a82]">
          Manage your WhatsApp hotline, free courier shipping thresholds, and announcement banner.
        </p>

        {feedback && (
          <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedback}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="mt-6 space-y-6 text-xs">
          {/* Brand Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#cfccc4] mb-1 font-semibold">Store / Brand Name</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-[#181822] border border-[#2b2b36] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
              />
            </div>

            <div>
              <label className="block text-[#cfccc4] mb-1 font-semibold">Concierge Email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-[#181822] border border-[#2b2b36] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
              />
            </div>
          </div>

          {/* Phone & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#cfccc4] mb-1 font-semibold">
                Customer Support Phone Number
              </label>
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-[#181822] border border-[#2b2b36] rounded px-3 py-2 text-[#f4f2ee] font-mono focus:border-[#d4af37] outline-none"
              />
            </div>

            <div>
              <label className="block text-[#cfccc4] mb-1 font-semibold">
                Live WhatsApp Concierge Number (Include Country Code)
              </label>
              <input
                type="text"
                required
                placeholder="+923001234567"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full bg-[#181822] border border-[#2b2b36] rounded px-3 py-2 text-[#f4f2ee] font-mono focus:border-[#d4af37] outline-none"
              />
              <span className="text-[10px] text-[#716e67] mt-0.5 block">
                Customers will be routed here when clicking the floating WhatsApp button.
              </span>
            </div>
          </div>

          {/* Shipping fees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#202028]">
            <div>
              <label className="block text-[#cfccc4] mb-1 font-semibold">
                Free Delivery Order Threshold (PKR)
              </label>
              <input
                type="number"
                required
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full bg-[#181822] border border-[#2b2b36] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
              />
              <span className="text-[10px] text-[#716e67] mt-0.5 block">
                Orders above this amount get Free Delivery across Pakistan.
              </span>
            </div>

            <div>
              <label className="block text-[#cfccc4] mb-1 font-semibold">
                Standard Courier Delivery Fee (PKR)
              </label>
              <input
                type="number"
                required
                value={defaultShippingFee}
                onChange={(e) => setDefaultShippingFee(Number(e.target.value))}
                className="w-full bg-[#181822] border border-[#2b2b36] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
              />
              <span className="text-[10px] text-[#716e67] mt-0.5 block">
                Applied to orders below the free delivery threshold.
              </span>
            </div>
          </div>

          {/* Announcement Bar */}
          <div className="pt-2 border-t border-[#202028]">
            <label className="block text-[#cfccc4] mb-1 font-semibold">
              Top Announcement Ribbon Text
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full bg-[#181822] border border-[#2b2b36] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
            />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#202028]">
            <div>
              <label className="block text-[#cfccc4] mb-1 font-semibold">Instagram URL</label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full bg-[#181822] border border-[#2b2b36] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
              />
            </div>

            <div>
              <label className="block text-[#cfccc4] mb-1 font-semibold">Facebook URL</label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full bg-[#181822] border border-[#2b2b36] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-[#d4af37] hover:bg-[#be9c2f] text-[#0c0c0e] font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-lg shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* Database Reset Option */}
      <div className="bg-[#131319] p-6 rounded-xl border border-red-950/40 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Atelier Data Maintenance</span>
        </div>
        <p className="text-xs text-[#8c887f]">
          Need to test with a clean slate? Resetting will re-populate all original royal perfumes, sample Pakistani COD orders, reviews, and coupons into localStorage.
        </p>
        <button
          onClick={handleResetData}
          className="bg-[#1e1919] hover:bg-red-950 text-red-300 border border-red-800/40 text-xs font-semibold px-4 py-2 rounded flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset to Default Pakistani Catalog</span>
        </button>
      </div>
    </div>
  );
};
