import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Calculator, FileSpreadsheet, Calendar, Edit, Save, X, Tag, Layers } from 'lucide-react';

function App() {
  const [view, setView] = useState('pos');
  const [cart, setCart] = useState(() => { const saved = localStorage.getItem('spicy_cart'); return saved ? JSON.parse(saved) : []; });
  const [orders, setOrders] = useState(() => { const saved = localStorage.getItem('spicy_orders'); return saved ? JSON.parse(saved) : []; });
  
  // 1. 初始化 menu 狀態與分類欄位
  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem('spicy_menu');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'item_c1_1', name: '招牌麻辣燙套餐', price: 100, category: '套餐' },
      { id: 'item_c1_2', name: 'A套餐', price: 115, category: '套餐' },
      { id: 'item_c1_3', name: 'B套餐', price: 130, category: '套餐' },
      { id: 'item_c1_4', name: 'c套餐', price: 135, category: '套餐' },
      { id: 'item_c1_5', name: 'D套餐', price: 140, category: '套餐' },
      { id: 'item_c1_6', name: '老饕套餐', price: 250, category: '套餐' },
      { id: 'item_c2_1', name: '牛肉片', price: 50, category: '吃不飽加點1' },
      { id: 'item_c2_2', name: '梅花豬肉', price: 45, category: '吃不飽加點1' },
      { id: 'item_c2_3', name: '麻辣鴨血', price: 40, category: '吃不飽加點1' },
      { id: 'item_c2_4', name: '麻辣豆腐', price: 40, category: '吃不飽加點1' },
      { id: 'item_c2_5', name: '魚餃', price: 25, category: '吃不飽加點1' },
      { id: 'item_c2_6', name: '燕餃', price: 25, category: '吃不飽加點1' },
      { id: 'item_c2_7', name: '蟹肉棒', price: 25, category: '吃不飽加點1' },
      { id: 'item_c2_8', name: '米血糕', price: 25, category: '吃不飽加點1' },
      { id: 'item_c2_9', name: '豆皮', price: 25, category: '吃不飽加點1' },
      { id: 'item_c2_10', name: '鑫鑫腸', price: 25, category: '吃不飽加點1' },
      { id: 'item_c2_11', name: '老油條', price: 35, category: '吃不飽加點1' },
      { id: 'item_c2_12', name: '黃金魚蛋', price: 25, category: '吃不飽加點1' },
      { id: 'item_c2_13', name: '科學麵', price: 20, category: '吃不飽加點1' },
      { id: 'item_c2_14', name: '王子麵', price: 20, category: '吃不飽加點1' },
      { id: 'item_c3_1', name: '金針菇', price: 25, category: '吃不飽加點2(蔬菜)' },
      { id: 'item_c3_2', name: '木耳', price: 20, category: '吃不飽加點2(蔬菜)' },
      { id: 'item_c3_3', name: '玉米筍', price: 25, category: '吃不飽加點2(蔬菜)' },
      { id: 'item_c3_4', name: '空心菜', price: 25, category: '吃不飽加點2(蔬菜)' },
      { id: 'item_c3_5', name: '大陸妹', price: 25, category: '吃不飽加點2(蔬菜)' },
      { id: 'item_c3_6', name: '水蓮', price: 25, category: '吃不飽加點2(蔬菜)' },
      { id: 'item_c3_7', name: '茼蒿(季節限定)', price: 25, category: '吃不飽加點2(蔬菜)' },
      { id: 'item_c4_1', name: '牛肉乾拌麵', price: 110, category: '吃麵麵' },
      { id: 'item_c4_2', name: '豬肉乾拌麵', price: 105, category: '吃麵麵' },
      { id: 'item_c4_3', name: '銷魂乾拌麵', price: 60, category: '吃麵麵' },
      { id: 'item_c4_4', name: '烏龍拌麵', price: 60, category: '吃麵麵' },
      { id: 'item_c5_1', name: '牛肚/牛筋/牛腱', price: 100, category: '秘制滷味' },
      { id: 'item_c5_2', name: '大腸', price: 60, category: '秘制滷味' },
      { id: 'item_c5_3', name: '豬耳朵', price: 40, category: '秘制滷味' },
      { id: 'item_c5_4', name: '無骨鳳爪', price: 40, category: '秘制滷味' }
    ];
  });

  const [promotions, setPromotions] = useState(() => { const saved = localStorage.getItem('spicy_promotions'); return saved ? JSON.parse(saved) : []; });
  
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [receivedCash, setReceivedCash] = useState('');
  const [selectedDate, setSelectedDate] = useState('ALL');

  const [selectedCategory, setSelectedCategory] = useState('全部');

  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(''); 
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [editMenuData, setEditMenuData] = useState({ name: '', price: '', category: '' });

  const [newPromoName, setNewPromoName] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState('');
  const [editingPromoId, setEditingPromoId] = useState(null);
  const [editPromoData, setEditPromoData] = useState({ name: '', discount: '' });
  
  const [activePromoId, setActivePromoId] = useState(''); 
  
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => { localStorage.setItem('spicy_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('spicy_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('spicy_menu', JSON.stringify(menu)); }, [menu]);
  useEffect(() => { localStorage.setItem('spicy_promotions', JSON.stringify(promotions)); }, [promotions]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) { return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i); }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const rawTotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const activePromo = promotions.find(p => p.id === activePromoId);
  const discountAmt = activePromo ? Number(activePromo.discount) : 0;
  const total = Math.max(0, rawTotal - discountAmt);
  const cashNum = Number(receivedCash) || 0;
  const change = cashNum - total;

  const handleCompleteCheckout = () => {
    if (cashNum < total) { alert('收到的金額不足！'); return; }
    const now = new Date();
    const newOrder = {
      id: 'A' + String(orders.length + 1).padStart(3, '0'),
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      items: [...cart],
      promo: activePromo ? activePromo.name : '無',
      discount: discountAmt,
      total: total,
      received: cashNum,
      change: change,
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setActivePromoId('');
    setShowCheckoutModal(false);
    setReceivedCash('');
    alert(`結帳成功！找零：$${change}`);
  };

  // --- 菜單管理 ---
  const addProduct = (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdCategory) {
      alert('請填寫完整商品資訊（包含分類）');
      return;
    }
    setMenu([...menu, { id: Date.now(), name: newProdName, price: Number(newProdPrice), category: newProdCategory }]);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdCategory('');
  };
  const startEditMenu = (item) => { 
    setEditingMenuId(item.id); 
    setEditMenuData({ name: item.name, price: item.price, category: item.category || '未分類' }); 
  };
  const saveMenuEdit = () => {
    setMenu(menu.map(m => m.id === editingMenuId ? { ...m, name: editMenuData.name, price: Number(editMenuData.price), category: editMenuData.category } : m));
    setEditingMenuId(null);
  };
  const deleteMenu = (id) => { if (window.confirm('確定刪除此品項？')) setMenu(menu.filter(m => m.id !== id)); };

  // --- 優惠管理 ---
  const addPromo = (e) => {
    e.preventDefault();
    if (!newPromoName || !newPromoDiscount) return;
    setPromotions([...promotions, { id: Date.now(), name: newPromoName, discount: Number(newPromoDiscount) }]);
    setNewPromoName('');
    setNewPromoDiscount('');
  };
  const startEditPromo = (promo) => { setEditingPromoId(promo.id); setEditPromoData({ name: promo.name, discount: promo.discount }); };
  const savePromoEdit = () => {
    setPromotions(promotions.map(p => p.id === editingPromoId ? { ...p, name: editPromoData.name, discount: Number(editPromoData.discount) } : p));
    setEditingPromoId(null);
  };
  const deletePromo = (id) => { if (window.confirm('確定刪除此優惠？')) setPromotions(promotions.filter(p => p.id !== id)); };

  // --- 訂單管理 ---
  const deleteOrder = (id) => { if (window.confirm('確定刪除此訂單？')) setOrders(orders.filter(o => o.id !== id)); };
  
  const startEditOrder = (order) => { 
    setEditingOrder(JSON.parse(JSON.stringify(order))); 
  };
  const handleOrderEditItemChange = (index, field, value) => {
    const updatedOrder = { ...editingOrder };
    updatedOrder.items[index][field] = value;
    setEditingOrder(updatedOrder);
  };
  const handleOrderRemoveItem = (index) => {
    const updatedOrder = { ...editingOrder };
    updatedOrder.items.splice(index, 1);
    setEditingOrder(updatedOrder);
  };
  const handleOrderAddItem = () => {
    setEditingOrder({ ...editingOrder, items: [...editingOrder.items, { id: Date.now(), name: '新項目', qty: 1, price: 0 }] });
  };
  const saveOrderEdit = () => {
    setOrders(orders.map(o => o.id === editingOrder.id ? editingOrder : o));
    setEditingOrder(null);
  };

  const exportToExcel = () => {
    const targetOrders = selectedDate === 'ALL' ? orders : orders.filter(o => o.date === selectedDate);
    if (targetOrders.length === 0) { alert('目前沒有可匯出的訂單資料！'); return; }
    let csvContent = "\ufeff訂單編號,日期,時間,優惠折扣,總金額,收到金額,找零,訂單品項細節\n";
    targetOrders.forEach(o => {
      const itemsStr = o.items.map(i => `${i.name}x${i.qty}`).join('; ');
      csvContent += `${o.id},${o.date},${o.time},${o.promo || '無'}(-$${o.discount || 0}),${o.total},${o.received},${o.change},"${itemsStr}"\n`;
    });
    const totalRevenue = targetOrders.reduce((sum, o) => sum + o.total, 0);
    csvContent += `\n,,,總計營業額,,,$${totalRevenue},\n`;
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `麻辣燙營業額報表_${selectedDate === 'ALL' ? '全部' : selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleKeyPad = (val) => {
    if (val === 'C') { setReceivedCash(''); }
    else if (val === 'DEL') { setReceivedCash(prev => prev.slice(0, -1)); }
    else { setReceivedCash(prev => prev + val); }
  };

  const uniqueDates = Array.from(new Set(orders.map(o => o.date)));
  const filteredOrders = selectedDate === 'ALL' ? orders : orders.filter(o => o.date === selectedDate);
  const filteredTotalRevenue = filteredOrders.reduce((sum, o) => sum + Number(o.total), 0);

  const categories = ['全部', ...Array.from(new Set(menu.map(item => item.category || '未分類')))];
  
  const displayedMenu = selectedCategory === '全部' 
    ? menu 
    : menu.filter(item => (item.category || '未分類') === selectedCategory);

  return (
    <div className="flex h-screen bg-[#D4B59D] text-black font-sans select-none">
      <div className="absolute top-2 left-4 z-10 flex gap-2">
        <button onClick={() => setView('pos')} className={`px-4 py-1.5 rounded text-sm font-bold text-white shadow ${view === 'pos' ? 'bg-[#5c3a1a]' : 'bg-[#8B5A2B]'}`}>點餐前台</button>
        <button onClick={() => setView('admin')} className={`px-4 py-1.5 rounded text-sm font-bold text-white shadow ${view === 'admin' ? 'bg-[#5c3a1a]' : 'bg-[#8B5A2B]'}`}>後台管理</button>
      </div>

      {view === 'pos' ? (
        <div className="flex w-full pt-12">
          <div className="flex-1 p-6 overflow-hidden flex flex-col">
            <h1 className="text-xl font-bold mb-4 text-black">🔥 麻辣燙點餐 POS</h1>
            
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-[#5c3a1a] text-white shadow-md' 
                      : 'bg-[#E6D2C3] text-[#5c3a1a] border border-[#B08D79] hover:bg-[#d8c0ad]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-4 gap-4 pb-10">
                {displayedMenu.map(item => (
                  <button key={item.id} onClick={() => addToCart(item)} className="bg-[#E6D2C3] border border-[#B08D79] p-5 rounded-xl shadow hover:bg-[#d8c0ad] flex flex-col justify-between h-28 font-bold text-lg active:scale-95 transition-transform">
                    <div className="flex flex-col text-left">
                      <span className="text-xs text-[#8B5A2B] mb-1">{item.category || '未分類'}</span>
                      <span className="text-black leading-tight">{item.name}</span>
                    </div>
                    <span className="text-right text-xl text-black w-full">${item.price}</span>
                  </button>
                ))}
                {displayedMenu.length === 0 && (
                  <div className="col-span-4 text-center py-10 text-gray-700 font-bold">
                    此分類目前沒有商品
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="w-[380px] bg-[#C5A087] border-l border-[#B08D79] p-5 flex flex-col justify-between shadow-lg">
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-black"><ShoppingCart size={20}/> 購物車</h2>
              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                {cart.length === 0 ? <div className="text-gray-700 text-center py-4 font-bold">購物車目前是空的</div> : cart.map(item => (
                  <div key={item.id} className="bg-[#E6D2C3] p-3 rounded-lg flex justify-between items-center shadow-sm border border-[#B08D79]">
                    <div>
                      <div className="font-bold text-black">{item.name}</div>
                      <div className="text-sm text-black">${item.price} x {item.qty}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.id, -1)} className="p-1 bg-[#8B5A2B] hover:bg-[#6e4621] text-white rounded"><Minus size={14}/></button>
                      <span className="text-black font-bold w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="p-1 bg-[#8B5A2B] hover:bg-[#6e4621] text-white rounded"><Plus size={14}/></button>
                      <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-red-700 hover:text-red-900 ml-1"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4">
              <div className="mb-4">
                <label className="text-sm font-bold text-black mb-1 flex items-center gap-1"><Tag size={14}/> 選擇優惠折扣</label>
                <select value={activePromoId} onChange={e => setActivePromoId(e.target.value)} className="w-full px-3 py-2 bg-[#E6D2C3] border border-[#B08D79] rounded font-bold text-black">
                  <option value="">不使用優惠</option>
                  {promotions.map(p => <option key={p.id} value={p.id}>{p.name} (折 ${p.discount})</option>)}
                </select>
              </div>

              <div className="bg-[#E6D2C3] p-3 rounded-lg border border-[#B08D79] mb-4">
                <div className="flex justify-between text-sm mb-1"><span className="text-black font-bold">小計:</span><span className="text-black font-bold">${rawTotal}</span></div>
                {discountAmt > 0 && <div className="flex justify-between text-sm text-red-700 mb-1 font-bold"><span>折扣:</span><span>-${discountAmt}</span></div>}
                <div className="border-t border-[#B08D79] pt-2 flex justify-between items-center text-xl font-bold mt-1">
                  <span className="text-black">應付總計:</span>
                  <span className="text-red-800 text-2xl">${total}</span>
                </div>
              </div>

              <button onClick={() => { if(cart.length === 0) return alert('購物車是空的'); setShowCheckoutModal(true); }} className="w-full py-4 bg-[#8B5A2B] hover:bg-[#6e4621] text-white font-extrabold text-xl rounded-xl shadow active:scale-95 transition-transform">
                確認結帳
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-8 pt-16 overflow-y-auto bg-[#D4B59D]">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-[#C5A087] p-4 rounded-xl border border-[#B08D79] shadow">
              <h1 className="text-2xl font-bold text-black flex items-center gap-2">⚙️ 後台管理與營業額統計</h1>
              <button onClick={exportToExcel} className="flex items-center gap-2 px-4 py-2 bg-[#8B5A2B] hover:bg-[#6e4621] text-white rounded-lg font-bold shadow">
                <FileSpreadsheet size={18}/> 匯出所選日期 Excel
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#C5A087] p-5 rounded-xl border border-[#B08D79] shadow">
                <h3 className="text-lg font-bold mb-4 text-black border-b border-[#B08D79] pb-2">🥘 菜單商品管理</h3>
                <form onSubmit={addProduct} className="flex gap-2 mb-4">
                  <input type="text" placeholder="分類 (如:主食)" value={newProdCategory} onChange={e => setNewProdCategory(e.target.value)} className="px-3 py-2 bg-[#E6D2C3] rounded border border-[#B08D79] w-28 text-black font-bold placeholder-gray-600" />
                  <input type="text" placeholder="品項名稱" value={newProdName} onChange={e => setNewProdName(e.target.value)} className="px-3 py-2 bg-[#E6D2C3] rounded border border-[#B08D79] flex-1 text-black font-bold placeholder-gray-600" />
                  <input type="number" placeholder="價格" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} className="px-3 py-2 bg-[#E6D2C3] rounded border border-[#B08D79] w-20 text-black font-bold placeholder-gray-600" />
                  <button type="submit" className="px-4 py-2 bg-[#8B5A2B] hover:bg-[#6e4621] text-white rounded font-bold shadow flex items-center gap-1"><Plus size={16}/> 新增</button>
                </form>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {menu.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-[#E6D2C3] p-2 rounded border border-[#B08D79]">
                      {editingMenuId === item.id ? (
                        <>
                          <input className="w-1/4 px-2 py-1 border rounded bg-white font-bold text-sm" placeholder="分類" value={editMenuData.category} onChange={e => setEditMenuData({...editMenuData, category: e.target.value})} />
                          <input className="w-1/3 px-2 py-1 border rounded bg-white font-bold" value={editMenuData.name} onChange={e => setEditMenuData({...editMenuData, name: e.target.value})} />
                          <input type="number" className="w-1/5 px-2 py-1 border rounded bg-white font-bold" value={editMenuData.price} onChange={e => setEditMenuData({...editMenuData, price: e.target.value})} />
                          <div className="flex gap-1">
                            <button onClick={saveMenuEdit} className="p-1 bg-green-700 text-white rounded"><Save size={16}/></button>
                            <button onClick={() => setEditingMenuId(null)} className="p-1 bg-gray-500 text-white rounded"><X size={16}/></button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="font-bold text-gray-700 text-sm w-16 truncate">{item.category || '未分類'}</span>
                          <span className="font-bold text-black pl-2 flex-1">{item.name}</span>
                          <span className="font-bold text-black w-16">${item.price}</span>
                          <div className="flex gap-1">
                            <button onClick={() => startEditMenu(item)} className="p-1 bg-[#8B5A2B] text-white rounded"><Edit size={16}/></button>
                            <button onClick={() => deleteMenu(item.id)} className="p-1 bg-red-700 text-white rounded"><Trash2 size={16}/></button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#C5A087] p-5 rounded-xl border border-[#B08D79] shadow">
                <h3 className="text-lg font-bold mb-4 text-black border-b border-[#B08D79] pb-2"><Tag size={20} className="inline mr-1"/> 優惠折扣管理</h3>
                <form onSubmit={addPromo} className="flex gap-2 mb-4">
                  <input type="text" placeholder="優惠名稱 (例: 滿百折十)" value={newPromoName} onChange={e => setNewPromoName(e.target.value)} className="px-3 py-2 bg-[#E6D2C3] rounded border border-[#B08D79] flex-1 text-black font-bold placeholder-gray-600" />
                  <input type="number" placeholder="折扣金額" value={newPromoDiscount} onChange={e => setNewPromoDiscount(e.target.value)} className="px-3 py-2 bg-[#E6D2C3] rounded border border-[#B08D79] w-28 text-black font-bold placeholder-gray-600" />
                  <button type="submit" className="px-4 py-2 bg-[#8B5A2B] hover:bg-[#6e4621] text-white rounded font-bold shadow flex items-center gap-1"><Plus size={16}/> 新增</button>
                </form>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {promotions.length === 0 && <div className="text-center text-sm font-bold mt-4 text-gray-700">目前無設定優惠</div>}
                  {promotions.map(promo => (
                    <div key={promo.id} className="flex items-center justify-between bg-[#E6D2C3] p-2 rounded border border-[#B08D79]">
                      {editingPromoId === promo.id ? (
                        <>
                          <input className="w-1/2 px-2 py-1 border rounded bg-white font-bold" value={editPromoData.name} onChange={e => setEditPromoData({...editPromoData, name: e.target.value})} />
                          <input type="number" className="w-1/4 px-2 py-1 border rounded bg-white font-bold" value={editPromoData.discount} onChange={e => setEditPromoData({...editPromoData, discount: e.target.value})} />
                          <div className="flex gap-1">
                            <button onClick={savePromoEdit} className="p-1 bg-green-700 text-white rounded"><Save size={16}/></button>
                            <button onClick={() => setEditingPromoId(null)} className="p-1 bg-gray-500 text-white rounded"><X size={16}/></button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="font-bold text-black pl-2 flex-1">{promo.name}</span>
                          <span className="font-bold text-red-800 w-24">折 ${promo.discount}</span>
                          <div className="flex gap-1">
                            <button onClick={() => startEditPromo(promo)} className="p-1 bg-[#8B5A2B] text-white rounded"><Edit size={16}/></button>
                            <button onClick={() => deletePromo(promo.id)} className="p-1 bg-red-700 text-white rounded"><Trash2 size={16}/></button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#C5A087] p-5 rounded-xl border border-[#B08D79] shadow space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Calendar size={20} className="text-black"/>
                  <span className="font-bold text-black">選擇日期查詢：</span>
                  <select value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="px-3 py-2 bg-[#E6D2C3] border border-[#B08D79] rounded font-bold text-black">
                    <option value="ALL">全部日期 (累計)</option>
                    {uniqueDates.map(dateStr => (<option key={dateStr} value={dateStr}>{dateStr}</option>))}
                  </select>
                </div>
                <div className="text-lg font-bold text-black bg-[#E6D2C3] px-4 py-1.5 rounded-lg border border-[#B08D79]">
                  所選日期總營業額：<span className="text-xl text-red-900">${filteredTotalRevenue}</span>
                </div>
              </div>
              <h3 className="font-bold text-black pt-2">歷史訂單紀錄 ({filteredOrders.length} 筆)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b-2 border-[#8B5A2B] text-black">
                      <th className="p-3">單號</th>
                      <th className="p-3">日期 / 時間</th>
                      <th className="p-3">品項細節</th>
                      <th className="p-3 text-center">優惠</th>
                      <th className="p-3 text-right">總額</th>
                      <th className="p-3 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr><td colSpan="6" className="p-6 text-center text-black font-bold">此日期沒有訂單紀錄</td></tr>
                    ) : (
                      filteredOrders.map(o => (
                        <tr key={o.id} className="border-b border-[#B08D79]/50 hover:bg-[#E6D2C3]/50">
                          <td className="p-3 text-black font-bold">{o.id}</td>
                          <td className="p-3 text-black">{o.date} {o.time}</td>
                          <td className="p-3 text-black text-sm max-w-xs">{o.items.map(i => `${i.name}x${i.qty}`).join(', ')}</td>
                          <td className="p-3 text-black text-center text-sm">{o.promo !== '無' && o.promo ? <span className="bg-red-800 text-white px-2 py-0.5 rounded-full text-xs">{o.promo}</span> : '-'}</td>
                          <td className="p-3 text-black font-bold text-right">${o.total}</td>
                          <td className="p-3 text-center">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => startEditOrder(o)} className="p-1.5 bg-[#8B5A2B] hover:bg-[#6e4621] text-white rounded"><Edit size={16}/></button>
                              <button onClick={() => deleteOrder(o.id)} className="p-1.5 bg-red-700 hover:bg-red-900 text-white rounded"><Trash2 size={16}/></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#C5A087] p-6 rounded-2xl w-[420px] border border-[#B08D79] shadow-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-black"><Calculator size={22}/> 收銀與找零計算機</h2>
            <div className="space-y-2 mb-4 bg-[#E6D2C3] p-4 rounded-xl border border-[#B08D79]">
              {discountAmt > 0 && <div className="flex justify-between text-sm text-red-800 font-bold mb-1"><span>已套用優惠: {activePromo?.name}</span><span>- ${discountAmt}</span></div>}
              <div className="flex justify-between text-lg"><span className="text-black font-bold">應付金額：</span><span className="font-bold text-red-800 text-xl">${total}</span></div>
              <div className="flex justify-between items-center text-lg border-t border-[#B08D79] pt-2 mt-2">
                <span className="text-black font-bold">收到現金：</span>
                <input type="number" value={receivedCash} onChange={e => setReceivedCash(e.target.value)} className="w-36 bg-white text-right px-3 py-1 rounded text-black text-xl font-bold border border-gray-400 focus:outline-none" placeholder="0" />
              </div>
              <div className="flex justify-between text-xl border-t border-[#B08D79] pt-2 mt-2">
                <span className="text-black font-bold">找零：</span>
                <span className="text-black font-bold">${change >= 0 ? change : 0}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', 'DEL', 'C'].map(btn => (
                <button key={btn} onClick={() => handleKeyPad(btn)} className="py-3 bg-[#8B5A2B] hover:bg-[#6e4621] text-white rounded-lg font-bold text-lg shadow active:scale-95 transition-transform">
                  {btn === 'DEL' ? '←' : btn === 'C' ? '清除' : btn}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[100, 500, 1000, 2000].map(amt => (<button key={amt} onClick={() => setReceivedCash(amt.toString())} className="py-2 bg-[#A0714F] hover:bg-[#8B5A2B] text-white rounded font-bold shadow active:scale-95 transition-transform">${amt}</button>))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCheckoutModal(false)} className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold shadow">取消</button>
              <button onClick={handleCompleteCheckout} className="flex-1 py-3 bg-[#8B5A2B] hover:bg-[#6e4621] text-white rounded-xl font-bold shadow">確認完成結帳</button>
            </div>
          </div>
        </div>
      )}

      {editingOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#C5A087] p-6 rounded-2xl w-[500px] border border-[#B08D79] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black flex items-center gap-2"><Edit size={22}/> 編輯訂單 ({editingOrder.id})</h2>
              <button onClick={() => setEditingOrder(null)} className="text-black hover:text-red-800"><X size={24}/></button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#E6D2C3] p-4 rounded-xl border border-[#B08D79]">
                <h3 className="font-bold text-black border-b border-[#B08D79] pb-1 mb-3">金額調整</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">總額</label>
                    <input type="number" value={editingOrder.total} onChange={e => setEditingOrder({...editingOrder, total: Number(e.target.value)})} className="w-full px-3 py-1.5 rounded border border-[#B08D79] font-bold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">收到金額</label>
                    <input type="number" value={editingOrder.received} onChange={e => setEditingOrder({...editingOrder, received: Number(e.target.value)})} className="w-full px-3 py-1.5 rounded border border-[#B08D79] font-bold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">找零</label>
                    <input type="number" value={editingOrder.change} onChange={e => setEditingOrder({...editingOrder, change: Number(e.target.value)})} className="w-full px-3 py-1.5 rounded border border-[#B08D79] font-bold" />
                  </div>
                </div>
              </div>

              <div className="bg-[#E6D2C3] p-4 rounded-xl border border-[#B08D79]">
                <div className="flex justify-between items-center border-b border-[#B08D79] pb-1 mb-3">
                  <h3 className="font-bold text-black">品項調整</h3>
                  <button onClick={handleOrderAddItem} className="text-xs bg-[#8B5A2B] text-white px-2 py-1 rounded flex items-center gap-1"><Plus size={12}/> 新增一列</button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {editingOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input type="text" value={item.name} onChange={e => handleOrderEditItemChange(idx, 'name', e.target.value)} className="flex-1 px-2 py-1 border rounded text-sm font-bold" placeholder="品名" />
                      <span className="text-black font-bold">x</span>
                      <input type="number" value={item.qty} onChange={e => handleOrderEditItemChange(idx, 'qty', Number(e.target.value))} className="w-16 px-2 py-1 border rounded text-sm font-bold text-center" placeholder="數量" />
                      <button onClick={() => handleOrderRemoveItem(idx)} className="p-1.5 bg-red-700 text-white rounded"><Trash2 size={14}/></button>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={saveOrderEdit} className="w-full py-3 bg-[#8B5A2B] hover:bg-[#6e4621] text-white rounded-xl font-bold shadow text-lg flex justify-center items-center gap-2">
                <Save size={20}/> 儲存變更
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;