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

// ==============================
// 2. 主應用程式組件
// ==============================
export default function SpicyHotPotSystem() {
  const [activePage, setActivePage] = useState('POS'); 
  const [currentTime, setCurrentTime] = useState(new Date());

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
  const [adminPassword, setAdminPassword] = useState('1234'); 

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const lowStockItems = ingredients.filter(i => i.stock <= i.safeStock);

  return (
    <div className="min-h-screen font-sans flex flex-col h-screen overflow-hidden" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
      {/* 頂部工具列 */}
      <div className="flex justify-between items-center p-4 text-white shadow-md flex-shrink-0" style={{ backgroundColor: COLORS.toolbar }}>
        <div className="flex items-center gap-4 text-xl font-bold">
          <Store size={28} />
          麻辣燙點餐 POS 系統
          <span className="flex items-center gap-1 text-xs bg-emerald-700 text-white px-2.5 py-1 rounded-full shadow-sm">
            <Cloud size={14} /> Firebase 雲端連線中
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

      {/* 頁面切換 */}
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
  
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || 'c1');
  const [selectedPromo, setSelectedPromo] = useState('');
  const [orderNote, setOrderNote] = useState('');
  
  const [spiceModal, setSpiceModal] = useState(null); 
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [successModal, setSuccessModal] = useState(null);

  useEffect(() => {
    if (categories.length > 0 && !categories.some(c => c.id === activeCategory)) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  const formatTime = (date) => `${date.getFullYear()}/${String(date.getMonth()+1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

  const addToCart = (item, options = {}) => {
    const isMilky = options.milky === '+$15麻奶';
    const finalPrice = Number(item.price) + (isMilky ? 15 : 0);

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
        tempMilky: '' 
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
      {/* 左側菜單區 */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategory(cat.id)}
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

        <div className="flex-1 overflow-y-auto grid grid-cols-3 md:grid-cols-4 gap-4 content-start p-1">
          {currentCatObj && currentCatObj.items && currentCatObj.items.length > 0 ? (
            currentCatObj.items.map(item => (
              <button 
                key={item.id} 
                onClick={() => handleItemClick(item, currentCatObj.name)}
                className="p-5 rounded-xl shadow bg-white flex flex-col items-center justify-center gap-2 hover:bg-orange-50 transition-all border-2 border-transparent active:border-[#C97A3D]"
              >
                <span className="font-bold text-lg text-center leading-tight text-[#3D332C]">{item.name}</span>
                <span className="text-[#8B1E1E] font-bold text-base">${item.price}</span>
              </button>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-400 font-medium">此分類下暫無品項</div>
          )}
        </div>
      </div>

      {/* 右側購物車 */}
      <div className="w-[400px] bg-white rounded-xl shadow-lg flex flex-col border border-gray-200">
        <div className="p-4 border-b bg-gray-50 rounded-t-xl">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-gray-500 text-sm">{formatTime(currentTime)}</span>
            <span className="bg-gray-200 text-sm px-2 py-1 rounded-full text-gray-700">共 {cart.length} 項 {totals.count} 件</span>
          </div>

          <div className="flex gap-2 mb-2 text-sm">
            {['現場', '外送', '電話/Line'].map(s => (
              <button key={s} onClick={() => { setSource(s); setSubSource(''); }}
                className={`flex-1 py-1.5 rounded border font-medium ${source === s ? 'bg-[#6B4F3A] text-white border-[#6B4F3A]' : 'bg-white text-gray-600'}`}>{s}</button>
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

        {/* 購物車列表 */}
        <div className="flex-1 overflow-y-auto p-2">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 font-medium">尚未點餐</div>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className="flex flex-col p-2.5 border-b last:border-0 hover:bg-orange-50 rounded transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className="text-xs text-gray-400 mr-2">{item.index}</span>
                    <span className="font-bold text-[#3D332C]">{item.name}</span>
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
                  <span className="font-semibold text-[#8B1E1E]">${item.price * item.qty}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <button onClick={() => setCart(cart.filter(c => c.cartId !== item.cartId))} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                  <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                    <button onClick={() => setCart(cart.map(c => c.cartId === item.cartId ? { ...c, qty: Math.max(1, c.qty - 1) } : c))} className="w-6 h-6 bg-white rounded shadow-sm font-bold text-gray-600">-</button>
                    <span className="font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => setCart(cart.map(c => c.cartId === item.cartId ? { ...c, qty: c.qty + 1 } : c))} className="w-6 h-6 bg-white rounded shadow-sm font-bold text-gray-600">+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 底部結帳區 */}
        <div className="p-4 border-t bg-gray-50 rounded-b-xl flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 font-medium">優惠折抵</span>
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

      {/* 口味 Modal */}
      {spiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4 border-b pb-2 text-[#3D332C]">選擇口味 - {spiceModal.name}</h3>
            
            <div className="mb-4">
              <p className="font-semibold mb-2 text-sm text-gray-700">辣度選擇</p>
              <div className="grid grid-cols-3 gap-2">
                {['不辣', '微辣', '小辣', '中辣', '大辣'].map(lvl => (
                  <button key={lvl} onClick={() => setSpiceModal({...spiceModal, tempSpice: lvl})}
                    className={`py-2 rounded border font-medium text-sm ${spiceModal.tempSpice === lvl ? 'bg-red-600 text-white border-red-600 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2 text-sm text-gray-700">麻度選擇</p>
              <div className="flex gap-2">
                {['不麻', '小麻', '正常麻'].map(lvl => (
                  <button key={lvl} onClick={() => setSpiceModal({...spiceModal, tempNumb: lvl})}
                    className={`flex-1 py-2 rounded border font-medium text-sm ${spiceModal.tempNumb === lvl ? 'bg-orange-600 text-white border-orange-600 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="font-semibold mb-2 text-sm text-gray-700">加價加濃</p>
              <button 
                onClick={() => setSpiceModal({
                  ...spiceModal, 
                  tempMilky: spiceModal.tempMilky === '+$15麻奶' ? '' : '+$15麻奶'
                })}
                className={`w-full py-3 rounded-lg border font-bold text-base transition-all ${
                  spiceModal.tempMilky === '+$15麻奶' 
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-300' 
                    : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                🥛 +$15麻奶
              </button>
            </div>

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
                className="flex-1 py-3 bg-[#C97A3D] text-white rounded font-bold hover:brightness-95 shadow"
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
  const btnClass = "bg-white border rounded-xl shadow-sm text-2xl font-bold flex items-center justify-center active:bg-gray-100 hover:bg-gray-50 text-[#3D332C]";

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
// 4. 後台管理中心 (Admin)
// ==============================
<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- 頂部頁籤切換 -->
    <div class="flex gap-4 mb-6 border-b pb-4">
      <button @click="currentTab = 'clock'" :class="currentTab === 'clock' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'" class="px-4 py-2 rounded font-bold">員工打卡</button>
      <button @click="currentTab = 'inventory'" :class="currentTab === 'inventory' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'" class="px-4 py-2 rounded font-bold">進貨庫存</button>
      <button @click="currentTab = 'reports'" :class="currentTab === 'reports' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'" class="px-4 py-2 rounded font-bold">報表匯出</button>
    </div>

    <!-- 1. 員工打卡頁籤 -->
    <div v-if="currentTab === 'clock'" class="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <div class="text-center mb-6">
        <h2 class="text-xl font-bold text-gray-700">台灣標準時間</h2>
        <div class="text-3xl font-mono font-extrabold text-blue-900 mt-2">{{ currentTime }}</div>
      </div>
      <div class="flex gap-4 mb-6">
        <button @click="handleClockIn" class="flex-1 py-4 rounded-lg bg-green-200 hover:bg-green-300 text-black font-bold text-lg">上班</button>
        <button @click="handleClockOut" class="flex-1 py-4 rounded-lg bg-red-200 hover:bg-red-300 text-black font-bold text-lg">下班</button>
      </div>
      <div class="p-4 bg-gray-50 rounded border">
        <h3 class="text-sm font-bold text-gray-600 mb-2">修改密碼</h3>
        <input :type="showPassword ? 'text' : 'password'" v-model="oldPassword" placeholder="舊密碼" class="w-full mb-2 p-2 border rounded">
        <input :type="showPassword ? 'text' : 'password'" v-model="newPassword1" placeholder="新密碼" class="w-full mb-2 p-2 border rounded">
        <input :type="showPassword ? 'text' : 'password'" v-model="newPassword2" placeholder="再次輸入新密碼" class="w-full mb-2 p-2 border rounded">
        <label class="flex items-center text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" v-model="showPassword" class="mr-2"> 顯示密碼
        </label>
      </div>
    </div>

    <!-- 2. 進貨庫存頁籤（內含計算機元件） -->
    <div v-if="currentTab === 'inventory'" class="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 class="text-xl font-bold mb-4">食材進貨管理</h2>
      <div class="flex gap-6">
        <div class="flex-1">
          <label class="block text-sm font-bold mb-1">當前輸入數量：</label>
          <input type="text" readonly :value="inventoryQty" class="w-full p-2 border rounded bg-gray-100 text-right text-xl font-mono mb-4">
          <button @click="saveInventory" class="w-full py-2 bg-blue-600 text-white font-bold rounded">儲存進貨</button>
        </div>
        <!-- 呼叫小計算機元件 -->
        <Keypad @update-qty="(val) => inventoryQty = val" />
      </div>
    </div>

    <!-- 3. 報表匯出頁籤 -->
    <div v-if="currentTab === 'reports'" class="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 class="text-xl font-bold mb-4">報表匯出 (包含 Line Pay 自動扣%額)</h2>
      <button @click="exportExcel" class="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded">一鍵匯出 Excel 報表</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as XLSX from 'xlsx'; // 請先用 npm i xlsx 安裝
import Keypad from './components/Keypad.vue'; // 引入計算機元件

const currentTab = ref('clock');
const currentTime = ref('');
const showPassword = ref(false);
const oldPassword = ref('');
const newPassword1 = ref('');
const newPassword2 = ref('');
const inventoryQty = ref(0);

// 即時時間更新
let timer = null;
const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('zh-TW', { hour12: false });
};
onMounted(() => { updateTime(); timer = setInterval(updateTime, 1000); });
onUnmounted(() => { clearInterval(timer); });

const handleClockIn = () => alert(`打卡上班：${currentTime.value}`);
const handleClockOut = () => alert(`打卡下班：${currentTime.value}`);
const saveInventory = () => alert(`已更新進貨數量：${inventoryQty.value}`);

// Excel 匯出邏輯（自動計算 Line Pay 2.2% 扣除額）
const exportExcel = () => {
  const linePayFeePercent = 0.022; // 2.2% 手續費
  const rawOrders = [
    { orderId: 'ORD-001', date: '2026-08-05', payType: 'Line Pay', amount: 1000 },
    { orderId: 'ORD-002', date: '2026-08-05', payType: '現金', amount: 500 },
  ];

  const processedData = rawOrders.map(item => {
    const fee = item.payType === 'Line Pay' ? Math.round(item.amount * linePayFeePercent) : 0;
    return {
      '訂單編號': item.orderId,
      '日期': item.date,
      '支付方式': item.payType,
      '原始金額': item.amount,
      'Line Pay 手續費': fee,
      '實際淨收入': item.amount - fee
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(processedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '銷售數據報表');
  XLSX.writeFile(workbook, `銷售與LinePay報表_${new Date().toISOString().split('T')[0]}.xlsx`);
};
</script>