import React, { useState } from 'react';
import { Truck, ShieldCheck, Mail, Phone, MessageSquare, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface PolicyPageProps {
  type: 'delivery' | 'returns' | 'privacy' | 'terms' | 'faq' | 'contact';
  onBack: () => void;
}

export const PolicyPages: React.FC<PolicyPageProps> = ({ type, onBack }) => {
  const { settings } = useShop();

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Cash on Delivery (COD) work across Pakistan?',
      a: 'We offer nationwide Cash on Delivery to over 250 cities and towns. You do not need a credit card or bank account. When our official logistics partner (TCS, Leopards, or Trax) arrives at your doorstep, you simply hand the exact parcel amount in PKR to the courier driver.'
    },
    {
      q: 'What is the delivery timeline for major Pakistani cities?',
      a: 'Orders placed before 2:00 PM PST are packed and handed over to couriers the same day. Delivery to Lahore, Karachi, Islamabad, and Rawalpindi takes 2 to 3 business days. Other cities (Faisalabad, Multan, Peshawar, Quetta, Gujranwala, Sialkot, etc.) take 3 to 5 business days.'
    },
    {
      q: 'What makes Extrait de Parfum different from regular perfumes?',
      a: 'Extrait de Parfum is the highest possible concentration in fine perfumery (typically 30% to 40% pure fragrance oils, compared to 10-15% in standard Eau de Toilette). At Rohan Perfume, this ensures an enduring scent trail (sillage) that lasts 14+ hours even in warm or humid Pakistani weather.'
    },
    {
      q: 'Can I test or sample the perfume before opening the main box?',
      a: 'We strongly recommend ordering our Royal Heritage Discovery Coffret (5 x 10ml travel bottles) to experience the full collection. If you ordered a 100ml bottle and it is damaged during courier transit, we replace it free of charge within 7 days.'
    },
    {
      q: 'How should I store my luxury perfume in Pakistan?',
      a: 'Store your fragrance bottles in a cool, shaded environment away from direct sunlight and extreme bathroom heat. Storing in their velvet-lined presentation boxes preserves the natural Cambodian agarwood and floral essences for years.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs text-[#9d9990] hover:text-[#d4af37] uppercase tracking-wider transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Store</span>
      </button>

      {/* 1. SHIPPING & DELIVERY */}
      {type === 'delivery' && (
        <div className="bg-[#121217] border border-[#23232c] rounded-xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 text-[#d4af37]">
            <Truck className="w-8 h-8" />
            <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#fbfaf8]">
              Shipping & Cash on Delivery Policy
            </h1>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#b5b1a6] leading-relaxed">
            <h3 className="font-cinzel text-base font-semibold text-[#f4f2ee] pt-2">
              1. Nationwide Coverage
            </h3>
            <p>
              Rohan Perfume dispatches exclusively from our central atelier in Lahore to every corner
              of Pakistan, covering over 250+ cities, including Karachi, Lahore, Islamabad, Rawalpindi,
              Faisalabad, Multan, Peshawar, Quetta, Gujranwala, Sialkot, Hyderabad, Abbottabad, and
              beyond.
            </p>

            <h3 className="font-cinzel text-base font-semibold text-[#f4f2ee] pt-2">
              2. Free Delivery Criteria
            </h3>
            <p>
              All orders with a subtotal exceeding{' '}
              <strong className="text-[#d4af37]">
                Rs. {settings.freeShippingThreshold.toLocaleString()}
              </strong>{' '}
              automatically qualify for Free Express Delivery. For orders below this threshold, a
              nominal courier logistics fee of{' '}
              <strong className="text-[#f4f2ee]">
                Rs. {settings.defaultShippingFee}
              </strong>{' '}
              is applied at checkout.
            </p>

            <h3 className="font-cinzel text-base font-semibold text-[#f4f2ee] pt-2">
              3. Courier Logistics & Order Verification
            </h3>
            <p>
              Deliveries are conducted via registered courier partners: TCS Express, Leopards Courier,
              and Trax. For all first-time Cash on Delivery orders, our customer operations desk may
              reach out via SMS or phone call to confirm your delivery address before shipment.
            </p>
          </div>
        </div>
      )}

      {/* 2. RETURNS & REPLACEMENTS */}
      {type === 'returns' && (
        <div className="bg-[#121217] border border-[#23232c] rounded-xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 text-[#d4af37]">
            <ShieldCheck className="w-8 h-8" />
            <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#fbfaf8]">
              7-Day Replacement & Transit Guarantee
            </h1>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#b5b1a6] leading-relaxed">
            <p>
              At Rohan Perfume, every bottle of Extrait de Parfum is hand-inspected, wrapped in
              protective foam, and sealed in a velvet gift presentation box before dispatch.
            </p>

            <h3 className="font-cinzel text-base font-semibold text-[#f4f2ee] pt-2">
              Eligibility for Exchange:
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Item damaged, leaked, or shattered during courier transit.</li>
              <li>Defective atomizer / sprayer mechanism upon first use.</li>
              <li>Incorrect fragrance or size delivered compared to your invoice.</li>
            </ul>

            <h3 className="font-cinzel text-base font-semibold text-[#f4f2ee] pt-2">
              Claim Procedure:
            </h3>
            <p>
              Please notify our team on WhatsApp ({settings.whatsappNumber || '+92 300 1234567'}) within
              7 days of receiving your package. Share photos of the damaged bottle and package label.
              A fresh replacement bottle will be dispatched immediately.
            </p>
          </div>
        </div>
      )}

      {/* 3. PRIVACY POLICY */}
      {type === 'privacy' && (
        <div className="bg-[#121217] border border-[#23232c] rounded-xl p-6 sm:p-10 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#fbfaf8]">
            Customer Privacy & Security
          </h1>
          <div className="space-y-4 text-xs sm:text-sm text-[#b5b1a6] leading-relaxed">
            <p>
              We honor the trust you place in Rohan Perfume. We never sell, rent, or trade your
              personal contact information with unauthorized third parties.
            </p>
            <p>
              Information collected (Name, Pakistani Mobile Number, Address) is strictly utilized to
              coordinate courier shipping with TCS / Leopards and keep you updated on tracking status.
            </p>
          </div>
        </div>
      )}

      {/* 4. TERMS */}
      {type === 'terms' && (
        <div className="bg-[#121217] border border-[#23232c] rounded-xl p-6 sm:p-10 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#fbfaf8]">
            Terms of Purchase
          </h1>
          <div className="space-y-4 text-xs sm:text-sm text-[#b5b1a6] leading-relaxed">
            <p>
              By placing a Cash on Delivery order on Rohan Perfume, you agree to inspect and accept the
              shipment upon delivery and pay the exact invoice amount in PKR to the courier agent.
            </p>
            <p>
              All prices are inclusive of Pakistani commercial taxes and import duties for raw essences.
            </p>
          </div>
        </div>
      )}

      {/* 5. FAQ */}
      {type === 'faq' && (
        <div className="bg-[#121217] border border-[#23232c] rounded-xl p-6 sm:p-10 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#fbfaf8]">
            Frequently Asked Questions
          </h1>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="border border-[#23232c] rounded-lg overflow-hidden bg-[#16161d]"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-4 text-left text-xs sm:text-sm font-semibold text-[#f4f2ee] hover:text-[#d4af37]"
                >
                  <span>{f.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-[#d4af37]" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-[#a39f96] leading-relaxed border-t border-[#1f1f27]">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. CONTACT */}
      {type === 'contact' && (
        <div className="bg-[#121217] border border-[#23232c] rounded-xl p-6 sm:p-10 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#fbfaf8]">
            Contact Our Fragrance Concierge
          </h1>
          <p className="text-xs sm:text-sm text-[#a09c93]">
            Have an inquiry regarding scent recommendations, wedding gift sets, or COD orders?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="bg-[#171720] border border-[#252530] p-5 rounded-xl space-y-2 text-center">
              <Phone className="w-6 h-6 text-[#d4af37] mx-auto" />
              <h4 className="font-cinzel text-xs font-bold text-[#f4f2ee]">Phone Support</h4>
              <p className="text-xs text-[#a09c93]">{settings.phoneNumber || '+92 300 1234567'}</p>
              <span className="text-[10px] text-[#6d6a63] block">Mon–Sat, 10am–8pm PKT</span>
            </div>

            <div className="bg-[#171720] border border-[#252530] p-5 rounded-xl space-y-2 text-center">
              <Mail className="w-6 h-6 text-[#d4af37] mx-auto" />
              <h4 className="font-cinzel text-xs font-bold text-[#f4f2ee]">Email Concierge</h4>
              <p className="text-xs text-[#a09c93]">{settings.contactEmail || 'support@rohanperfume.com'}</p>
              <span className="text-[10px] text-[#6d6a63] block">Replies within 4 business hours</span>
            </div>

            <div className="bg-[#171720] border border-[#252530] p-5 rounded-xl space-y-2 text-center">
              <MessageSquare className="w-6 h-6 text-[#25D366] mx-auto" />
              <h4 className="font-cinzel text-xs font-bold text-[#f4f2ee]">WhatsApp Live</h4>
              <p className="text-xs text-[#a09c93]">{settings.whatsappNumber || '+92 300 1234567'}</p>
              <span className="text-[10px] text-[#6d6a63] block">Fastest for order status</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
