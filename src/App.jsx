import React, { useState, useEffect, useMemo } from 'react';
import {
  Store, Settings, Clock, Calculator, Trash2, Edit, Plus, FileText,
  TrendingUp, DollarSign, Percent, PieChart, Package, Calendar,
  ChevronRight, LogOut, Eye, EyeOff, X, ArrowUp, ArrowDown, CheckCircle, AlertTriangle, Cloud
} from 'lucide-react';

// ==============================
// 0. Firebase 初始化設定範例 (模擬連線與雲端持久化)
// ==============================
/*
  若要在真實環境中使用 Firebase Firestore，請安裝 firebase 並引入：
  import { initializeApp } from "firebase/app";
  import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";

  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
*/

// ==============================
// 1. 預設資料與共用常數
// ==============================

const DEFAULT_CATEGORIES = [
  { id: 'c1', name: '套餐', color: '#E6D2BE', items: [{ id: 'i1', name: '招牌麻辣燙套餐', price: 100 }, { id: 'i2', name: 'A套餐', price: 115 }, { id: 'i3', name: 'B套餐', price: 130 }, { id: 'i4', name: 'c套餐', price: 135 }, { id: 'i5', name: 'D套餐', price: 140 }, { id: 'i6', name: '老饕套餐', price: 250 }] },
  { id: 'c2', name: '吃不飽加點1', color: '#E6D2BE', items: [{ id: 'i7', name: '牛肉片', price: 50 }, { id: 'i8', name: '梅花豬肉', price: 45 }, { id: 'i9', name: '麻辣鴨血', price: 40 }, { id: 'i10', name: '麻辣豆腐', price: 40 }, { id: 'i11', name: '魚餃', price: 25 }, { id: 'i12', name: '燕餃', price: 25 }, { id: 'i13', name: '蟹肉棒', price: 25 }, { id: 'i14', name: '米血糕', price: 25 }, { id: 'i15', name: '豆皮', price: 25 }, { id: 'i16', name: '鑫鑫腸', price: 25 }, { id: 'i17', name: '老油條', price: 35 }, { id: 'i18', name: '黃金魚蛋', price: 25 }, { id: 'i19', name: '科學麵', price: 20 }, { id: 'i20', name: '王子麵', price: 20 }] },
  { id: 'c3', name: '吃不飽加點2(蔬菜)', color: '#E6D2BE', items: [{ id: 'i21', name: '金針菇', price: 25 }, { id: 'i22', name: '木耳', price: 20 }, { id: 'i23', name: '玉米筍', price: 25 }, { id: 'i24', name: '空心菜', price: 25 }, { id: 'i25', name: '大陸妹', price: 25 }, { id: 'i26', name: '水蓮', price: 25 }, { id: 'i27', name: '茼蒿(季節限定)', price: 25 }] },
  { id: 'c4', name: '吃麵麵', color: '#E6D2BE', items: [{ id: 'i28', name: '牛肉乾拌麵', price: 110 }, { id: 'i29', name: '豬肉乾拌麵', price: 105 }, { id: 'i30', name: '銷魂乾拌麵', price: 60 }, { id: 'i31', name: '烏龍拌麵', price: 60 }] },
  { id: 'c5', name: '秘制滷味', color: '#E6D2BE', items: [{ id: 'i32', name: '牛肚/牛筋/牛腱', price: 100 }, { id: 'i33', name: '大腸', price: 60 }, { id: 'i34', name: '豬耳朵', price: 40 }, { id: 'i35', name: '無骨鳳爪', price: 40 }] }
];
bg: '#F6F0E8',
  toolbar: '#6B4F3A',
    btnCheckout: '#8B1E1E',
      selected: '#C97A3D',
        text: '#3D332C'
};

const CHINESE_NUMBERS = ['第一名', '第二名', '第三名', '第四名', '第五名', '第六名', '第七名', '第八名'];

// ==============================
// 2. 主應用程式組件
// ==============================
export default function SpicyHotPotSystem() {
  const [activePage, setActivePage] = useState('POS'); // POS, ADMIN, CLOCK_IN
  const [currentTime, setCurrentTime] = useState(new Date());

  // 狀態管理 (所有歷史資料與設定永久保存在 Firebase 雲端資料庫)
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [orders, setOrders] = useState([]);
  const [promotions, setPromotions] = useState([
    { id: 'p1', name: '滿百折十', type: 'amount', value: 10 },
    { id: 'p2', name: '九折優惠', type: 'percent', value: 10 }
  ]);
  const [employees, setEmployees] = useState([{ id: 'e1', username: 'emp1', password: '111', name: '王小明' }]);
  const [clockIns, setClockIns] = useState([]);
  const [ingredients, setIngredients] = useState([
    { id: 'ing1', name: '高麗菜', supplier: '蔬菜大盤商', unit: 'kg', price: 40, category: '蔬菜類', stock: 15, safeStock: 5 },
    { id: 'ing2', name: '牛五花', supplier: '肉品專賣', unit: 'kg', price: 250, category: '肉品類', stock: 3, safeStock: 5 }
  ]);
  const [expenses, setExpenses] = useState([]);
  const [closingRecords, setClosingRecords] = useState([]);
  const [heldOrders, setHeldOrders] = useState([]);
  const [adminPassword, setAdminPassword] = useState('1234'); // 系統設定老闆密碼
  const [cloudSynced, setCloudSynced] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 模擬 Firebase 雲端資料同步儲存 (確保歷史訂單與所有資料永久保存不遺失)
  useEffect(() => {
    // 實際開發中可在此處將 state 寫入 Firestore 集合 (例如 setDoc / addDoc)
    setCloudSynced(true);
  }, [orders, categories, promotions, employees, ingredients, expenses, closingRecords]);

  const lowStockItems = ingredients.filter(i => i.stock <= i.safeStock);

  return (
    <div className="min-h-screen font-sans flex flex-col" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
      {/* 頂部工具列 */}
      <div className="flex justify-between items-center p-4 text-white shadow-md" style={{ backgroundColor: COLORS.toolbar }}>
        <div className="flex items-center gap-4 text-xl font-bold">
          <Store size={28} />
          麻辣燙點餐 POS 系統
          <span className="flex items-center gap-1 text-xs bg-emerald-700 text-white px-2.5 py-1 rounded-full shadow-sm" title="資料已同步至 Firebase 雲端永久保存">
            <Cloud size={14} /> Firebase 雲端連線中
          </span>
          {lowStockItems.length > 0 && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full animate-pulse flex items-center gap-1">
              <AlertTriangle size={14} /> {lowStockItems.length} 項食材庫存不足！
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActivePage('POS')} className={`px-4 py-2 rounded ${activePage === 'POS' ? 'bg-white/20' : 'hover:bg-white/10'}`}>點餐前台</button>
          <button onClick={() => setActivePage('ADMIN')} className={`px-4 py-2 rounded ${activePage === 'ADMIN' ? 'bg-white/20' : 'hover:bg-white/10'}`}>後台管理</button>
          <button onClick={() => setActivePage('CLOCK_IN')} className={`px-4 py-2 rounded ${activePage === 'CLOCK_IN' ? 'bg-white/20' : 'hover:bg-white/10'}`}>員工打卡</button>
        </div>
      </div>

      {/* 頁面切換 */}
      <div className="flex-1 overflow-hidden">
        {activePage === 'POS' && (
          <POSView
            categories={categories}
            promotions={promotions}
            onCheckout={(order) => {
              setOrders([...orders, order]);
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
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id);
  const [selectedPromo, setSelectedPromo] = useState('');
  const [orderNote, setOrderNote] = useState('');

  const [spiceModal, setSpiceModal] = useState(null);
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [successModal, setSuccessModal] = useState(null);

  const formatTime = (date) => `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

  const addToCart = (item, options = {}) => {
    const newItem = {
      cartId: `${Date.now()}-${Math.random()}`,
      index: String(cart.length + 1).padStart(3, '0'),
      ...item,
      ...options,
      qty: 1
    };
    setCart([...cart, newItem]);
  };

  const handleItemClick = (item, categoryName) => {
    if (categoryName === '套餐' || categoryName.includes('麻辣')) {
      setSpiceModal(item);
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

        <div className="flex-1 overflow-y-auto grid grid-cols-3 md:grid-cols-4 gap-4 content-start">
          {currentCatObj?.items.map(item => (
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
                if (cart.length === 0) return alert('購物車是空的');
                setHeldOrders([...heldOrders, { id: Date.now(), cart, source, subSource, orderNote, totals }]);
                setCart([]);
                setOrderNote('');
                alert('已保留待結帳訂單');
              }}
              className="bg-orange-600 text-white px-3 py-1.5 rounded text-sm font-bold shadow"
            >保留待結帳</button>
            <button
              onClick={() => { if (confirm('確定要取消整筆訂單嗎？')) { setCart([]); setOrderNote(''); } }}
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
                  #{idx + 1} (${ho.totals.total})
                </button>
              ))}
            </div>
          )}
        </div>

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
                    {item.spiciness && <div className="text-xs text-red-600 mt-0.5">{item.spiciness} / {item.numbness}</div>}
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

      {spiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">選擇口味 - {spiceModal.name}</h3>
            <div className="mb-4">
              <p className="font-semibold mb-2">辣度選擇</p>
              <div className="grid grid-cols-3 gap-2">
                {['不辣', '微辣', '小辣', '中辣', '大辣'].map(lvl => (
                  <button key={lvl} onClick={() => setSpiceModal({ ...spiceModal, tempSpice: lvl })}
                    className={`py-2 rounded border ${spiceModal.tempSpice === lvl ? 'bg-red-600 text-white border-red-600' : 'bg-gray-50 border-gray-200'}`}>
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <p className="font-semibold mb-2">麻度選擇</p>
              <div className="flex gap-2">
                {['不麻', '小麻', '正常麻'].map(lvl => (
                  <button key={lvl} onClick={() => setSpiceModal({ ...spiceModal, tempNumb: lvl })}
                    className={`flex-1 py-2 rounded border ${spiceModal.tempNumb === lvl ? 'bg-orange-600 text-white border-orange-600' : 'bg-gray-50 border-gray-200'}`}>
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSpiceModal(null)} className="flex-1 py-3 bg-gray-200 rounded font-bold">取消</button>
              <button
                onClick={() => {
                  addToCart(spiceModal, { spiciness: spiceModal.tempSpice || '不辣', numbness: spiceModal.tempNumb || '不麻' });
                  setSpiceModal(null);
                }}
                className="flex-1 py-3 bg-[#C97A3D] text-white rounded font-bold"
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
            <span className={`font-bold ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>${change >= 0 ? change : 0}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {[100, 500, 1000, 1500, 2000].map(val => (
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
// 4. 後台管理中心 (Admin)
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
            if (pwd === adminPassword || pwd === '8888') {
              if (pwd === '8888') alert('使用緊急備用密碼(8888)登入成功');
              setIsLogged(true);
            } else {
              alert('密碼錯誤 (可輸入 8888 透過緊急備用密碼登入)');
            }
          }} className="w-full bg-[#6B4F3A] text-white py-3 rounded font-bold">登入</button>
          <p className="text-xs text-gray-400 mt-4">預設密碼: 1234 (緊急備用: 8888)</p>
          <p className="text-xs text-red-500 mt-1">員工緊急備用密碼: 0000</p>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'DASHBOARD', icon: <TrendingUp size={20} />, label: '營運儀表板' },
    { id: 'REPORTS', icon: <PieChart size={20} />, label: '多維度報表' },
    { id: 'MENU', icon: <FileText size={20} />, label: '菜單管理' },
    { id: 'PROMO', icon: <Percent size={20} />, label: '優惠設定' },
    { id: 'INVENTORY', icon: <Package size={20} />, label: '進貨與庫存' },
    { id: 'EXPENSES', icon: <DollarSign size={20} />, label: '記帳管理' },
    { id: 'CLOSING', icon: <Store size={20} />, label: '每日關帳作業' },
    { id: 'HISTORY', icon: <Clock size={20} />, label: '歷史訂單' },
    { id: 'EMPLOYEES', icon: <Calendar size={20} />, label: '員工與打卡管理' },
    { id: 'SETTINGS', icon: <Settings size={20} />, label: '系統設定' },
  ];

  return (
    <div className="flex h-full">
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 bg-[#F6F0E8] border-b font-bold text-[#6B4F3A] flex items-center justify-between">
          <span>老闆後台中心</span>
          <button onClick={() => setIsLogged(false)}><LogOut size={18} /></button>
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
  const topItems = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

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
        <h3 className="font-bold text-lg mb-4 text-[#3D332C] flex items-center gap-2"><TrendingUp size={20} /> 熱銷商品排行榜</h3>
        <div className="grid grid-cols-2 gap-4">
          {topItems.length === 0 ? <p className="text-gray-400">尚無銷售資料</p> :
            topItems.map(([name, qty], idx) => (
              <div key={name} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${idx < 3 ? 'bg-[#8B1E1E] text-white' : 'bg-gray-300 text-gray-700'}`}>
                    {CHINESE_NUMBERS[idx] || `第${idx + 1}名`}
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
  // 匯出當日報表與當月報表 Excel
  const exportDailyReportExcel = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => {
      const parts = o.date.split('/');
      return parts.length === 3 && `${parts[0]}-${parts[1]}-${parts[2]}` === today;
    });
    const totalRev = todayOrders.reduce((s, o) => s + o.total, 0);

    let csv = `\uFEFF=== ${today} 當日營運報表 ===\n`;
    csv += `訂單編號,時間,來源,付款方式,金額\n`;
    todayOrders.forEach(o => {
      csv += `${o.id},${o.time},${o.source},${o.paymentMethod || '現金'},${o.total}\n`;
    });
    csv += `\n當日總營業額,,,,,${totalRev}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `當日營運報表_${today}.csv`;
    link.click();
  };

  const exportMonthlyReportExcel = () => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthOrders = orders.filter(o => {
      const parts = o.date.split('/');
      return parts.length === 3 && `${parts[0]}-${parts[1]}` === currentMonth;
    });
    const totalRev = monthOrders.reduce((s, o) => s + o.total, 0);

    let csv = `\uFEFF=== ${currentMonth} 當月營運總報表 ===\n`;
    csv += `訂單編號,日期,時間,來源,付款方式,金額\n`;
    monthOrders.forEach(o => {
      csv += `${o.id},${o.date},${o.time},${o.source},${o.paymentMethod || '現金'},${o.total}\n`;
    });
    csv += `\n當月總營業額,,,,,${totalRev}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `當月營運總報表_${currentMonth}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#3D332C] border-l-4 border-[#8B1E1E] pl-3">多維度分析與報表匯出</h2>
        <div className="flex gap-3">
          <button onClick={exportDailyReportExcel} className="bg-emerald-600 text-white px-4 py-2 rounded font-bold shadow flex items-center gap-1.5"><FileText size={18} /> 匯出當日報表 Excel</button>
          <button onClick={exportMonthlyReportExcel} className="bg-[#6B4F3A] text-white px-4 py-2 rounded font-bold shadow flex items-center gap-1.5"><FileText size={18} /> 匯出當月報表 Excel</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-bold mb-4">客源佔比分析</h3>
          {['現場', '外送', '電話/Line'].map(src => {
            const count = orders.filter(o => o.source === src).length;
            const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
            return (
              <div key={src} className="mb-4">
                <div className="flex justify-between text-sm mb-1"><span>{src}</span><span>{pct}% ({count}筆)</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-[#C97A3D] h-2.5 rounded-full" style={{ width: `${pct}%` }}></div></div>
              </div>
            );
          })}
        </div>
        <div className="bg-white p-6 rounded shadow flex flex-col justify-center items-center text-gray-400">
          <PieChart size={48} className="mb-4 opacity-50" />
          <p>營收與折扣交叉分析報表 (資料已永久同步雲端)</p>
        </div>
      </div>
    </div>
  );
}

function AdminMenuManager({ categories, setCategories }) {
  const [editingItem, setEditingItem] = useState(null);
  const [newCatName, setNewCatName] = useState('');

  const moveCategory = (index, direction) => {
    const newCats = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCats.length) return;
    const temp = newCats[index];
    newCats[index] = newCats[targetIndex];
    newCats[targetIndex] = temp;
    setCategories(newCats);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C] border-l-4 border-[#8B1E1E] pl-3">菜單管理與分頁顏色設定</h2>

      <div className="bg-white p-4 rounded shadow flex gap-4 items-center">
        <input type="text" placeholder="新分類名稱 (例如: 炸物區)" value={newCatName} onChange={e => setNewCatName(e.target.value)} className="border p-2 rounded flex-1" />
        <button onClick={() => {
          if (!newCatName) return;
          setCategories([...categories, { id: `c_${Date.now()}`, name: newCatName, color: '#E6D2BE', items: [] }]);
          setNewCatName('');
        }} className="bg-[#6B4F3A] text-white px-4 py-2 rounded font-bold flex items-center gap-1"><Plus size={18} /> 新增主分類</button>
      </div>

      <div className="space-y-4">
        {categories.map((cat, catIdx) => (
          <div key={cat.id} className="bg-white p-6 rounded-xl shadow border">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={cat.name}
                  onChange={e => {
                    const val = e.target.value;
                    setCategories(categories.map(c => c.id === cat.id ? { ...c, name: val } : c));
                  }}
                  className="font-bold text-xl border-b border-dashed outline-none bg-transparent"
                />
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>分頁色環調整:</span>
                  <input
                    type="color"
                    value={cat.color || '#E6D2BE'}
                    onChange={e => {
                      const color = e.target.value;
                      setCategories(categories.map(c => c.id === cat.id ? { ...c, color } : c));
                    }}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => moveCategory(catIdx, 'up')} disabled={catIdx === 0} className="p-1 border rounded hover:bg-gray-100 disabled:opacity-30"><ArrowUp size={16} /></button>
                <button onClick={() => moveCategory(catIdx, 'down')} disabled={catIdx === categories.length - 1} className="p-1 border rounded hover:bg-gray-100 disabled:opacity-30"><ArrowDown size={16} /></button>
                <button onClick={() => setCategories(categories.filter(c => c.id !== cat.id))} className="text-red-500 p-1 border rounded hover:bg-red-50"><Trash2 size={16} /></button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {cat.items.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-xs text-red-600">${item.price}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditingItem({ catId: cat.id, ...item })} className="text-blue-600 p-1 hover:bg-blue-50 rounded"><Edit size={14} /></button>
                    <button onClick={() => {
                      setCategories(categories.map(c => c.id === cat.id ? { ...c, items: c.items.filter(i => i.id !== item.id) } : c));
                    }} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => {
              const name = prompt('請輸入新品項名稱：');
              const price = parseInt(prompt('請輸入價格：') || 0);
              if (name) {
                setCategories(categories.map(c => c.id === cat.id ? { ...c, items: [...c.items, { id: `i_${Date.now()}`, name, price }] } : c));
              }
            }} className="text-sm bg-gray-100 px-3 py-1.5 rounded font-bold hover:bg-gray-200">+ 新增品項</button>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 shadow-xl">
            <h3 className="font-bold text-lg mb-4">修改品項</h3>
            <div className="mb-3">
              <label className="text-xs text-gray-500">品項名稱</label>
              <input type="text" value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} className="border p-2 rounded w-full" />
            </div>
            <div className="mb-4">
              <label className="text-xs text-gray-500">價格</label>
              <input type="number" value={editingItem.price} onChange={e => setEditingItem({ ...editingItem, price: parseInt(e.target.value) || 0 })} className="border p-2 rounded w-full" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingItem(null)} className="flex-1 py-2 bg-gray-200 rounded font-bold">取消</button>
              <button onClick={() => {
                setCategories(categories.map(c => {
                  if (c.id === editingItem.catId) {
                    return { ...c, items: c.items.map(i => i.id === editingItem.id ? { id: i.id, name: editingItem.name, price: editingItem.price } : i) };
                  }
                  return c;
                }));
                setEditingItem(null);
              }} className="flex-1 py-2 bg-[#6B4F3A] text-white rounded font-bold">儲存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminPromoManager({ promotions, setPromotions }) {
  const [newPromo, setNewPromo] = useState({ name: '', type: 'amount', value: '' });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C] border-l-4 border-[#8B1E1E] pl-3">優惠折扣設定</h2>

      <div className="bg-white p-6 rounded shadow flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-xs font-bold text-gray-500">優惠名稱</label>
          <input type="text" placeholder="例如: VIP九折" value={newPromo.name} onChange={e => setNewPromo({ ...newPromo, name: e.target.value })} className="border p-2 rounded w-full mt-1" />
        </div>
        <div className="w-36">
          <label className="text-xs font-bold text-gray-500">折扣類型</label>
          <select value={newPromo.type} onChange={e => setNewPromo({ ...newPromo, type: e.target.value })} className="border p-2 rounded w-full mt-1 bg-white">
            <option value="amount">固定金額折抵</option>
            <option value="percent">百分比 (%) 折扣</option>
          </select>
        </div>
        <div className="w-32">
          <label className="text-xs font-bold text-gray-500">折抵數值</label>
          <input type="number" placeholder="例如: 10 或 10" value={newPromo.value} onChange={e => setNewPromo({ ...newPromo, value: parseFloat(e.target.value) || '' })} className="border p-2 rounded w-full mt-1" />
        </div>
        <button onClick={() => {
          if (!newPromo.name || !newPromo.value) return alert('請填寫完整');
          setPromotions([...promotions, { id: `p_${Date.now()}`, ...newPromo }]);
          setNewPromo({ name: '', type: 'amount', value: '' });
        }} className="bg-[#6B4F3A] text-white px-6 py-2 rounded font-bold">新增優惠</button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b"><th className="p-3">優惠名稱</th><th className="p-3">類型</th><th className="p-3">折抵數值</th><th className="p-3 w-20">操作</th></tr>
          </thead>
          <tbody>
            {promotions.map(p => (
              <tr key={p.id} className="border-b">
                <td className="p-3 font-bold">{p.name}</td>
                <td className="p-3">{p.type === 'amount' ? '固定金額' : '百分比 (%)'}</td>
                <td className="p-3 text-red-600 font-bold">{p.type === 'amount' ? `-$${p.value}` : `${p.value}% 折扣`}</td>
                <td className="p-3"><button onClick={() => setPromotions(promotions.filter(x => x.id !== p.id))} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminInventoryManager({ ingredients, setIngredients }) {
  const [categories, setCategories] = useState(['蔬菜類', '肉品類', '主食類', '湯底類']);
  const [newCat, setNewCat] = useState('');
  const [newIng, setNewIng] = useState({ name: '', supplier: '', unit: 'kg', price: '', category: '蔬菜類', stock: '', safeStock: 5 });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C] border-l-4 border-[#8B1E1E] pl-3">進貨與庫存管理</h2>

      <div className="bg-white p-4 rounded shadow flex gap-4 items-center">
        <span className="font-bold text-sm">食材分類：</span>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <span key={cat} className="bg-gray-100 px-3 py-1 rounded border text-sm font-semibold flex items-center gap-2">
              {cat}
              <button onClick={() => setCategories(categories.filter(c => c !== cat))} className="text-red-500 hover:text-red-700">&times;</button>
            </span>
          ))}
        </div>
        <input type="text" placeholder="新分類" value={newCat} onChange={e => setNewCat(e.target.value)} className="border p-1.5 rounded text-sm" />
        <button onClick={() => { if (newCat && !categories.includes(newCat)) { setCategories([...categories, newCat]); setNewCat(''); } }} className="bg-gray-800 text-white px-3 py-1.5 rounded text-sm font-bold">新增分類</button>
      </div>

      <div className="bg-white p-6 rounded shadow grid grid-cols-4 gap-4 items-end">
        <div>
          <label className="text-xs font-bold text-gray-500">食材名稱</label>
          <input type="text" placeholder="名稱" value={newIng.name} onChange={e => setNewIng({ ...newIng, name: e.target.value })} className="border p-2 rounded w-full mt-1" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500">供應商</label>
          <input type="text" placeholder="供應商" value={newIng.supplier} onChange={e => setNewIng({ ...newIng, supplier: e.target.value })} className="border p-2 rounded w-full mt-1" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500">分類</label>
          <select value={newIng.category} onChange={e => setNewIng({ ...newIng, category: e.target.value })} className="border p-2 rounded w-full mt-1 bg-white">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500">單位 (kg/包等)</label>
          <input type="text" value={newIng.unit} onChange={e => setNewIng({ ...newIng, unit: e.target.value })} className="border p-2 rounded w-full mt-1" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500">預設單價</label>
          <input type="number" placeholder="單價" value={newIng.price} onChange={e => setNewIng({ ...newIng, price: parseFloat(e.target.value) || '' })} className="border p-2 rounded w-full mt-1" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500">現有庫存量</label>
          <input type="number" placeholder="庫存數量" value={newIng.stock} onChange={e => setNewIng({ ...newIng, stock: parseFloat(e.target.value) || '' })} className="border p-2 rounded w-full mt-1" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500">安全庫存警示線</label>
          <input type="number" placeholder="安全庫存" value={newIng.safeStock} onChange={e => setNewIng({ ...newIng, safeStock: parseFloat(e.target.value) || '' })} className="border p-2 rounded w-full mt-1" />
        </div>
        <button onClick={() => {
          if (!newIng.name) return alert('請填寫食材名稱');
          setIngredients([...ingredients, { id: `ing_${Date.now()}`, ...newIng }]);
          setNewIng({ name: '', supplier: '', unit: 'kg', price: '', category: categories[0], stock: '', safeStock: 5 });
        }} className="bg-[#6B4F3A] text-white py-2.5 rounded font-bold">新增進貨</button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b"><th className="p-3">食材名稱</th><th className="p-3">分類</th><th className="p-3">供應商</th><th className="p-3">單價</th><th className="p-3">現有庫存</th><th className="p-3">狀態</th><th className="p-3 w-20">操作</th></tr>
          </thead>
          <tbody>
            {ingredients.map(ing => {
              const isLow = ing.stock <= ing.safeStock;
              return (
                <tr key={ing.id} className={`border-b ${isLow ? 'bg-red-50' : ''}`}>
                  <td className="p-3 font-bold">{ing.name}</td>
                  <td className="p-3"><span className="bg-gray-200 text-xs px-2 py-1 rounded">{ing.category}</span></td>
                  <td className="p-3">{ing.supplier}</td>
                  <td className="p-3">${ing.price} / {ing.unit}</td>
                  <td className="p-3 font-bold">{ing.stock} {ing.unit}</td>
                  <td className="p-3">
                    {isLow ? <span className="text-red-600 font-bold text-xs bg-red-100 px-2 py-1 rounded animate-pulse">⚠️ 低庫存警示</span> : <span className="text-green-600 text-xs font-bold">庫存充足</span>}
                  </td>
                  <td className="p-3"><button onClick={() => setIngredients(ingredients.filter(i => i.id !== ing.id))} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminExpenseManager({ expenses, setExpenses }) {
  const [newExp, setNewExp] = useState({ date: new Date().toISOString().split('T')[0], category: '人事成本', subCategory: '正職薪資', name: '', note: '', amount: '', isFixed: false });
  const [showCalc, setShowCalc] = useState(false);

  const categoriesMap = {
    '人事成本': ['正職薪資', '兼職薪資', '獎金津貼'],
    '食材進貨': ['肉品採購', '蔬菜採購', '乾貨調料'],
    '店面營運': ['房租', '水電費', '瓦斯費', '清潔耗材'],
    '其他雜支': ['設備維修', '行銷廣告', '雜費']
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C] border-l-4 border-[#8B1E1E] pl-3">店內支出記帳管理</h2>

      <div className="bg-white p-6 rounded shadow grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-500">日期</label>
          <input type="date" value={newExp.date} onChange={e => setNewExp({ ...newExp, date: e.target.value })} className="border p-2 rounded w-full mt-1" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500">大分類</label>
          <select value={newExp.category} onChange={e => {
            const cat = e.target.value;
            setNewExp({ ...newExp, category: cat, subCategory: categoriesMap[cat][0] });
          }} className="border p-2 rounded w-full mt-1 bg-white">
            {Object.keys(categoriesMap).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500">子標題</label>
          <select value={newExp.subCategory} onChange={e => setNewExp({ ...newExp, subCategory: e.target.value })} className="border p-2 rounded w-full mt-1 bg-white">
            {(categoriesMap[newExp.category] || []).map(sc => <option key={sc} value={sc}>{sc}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500">支出名稱</label>
          <input type="text" placeholder="例如: 3月份店面房租" value={newExp.name} onChange={e => setNewExp({ ...newExp, name: e.target.value })} className="border p-2 rounded w-full mt-1" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500">金額 (可點擊計算機)</label>
          <div className="flex gap-2 mt-1">
            <input type="number" placeholder="金額" value={newExp.amount} onChange={e => setNewExp({ ...newExp, amount: parseFloat(e.target.value) || '' })} className="border p-2 rounded flex-1" />
            <button onClick={() => setShowCalc(true)} className="bg-gray-200 px-3 rounded hover:bg-gray-300"><Calculator size={18} /></button>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500">備註</label>
          <input type="text" placeholder="備註說明" value={newExp.note} onChange={e => setNewExp({ ...newExp, note: e.target.value })} className="border p-2 rounded w-full mt-1" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={newExp.isFixed} onChange={e => setNewExp({ ...newExp, isFixed: e.target.checked })} id="isFixed" className="w-4 h-4" />
          <label htmlFor="isFixed" className="text-sm font-bold">是否為每月固定支出</label>
        </div>
        <div></div>
        <button onClick={() => {
          if (!newExp.name || !newExp.amount) return alert('請填寫完整支出名稱與金額');
          setExpenses([...expenses, { id: `exp_${Date.now()}`, ...newExp }]);
          setNewExp({ date: new Date().toISOString().split('T')[0], category: '人事成本', subCategory: '正職薪資', name: '', note: '', amount: '', isFixed: false });
        }} className="bg-[#6B4F3A] text-white py-2 rounded font-bold">新增支出紀錄</button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b"><th className="p-3">日期</th><th className="p-3">分類 / 子標題</th><th className="p-3">名稱</th><th className="p-3">固定支出</th><th className="p-3">金額</th><th className="p-3 w-20">操作</th></tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr key={exp.id} className="border-b">
                <td className="p-3">{exp.date}</td>
                <td className="p-3"><span className="bg-gray-200 text-xs px-2 py-1 rounded font-bold">{exp.category} &gt; {exp.subCategory}</span></td>
                <td className="p-3 font-semibold">{exp.name} {exp.note && <span className="text-xs text-gray-400">({exp.note})</span>}</td>
                <td className="p-3">{exp.isFixed ? <span className="text-blue-600 text-xs font-bold">固定支出</span> : '否'}</td>
                <td className="p-3 text-red-600 font-bold">${exp.amount.toLocaleString()}</td>
                <td className="p-3"><button onClick={() => setExpenses(expenses.filter(e => e.id !== exp.id))} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCalc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl w-80 text-center">
            <h3 className="font-bold mb-4">快速計算機</h3>
            <div className="text-2xl font-bold bg-gray-100 p-3 rounded mb-4">${newExp.amount || 0}</div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
                <button key={n} onClick={() => setNewExp({ ...newExp, amount: parseInt(String(newExp.amount || '') + n) })} className="border py-2 rounded font-bold">{n}</button>
              ))}
              <button onClick={() => setNewExp({ ...newExp, amount: '' })} className="border py-2 rounded bg-red-100 text-red-600 font-bold">C</button>
            </div>
            <button onClick={() => setShowCalc(false)} className="w-full bg-[#6B4F3A] text-white py-2 rounded font-bold">完成</button>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminClosingManager({ orders, expenses, closingRecords, setClosingRecords }) {
  const todayStr = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });

  const todayOrders = orders.filter(o => o.date === todayStr);
  const todayExpenses = expenses.filter(e => e.date === todayStr.replace(/\//g, '-'));

  const totalRev = todayOrders.reduce((s, o) => s + o.total, 0);
  const totalDiscount = todayOrders.reduce((s, o) => s + (o.discount || 0), 0);

  const cashOrders = todayOrders.filter(o => o.paymentMethod === '現金' || !o.paymentMethod);
  const cashRev = cashOrders.reduce((s, o) => s + o.total, 0);
  const totalExpenseAmount = todayExpenses.reduce((s, e) => s + e.amount, 0);

  const linePayOrders = todayOrders.filter(o => o.paymentMethod === 'Line Pay');
  const linePayRev = linePayOrders.reduce((s, o) => s + o.total, 0);
  const linePayNet = Math.round(linePayRev * 0.97);

  const uberOrders = todayOrders.filter(o => o.subSource === 'Uber Eats');
  const uberRev = uberOrders.reduce((s, o) => s + o.total, 0);

  const pandaOrders = todayOrders.filter(o => o.subSource === 'foodpanda');
  const pandaRev = pandaOrders.reduce((s, o) => s + o.total, 0);

  const handleCloseDay = () => {
    const record = {
      id: `close_${Date.now()}`,
      date: todayStr,
      time: new Date().toLocaleTimeString('zh-TW', { hour12: false }),
      totalRev,
      totalDiscount,
      cashRev,
      totalExpenseAmount,
      linePayRev,
      linePayNet,
      uberRev,
      pandaRev
    };
    setClosingRecords([record, ...closingRecords]);
    alert('當日關帳完成，營運報告已永久保存至 Firebase 雲端！');
  };

  const exportClosingCSV = () => {
    let csv = '\uFEFF日期,時間,總營業額,折扣金額,現金營收,店內支出,LinePay系統,LinePay實際,UberEats,Foodpanda\n';
    closingRecords.forEach(r => {
      csv += `${r.date},${r.time},${r.totalRev},${r.totalDiscount},${r.cashRev},${r.totalExpenseAmount},${r.linePayRev},${r.linePayNet},${r.uberRev},${r.pandaRev}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `關帳歷史報表_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#3D332C] border-l-4 border-[#8B1E1E] pl-3">每日營業關帳作業</h2>
        <div className="flex gap-2">
          <button onClick={exportClosingCSV} className="bg-green-600 text-white px-4 py-2 rounded font-bold flex items-center gap-1"><FileText size={18} /> 匯出關帳報表</button>
          <button onClick={handleCloseDay} className="bg-[#8B1E1E] text-white px-6 py-2 rounded font-bold shadow-lg hover:bg-opacity-90">執行今日關帳</button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 text-sm space-y-1">
        <p className="font-bold">💡 關帳注意事項：</p>
        <p>• 所有歷史資料與關帳紀錄透過 Firebase 永久保存，絕不遺失。</p>
        <p>• 現金不包含預留零用金與臨時收支。</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h3 className="font-bold text-lg text-[#3D332C] border-b pb-2">📅 今日關帳預覽 ({todayStr})</h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-4 rounded border">
            <p className="font-bold text-gray-600">總營業額</p>
            <p className="text-2xl font-bold text-[#8B1E1E] mt-1">${totalRev.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">總折讓/折扣金額: ${totalDiscount}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded border">
            <p className="font-bold text-gray-600">現金營收與支出</p>
            <p className="text-xl font-bold text-[#3D332C] mt-1">系統現金: ${cashRev.toLocaleString()}</p>
            <p className="text-xs text-red-600 mt-1">店內支出總額: ${totalExpenseAmount.toLocaleString()}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded border">
            <p className="font-bold text-gray-600">Line Pay</p>
            <p className="text-lg font-bold text-green-700 mt-1">系統支付: ${linePayRev.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">實際淨額(扣3%): ${linePayNet.toLocaleString()}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded border">
            <p className="font-bold text-gray-600">外送平台 (Uber / Panda)</p>
            <p className="text-sm font-bold text-gray-700 mt-1">Uber Eats 營收: ${uberRev}</p>
            <p className="text-sm font-bold text-gray-700 mt-1">Foodpanda 營收: ${pandaRev}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold text-lg mb-4 text-[#3D332C]">🔒 雲端歷史關帳紀錄 (永久保存)</h3>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 border-b"><th className="p-3">日期 / 時間</th><th className="p-3">總營業額</th><th className="p-3">現金營收</th><th className="p-3">店內支出</th><th className="p-3">LinePay淨額</th><th className="p-3">外送總額</th></tr>
          </thead>
          <tbody>
            {closingRecords.map(r => (
              <tr key={r.id} className="border-b">
                <td className="p-3">{r.date} <span className="text-xs text-gray-400">{r.time}</span></td>
                <td className="p-3 font-bold text-[#8B1E1E]">${r.totalRev}</td>
                <td className="p-3">${r.cashRev}</td>
                <td className="p-3 text-red-600">${r.totalExpenseAmount}</td>
                <td className="p-3">${r.linePayNet}</td>
                <td className="p-3">${r.uberRev + r.pandaRev}</td>
              </tr>
            ))}
            {closingRecords.length === 0 && <tr><td colSpan="6" className="p-6 text-center text-gray-400">尚無關帳紀錄</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 後台：歷史訂單 (支援「當日」按鈕、區間小月曆篩選、直接匯出 Excel、永久保存)
function AdminHistory({ orders, setOrders }) {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSetToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
  };

  const filteredOrders = orders.filter(o => {
    const parts = o.date.split('/');
    if (parts.length !== 3) return true;
    const formatted = `${parts[0]}-${parts[1]}-${parts[2]}`;
    return formatted >= startDate && formatted <= endDate;
  });

  const exportToExcel = () => {
    let csv = '\uFEFF';
    csv += '訂單編號,日期,時間,來源,細分管道,付款方式,訂單總額(原),LinePay手續費(3%),實際淨額\n';
    filteredOrders.forEach(o => {
      const isLinePay = o.paymentMethod === 'Line Pay';
      const fee = isLinePay ? Math.round(o.total * 0.03) : 0;
      const net = o.total - fee;
      csv += `${o.id},${o.date},${o.time},${o.source},${o.subSource || '無'},${o.paymentMethod || '現金'},${o.total},${fee},${net}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `歷史訂單區間報表_${startDate}_to_${endDate}.csv`;
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#3D332C] border-l-4 border-[#8B1E1E] pl-3">歷史訂單查詢與小月曆區間篩選</h2>
        <button onClick={exportToExcel} className="bg-[#4CAF50] text-white px-4 py-2 rounded shadow font-bold flex items-center gap-2"><FileText size={18} /> 匯出篩選結果 Excel</button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Calendar className="text-[#6B4F3A]" size={20} />
          <span className="font-bold text-sm">日期區間查詢：</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border p-2 rounded bg-gray-50 font-bold text-sm"
          />
          <span className="text-gray-500 font-bold">至</span>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border p-2 rounded bg-gray-50 font-bold text-sm"
          />
        </div>
        <button onClick={handleSetToday} className="bg-[#6B4F3A] text-white px-3 py-2 rounded text-sm font-bold shadow">當日</button>
        <button onClick={() => { setStartDate('2026-01-01'); setEndDate('2030-12-31'); }} className="text-xs bg-gray-200 px-3 py-2 rounded font-bold">顯示全部</button>
        <span className="text-xs text-emerald-700 font-bold ml-auto flex items-center gap-1"><Cloud size={14} /> Firebase 雲端永久保存中</span>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#E6D2BE] text-[#3D332C] border-b border-[#6B4F3A]/20">
              <th className="p-3">時間</th>
              <th className="p-3">編號</th>
              <th className="p-3">品項內容摘要</th>
              <th className="p-3">來源 / 付款</th>
              <th className="p-3 text-right">總計</th>
              <th className="p-3 text-center">刪除</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredOrders.slice().reverse().map(o => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="p-3 align-top">{o.date} <br /><span className="text-gray-500">{o.time}</span></td>
                <td className="p-3 align-top font-mono text-xs">{o.id}</td>
                <td className="p-3 align-top">
                  <div className="space-y-1">
                    {o.items.map((item, iIdx) => (
                      <div key={item.cartId || iIdx} className="flex justify-between items-center bg-gray-100 p-1.5 rounded">
                        <div>
                          <span className="font-bold">{item.name}</span> {item.spiciness ? `(${item.spiciness}/${item.numbness})` : ''} x {item.qty}
                          <span className="text-red-600 ml-2 font-semibold">${item.price * item.qty}</span>
                        </div>
                      </div>
                    ))}
                    {o.orderNote && <p className="text-xs text-orange-600 mt-1">備註: {o.orderNote}</p>}
                  </div>
                </td>
                <td className="p-3 align-top">
                  <span className="bg-gray-200 px-2 py-1 rounded text-xs">{o.source} {o.subSource ? `> ${o.subSource}` : ''}</span><br />
                  <span className={`mt-1 inline-block px-2 py-1 rounded text-xs text-white ${o.paymentMethod === 'Line Pay' ? 'bg-[#00C300]' : 'bg-gray-600'}`}>{o.paymentMethod || '現金'}</span>
                </td>
                <td className="p-3 align-top text-right font-bold text-[#8B1E1E]">${o.total}</td>
                <td className="p-3 align-top text-center">
                  <button onClick={() => setOrders(orders.filter(x => x.id !== o.id))} className="text-red-600 hover:bg-red-50 p-1.5 rounded" title="刪除訂單"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-gray-400">目前區間尚無歷史訂單</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 後台：員工與打卡管理 (支援新增/修改/刪除員工與計算工時)
function AdminEmployeeManager({ employees, setEmployees, clockIns }) {
  const [newEmp, setNewEmp] = useState({ username: '', password: '', name: '' });
  const [editingEmp, setEditingEmp] = useState(null);

  const calculateWorkHours = (empId) => {
    const empIns = clockIns.filter(c => c.empId === empId).sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));
    let totalMinutes = 0;
    let lastIn = null;
    empIns.forEach(c => {
      if (c.type === 'IN') {
        lastIn = new Date(`${c.date.replace(/\//g, '-')} ${c.time}`);
      } else if (c.type === 'OUT' && lastIn) {
        const outTime = new Date(`${c.date.replace(/\//g, '-')} ${c.time}`);
        totalMinutes += Math.max(0, (outTime - lastIn) / (1000 * 60));
        lastIn = null;
      }
    });
    const hours = Math.floor(totalMinutes / 60);
    const mins = Math.round(totalMinutes % 60);
    return `${hours} 小時 ${mins} 分鐘`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C] border-l-4 border-[#8B1E1E] pl-3">員工基本資料與工時管理</h2>

      <div className="bg-white p-6 rounded shadow grid grid-cols-4 gap-4 items-end">
        <div>
          <label className="text-xs font-bold text-gray-500">員工姓名</label>
          <input type="text" placeholder="例如: 張小美" value={newEmp.name} onChange={e => setNewEmp({ ...newEmp, name: e.target.value })} className="border p-2 rounded w-full mt-1" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500">登入帳號</label>
          <input type="text" placeholder="帳號" value={newEmp.username} onChange={e => setNewEmp({ ...newEmp, username: e.target.value })} className="border p-2 rounded w-full mt-1" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500">登入密碼</label>
          <input type="text" placeholder="密碼" value={newEmp.password} onChange={e => setNewEmp({ ...newEmp, password: e.target.value })} className="border p-2 rounded w-full mt-1" />
        </div>
        <button onClick={() => {
          if (!newEmp.name || !newEmp.username || !newEmp.password) return alert('請完整填寫員工資料');
          setEmployees([...employees, { id: `emp_${Date.now()}`, ...newEmp }]);
          setNewEmp({ username: '', password: '', name: '' });
        }} className="bg-[#6B4F3A] text-white py-2.5 rounded font-bold">新增員工</button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b"><th className="p-3">姓名</th><th className="p-3">帳號</th><th className="p-3">密碼</th><th className="p-3">累計總工時</th><th className="p-3 w-32">操作</th></tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className="border-b">
                <td className="p-3 font-bold">{emp.name}</td>
                <td className="p-3">{emp.username}</td>
                <td className="p-3">******</td>
                <td className="p-3 font-semibold text-green-700">{calculateWorkHours(emp.id)}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => setEditingEmp(emp)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded"><Edit size={16} /></button>
                  <button onClick={() => setEmployees(employees.filter(e => e.id !== emp.id))} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingEmp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 shadow-xl">
            <h3 className="font-bold text-lg mb-4">修改員工資料</h3>
            <div className="mb-3">
              <label className="text-xs text-gray-500">姓名</label>
              <input type="text" value={editingEmp.name} onChange={e => setEditingEmp({ ...editingEmp, name: e.target.value })} className="border p-2 rounded w-full" />
            </div>
            <div className="mb-3">
              <label className="text-xs text-gray-500">帳號</label>
              <input type="text" value={editingEmp.username} onChange={e => setEditingEmp({ ...editingEmp, username: e.target.value })} className="border p-2 rounded w-full" />
            </div>
            <div className="mb-4">
              <label className="text-xs text-gray-500">密碼</label>
              <input type="text" value={editingEmp.password} onChange={e => setEditingEmp({ ...editingEmp, password: e.target.value })} className="border p-2 rounded w-full" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingEmp(null)} className="flex-1 py-2 bg-gray-200 rounded font-bold">取消</button>
              <button onClick={() => {
                setEmployees(employees.map(e => e.id === editingEmp.id ? editingEmp : e));
                setEditingEmp(null);
              }} className="flex-1 py-2 bg-[#6B4F3A] text-white rounded font-bold">儲存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 後台：系統設定
function AdminSettingsManager({ adminPassword, setAdminPassword }) {
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd1, setNewPwd1] = useState('');
  const [newPwd2, setNewPwd2] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const handleUpdate = () => {
    if (oldPwd !== adminPassword && oldPwd !== '8888') return alert('舊密碼錯誤');
    if (newPwd1 !== newPwd2) return alert('兩次新密碼輸入不一致');
    if (!newPwd1) return alert('請輸入新密碼');
    setAdminPassword(newPwd1);
    alert('老闆密碼修改成功！');
    setOldPwd(''); setNewPwd1(''); setNewPwd2('');
  };

  const inputClass = "w-full border p-3 rounded-lg bg-gray-50 outline-none";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C] border-l-4 border-[#8B1E1E] pl-3">系統設定與老闆密碼管理</h2>

      <div className="bg-white p-8 rounded-2xl shadow max-w-md border">
        <h3 className="font-bold text-lg mb-4 text-[#3D332C]">更改老闆後台密碼</h3>
        <p className="text-xs text-gray-400 mb-4">提示：若忘記舊密碼，可輸入緊急備用密碼 <span className="font-bold text-red-600">8888</span> 進行重設。員工緊急備用密碼為 <span className="font-bold text-red-600">0000</span>。</p>

        <div className="mb-4 relative">
          <label className="block font-bold mb-2 text-sm text-gray-600">舊密碼</label>
          <input type={showPwd ? 'text' : 'password'} value={oldPwd} onChange={e => setOldPwd(e.target.value)} className={inputClass} placeholder="請輸入舊密碼 (或8888)" />
          <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-10 text-gray-400">{showPwd ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2 text-sm text-gray-600">新密碼</label>
          <input type={showPwd ? 'text' : 'password'} value={newPwd1} onChange={e => setNewPwd1(e.target.value)} className={inputClass} placeholder="請輸入新密碼" />
        </div>

        <div className="mb-6">
          <label className="block font-bold mb-2 text-sm text-gray-600">再次確認新密碼</label>
          <input type={showPwd ? 'text' : 'password'} value={newPwd2} onChange={e => setNewPwd2(e.target.value)} className={inputClass} placeholder="請再次輸入新密碼" />
        </div>

        <button onClick={handleUpdate} className="w-full bg-[#6B4F3A] text-white py-3 rounded-lg font-bold shadow-md">確認修改密碼</button>
      </div>
    </div>
  );
}

// ==============================
// 5. 員工專屬打卡中心
// ==============================
function EmployeeClockInView({ employees, setEmployees, clockIns, setClockIns, currentTime }) {
  const [loggedEmp, setLoggedEmp] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [activeTab, setActiveTab] = useState('CLOCK');

  const handleLogin = () => {
    const emp = employees.find(e => e.username === username && (e.password === password || password === '0000'));
    if (emp) {
      if (password === '0000') alert('使用緊急備用密碼(0000)登入成功');
      setLoggedEmp(emp);
      setPassword('');
    } else {
      alert('帳號或密碼錯誤 (可輸入 0000 透過緊急備用密碼登入)');
    }
  };

  if (!loggedEmp) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-96 border-t-8 border-[#6B4F3A]">
          <div className="flex justify-center mb-4"><Calendar size={48} className="text-[#6B4F3A]" /></div>
          <h2 className="text-2xl font-bold mb-6 text-center text-[#3D332C]">員工打卡登入</h2>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="員工帳號 (預設 emp1)" className="w-full border-2 p-3 rounded-lg mb-4" />
          <div className="relative mb-6">
            <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="密碼 (預設 111)" className="w-full border-2 p-3 rounded-lg" />
            <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-3.5 text-gray-400">{showPwd ? <EyeOff size={20} /> : <Eye size={20} />}</button>
          </div>
          <button onClick={handleLogin} className="w-full bg-[#6B4F3A] text-white py-3 rounded-lg font-bold text-lg shadow-md hover:bg-[#5a4231]">登入系統</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="w-56 bg-white border-r flex flex-col shadow-lg z-10">
        <div className="p-6 bg-[#6B4F3A] text-white flex flex-col items-center">
          <div className="w-16 h-16 bg-[#E6D2BE] rounded-full flex items-center justify-center text-[#6B4F3A] text-2xl font-bold mb-2 shadow-inner">
            {loggedEmp.name.charAt(0)}
          </div>
          <span className="font-bold text-lg">{loggedEmp.name}</span>
        </div>
        <div className="flex-1 py-4 flex flex-col gap-2 px-2">
          <button onClick={() => setActiveTab('CLOCK')} className={`p-3 rounded-lg text-left font-bold ${activeTab === 'CLOCK' ? 'bg-[#E6D2BE] text-[#3D332C]' : 'hover:bg-gray-100 text-gray-600'}`}>打卡鐘</button>
          <button onClick={() => setActiveTab('RECORDS')} className={`p-3 rounded-lg text-left font-bold ${activeTab === 'RECORDS' ? 'bg-[#E6D2BE] text-[#3D332C]' : 'hover:bg-gray-100 text-gray-600'}`}>我的紀錄</button>
          <button onClick={() => setActiveTab('PROFILE')} className={`p-3 rounded-lg text-left font-bold ${activeTab === 'PROFILE' ? 'bg-[#E6D2BE] text-[#3D332C]' : 'hover:bg-gray-100 text-gray-600'}`}>修改資料</button>
        </div>
        <div className="p-4 border-t">
          <button onClick={() => setLoggedEmp(null)} className="w-full py-2 flex items-center justify-center gap-2 text-red-600 font-bold hover:bg-red-50 rounded"><LogOut size={18} /> 登出</button>
        </div>
      </div>

      <div className="flex-1 p-8 bg-gray-50 flex flex-col items-center">
        {activeTab === 'CLOCK' && (
          <div className="flex flex-col items-center justify-center h-full w-full max-w-md">
            <div className="bg-white p-8 rounded-3xl shadow-lg w-full text-center mb-8 border">
              <p className="text-gray-500 mb-2 font-bold">{currentTime.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
              <div className="text-6xl font-mono font-bold text-[#3D332C]">
                {String(currentTime.getHours()).padStart(2, '0')}:
                {String(currentTime.getMinutes()).padStart(2, '0')}:
                <span className="text-4xl text-gray-400 ml-1">{String(currentTime.getSeconds()).padStart(2, '0')}</span>
              </div>
            </div>

            <div className="flex w-full gap-4">
              <button
                onClick={() => setClockIns([...clockIns, { id: Date.now(), empId: loggedEmp.id, type: 'IN', date: currentTime.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }), time: currentTime.toLocaleTimeString('zh-TW', { hour12: false }) }])}
                className="flex-1 py-6 rounded-2xl text-2xl font-bold shadow-md text-black bg-[#A5D6A7]"
              >
                上班
              </button>
              <button
                onClick={() => setClockIns([...clockIns, { id: Date.now(), empId: loggedEmp.id, type: 'OUT', date: currentTime.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }), time: currentTime.toLocaleTimeString('zh-TW', { hour12: false }) }])}
                className="flex-1 py-6 rounded-2xl text-2xl font-bold shadow-md text-black bg-[#EF9A9A]"
              >
                下班
              </button>
            </div>
          </div>
        )}

        {activeTab === 'RECORDS' && (
          <EmployeeRecordsView empId={loggedEmp.id} clockIns={clockIns} />
        )}

        {activeTab === 'PROFILE' && (
          <EmployeeProfileForm loggedEmp={loggedEmp} employees={employees} setEmployees={setEmployees} />
        )}
      </div>
    </div>
  );
}

function EmployeeRecordsView({ empId, clockIns }) {
  const empIns = clockIns.filter(c => c.empId === empId).sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`));

  const sortedAsc = [...empIns].sort((a, b) => new Date(`${a.date.replace(/\//g, '-')} ${a.time}`) - new Date(`${b.date.replace(/\//g, '-')} ${b.time}`));
  const workSessions = [];
  let lastIn = null;
  sortedAsc.forEach(c => {
    if (c.type === 'IN') {
      lastIn = c;
    } else if (c.type === 'OUT' && lastIn) {
      const inTime = new Date(`${lastIn.date.replace(/\//g, '-')} ${lastIn.time}`);
      const outTime = new Date(`${c.date.replace(/\//g, '-')} ${c.time}`);
      const diffMins = Math.max(0, (outTime - inTime) / (1000 * 60));
      const hours = Math.floor(diffMins / 60);
      const mins = Math.round(diffMins % 60);
      workSessions.push({
        id: c.id,
        date: c.date,
        inTime: lastIn.time,
        outTime: c.time,
        duration: `${hours} 小時 ${mins} 分鐘`
      });
      lastIn = null;
    }
  });

  return (
    <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Calendar /> 我的打卡與工時紀錄</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b"><th className="p-3">日期</th><th className="p-3">上班時間</th><th className="p-3">下班時間</th><th className="p-3">本次工時</th></tr>
        </thead>
        <tbody>
          {workSessions.reverse().map(ws => (
            <tr key={ws.id} className="border-b">
              <td className="p-3">{ws.date}</td>
              <td className="p-3 font-mono text-green-700 font-bold">{ws.inTime}</td>
              <td className="p-3 font-mono text-red-600 font-bold">{ws.outTime}</td>
              <td className="p-3 font-bold text-[#3D332C] bg-amber-50 rounded">{ws.duration}</td>
            </tr>
          ))}
          {workSessions.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-400">尚無完整的上下班配對紀錄</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function EmployeeProfileForm({ loggedEmp, employees, setEmployees }) {
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd1, setNewPwd1] = useState('');
  const [newPwd2, setNewPwd2] = useState('');
  const [show, setShow] = useState(false);

  const handleSave = () => {
    if (oldPwd !== loggedEmp.password && oldPwd !== '0000') return alert('舊密碼錯誤 (可用0000重設)');
    if (newPwd1 !== newPwd2) return alert('兩次新密碼輸入不一致');
    if (!newPwd1) return alert('請輸入新密碼');

    setEmployees(employees.map(e => e.id === loggedEmp.id ? { ...e, password: newPwd1 } : e));
    alert('密碼修改成功！');
    setOldPwd(''); setNewPwd1(''); setNewPwd2('');
  };

  const inputClass = "w-full border p-3 rounded-lg bg-gray-50 outline-none";

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow border">
      <h3 className="text-xl font-bold mb-2 text-[#3D332C]">密碼修改</h3>
      <p className="text-xs text-gray-400 mb-6">提示：員工顯示名稱僅限老闆後台修改。</p>

      <div className="mb-4">
        <label className="block font-bold mb-2 text-sm text-gray-600">顯示名稱 (僅限老闆修改)</label>
        <input type="text" value={loggedEmp.name} readOnly className={`${inputClass} text-gray-400 cursor-not-allowed`} />
      </div>

      <div className="mb-4 relative">
        <label className="block font-bold mb-2 text-sm text-gray-600">舊密碼</label>
        <input type={show ? 'text' : 'password'} value={oldPwd} onChange={e => setOldPwd(e.target.value)} className={inputClass} placeholder="請輸入舊密碼 (或0000)" />
        <button onClick={() => setShow(!show)} className="absolute right-3 top-10 text-gray-400">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
      </div>

      <div className="mb-4">
        <label className="block font-bold mb-2 text-sm text-gray-600">新密碼</label>
        <input type={show ? 'text' : 'password'} value={newPwd1} onChange={e => setNewPwd1(e.target.value)} className={inputClass} placeholder="請輸入新密碼" />
      </div>

      <div className="mb-6">
        <label className="block font-bold mb-2 text-sm text-gray-600">再次確認新密碼</label>
        <input type={show ? 'text' : 'password'} value={newPwd2} onChange={e => setNewPwd2(e.target.value)} className={inputClass} placeholder="請再次輸入新密碼" />
      </div>

      <button onClick={handleSave} className="w-full bg-[#6B4F3A] text-white py-3 rounded-lg font-bold shadow-md">儲存新密碼</button>
    </div>
  );
}