import React, { useState, useEffect } from 'react';
import { 
  Store, Settings, Clock, Calculator, Trash2, Edit, Plus, FileText, 
  TrendingUp, DollarSign, Percent, PieChart, Package, Calendar, 
  ChevronRight, LogOut, Eye, EyeOff, X, ArrowUp, ArrowDown, CheckCircle, AlertTriangle, Cloud, Download
} from 'lucide-react';

// ==============================
// 1. 預設資料與共用常數
// ==============================
const DEFAULT_CATEGORIES = [
  { id: 'c1', name: '套餐', color: '#E6D2BE', items: [{ id: 'item_c1_1', name: '招牌麻辣燙套餐', price: 100 }, { id: 'item_c1_2', name: 'A套餐', price: 115 }, { id: 'item_c1_3', name: 'B套餐', price: 130 }, { id: 'item_c1_4', name: 'c套餐', price: 135 }, { id: 'item_c1_5', name: 'D套餐', price: 140 }, { id: 'item_c1_6', name: '老饕套餐', price: 250 }] },
  { id: 'c2', name: '吃不飽加點1', color: '#E6D2BE', items: [{ id: 'item_c2_1', name: '牛肉片', price: 50 }, { id: 'item_c2_2', name: '梅花豬肉', price: 45 }, { id: 'item_c2_3', name: '麻辣鴨血', price: 40 }, { id: 'item_c2_4', name: '麻辣豆腐', price: 40 }, { id: 'item_c2_5', name: '魚餃', price: 25 }, { id: 'item_c2_6', name: '燕餃', price: 25 }, { id: 'item_c2_7', name: '蟹肉棒', price: 25 }, { id: 'item_c2_8', name: '米血糕', price: 25 }, { id: 'item_c2_9', name: '豆皮', price: 25 }, { id: 'item_c2_10', name: '鑫鑫腸', price: 25 }, { id: 'item_c2_11', name: '老油條', price: 35 }, { id: 'item_c2_12', name: '黃金魚蛋', price: 25 }, { id: 'item_c2_13', name: '科學麵', price: 20 }, { id: 'item_c2_14', name: '王子麵', price: 20 }] },
  { id: 'c3', name: '吃不飽加點2(蔬菜)', color: '#E6D2BE', items: [{ id: 'item_c3_1', name: '金針菇', price: 25 }, { id: 'item_c3_2', name: '木耳', price: 20 }, { id: 'item_c3_3', name: '玉米筍', price: 25 }, { id: 'item_c3_4', name: '空心菜', price: 25 }, { id: 'item_c3_5', name: '大陸妹', price: 25 }, { id: 'item_c3_6', name: '水蓮', price: 25 }, { id: 'item_c3_7', name: '茼蒿(季節限定)', price: 25 }] },
  { id: 'c4', name: '吃麵麵', color: '#E6D2BE', items: [{ id: 'item_c4_1', name: '牛肉乾拌麵', price: 110 }, { id: 'item_c4_2', name: '豬肉乾拌麵', price: 105 }, { id: 'item_c4_3', name: '銷魂乾拌麵', price: 60 }, { id: 'item_c4_4', name: '烏龍拌麵', price: 60 }] },
  { id: 'c5', name: '秘制滷味', color: '#E6D2BE', items: [{ id: 'item_c5_1', name: '牛肚/牛筋/牛腱', price: 100 }, { id: 'item_c5_2', name: '大腸', price: 60 }, { id: 'item_c5_3', name: '豬耳朵', price: 40 }, { id: 'item_c5_4', name: '無骨鳳爪', price: 40 }] }
];

const COLORS = {
  bg: '#F6F0E8',
  toolbar: '#6B4F3A',
  btnCheckout: '#8B1E1E',
  selected: '#C97A3D',
  text: '#3D332C'
};

const CHINESE_NUMBERS = ['第一名', '第二名', '第三名', '第四名', '第五名', '第六名', '第七名', '第八名'];

// 讀取 localStorage 輔助函式
const getStorageData = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

// ==============================
// 2. 主應用程式組件 (含 localStorage 資料持久化)
// ==============================
export default function SpicyHotPotSystem() {
  const [activePage, setActivePage] = useState('POS');
  const [currentTime, setCurrentTime] = useState(new Date());

  // 本地儲存綁定：新增的品項、菜單、訂單皆不會隨重新整理消失
  const [categories, setCategories] = useState(() => getStorageData('spicy_categories', DEFAULT_CATEGORIES));
  const [orders, setOrders] = useState(() => getStorageData('spicy_orders', []));
  const [promotions, setPromotions] = useState(() => getStorageData('spicy_promotions', [
    { id: 'p1', name: '滿百折十', type: 'amount', value: 10 },
    { id: 'p2', name: '九折優惠', type: 'percent', value: 10 }
  ]));
  const [employees, setEmployees] = useState(() => getStorageData('spicy_employees', [{ id: 'e1', username: 'emp1', password: '111', name: '王小明' }]));
  const [clockIns, setClockIns] = useState(() => getStorageData('spicy_clockIns', [])); 
  const [ingredients, setIngredients] = useState(() => getStorageData('spicy_ingredients', [
    { id: 'ing1', name: '高麗菜', supplier: '蔬菜大盤商', unit: 'kg', price: 40, category: '蔬菜類', stock: 15, safeStock: 5 },
    { id: 'ing2', name: '牛五花', supplier: '肉品專賣', unit: 'kg', price: 250, category: '肉品類', stock: 3, safeStock: 5 }
  ]));
  const [expenses, setExpenses] = useState(() => getStorageData('spicy_expenses', [])); 
  const [closingRecords, setClosingRecords] = useState(() => getStorageData('spicy_closingRecords', [])); 
  const [heldOrders, setHeldOrders] = useState(() => getStorageData('spicy_heldOrders', [])); 
  const [adminPassword, setAdminPassword] = useState(() => getStorageData('spicy_adminPassword', '1234')); 

  // 當資料更動時同步至 LocalStorage
  useEffect(() => { localStorage.setItem('spicy_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('spicy_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('spicy_promotions', JSON.stringify(promotions)); }, [promotions]);
  useEffect(() => { localStorage.setItem('spicy_employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('spicy_clockIns', JSON.stringify(clockIns)); }, [clockIns]);
  useEffect(() => { localStorage.setItem('spicy_ingredients', JSON.stringify(ingredients)); }, [ingredients]);
  useEffect(() => { localStorage.setItem('spicy_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('spicy_closingRecords', JSON.stringify(closingRecords)); }, [closingRecords]);
  useEffect(() => { localStorage.setItem('spicy_heldOrders', JSON.stringify(heldOrders)); }, [heldOrders]);
  useEffect(() => { localStorage.setItem('spicy_adminPassword', JSON.stringify(adminPassword)); }, [adminPassword]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const lowStockItems = ingredients.filter(i => i.stock <= i.safeStock);

  return (
    <div className="min-h-screen font-sans flex flex-col" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
      {/* 頂部工具列 */}
      <div className="flex justify-between items-center p-4 text-white shadow-md" style={{ backgroundColor: COLORS.toolbar }}>
        <div className="flex items-center gap-4 text-xl font-bold">
          <Store size={28} />
          麻辣燙點餐 POS 系統
          <span className="flex items-center gap-1 text-xs bg-emerald-700 text-white px-2.5 py-1 rounded-full shadow-sm">
            <Cloud size={14} /> 資料自動儲存中
          </span>
          {lowStockItems.length > 0 && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full animate-pulse flex items-center gap-1">
              <AlertTriangle size={14}/> {lowStockItems.length} 項食材庫存不足！
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActivePage('POS')} className={`px-4 py-2 rounded ${activePage === 'POS' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>點餐前台</button>
          <button onClick={() => setActivePage('ADMIN')} className={`px-4 py-2 rounded ${activePage === 'ADMIN' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>後台管理</button>
          <button onClick={() => setActivePage('CLOCK_IN')} className={`px-4 py-2 rounded ${activePage === 'CLOCK_IN' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>員工打卡</button>
        </div>
      </div>

      {/* 頁面內容 */}
      <div className="flex-1 overflow-hidden">
        {activePage === 'POS' && (
          <POSView 
            categories={categories} 
            promotions={promotions} 
            onCheckout={(order) => {
              setOrders(prev => [...prev, order]);
              setIngredients(prev => prev.map(ing => ({ ...ing, stock: Math.max(0, ing.stock - 1) })));
            }} 
            currentTime={currentTime}
            heldOrders={heldOrders}
            setHeldOrders={setHeldOrders}
          />
        )}
        {activePage === 'ADMIN' && (
          <AdminView 
            orders={orders} setOrders={setOrders} 
            categories={categories} setCategories={setCategories} 
            promotions={promotions} setPromotions={setPromotions} 
            employees={employees} setEmployees={setEmployees} clockIns={clockIns} 
            ingredients={ingredients} setIngredients={setIngredients}
            expenses={expenses} setExpenses={setExpenses}
            closingRecords={closingRecords} setClosingRecords={setClosingRecords}
            adminPassword={adminPassword} setAdminPassword={setAdminPassword}
          />
        )}
        {activePage === 'CLOCK_IN' && (
          <EmployeeClockInView 
            employees={employees} setEmployees={setEmployees} 
            clockIns={clockIns} setClockIns={setClockIns} 
            currentTime={currentTime} 
          />
        )}
      </div>
    </div>
  );
}

// ==============================
// 3. 點餐前台 (POS)
// ==============================
function POSView({ categories, promotions, onCheckout, currentTime, heldOrders, setHeldOrders }) {
  const [cart, setCart] = useState([]);
  const [source, setSource] = useState('現場');
  const [subSource, setSubSource] = useState('');
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '');
  const [selectedPromo, setSelectedPromo] = useState('');
  const [orderNote, setOrderNote] = useState('');
  
  const [spiceModal, setSpiceModal] = useState(null); 
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [successModal, setSuccessModal] = useState(null);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories]);

  const formatTime = (date) => `${date.getFullYear()}/${String(date.getMonth()+1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

  const addToCart = (item, options = {}) => {
    const isMilky = options.milky === '+$15麻奶';
    const finalPrice = item.price + (isMilky ? 15 : 0);

    const newItem = {
      cartId: `${Date.now()}-${Math.random()}`,
      index: String(cart.length + 1).padStart(3, '0'),
      ...item,
      price: finalPrice,
      basePrice: item.price,
      ...options,
      qty: 1
    };
    setCart(prev => [...prev, newItem]);
  };

  const handleItemClick = (item, categoryName) => {
    if (categoryName === '套餐' || categoryName.includes('麻辣')) {
      setSpiceModal({
        ...item,
        tempSpice: '不辣',
        tempNumb: '不麻',
        tempMilky: '' // 預設不勾選加麻奶
      });
    } else {
      addToCart(item);
    }
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const promo = promotions.find(p => p.id === selectedPromo);
    let discount = 0;
    if (promo) {
      if (promo.type === 'amount') discount = promo.value;
      else if (promo.type === 'percent') discount = Math.round(subtotal * (promo.value / 100));
    }
    const total = Math.max(0, subtotal - discount);
    return { subtotal, discount, total, count: cart.reduce((s, i) => s + i.qty, 0) };
  };

  const totals = calculateTotals();
  const currentCatObj = categories.find(c => c.id === activeCategory) || categories[0];

  return (
    <div className="flex h-full p-4 gap-4">
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* 分頁 Tab */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className="px-6 py-3 rounded-lg shadow-sm font-bold whitespace-nowrap transition-all border-2"
              style={{ 
                backgroundColor: activeCategory === cat.id ? COLORS.selected : (cat.color || '#E6D2BE'), 
                color: activeCategory === cat.id ? '#fff' : COLORS.text,
                borderColor: activeCategory === cat.id ? '#8B1E1E' : 'transparent'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 菜單品項 */}
        <div className="flex-1 overflow-y-auto grid grid-cols-3 md:grid-cols-4 gap-4 content-start">
          {currentCatObj?.items?.map(item => (
            <button key={item.id} onClick={() => handleItemClick(item, currentCatObj.name)}
              className="p-4 rounded-xl shadow bg-white flex flex-col items-center justify-center gap-2 hover:bg-opacity-95 transition-all border-2 border-transparent active:border-[#C97A3D]"
            >
              <span className="font-bold text-lg text-center leading-tight">{item.name}</span>
              <span className="text-[#8B1E1E] font-semibold">${item.price}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-[400px] bg-white rounded-xl shadow-lg flex flex-col border border-gray-200">
        <div className="p-4 border-b bg-gray-50 rounded-t-xl">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-gray-500 text-sm">{formatTime(currentTime)}</span>
            <span className="bg-gray-200 text-sm px-2 py-1 rounded-full text-gray-700">共 {cart.length} 項 {totals.count} 件</span>
          </div>

          <div className="flex gap-2 mb-2 text-sm">
            {['現場', '外送', '電話/Line'].map(s => (
              <button key={s} onClick={() => { setSource(s); setSubSource(''); }}
                className={`flex-1 py-1.5 rounded border ${source === s ? 'bg-[#6B4F3A] text-white border-[#6B4F3A]' : 'bg-white text-gray-600'}`}>{s}</button>
            ))}
          </div>
          {source === '外送' && (
            <div className="flex gap-2 text-sm mb-2">
              <button onClick={() => setSubSource('Uber Eats')} className={`flex-1 py-1 rounded ${subSource === 'Uber Eats' ? 'bg-[#4CAF50] text-white' : 'bg-gray-100'}`}>Uber Eats</button>
              <button onClick={() => setSubSource('foodpanda')} className={`flex-1 py-1 rounded ${subSource === 'foodpanda' ? 'bg-[#E91E63] text-white' : 'bg-gray-100'}`}>foodpanda</button>
            </div>
          )}
          {source === '電話/Line' && (
            <div className="flex gap-2 text-sm mb-2">
              <button onClick={() => setSubSource('電話')} className={`flex-1 py-1 rounded ${subSource === '電話' ? 'bg-[#6B4F3A] text-white' : 'bg-gray-100'}`}>電話</button>
              <button onClick={() => setSubSource('官方Line')} className={`flex-1 py-1 rounded ${subSource === '官方Line' ? 'bg-[#00B900] text-white' : 'bg-gray-100'}`}>官方Line</button>
            </div>
          )}

          <div className="flex gap-2 mb-2">
            <input 
              type="text" 
              placeholder="輸入訂單備註..." 
              value={orderNote} 
              onChange={e => setOrderNote(e.target.value)} 
              className="flex-1 border p-1.5 rounded text-sm bg-white"
            />
            <button 
              onClick={() => {
                if(cart.length === 0) return alert('購物車是空的');
                setHeldOrders([...heldOrders, { id: Date.now(), cart, source, subSource, orderNote, totals }]);
                setCart([]);
                setOrderNote('');
                alert('已保留待結帳訂單');
              }}
              className="bg-orange-600 text-white px-3 py-1.5 rounded text-sm font-bold shadow"
            >保留待結帳</button>
            <button 
              onClick={() => { if(confirm('確定要取消整筆訂單嗎？')) { setCart([]); setOrderNote(''); }}}
              className="bg-red-500 text-white px-3 py-1.5 rounded text-sm font-bold shadow"
            >整筆取消</button>
          </div>

          {heldOrders.length > 0 && (
            <div className="flex gap-1 overflow-x-auto py-1">
              <span className="text-xs text-gray-500 font-bold self-center">待結帳({heldOrders.length}):</span>
              {heldOrders.map((ho, idx) => (
                <button key={ho.id} onClick={() => {
                  setCart(ho.cart);
                  setSource(ho.source);
                  setSubSource(ho.subSource);
                  setOrderNote(ho.orderNote || '');
                  setHeldOrders(heldOrders.filter(h => h.id !== ho.id));
                }} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded border border-amber-300 whitespace-nowrap">
                  #{idx+1} (${ho.totals.total})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 購物車內容 */}
        <div className="flex-1 overflow-y-auto p-2">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">尚未點餐</div>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className="flex flex-col p-2 border-b last:border-0 hover:bg-orange-50 rounded">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className="text-xs text-gray-400 mr-2">{item.index}</span>
                    <span className="font-bold">{item.name}</span>
                    {item.spiciness && (
                      <div className="text-xs text-red-600 mt-0.5 font-medium flex items-center gap-1">
                        <span>{item.spiciness} / {item.numbness}</span>
                        {item.milky === '+$15麻奶' && (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded text-[11px] font-bold">
                            +$15麻奶
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="font-semibold">${item.price * item.qty}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <button onClick={() => setCart(cart.filter(c => c.cartId !== item.cartId))} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                  <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                    <button onClick={() => setCart(cart.map(c => c.cartId === item.cartId ? { ...c, qty: Math.max(1, c.qty - 1) } : c))} className="w-6 h-6 bg-white rounded shadow-sm">-</button>
                    <span className="font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => setCart(cart.map(c => c.cartId === item.cartId ? { ...c, qty: c.qty + 1 } : c))} className="w-6 h-6 bg-white rounded shadow-sm">+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 rounded-b-xl flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">優惠折抵</span>
            <select value={selectedPromo} onChange={(e) => setSelectedPromo(e.target.value)} className="border rounded p-1 text-sm bg-white">
              <option value="">無</option>
              {promotions.map(p => <option key={p.id} value={p.id}>{p.name} ({p.type === 'amount' ? `-$${p.value}` : `-${p.value}%`})</option>)}
            </select>
          </div>
          <div className="flex justify-between items-center text-xl font-bold text-[#8B1E1E]">
            <span>總計</span>
            <span>${totals.total}</span>
          </div>
          <button 
            disabled={cart.length === 0}
            onClick={() => setCheckoutModal(true)}
            className="w-full py-4 text-white font-bold text-xl rounded-xl shadow-md transition-transform active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: COLORS.btnCheckout }}
          >
            前往收銀結帳
          </button>
        </div>
      </div>

      {/* 口味彈窗 Modal（已移除不加麻奶，只留加麻奶+$15） */}
      {spiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4 border-b pb-2 text-[#3D332C]">選擇口味 - {spiceModal.name}</h3>
            
            {/* 辣度選擇 */}
            <div className="mb-4">
              <p className="font-semibold mb-2 text-sm text-gray-700">辣度選擇</p>
              <div className="grid grid-cols-3 gap-2">
                {['不辣', '微辣', '小辣', '中辣', '大辣'].map(lvl => (
                  <button key={lvl} onClick={() => setSpiceModal({...spiceModal, tempSpice: lvl})}
                    className={`py-2 rounded border font-medium text-sm ${spiceModal.tempSpice === lvl ? 'bg-red-600 text-white border-red-600' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* 麻度選擇 */}
            <div className="mb-4">
              <p className="font-semibold mb-2 text-sm text-gray-700">麻度選擇</p>
              <div className="flex gap-2">
                {['不麻', '小麻', '正常麻'].map(lvl => (
                  <button key={lvl} onClick={() => setSpiceModal({...spiceModal, tempNumb: lvl})}
                    className={`flex-1 py-2 rounded border font-medium text-sm ${spiceModal.tempNumb === lvl ? 'bg-orange-600 text-white border-orange-600' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* 僅保留「+$15麻奶」獨立按鈕 */}
            <div className="mb-6">
              <p className="font-semibold mb-2 text-sm text-gray-700">湯底加價</p>
              <button 
                onClick={() => setSpiceModal({
                  ...spiceModal, 
                  tempMilky: spiceModal.tempMilky === '+$15麻奶' ? '' : '+$15麻奶'
                })}
                className={`w-full py-3 rounded-lg border font-bold text-base transition-all ${
                  spiceModal.tempMilky === '+$15麻奶' 
                    ? 'bg-amber-600 text-white border-amber-600 shadow' 
                    : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                }`}
              >
                🥛 +$15麻奶 {spiceModal.tempMilky === '+$15麻奶' && '✓'}
              </button>
            </div>

            {/* 操作按鈕 */}
            <div className="flex gap-2">
              <button onClick={() => setSpiceModal(null)} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded font-bold">取消</button>
              <button 
                onClick={() => {
                  addToCart(spiceModal, { 
                    spiciness: spiceModal.tempSpice || '不辣', 
                    numbness: spiceModal.tempNumb || '不麻',
                    milky: spiceModal.tempMilky || ''
                  });
                  setSpiceModal(null);
                }}
                className="flex-1 py-3 bg-[#C97A3D] text-white rounded font-bold hover:brightness-95"
              >確認加入</button>
            </div>
          </div>
        </div>
      )}

      {checkoutModal && (
        <CheckoutCalculator 
          total={totals.total} 
          onClose={() => setCheckoutModal(false)}
          onComplete={(paymentMethod, inputAmount, change) => {
            onCheckout({
              id: `ORD${Date.now()}`,
              date: new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }),
              time: new Date().toLocaleTimeString('zh-TW', { hour12: false }),
              items: [...cart],
              source,
              subSource,
              paymentMethod,
              total: totals.total,
              discount: totals.discount,
              orderNote
            });
            setSuccessModal({ total: totals.total, paymentMethod, inputAmount, change });
            setCart([]);
            setCheckoutModal(false);
            setSource('現場'); setSubSource(''); setSelectedPromo(''); setOrderNote('');
          }}
        />
      )}

      {successModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center border-t-8 border-green-500">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-[#3D332C]">結帳完成！</h3>
            <div className="bg-gray-50 p-4 rounded-xl text-left space-y-2 mb-6 text-sm">
              <div className="flex justify-between"><span>本次結帳金額：</span><span className="font-bold text-[#8B1E1E]">${successModal.total}</span></div>
              <div className="flex justify-between"><span>付款方式：</span><span className="font-bold">{successModal.paymentMethod}</span></div>
              {successModal.paymentMethod === '現金' && (
                <>
                  <div className="flex justify-between"><span>實際收取：</span><span className="font-bold">${successModal.inputAmount}</span></div>
                  <div className="flex justify-between"><span>找零金額：</span><span className="font-bold text-green-600">${successModal.change}</span></div>
                </>
              )}
            </div>
            <button onClick={() => setSuccessModal(null)} className="w-full bg-[#6B4F3A] text-white py-3 rounded-xl font-bold shadow">確認</button>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckoutCalculator({ total, onClose, onComplete }) {
  const [amount, setAmount] = useState('');
  
  const handleNum = (n) => {
    if (amount === '0' && n !== '.') setAmount(n);
    else setAmount(amount + n);
  };
  
  const handleDel = () => setAmount(amount.slice(0, -1));
  const handleClear = () => setAmount('');

  const inputAmount = parseInt(amount) || 0;
  const change = inputAmount - total;
  const btnClass = "bg-white border rounded-xl shadow-sm text-2xl font-bold flex items-center justify-center active:bg-gray-100 hover:bg-gray-50";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#F6F0E8] p-6 rounded-2xl w-[480px] shadow-2xl flex flex-col gap-4 border-4 border-[#6B4F3A]">
        <div className="flex justify-between items-center border-b border-[#6B4F3A]/20 pb-2">
          <h2 className="text-2xl font-bold text-[#3D332C]">收銀結帳</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={28} /></button>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-inner border text-[#3D332C]">
          <div className="flex justify-between text-lg mb-1"><span>應收總計：</span><span className="font-bold text-[#8B1E1E]">${total}</span></div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-lg">實收金額：</span>
            <input type="text" readOnly value={`$${amount}`} className="text-right text-3xl font-bold bg-transparent outline-none w-1/2 text-[#3D332C]" placeholder="$0" />
          </div>
          <div className="flex justify-between text-lg pt-2 border-t mt-2">
            <span>找零：</span>
            <span className={`font-bold ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>{change >= 0 ? `$${change}` : '$0'}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {[500, 1000, 1500, 2000].map(val => (
            <button key={val} onClick={() => setAmount(String(val))} className="flex-1 py-2 bg-[#E6D2BE] rounded text-[#3D332C] font-bold shadow-sm hover:brightness-95 border border-[#6B4F3A]/30">${val}</button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-3 h-64">
          <div className="col-span-3 grid grid-cols-3 gap-3">
            {[7, 8, 9, 4, 5, 6, 1, 2, 3].map(n => (
              <button key={n} onClick={() => handleNum(String(n))} className={btnClass}>{n}</button>
            ))}
            <button onClick={() => handleNum('0')} className={btnClass}>0</button>
            <button onClick={() => handleNum('00')} className={btnClass}>00</button>
            <button onClick={() => handleNum('.')} className={btnClass}>.</button>
          </div>
          <div className="col-span-1 flex flex-col gap-3">
            <button onClick={handleDel} className={`${btnClass} text-[#8B1E1E] flex-1 text-xl`}>←</button>
            <button onClick={handleClear} className={`${btnClass} text-[#8B1E1E] flex-1`}>C</button>
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <button 
            disabled={inputAmount < total}
            onClick={() => onComplete('現金', inputAmount, change >= 0 ? change : 0)} 
            className="flex-1 bg-[#4CAF50] text-white py-4 rounded-xl text-xl font-bold shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <DollarSign /> 現金結帳
          </button>
          <button 
            onClick={() => onComplete('Line Pay', total, 0)} 
            className="flex-1 bg-[#00C300] text-white py-4 rounded-xl text-xl font-bold shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            Line Pay
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================
// 4. 後台管理中心 (Admin) - 含新增品項與分類功能
// ==============================
function AdminView({ 
  orders, setOrders, 
  categories, setCategories, 
  promotions, setPromotions, 
  employees, setEmployees, clockIns, 
  ingredients, setIngredients,
  expenses, setExpenses,
  closingRecords, setClosingRecords,
  adminPassword, setAdminPassword 
}) {
  const [isLogged, setIsLogged] = useState(false);
  const [pwd, setPwd] = useState('');
  const [activeTab, setActiveTab] = useState('DASHBOARD'); 

  if (!isLogged) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-80 text-center border-t-4 border-[#6B4F3A]">
          <h2 className="text-2xl font-bold mb-6 text-[#3D332C]">後台管理登入</h2>
          <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="請輸入老闆密碼" className="w-full border p-3 rounded mb-4 text-center tracking-widest text-lg" />
          <button onClick={() => { 
            if(pwd === adminPassword || pwd === '8888') {
              setIsLogged(true); 
            } else {
              alert('密碼錯誤 (可輸入 8888 緊急登入)');
            }
          }} className="w-full bg-[#6B4F3A] text-white py-3 rounded font-bold">登入</button>
          <p className="text-xs text-gray-400 mt-4">預設密碼: 1234 (緊急備用: 8888)</p>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'DASHBOARD', icon: <TrendingUp size={20}/>, label: '營運儀表板' },
    { id: 'REPORTS', icon: <PieChart size={20}/>, label: '多維度報表' },
    { id: 'MENU', icon: <FileText size={20}/>, label: '菜單管理' },
    { id: 'PROMO', icon: <Percent size={20}/>, label: '優惠設定' },
    { id: 'INVENTORY', icon: <Package size={20}/>, label: '進貨與庫存' },
    { id: 'EXPENSES', icon: <DollarSign size={20}/>, label: '記帳管理' },
    { id: 'CLOSING', icon: <Store size={20}/>, label: '每日關帳作業' },
    { id: 'HISTORY', icon: <Clock size={20}/>, label: '歷史訂單' },
    { id: 'EMPLOYEES', icon: <Calendar size={20}/>, label: '員工與打卡管理' },
    { id: 'SETTINGS', icon: <Settings size={20}/>, label: '系統設定' },
  ];

  return (
    <div className="flex h-full">
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 bg-[#F6F0E8] border-b font-bold text-[#6B4F3A] flex items-center justify-between">
          <span>老闆後台中心</span>
          <button onClick={() => setIsLogged(false)}><LogOut size={18}/></button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${activeTab === tab.id ? 'bg-[#E6D2BE] text-[#3D332C] font-bold border-r-4 border-[#8B1E1E]' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {activeTab === 'DASHBOARD' && <AdminDashboard orders={orders} />}
        {activeTab === 'REPORTS' && <AdminReports orders={orders} />}
        {activeTab === 'MENU' && <AdminMenuManager categories={categories} setCategories={setCategories} />}
        {activeTab === 'PROMO' && <AdminPromoManager promotions={promotions} setPromotions={setPromotions} />}
        {activeTab === 'INVENTORY' && <AdminInventoryManager ingredients={ingredients} setIngredients={setIngredients} />}
        {activeTab === 'EXPENSES' && <AdminExpenseManager expenses={expenses} setExpenses={setExpenses} />}
        {activeTab === 'CLOSING' && <AdminClosingManager orders={orders} expenses={expenses} closingRecords={closingRecords} setClosingRecords={setClosingRecords} />}
        {activeTab === 'HISTORY' && <AdminHistory orders={orders} setOrders={setOrders} />}
        {activeTab === 'EMPLOYEES' && <AdminEmployeeManager employees={employees} setEmployees={setEmployees} clockIns={clockIns} />}
        {activeTab === 'SETTINGS' && <AdminSettingsManager adminPassword={adminPassword} setAdminPassword={setAdminPassword} />}
      </div>
    </div>
  );
}

function AdminDashboard({ orders }) {
  const totalRev = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const aov = totalOrders ? Math.round(totalRev / totalOrders) : 0;

  const itemCounts = {};
  orders.forEach(o => {
    o.items.forEach(i => {
      itemCounts[i.name] = (itemCounts[i.name] || 0) + i.qty;
    });
  });
  const topItems = Object.entries(itemCounts).sort((a,b) => b[1] - a[1]).slice(0, 8);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C] border-l-4 border-[#8B1E1E] pl-3">今日營運概況</h2>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border-t-4 border-green-500">
          <p className="text-gray-500 text-sm font-bold">總營業額</p>
          <p className="text-3xl font-bold mt-2 text-[#3D332C]">${totalRev.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border-t-4 border-blue-500">
          <p className="text-gray-500 text-sm font-bold">總訂單數</p>
          <p className="text-3xl font-bold mt-2 text-[#3D332C]">{totalOrders} 筆</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border-t-4 border-orange-500">
          <p className="text-gray-500 text-sm font-bold">平均客單價</p>
          <p className="text-3xl font-bold mt-2 text-[#3D332C]">${aov.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold text-lg mb-4 text-[#3D332C] flex items-center gap-2"><TrendingUp size={20}/> 熱銷商品排行榜</h3>
        <div className="grid grid-cols-2 gap-4">
          {topItems.length === 0 ? <p className="text-gray-400">尚無銷售資料</p> : 
            topItems.map(([name, qty], idx) => (
              <div key={name} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${idx < 3 ? 'bg-[#8B1E1E] text-white' : 'bg-gray-300 text-gray-700'}`}>
                    {CHINESE_NUMBERS[idx] || `第${idx+1}名`}
                  </span>
                  <span className="font-semibold text-[#3D332C]">{name}</span>
                </div>
                <span className="font-bold text-gray-600">{qty} 份</span>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminReports({ orders }) {
  const exportDailyReportCSV = () => {
    const today = new Date().toLocaleDateString('zh-TW');
    let csv = `\uFEFF=== ${today} 當日營運報表 ===\n`;
    csv += `訂單編號,時間,管道,付款方式,折抵,金額\n`;
    orders.forEach(o => {
      csv += `${o.id},${o.time},${o.source}${o.subSource ? `(${o.subSource})` : ''},${o.paymentMethod},${o.discount},${o.total}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `營運報表_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-l-4 border-[#8B1E1E] pl-3">
        <h2 className="text-2xl font-bold text-[#3D332C]">多維度營業報表</h2>
        <button onClick={exportDailyReportCSV} className="bg-[#6B4F3A] text-white px-4 py-2 rounded shadow flex items-center gap-2 hover:bg-[#583f2e]">
          <Download size={18} /> 匯出 CSV 報表
        </button>
      </div>
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold text-lg mb-4">交易記錄與分析</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-100 text-gray-600">
              <th className="p-3">單號</th>
              <th className="p-3">時間</th>
              <th className="p-3">來源</th>
              <th className="p-3">付款方式</th>
              <th className="p-3">金額</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center text-gray-400">尚無報表數據</td></tr>
            ) : (
              orders.map(o => (
                <tr key={o.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-bold">{o.id}</td>
                  <td className="p-3 text-sm">{o.time}</td>
                  <td className="p-3">{o.source} {o.subSource && `(${o.subSource})`}</td>
                  <td className="p-3">{o.paymentMethod}</td>
                  <td className="p-3 font-bold text-[#8B1E1E]">${o.total}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 可在後台新增品項與分類（新增的內容會自動寫入系統持久保存）
function AdminMenuManager({ categories, setCategories }) {
  const [newCatName, setNewCatName] = useState('');
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || '');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  const addCategory = () => {
    if (!newCatName.trim()) return alert('請輸入分類名稱');
    const newCat = {
      id: `c_${Date.now()}`,
      name: newCatName.trim(),
      color: '#E6D2BE',
      items: []
    };
    setCategories([...categories, newCat]);
    setNewCatName('');
    alert('分類新增成功！');
  };

  const addItem = () => {
    if (!selectedCatId) return alert('請選擇分類');
    if (!newItemName.trim() || !newItemPrice) return alert('請輸入完整品項名稱與價格');

    setCategories(categories.map(cat => {
      if (cat.id === selectedCatId) {
        return {
          ...cat,
          items: [...cat.items, { id: `i_${Date.now()}`, name: newItemName.trim(), price: Number(newItemPrice) }]
        };
      }
      return cat;
    }));
    setNewItemName('');
    setNewItemPrice('');
    alert('品項新增成功！已持久保存於瀏覽器。');
  };

  const deleteItem = (catId, itemId) => {
    if (!confirm('確定要刪除此品項嗎？')) return;
    setCategories(categories.map(cat => {
      if (cat.id === catId) {
        return { ...cat, items: cat.items.filter(i => i.id !== itemId) };
      }
      return cat;
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold border-l-4 border-[#8B1E1E] pl-3 text-[#3D332C]">菜單與品項管理</h2>
      
      {/* 新增分類與品項卡片 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow space-y-4 border">
          <h3 className="font-bold text-lg border-b pb-2 text-[#6B4F3A]">新增菜單分類</h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="例如: 獨家特調湯底" 
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              className="flex-1 border p-2 rounded"
            />
            <button onClick={addCategory} className="bg-[#6B4F3A] text-white px-4 py-2 rounded font-bold flex items-center gap-1">
              <Plus size={18}/> 新增分類
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow space-y-4 border">
          <h3 className="font-bold text-lg border-b pb-2 text-[#6B4F3A]">新增品項至分類</h3>
          <div className="space-y-2">
            <select 
              value={selectedCatId} 
              onChange={e => setSelectedCatId(e.target.value)}
              className="w-full border p-2 rounded bg-white"
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="品項名稱" 
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                className="flex-1 border p-2 rounded"
              />
              <input 
                type="number" 
                placeholder="單價" 
                value={newItemPrice}
                onChange={e => setNewItemPrice(e.target.value)}
                className="w-28 border p-2 rounded"
              />
            </div>
            <button onClick={addItem} className="w-full bg-[#8B1E1E] text-white py-2 rounded font-bold flex items-center justify-center gap-1">
              <Plus size={18}/> 新增單品
            </button>
          </div>
        </div>
      </div>

      {/* 菜單總覽 */}
      <div className="bg-white p-6 rounded-xl shadow border space-y-6">
        <h3 className="font-bold text-lg text-[#3D332C]">目前菜單清單</h3>
        {categories.map(cat => (
          <div key={cat.id} className="border rounded-lg p-4 bg-gray-50 space-y-3">
            <div className="font-bold text-lg text-[#6B4F3A] flex justify-between items-center border-b pb-2">
              <span>{cat.name} ({cat.items.length} 個品項)</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {cat.items.map(item => (
                <div key={item.id} className="bg-white p-3 rounded border flex justify-between items-center shadow-sm">
                  <div>
                    <div className="font-bold">{item.name}</div>
                    <div className="text-sm text-[#8B1E1E] font-semibold">${item.price}</div>
                  </div>
                  <button onClick={() => deleteItem(cat.id, item.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
                    <Trash2 size={16}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPromoManager({ promotions, setPromotions }) { return <div className="p-6 bg-white rounded-xl shadow">優惠設定管理面板</div>; }
function AdminInventoryManager({ ingredients, setIngredients }) { return <div className="p-6 bg-white rounded-xl shadow">庫存與食材進貨面板</div>; }
function AdminExpenseManager({ expenses, setExpenses }) { return <div className="p-6 bg-white rounded-xl shadow">店務記帳管理</div>; }
function AdminClosingManager({ orders, expenses, closingRecords, setClosingRecords }) { return <div className="p-6 bg-white rounded-xl shadow">每日交班關帳</div>; }
function AdminHistory({ orders, setOrders }) { return <div className="p-6 bg-white rounded-xl shadow">歷史訂單紀錄</div>; }
function AdminEmployeeManager({ employees, setEmployees, clockIns }) { return <div className="p-6 bg-white rounded-xl shadow">員工與打卡管理</div>; }
function AdminSettingsManager({ adminPassword, setAdminPassword }) { return <div className="p-6 bg-white rounded-xl shadow">系統參數與密碼設定</div>; }
function EmployeeClockInView({ employees, setEmployees, clockIns, setClockIns, currentTime }) { return <div className="p-8 text-center bg-white m-6 rounded-xl shadow">打卡系統</div>; }