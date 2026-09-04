import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Save
} from 'lucide-react';
import { Product, FragranceType, FragranceGender } from '../../types';
import { ProductService } from '../../services/storageService';
import { useShop } from '../../context/ShopContext';

export const AdminProductsTab: React.FC = () => {
  const { products, refreshProducts } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState("Men's Collection");
  const [collection, setCollection] = useState("Men's Collection");
  const [fragranceType, setFragranceType] = useState<FragranceType>('Extrait de Parfum');
  const [gender, setGender] = useState<FragranceGender>('Men');
  const [size, setSize] = useState('100ml');
  const [price, setPrice] = useState<number>(7500);
  const [salePrice, setSalePrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(20);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [topNotes, setTopNotes] = useState('');
  const [middleNotes, setMiddleNotes] = useState('');
  const [baseNotes, setBaseNotes] = useState('');
  const [imagesText, setImagesText] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [published, setPublished] = useState(true);

  const openCreateModal = () => {
    setIsCreating(true);
    setEditingProduct(null);
    setName('');
    setSku(`RP-EXT-${Math.floor(100 + Math.random() * 900)}`);
    setCategory("Men's Collection");
    setCollection("Men's Collection");
    setFragranceType('Extrait de Parfum');
    setGender('Men');
    setSize('100ml');
    setPrice(7500);
    setSalePrice(undefined);
    setStock(20);
    setLowStockThreshold(5);
    setTopNotes('Bergamot, Cardamom');
    setMiddleNotes('Taif Rose, Kashmiri Saffron');
    setBaseNotes('Cambodian Oud, Amber, Sandalwood');
    setImagesText('https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80');
    setShortDesc('');
    setDescription('');
    setFeatured(false);
    setBestSeller(false);
    setNewArrival(true);
    setPublished(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setIsCreating(false);
    setName(p.name);
    setSku(p.sku);
    setCategory(p.category);
    setCollection(p.collection);
    setFragranceType(p.fragranceType);
    setGender(p.gender);
    setSize(p.size);
    setPrice(p.price);
    setSalePrice(p.salePrice);
    setStock(p.stock);
    setLowStockThreshold(p.lowStockThreshold);
    setTopNotes(p.fragranceNotes.top.join(', '));
    setMiddleNotes(p.fragranceNotes.middle.join(', '));
    setBaseNotes(p.fragranceNotes.base.join(', '));
    setImagesText(p.images.join('\n'));
    setShortDesc(p.shortDescription || '');
    setDescription(p.description);
    setFeatured(p.featured);
    setBestSeller(p.bestSeller);
    setNewArrival(p.newArrival);
    setPublished(p.published);
  };

  const closeModal = () => {
    setIsCreating(false);
    setEditingProduct(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const images = imagesText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const productPayload = {
      name: name.trim(),
      sku: sku.trim(),
      category,
      collection,
      fragranceType,
      gender,
      size,
      availableSizes: [size],
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      stock: Number(stock),
      lowStockThreshold: Number(lowStockThreshold),
      fragranceNotes: {
        top: topNotes.split(',').map((s) => s.trim()).filter(Boolean),
        middle: middleNotes.split(',').map((s) => s.trim()).filter(Boolean),
        base: baseNotes.split(',').map((s) => s.trim()).filter(Boolean)
      },
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80'],
      shortDescription: shortDesc.trim(),
      description: description.trim(),
      featured,
      bestSeller,
      newArrival,
      published
    };

    if (isCreating) {
      ProductService.create(productPayload);
      setFeedback(`"${name}" created successfully.`);
    } else if (editingProduct) {
      ProductService.update(editingProduct.id, productPayload);
      setFeedback(`"${name}" updated successfully.`);
    }

    refreshProducts();
    closeModal();
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDelete = (id: string, pName: string) => {
    if (window.confirm(`Are you sure you want to permanently remove "${pName}"?`)) {
      ProductService.delete(id);
      refreshProducts();
      setFeedback(`"${pName}" removed.`);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const filtered = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-[#131319] p-4 rounded-xl border border-[#23232c]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#75726a] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search perfumes by name, SKU, collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181822] border border-[#2a2a34] rounded-lg pl-9 pr-3 py-2 text-xs text-[#f4f2ee] focus:border-[#d4af37] outline-none"
          />
        </div>

        <button
          onClick={openCreateModal}
          className="bg-[#d4af37] hover:bg-[#be9c2f] text-[#0c0c0e] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Fragrance</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-[#131319] border border-[#23232c] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#cfccc4]">
            <thead className="bg-[#171720] border-b border-[#24242e] text-[#8e8a81] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Fragrance</th>
                <th className="py-3 px-4">SKU / Family</th>
                <th className="py-3 px-4">Price (PKR)</th>
                <th className="py-3 px-4">Inventory</th>
                <th className="py-3 px-4">Tags</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e26]">
              {filtered.map((p) => {
                const isOut = p.stock <= 0;
                const isLow = p.stock > 0 && p.stock <= p.lowStockThreshold;

                return (
                  <tr key={p.id} className="hover:bg-[#16161f] transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-12 object-cover rounded bg-[#181820]"
                      />
                      <div>
                        <strong className="text-[#f4f2ee] block">{p.name}</strong>
                        <span className="text-[11px] text-[#7d7971]">
                          {p.fragranceType} ({p.size})
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px]">
                      <div>{p.sku}</div>
                      <span className="text-[#7d7971]">{p.gender}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-[#d4af37]">
                        Rs. {(p.salePrice || p.price).toLocaleString()}
                      </span>
                      {p.salePrice && (
                        <span className="text-[10px] text-[#716e67] line-through block">
                          Rs. {p.price.toLocaleString()}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {isOut ? (
                        <span className="text-red-400 font-semibold">Out of Stock (0)</span>
                      ) : isLow ? (
                        <span className="text-amber-400 font-semibold">
                          Low Stock ({p.stock})
                        </span>
                      ) : (
                        <span className="text-emerald-400">{p.stock} bottles</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.featured && (
                          <span className="text-[9px] bg-[#d4af37]/15 text-[#d4af37] px-1.5 py-0.5 rounded border border-[#d4af37]/30">
                            Featured
                          </span>
                        )}
                        {p.bestSeller && (
                          <span className="text-[9px] bg-purple-950/40 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">
                            Best Seller
                          </span>
                        )}
                        {p.newArrival && (
                          <span className="text-[9px] bg-blue-950/40 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">
                            New
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {p.published ? (
                        <span className="text-[11px] text-emerald-400 font-medium">Published</span>
                      ) : (
                        <span className="text-[11px] text-[#716e67]">Draft / Hidden</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-[#9d9990] hover:text-[#d4af37] transition-colors rounded"
                        title="Edit Perfume"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 text-[#9d9990] hover:text-red-400 transition-colors rounded"
                        title="Delete Perfume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {(isCreating || editingProduct) && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />

          <div className="relative w-full max-w-2xl bg-[#121217] border border-[#2a2a36] rounded-xl shadow-2xl p-6 overflow-hidden z-10 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#212128] pb-4">
              <h3 className="font-cinzel text-lg font-bold text-[#fbfaf8]">
                {isCreating ? 'Add New Royal Fragrance' : `Edit "${editingProduct?.name}"`}
              </h3>
              <button onClick={closeModal} className="p-1 text-[#8c887f] hover:text-[#f4f2ee]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Name & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#cfccc4] mb-1 font-semibold">Fragrance Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#181822] border border-[#292936] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cfccc4] mb-1 font-semibold">SKU Identifier *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-[#181822] border border-[#292936] rounded px-3 py-2 text-[#f4f2ee] font-mono focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>

              {/* Category, Concentration & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#cfccc4] mb-1 font-semibold">Collection</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setCollection(e.target.value);
                    }}
                    className="w-full bg-[#181822] border border-[#292936] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                  >
                    <option value="Men's Collection">Men's Collection</option>
                    <option value="Women's Collection">Women's Collection</option>
                    <option value="Unisex Collection">Unisex Collection</option>
                    <option value="Premium Royale">Premium Royale</option>
                    <option value="Gift Sets">Gift Sets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#cfccc4] mb-1 font-semibold">Concentration</label>
                  <select
                    value={fragranceType}
                    onChange={(e) => setFragranceType(e.target.value as FragranceType)}
                    className="w-full bg-[#181822] border border-[#292936] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                  >
                    <option value="Extrait de Parfum">Extrait de Parfum</option>
                    <option value="Eau de Parfum">Eau de Parfum</option>
                    <option value="Attar Oil">Attar Oil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#cfccc4] mb-1 font-semibold">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as FragranceGender)}
                    className="w-full bg-[#181822] border border-[#292936] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              {/* Pricing in PKR & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[#cfccc4] mb-1 font-semibold">Regular Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#181822] border border-[#292936] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#cfccc4] mb-1 font-semibold">Sale Price (PKR)</label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={salePrice || ''}
                    onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-[#181822] border border-[#292936] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#cfccc4] mb-1 font-semibold">Units In Stock *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-[#181822] border border-[#292936] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#cfccc4] mb-1 font-semibold">Low Alert At</label>
                  <input
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                    className="w-full bg-[#181822] border border-[#292936] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>

              {/* Fragrance Pyramid Notes */}
              <div className="space-y-2 pt-2 border-t border-[#202028]">
                <h4 className="font-semibold text-[#f4f2ee] uppercase tracking-wider">
                  Olfactory Pyramid Notes (Comma Separated)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#9d9990] mb-1">Top Notes</label>
                    <input
                      type="text"
                      placeholder="Bergamot, Cardamom"
                      value={topNotes}
                      onChange={(e) => setTopNotes(e.target.value)}
                      className="w-full bg-[#181822] border border-[#292936] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9d9990] mb-1">Heart / Middle Notes</label>
                    <input
                      type="text"
                      placeholder="Taif Rose, Saffron"
                      value={middleNotes}
                      onChange={(e) => setMiddleNotes(e.target.value)}
                      className="w-full bg-[#181822] border border-[#292936] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9d9990] mb-1">Base Notes</label>
                    <input
                      type="text"
                      placeholder="Cambodian Oud, Amber"
                      value={baseNotes}
                      onChange={(e) => setBaseNotes(e.target.value)}
                      className="w-full bg-[#181822] border border-[#292936] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-[#cfccc4] mb-1 font-semibold">
                  Image URLs (One per line)
                </label>
                <textarea
                  rows={2}
                  value={imagesText}
                  onChange={(e) => setImagesText(e.target.value)}
                  className="w-full bg-[#181822] border border-[#292936] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none font-mono"
                />
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-[#cfccc4] mb-1 font-semibold">Short Subtitle</label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full bg-[#181822] border border-[#292936] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#cfccc4] mb-1 font-semibold">Full Scent Narrative</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#181822] border border-[#292936] rounded px-3 py-2 text-[#f4f2ee] focus:border-[#d4af37] outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-[#202028]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="accent-[#d4af37]"
                  />
                  <span>Featured Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bestSeller}
                    onChange={(e) => setBestSeller(e.target.checked)}
                    className="accent-[#d4af37]"
                  />
                  <span>Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newArrival}
                    onChange={(e) => setNewArrival(e.target.checked)}
                    className="accent-[#d4af37]"
                  />
                  <span>New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="accent-[#d4af37]"
                  />
                  <span>Published to Store</span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs rounded bg-[#1f1f28] text-[#8e8a81] hover:text-[#f4f2ee]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#d4af37] hover:bg-[#be9c2f] text-[#0c0c0e] font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded shadow"
                >
                  {isCreating ? 'Create Perfume' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
