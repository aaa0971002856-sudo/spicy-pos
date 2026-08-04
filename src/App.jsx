import React, { useState, useEffect } from 'react';
import { 
  Plus, Minus, Trash2, ShoppingCart, DollarSign, Clock, FileText, 
  Settings, TrendingUp, AlertTriangle, UserCheck, Shield, ChevronDown 
} from 'lucide-react';

// ==============================
// 0. 輔助函式與預設資料設定
// ==============================
const CHINESE_NUMBERS = ['第一名', '第二名', '第三名', '第四名', '第五名'];

// 預設菜單資料（僅在第一次開啟、localStorage 完全無資料時作為初始化使用）
const DEFAULT_CATEGORIES = [
  {
    id: 'cat_1',
    name: '主食套餐',
    color: '#E6D2BE',
    items: [
      { id: 'i_101', name: '麻辣鴨血豆腐煲', price: 150 },
      { id: 'i_102', name: '麻辣牛肉鍋', price: 180 },
      { id: 'i_103', name: '麻辣豬肉鍋', price: 170 },
      { id: 'i_104', name: '麻辣海鮮鍋', price: 200 }
    ]
  },
  {
    id: 'cat_2',
    name: '精選單點',
    color: '#F3E5AB',
    items: [
      { id: 'i_201', name: '招牌滷鴨血', price: 50 },
      { id: 'i_202', name: '手工香燉豆腐', price: 50 },
      { id: 'i_203', name: '老油條', price: 40 },
      { id: 'i_204', name: '王子麵', price: 20 }
    ]
  },
  {
    id: 'cat_3',
    name: '飲料與甜品',
    color: '#D4E6B5',
    items: [
      { id: 'i_301', name: '烏梅汁', price: 45 },
      { id: 'i_302', name: '冷泡高山茶', price: 35 }
    ]
  }
];

const DEFAULT_EMPLOYEES = [
  { id: 'emp_1', name: '店長', username: 'manager', password: '123' },
  { id: 'emp_2', name: '店員 A', username: 'staff1', password: '123' }
];

// 自訂 Hook：讓資料連動 localStorage 實現永久儲存
function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(`Error loading localStorage key "${key}":`, e);
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error(`Error setting localStorage key "${key}":`, e);
    }
  }, [key, state]);

  return [state, setState];
}

// ==============================
// 1. 主系統進入點
// ==============================
export default function App() {
  const [currentMode, setCurrentMode] = useState('POS'); // 'POS' | 'ADMIN' | 'CLOCK_IN'
  const [currentTime, setCurrentTime] = useState(new Date());

  // 持久化 State 宣告 (任何修改都會自動寫入瀏覽器 LocalStorage)
  const [categories, setCategories] = useLocalStorageState('pos_categories', DEFAULT_CATEGORIES);
  const [orders, setOrders] = useLocalStorageState('pos_orders', []);
  const [promotions, setPromotions] = useLocalStorageState('pos_promotions', []);
  const [ingredients, setIngredients] = useLocalStorageState('pos_ingredients', [
    { id: 'ing_1', name: '麻辣湯底', stock: 50, safeStock: 10, unit: '份' },
    { id: 'ing_2', name: '鴨血', stock: 100, safeStock: 20, unit: '塊' }
  ]);
  const [expenses, setExpenses] = useLocalStorageState('pos_expenses', []);
  const [closingRecords, setClosingRecords] = useLocalStorageState('pos_closing_records', []);
  const [employees, setEmployees] = useLocalStorageState('pos_employees', DEFAULT_EMPLOYEES);
  const [clockIns, setClockIns] = useLocalStorageState('pos_clock_ins', []);
  const [adminPassword, setAdminPassword] = useLocalStorageState('pos_admin_password', '1234');

  // 即時時間更新
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100 text-gray-800 font-sans select-none overflow-hidden">
      {/* 頂部導覽列 */}
      <header className="bg-[#3D332C] text-white px-6 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-wider text-[#E6D2BE]">餐飲 POS 營運系統</h1>
          <span className="text-xs bg-[#6B4F3A] px-2.5 py-1 rounded-full text-gray-200">
            {currentTime.toLocaleTimeString('zh-TW')}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMode('POS')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
              currentMode === 'POS' ? 'bg-[#8B1E1E] text-white' : 'bg-[#52443B] hover:bg-[#6B4F3A] text-gray-200'
            }`}
          >
            前台點餐
          </button>
          <button
            onClick={() => setCurrentMode('ADMIN')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
              currentMode === 'ADMIN' ? 'bg-[#8B1E1E] text-white' : 'bg-[#52443B] hover:bg-[#6B4F3A] text-gray-200'
            }`}
          >
            後台管理
          </button>
          <button
            onClick={() => setCurrentMode('CLOCK_IN')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
              currentMode === 'CLOCK_IN' ? 'bg-[#8B1E1E] text-white' : 'bg-[#52443B] hover:bg-[#6B4F3A] text-gray-200'
            }`}
          >
            員工打卡
          </button>
        </div>
      </header>

      {/* 主要內容區 */}
      <main className="flex-1 overflow-hidden">
        {currentMode === 'POS' && (
          <PosView 
            categories={categories} 
            promotions={promotions} 
            orders={orders} 
            setOrders={setOrders} 
          />
        )}
        {currentMode === 'ADMIN' && (
          <AdminView
            adminPassword={adminPassword}
            setAdminPassword={setAdminPassword}
            categories={categories}
            setCategories={setCategories}
            orders={orders}
            setOrders={setOrders}
            promotions={promotions}
            setPromotions={setPromotions}
            ingredients={ingredients}
            setIngredients={setIngredients}
            expenses={expenses}
            setExpenses={setExpenses}
            closingRecords={closingRecords}
            setClosingRecords={setClosingRecords}
            employees={employees}
            setEmployees={setEmployees}
            clockIns={clockIns}
          />
        )}
        {currentMode === 'CLOCK_IN' && (
          <EmployeeClockInView
            employees={employees}
            clockIns={clockIns}
            setClockIns={setClockIns}
            currentTime={currentTime}
          />
        )}
      </main>
    </div>
  );
}

// ==============================
// 2. 前台點餐介面 (POS View)
// ==============================
function PosView({ categories, promotions, orders, setOrders }) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [cart, setCart] = useState([]);
  
  // 訂單資訊設定
  const [orderSource, setOrderSource] = useState('內用'); // '內用' | '外帶' | '外送'
  const [tableNo, setTableNo] = useState('1');
  const [subSource, setSubSource] = useState('現場'); // 外帶: 現場/電話/LINE | 外送: Ubereats/Foodpanda
  const [selectedPromoId, setSelectedPromoId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('現金');

  // 切換類別防呆
  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  // 新增至購物車 (支援麻奶選項)
  const addToCart = (item, isMilky = false) => {
    const cartItemId = `${item.id}_${isMilky ? 'milky' : 'normal'}`;
    const itemPrice = isMilky ? item.price + 15 : item.price;
    const itemName = isMilky ? `${item.name} (麻奶)` : item.name;

    const existingIndex = cart.findIndex(c => c.cartItemId === cartItemId);
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].qty += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { cartItemId, id: item.id, name: itemName, price: itemPrice, qty: 1, milky: isMilky }]);
    }
  };

  // 修改數量
  const updateQty = (cartItemId, delta) => {
    setCart(cart.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  // 金額計算
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const selectedPromo = promotions.find(p => p.id === selectedPromoId);
  
  let discountAmount = 0;
  if (selectedPromo) {
    if (selectedPromo.type === 'amount') {
      discountAmount = selectedPromo.value;
    } else if (selectedPromo.type === 'percent') {
      discountAmount = Math.round(subtotal * (selectedPromo.value / 100));
    }
  }
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // 送出訂單結帳
  const handleCheckout = () => {
    if (cart.length === 0) return alert('購物車內無商品！');

    const newOrder = {
      id: `ORD_${Date.now()}`,
      date: new Date().toLocaleDateString('zh-TW'),
      time: new Date().toLocaleTimeString('zh-TW'),
      source: orderSource,
      subSource: orderSource === '內用' ? `桌號: ${tableNo}` : subSource,
      items: cart,
      subtotal,
      discount: discountAmount,
      total: finalTotal,
      paymentMethod
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    alert(`送單成功！金額: $${finalTotal}`);
  };

  const activeCategory = categories.find(c => c.id === selectedCategory);

  return (
    <div className="h-full flex overflow-hidden">
      {/* 左側：分類與品項選擇區 */}
      <div className="flex-1 flex flex-col bg-gray-50 border-r border-gray-200">
        {/* 分類 Tab 標籤 */}
        <div className="flex overflow-x-auto p-3 bg-white border-b gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-3 rounded-xl font-bold whitespace-nowrap text-sm transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#6B4F3A] text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name} ({cat.items.length})
            </button>
          ))}
        </div>

        {/* 品項卡片區 */}
        <div className="flex-1 p-4 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 align-content-start">
          {activeCategory?.items.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <h3 className="font-bold text-gray-800 text-base">{item.name}</h3>
                <p className="text-[#8B1E1E] font-bold text-lg mt-1">${item.price}</p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => addToCart(item, false)}
                  className="bg-[#6B4F3A] text-white py-2 rounded-lg text-xs font-bold hover:bg-[#52443B] active:scale-95"
                >
                  原味
                </button>
                <button
                  onClick={() => addToCart(item, true)}
                  className="bg-[#8B1E1E] text-white py-2 rounded-lg text-xs font-bold hover:bg-red-900 active:scale-95"
                >
                  麻奶(+15)
                </button>
              </div>
            </div>
          ))}
          {(!activeCategory || activeCategory.items.length === 0) && (
            <div className="col-span-full text-center text-gray-400 py-12">此分類暫無商品</div>
          )}
        </div>
      </div>

      {/* 右側：購物車與結帳區 */}
      <div className="w-96 bg-white flex flex-col shadow-xl z-10 border-l">
        {/* 訂單設定屬性 */}
        <div className="p-4 bg-gray-50 border-b space-y-3">
          <div className="flex gap-2">
            {['內用', '外帶', '外送'].map(src => (
              <button
                key={src}
                onClick={() => {
                  setOrderSource(src);
                  if (src === '外帶') setSubSource('現場');
                  if (src === '外送') setSubSource('Ubereats');
                }}
                className={`flex-1 py-2 rounded-lg font-bold text-sm ${
                  orderSource === src ? 'bg-[#8B1E1E] text-white' : 'bg-white border text-gray-700'
                }`}
              >
                {src}
              </button>
            ))}
          </div>

          {/* 子選項 */}
          {orderSource === '內用' && (
            <div className="flex items-center justify-between bg-white p-2 rounded border text-sm">
              <span className="font-bold text-gray-600">桌號選擇：</span>
              <input
                type="text"
                value={tableNo}
                onChange={e => setTableNo(e.target.value)}
                className="w-16 border rounded px-2 py-1 text-center font-bold bg-white"
              />
            </div>
          )}
          {orderSource === '外帶' && (
            <div className="flex gap-2">
              {['現場', '電話', 'LINE'].map(sub => (
                <button
                  key={sub}
                  onClick={() => setSubSource(sub)}
                  className={`flex-1 py-1 rounded text-xs font-bold ${
                    subSource === sub ? 'bg-[#6B4F3A] text-white' : 'bg-white border text-gray-600'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
          {orderSource === '外送' && (
            <div className="flex gap-2">
              {['Ubereats', 'Foodpanda'].map(sub => (
                <button
                  key={sub}
                  onClick={() => setSubSource(sub)}
                  className={`flex-1 py-1 rounded text-xs font-bold ${
                    subSource === sub ? 'bg-[#6B4F3A] text-white' : 'bg-white border text-gray-600'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 購物車品項列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.map(item => (
            <div key={item.cartItemId} className="flex justify-between items-center border-b pb-2">
              <div className="flex-1">
                <p className="font-bold text-sm text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">${item.price} x {item.qty} = ${item.price * item.qty}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item.cartItemId, -1)} className="p-1 bg-gray-100 rounded hover:bg-gray-200">
                  <Minus size={14} />
                </button>
                <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                <button onClick={() => updateQty(item.cartItemId, 1)} className="p-1 bg-gray-100 rounded hover:bg-gray-200">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="h-full flex flex-col justify-center items-center text-gray-400">
              <ShoppingCart size={40} className="mb-2 opacity-30" />
              <p className="text-sm">尚未選購商品</p>
            </div>
          )}
        </div>

        {/* 結帳資訊面板 */}
        <div className="p-4 bg-gray-50 border-t space-y-3">
          {/* 優惠選擇 */}
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-gray-600">折扣套用：</span>
            <select
              value={selectedPromoId}
              onChange={e => setSelectedPromoId(e.target.value)}
              className="border p-1 rounded bg-white text-xs font-medium"
            >
              <option value="">-- 無優惠 --</option>
              {promotions.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* 付款方式 */}
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-gray-600">支付方式：</span>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              className="border p-1 rounded bg-white text-xs font-medium"
            >
              <option value="現金">現金 Cash</option>
              <option value="LINE Pay">LINE Pay</option>
              <option value="信用卡">信用卡 Credit Card</option>
            </select>
          </div>

          <div className="space-y-1 text-right pt-2 border-t">
            <p className="text-xs text-gray-500">小計: ${subtotal}</p>
            {discountAmount > 0 && <p className="text-xs text-red-600 font-bold">折扣: -${discountAmount}</p>}
            <p className="text-2xl font-bold text-[#8B1E1E]">總計: ${finalTotal}</p>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-[#8B1E1E] text-white py-3 rounded-xl font-bold text-base shadow hover:bg-red-900 active:scale-98 transition"
          >
            確認結帳送單
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================
// 3. 後台管理系統控制總樞 (Admin View)
// ==============================
function AdminView(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState('DASHBOARD');

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === props.adminPassword) {
      setIsAuthenticated(true);
    } else {
      alert('管理員密碼錯誤！');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 p-6">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-80 space-y-4 border">
          <div className="text-center text-[#3D332C]">
            <Shield size={40} className="mx-auto mb-2 text-[#8B1E1E]" />
            <h2 className="text-xl font-bold">後台管理員驗證</h2>
          </div>
          <input
            type="password"
            placeholder="請輸入後台密碼"
            value={passwordInput}
            onChange={e => setPasswordInput(e.target.value)}
            className="w-full border p-3 rounded-lg text-center tracking-widest text-lg bg-white"
          />
          <button type="submit" className="w-full bg-[#6B4F3A] text-white py-3 rounded-lg font-bold">
            登入後台
          </button>
        </form>
      </div>
    );
  }

  const menuNav = [
    { id: 'DASHBOARD', name: '營運概況' },
    { id: 'REPORTS', name: '營收報表' },
    { id: 'MENU', name: '菜單管理' },
    { id: 'PROMO', name: '優惠設定' },
    { id: 'INVENTORY', name: '庫存管理' },
    { id: 'EXPENSE', name: '營業記帳' },
    { id: 'CLOSING', name: '每日關帳' },
    { id: 'HISTORY', name: '歷史訂單' },
    { id: 'EMPLOYEE', name: '員工考勤' },
    { id: 'SETTINGS', name: '系統設定' }
  ];

  return (
    <div className="h-full flex bg-gray-100 overflow-hidden">
      {/* 後台側邊選單 */}
      <div className="w-56 bg-[#3D332C] text-white flex flex-col p-3 space-y-1">
        <div className="p-3 font-bold text-gray-300 border-b border-gray-700 mb-2">管理選單</div>
        {menuNav.map(nav => (
          <button
            key={nav.id}
            onClick={() => setActiveTab(nav.id)}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition ${
              activeTab === nav.id ? 'bg-[#8B1E1E] text-white' : 'hover:bg-[#52443B] text-gray-300'
            }`}
          >
            {nav.name}
          </button>
        ))}
      </div>

      {/* 後台模組內容 */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'DASHBOARD' && <AdminDashboard orders={props.orders} />}
        {activeTab === 'REPORTS' && <AdminReports orders={props.orders} />}
        {activeTab === 'MENU' && <AdminMenuManager categories={props.categories} setCategories={props.setCategories} />}
        {activeTab === 'PROMO' && <AdminPromoManager promotions={props.promotions} setPromotions={props.setPromotions} />}
        {activeTab === 'INVENTORY' && <AdminInventoryManager ingredients={props.ingredients} setIngredients={props.setIngredients} />}
        {activeTab === 'EXPENSE' && <AdminExpenseManager expenses={props.expenses} setExpenses={props.setExpenses} />}
        {activeTab === 'CLOSING' && <AdminClosingManager orders={props.orders} expenses={props.expenses} closingRecords={props.closingRecords} setClosingRecords={props.setClosingRecords} />}
        {activeTab === 'HISTORY' && <AdminHistory orders={props.orders} setOrders={props.setOrders} />}
        {activeTab === 'EMPLOYEE' && <AdminEmployeeManager employees={props.employees} setEmployees={props.setEmployees} clockIns={props.clockIns} />}
        {activeTab === 'SETTINGS' && <AdminSettings adminPassword={props.adminPassword} setAdminPassword={props.setAdminPassword} />}
      </div>
    </div>
  );
}

// ==============================
// 4. 後台各模組詳細實作
// ==============================

// 4.1 營運儀表板
function AdminDashboard({ orders }) {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const itemCounts = {};
  orders.forEach(o => {
    o.items?.forEach(i => {
      itemCounts[i.name] = (itemCounts[i.name] || 0) + i.qty;
    });
  });
  const topItems = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C]">營運概況</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow border flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">總營業額</p>
            <p className="text-3xl font-bold text-[#8B1E1E] mt-1">${totalRevenue}</p>
          </div>
          <div className="p-3 bg-red-50 text-[#8B1E1E] rounded-full"><DollarSign size={28}/></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">總訂單數</p>
            <p className="text-3xl font-bold text-[#6B4F3A] mt-1">{totalOrders} 筆</p>
          </div>
          <div className="p-3 bg-amber-50 text-[#6B4F3A] rounded-full"><FileText size={28}/></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">平均客單價</p>
            <p className="text-3xl font-bold text-emerald-700 mt-1">${avgOrderValue}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-full"><TrendingUp size={28}/></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border">
        <h3 className="text-lg font-bold text-[#3D332C] mb-4">熱銷商品 Top 5</h3>
        {topItems.length > 0 ? (
          <div className="space-y-3">
            {topItems.map(([name, count], idx) => (
              <div key={name} className="flex justify-between items-center border-b pb-2 last:border-0">
                <span className="font-medium text-gray-700">
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold mr-2">
                    {CHINESE_NUMBERS[idx] || `第${idx + 1}名`}
                  </span>
                  {name}
                </span>
                <span className="font-bold text-[#8B1E1E]">{count} 份</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">尚無銷售紀錄</p>
        )}
      </div>
    </div>
  );
}

// 4.2 多維度報表
function AdminReports({ orders }) {
  const sourceStats = orders.reduce((acc, o) => {
    const key = o.subSource ? `${o.source} (${o.subSource})` : o.source;
    acc[key] = (acc[key] || 0) + o.total;
    return acc;
  }, {});

  const paymentStats = orders.reduce((acc, o) => {
    acc[o.paymentMethod] = (acc[o.paymentMethod] || 0) + o.total;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C]">多維度分析報表</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-bold mb-4 text-[#3D332C]">訂單來源營收分析</h3>
          {Object.keys(sourceStats).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(sourceStats).map(([src, amount]) => (
                <div key={src} className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-700 font-medium">{src}</span>
                  <span className="font-bold text-[#8B1E1E]">${amount}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400 text-sm">尚無數據</p>}
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-bold mb-4 text-[#3D332C]">支付方式營收分析</h3>
          {Object.keys(paymentStats).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(paymentStats).map(([pay, amount]) => (
                <div key={pay} className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-700 font-medium">{pay}</span>
                  <span className="font-bold text-emerald-700">${amount}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400 text-sm">尚無數據</p>}
        </div>
      </div>
    </div>
  );
}

// 4.3 菜單管理
function AdminMenuManager({ categories, setCategories }) {
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState(null);

  const [newItem, setNewItem] = useState({ name: '', price: '' });

  const addCategory = () => {
    if (!newCatName.trim()) return;
    setCategories([...categories, { id: `cat_${Date.now()}`, name: newCatName, color: '#E6D2BE', items: [] }]);
    setNewCatName('');
  };

  const deleteCategory = (id) => {
    if (confirm('確定要刪除此分類及其下方所有品項嗎？')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const addItem = (catId) => {
    if (!newItem.name || !newItem.price) return alert('請填寫完整品項名稱與價格');
    setCategories(categories.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          items: [...c.items, { id: `item_${Date.now()}`, name: newItem.name, price: Number(newItem.price) }]
        };
      }
      return c;
    }));
    setNewItem({ name: '', price: '' });
  };

  const deleteItem = (catId, itemId) => {
    setCategories(categories.map(c => {
      if (c.id === catId) {
        return { ...c, items: c.items.filter(i => i.id !== itemId) };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C]">菜單品項管理</h2>
      
      {/* 新增分類 */}
      <div className="bg-white p-4 rounded-xl shadow border flex gap-3">
        <input 
          type="text" 
          placeholder="輸入新分類名稱..." 
          value={newCatName} 
          onChange={e => setNewCatName(e.target.value)} 
          className="border p-2 rounded flex-1 text-sm bg-white"
        />
        <button onClick={addCategory} className="bg-[#6B4F3A] text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-1">
          <Plus size={16}/> 新增分類
        </button>
      </div>

      {/* 分類與品項列表 */}
      <div className="space-y-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white p-5 rounded-xl shadow border">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <span className="font-bold text-lg text-[#3D332C]">{cat.name} ({cat.items.length} 項)</span>
              <button onClick={() => deleteCategory(cat.id)} className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1">
                <Trash2 size={16}/> 刪除分類
              </button>
            </div>

            {/* 品項清單 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {cat.items.map(item => (
                <div key={item.id} className="flex justify-between items-center border p-3 rounded-lg bg-gray-50">
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#8B1E1E]">${item.price}</span>
                    <button onClick={() => deleteItem(cat.id, item.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 新增品項輸入區 */}
            <div className="flex gap-2 pt-2 border-t">
              <input 
                type="text" 
                placeholder="品項名稱" 
                value={editingCatId === cat.id ? newItem.name : ''} 
                onFocus={() => setEditingCatId(cat.id)}
                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                className="border p-2 rounded text-sm flex-1 bg-white" 
              />
              <input 
                type="number" 
                placeholder="價格" 
                value={editingCatId === cat.id ? newItem.price : ''} 
                onFocus={() => setEditingCatId(cat.id)}
                onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                className="border p-2 rounded text-sm w-24 bg-white" 
              />
              <button onClick={() => addItem(cat.id)} className="bg-emerald-700 text-white px-3 py-2 rounded text-sm font-bold">
                新增品項
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4.4 優惠設定
function AdminPromoManager({ promotions, setPromotions }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('amount');
  const [value, setValue] = useState('');

  const addPromo = () => {
    if (!name || !value) return alert('請填寫完整資訊');
    setPromotions([...promotions, { id: `p_${Date.now()}`, name, type, value: Number(value) }]);
    setName(''); setValue('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C]">優惠活動管理</h2>
      <div className="bg-white p-4 rounded-xl shadow border flex gap-3 items-center">
        <input type="text" placeholder="優惠名稱" value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded text-sm flex-1 bg-white"/>
        <select value={type} onChange={e => setType(e.target.value)} className="border p-2 rounded text-sm bg-white">
          <option value="amount">定額折抵 ($)</option>
          <option value="percent">折扣比例 (%)</option>
        </select>
        <input type="number" placeholder="數值" value={value} onChange={e => setValue(e.target.value)} className="border p-2 rounded text-sm w-28 bg-white"/>
        <button onClick={addPromo} className="bg-[#6B4F3A] text-white px-4 py-2 rounded font-bold text-sm">新增優惠</button>
      </div>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 border-b font-bold text-gray-700">
            <tr>
              <th className="p-4">優惠名稱</th>
              <th className="p-4">類型</th>
              <th className="p-4">折抵數值</th>
              <th className="p-4">操作</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map(p => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="p-4 font-bold">{p.name}</td>
                <td className="p-4">{p.type === 'amount' ? '定額折抵' : '折扣比例'}</td>
                <td className="p-4 font-bold text-[#8B1E1E]">{p.type === 'amount' ? `-$${p.value}` : `-${p.value}%`}</td>
                <td className="p-4">
                  <button onClick={() => setPromotions(promotions.filter(x => x.id !== p.id))} className="text-red-500 hover:underline">刪除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 4.5 進貨與庫存
function AdminInventoryManager({ ingredients, setIngredients }) {
  const [ingName, setIngName] = useState('');
  const [stock, setStock] = useState('');
  const [safeStock, setSafeStock] = useState('');

  const addIngredient = () => {
    if (!ingName || !stock) return alert('請輸入食材名稱與庫存');
    setIngredients([...ingredients, {
      id: `ing_${Date.now()}`,
      name: ingName,
      stock: Number(stock),
      safeStock: Number(safeStock || 5),
      unit: '份'
    }]);
    setIngName(''); setStock(''); setSafeStock('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C]">食材與庫存管理</h2>
      <div className="bg-white p-4 rounded-xl shadow border flex gap-3">
        <input type="text" placeholder="食材名稱" value={ingName} onChange={e => setIngName(e.target.value)} className="border p-2 rounded text-sm flex-1 bg-white"/>
        <input type="number" placeholder="初始庫存" value={stock} onChange={e => setStock(e.target.value)} className="border p-2 rounded text-sm w-28 bg-white"/>
        <input type="number" placeholder="安全庫存量" value={safeStock} onChange={e => setSafeStock(e.target.value)} className="border p-2 rounded text-sm w-28 bg-white"/>
        <button onClick={addIngredient} className="bg-[#6B4F3A] text-white px-4 py-2 rounded font-bold text-sm">新增食材</button>
      </div>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 border-b font-bold text-gray-700">
            <tr>
              <th className="p-4">食材名稱</th>
              <th className="p-4">目前庫存</th>
              <th className="p-4">安全庫存水位</th>
              <th className="p-4">狀態</th>
              <th className="p-4">庫存微調</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map(ing => {
              const isLow = ing.stock <= ing.safeStock;
              return (
                <tr key={ing.id} className="border-b last:border-0">
                  <td className="p-4 font-bold">{ing.name}</td>
                  <td className="p-4 font-bold text-lg">{ing.stock}</td>
                  <td className="p-4 text-gray-500">{ing.safeStock}</td>
                  <td className="p-4">
                    {isLow ? (
                      <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max">
                        <AlertTriangle size={12}/> 庫存偏低
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold w-max block">正常</span>
                    )}
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => setIngredients(ingredients.map(i => i.id === ing.id ? { ...i, stock: i.stock + 1 } : i))} className="bg-gray-200 px-3 py-1 rounded font-bold hover:bg-gray-300">+</button>
                    <button onClick={() => setIngredients(ingredients.map(i => i.id === ing.id ? { ...i, stock: Math.max(0, i.stock - 1) } : i))} className="bg-gray-200 px-3 py-1 rounded font-bold hover:bg-gray-300">-</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 4.6 記帳管理
function AdminExpenseManager({ expenses, setExpenses }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('進貨');

  const addExpense = () => {
    if (!title || !amount) return alert('請填寫完整資訊');
    setExpenses([...expenses, {
      id: `exp_${Date.now()}`,
      date: new Date().toLocaleDateString('zh-TW'),
      title,
      category,
      amount: Number(amount)
    }]);
    setTitle(''); setAmount('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C]">營業支出記帳</h2>
      <div className="bg-white p-4 rounded-xl shadow border flex gap-3">
        <input type="text" placeholder="支出項目描述" value={title} onChange={e => setTitle(e.target.value)} className="border p-2 rounded text-sm flex-1 bg-white"/>
        <select value={category} onChange={e => setCategory(e.target.value)} className="border p-2 rounded text-sm bg-white">
          <option value="進貨">進貨採購</option>
          <option value="水電">水電雜費</option>
          <option value="房租">門市房租</option>
          <option value="薪資">員工薪資</option>
          <option value="其他">其他雜項</option>
        </select>
        <input type="number" placeholder="金額" value={amount} onChange={e => setAmount(e.target.value)} className="border p-2 rounded text-sm w-32 bg-white"/>
        <button onClick={addExpense} className="bg-[#6B4F3A] text-white px-4 py-2 rounded font-bold text-sm">新增紀錄</button>
      </div>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 border-b font-bold text-gray-700">
            <tr>
              <th className="p-4">日期</th>
              <th className="p-4">項目描述</th>
              <th className="p-4">類別</th>
              <th className="p-4">金額</th>
              <th className="p-4">操作</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr key={exp.id} className="border-b last:border-0">
                <td className="p-4 text-gray-500">{exp.date}</td>
                <td className="p-4 font-bold">{exp.title}</td>
                <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{exp.category}</span></td>
                <td className="p-4 font-bold text-red-600">${exp.amount}</td>
                <td className="p-4">
                  <button onClick={() => setExpenses(expenses.filter(e => e.id !== exp.id))} className="text-red-500 hover:underline">刪除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 4.7 每日關帳作業
function AdminClosingManager({ orders, expenses, closingRecords, setClosingRecords }) {
  const totalIncome = orders.reduce((sum, o) => sum + o.total, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const handleClosing = () => {
    if (confirm('確定要執行今日關帳結算嗎？')) {
      const record = {
        id: `close_${Date.now()}`,
        date: new Date().toLocaleDateString('zh-TW'),
        time: new Date().toLocaleTimeString('zh-TW'),
        income: totalIncome,
        expense: totalExpense,
        netProfit,
        orderCount: orders.length
      };
      setClosingRecords([record, ...closingRecords]);
      alert('關帳作業完成！');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C]">每日關帳與損益結算</h2>
      
      <div className="bg-white p-6 rounded-xl shadow border space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700 font-medium">本日總營業額</p>
            <p className="text-2xl font-bold text-green-800 mt-1">${totalIncome}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-700 font-medium">本日總支出</p>
            <p className="text-2xl font-bold text-red-800 mt-1">${totalExpense}</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="text-sm text-amber-700 font-medium">本日淨利</p>
            <p className="text-2xl font-bold text-amber-900 mt-1">${netProfit}</p>
          </div>
        </div>
        
        <button onClick={handleClosing} className="w-full bg-[#8B1E1E] text-white py-3 rounded-xl font-bold text-lg shadow hover:bg-red-900">
          執行本日關帳作業
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border p-6">
        <h3 className="text-lg font-bold mb-4 text-[#3D332C]">歷史關帳紀錄</h3>
        <div className="space-y-3">
          {closingRecords.map(rec => (
            <div key={rec.id} className="flex justify-between items-center border-b pb-3 last:border-0 text-sm">
              <div>
                <p className="font-bold text-[#3D332C]">{rec.date} {rec.time}</p>
                <p className="text-xs text-gray-500">共 {rec.orderCount} 筆訂單</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-700">淨利: ${rec.netProfit}</p>
                <p className="text-xs text-gray-500">營收: ${rec.income} / 支出: ${rec.expense}</p>
              </div>
            </div>
          ))}
          {closingRecords.length === 0 && <p className="text-gray-400 text-sm">暫無關帳紀錄</p>}
        </div>
      </div>
    </div>
  );
}

// 4.8 歷史訂單
function AdminHistory({ orders, setOrders }) {
  const deleteOrder = (id) => {
    if (confirm('確定要作廢此筆訂單嗎？')) {
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C]">歷史訂單紀錄</h2>
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 border-b font-bold text-gray-700">
            <tr>
              <th className="p-4">訂單號</th>
              <th className="p-4">時間</th>
              <th className="p-4">來源</th>
              <th className="p-4">品項明細</th>
              <th className="p-4">金額</th>
              <th className="p-4">付款方式</th>
              <th className="p-4">操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-mono font-bold text-gray-600">{o.id}</td>
                <td className="p-4 text-xs text-gray-500">{o.date} {o.time}</td>
                <td className="p-4"><span className="bg-gray-200 px-2 py-0.5 rounded text-xs">{o.subSource ? `${o.source}(${o.subSource})` : o.source}</span></td>
                <td className="p-4 text-xs">
                  {o.items?.map(i => `${i.name}${i.milky ? '(麻奶)' : ''} x${i.qty}`).join(', ')}
                </td>
                <td className="p-4 font-bold text-[#8B1E1E]">${o.total}</td>
                <td className="p-4 font-medium">{o.paymentMethod}</td>
                <td className="p-4">
                  <button onClick={() => deleteOrder(o.id)} className="text-red-500 hover:underline">作廢</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-gray-400">目前尚無歷史訂單</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 4.9 員工與打卡管理
function AdminEmployeeManager({ employees, setEmployees, clockIns }) {
  const [empName, setEmpName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const addEmployee = () => {
    if (!empName || !username || !password) return alert('請填寫完整員工資訊');
    setEmployees([...employees, { id: `emp_${Date.now()}`, name: empName, username, password }]);
    setEmpName(''); setUsername(''); setPassword('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C]">員工與打卡管理</h2>
      
      {/* 新增員工 */}
      <div className="bg-white p-4 rounded-xl shadow border flex gap-3">
        <input type="text" placeholder="員工姓名" value={empName} onChange={e => setEmpName(e.target.value)} className="border p-2 rounded text-sm flex-1 bg-white"/>
        <input type="text" placeholder="帳號" value={username} onChange={e => setUsername(e.target.value)} className="border p-2 rounded text-sm flex-1 bg-white"/>
        <input type="password" placeholder="密碼" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 rounded text-sm flex-1 bg-white"/>
        <button onClick={addEmployee} className="bg-[#6B4F3A] text-white px-4 py-2 rounded font-bold text-sm">新增員工</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 員工名單 */}
        <div className="bg-white p-5 rounded-xl shadow border">
          <h3 className="font-bold text-lg mb-4 text-[#3D332C]">員工列表</h3>
          <div className="space-y-2">
            {employees.map(e => (
              <div key={e.id} className="flex justify-between items-center border-b pb-2">
                <span className="font-bold text-gray-800">{e.name} <span className="text-xs text-gray-400">({e.username})</span></span>
                <button onClick={() => setEmployees(employees.filter(x => x.id !== e.id))} className="text-red-500 text-sm">刪除</button>
              </div>
            ))}
          </div>
        </div>

        {/* 打卡紀錄 */}
        <div className="bg-white p-5 rounded-xl shadow border">
          <h3 className="font-bold text-lg mb-4 text-[#3D332C]">打卡紀錄</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {clockIns.map(c => (
              <div key={c.id} className="flex justify-between items-center border-b pb-2 text-sm">
                <span className="font-medium text-gray-700">{c.employeeName}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${c.type === '上班' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{c.type}</span>
                <span className="text-gray-400 text-xs">{c.time}</span>
              </div>
            ))}
            {clockIns.length === 0 && <p className="text-gray-400 text-sm">尚無打卡紀錄</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// 4.10 系統設定
function AdminSettings({ adminPassword, setAdminPassword }) {
  const [newPwd, setNewPwd] = useState('');

  const updatePassword = () => {
    if (!newPwd.trim()) return alert('請輸入新密碼');
    setAdminPassword(newPwd);
    setNewPwd('');
    alert('後台管理密碼修改成功！');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C]">系統安全設定</h2>
      <div className="bg-white p-6 rounded-xl shadow border max-w-md space-y-4">
        <h3 className="text-lg font-bold text-[#3D332C]">修改老闆登入密碼</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">目前密碼</label>
          <input type="text" disabled value={adminPassword} className="w-full border p-2 rounded bg-gray-100 text-gray-500"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">新密碼</label>
          <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="輸入新密碼..." className="w-full border p-2 rounded bg-white"/>
        </div>
        <button onClick={updatePassword} className="w-full bg-[#6B4F3A] text-white py-2 rounded font-bold shadow">
          儲存變更
        </button>
      </div>
    </div>
  );
}

// ==============================
// 5. 員工打卡介面 (Clock-In View)
// ==============================
function EmployeeClockInView({ employees, clockIns, setClockIns, currentTime }) {
  const [selectedEmp, setSelectedEmp] = useState('');
  const [empPwd, setEmpPwd] = useState('');

  const handleClock = (type) => {
    const emp = employees.find(e => e.id === selectedEmp);
    if (!emp) return alert('請選擇員工');
    if (emp.password !== empPwd && empPwd !== '0000') return alert('密碼錯誤 (緊急備用密碼: 0000)');

    const record = {
      id: `clk_${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.name,
      type,
      time: currentTime.toLocaleString('zh-TW')
    };

    setClockIns([record, ...clockIns]);
    setEmpPwd('');
    alert(`${emp.name} ${type}打卡成功！`);
  };

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 border-t-8 border-[#6B4F3A] space-y-6 text-center">
        <div className="flex justify-center items-center gap-2 text-[#6B4F3A] font-bold text-xl">
          <Clock size={28}/> 員工考勤打卡
        </div>

        <div className="text-2xl font-mono font-bold text-gray-700 bg-gray-50 py-3 rounded-xl border">
          {currentTime.toLocaleTimeString('zh-TW')}
        </div>

        <div className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">選擇員工</label>
            <select value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)} className="w-full border p-3 rounded-xl text-base bg-white font-medium">
              <option value="">-- 請選擇名字 --</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">員工密碼</label>
            <input 
              type="password" 
              placeholder="請輸入密碼" 
              value={empPwd} 
              onChange={e => setEmpPwd(e.target.value)} 
              className="w-full border p-3 rounded-xl text-center tracking-widest text-lg bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <button onClick={() => handleClock('上班')} className="bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow active:scale-95">
            上班打卡
          </button>
          <button onClick={() => handleClock('下班')} className="bg-amber-600 text-white py-4 rounded-xl font-bold text-lg shadow active:scale-95">
            下班打卡
          </button>
        </div>
      </div>
    </div>
  );
}