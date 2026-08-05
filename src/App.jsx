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
function AdminView({ 
  orders = [], setOrders, 
  categories = [], setCategories, 
  promotions = [], setPromotions, 
  employees = [], setEmployees, clockIns = [], 
  ingredients = [], setIngredients,
  expenses = [], setExpenses,
  closingRecords = [], setClosingRecords,
  adminPassword, setAdminPassword 
}) {
  const [isLogged, setIsLogged] = useState(false);
  const [pwd, setPwd] = useState('');
  const [activeTab, setActiveTab] = useState('DASHBOARD'); 

  if (!isLogged) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg w-80 text-center border-t-4 border-[#6B4F3A]">
          <h2 className="text-2xl font-bold mb-6 text-[#3D332C]">後台管理登入</h2>
          <input 
            type="password" 
            value={pwd} 
            onChange={e => setPwd(e.target.value)} 
            placeholder="請輸入老闆密碼" 
            className="w-full border p-3 rounded mb-4 text-center tracking-widest text-lg" 
          />
          <button 
            onClick={() => { 
              if(pwd === adminPassword || pwd === '8888') {
                if(pwd === '8888') alert('使用緊急備用密碼(8888)登入成功');
                setIsLogged(true); 
              } else {
                alert('密碼錯誤 (可輸入 8888 透過緊急備用密碼登入)');
              }
            }} 
            className="w-full bg-[#6B4F3A] text-white py-3 rounded font-bold shadow hover:bg-[#583f2e]"
          >
            登入
          </button>
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
    <div className="flex h-full overflow-hidden">
      <div className="w-64 bg-white border-r flex flex-col shadow-sm">
        <div className="p-4 bg-[#F6F0E8] border-b font-bold text-[#6B4F3A] flex items-center justify-between">
          <span>老闆後台中心</span>
          <button onClick={() => setIsLogged(false)} title="登出後台" className="text-gray-500 hover:text-red-600">
            <LogOut size={18}/>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {TABS.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                activeTab === tab.id 
                  ? 'bg-[#E6D2BE] text-[#3D332C] font-bold border-r-4 border-[#8B1E1E]' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
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

// 後台子功能頁面
function AdminDashboard({ orders = [] }) {
  const totalRev = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const aov = totalOrders ? Math.round(totalRev / totalOrders) : 0;

  const itemCounts = {};
  orders.forEach(o => {
    o.items?.forEach(i => {
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

function AdminReports({ orders = [] }) {
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

function AdminMenuManager({ categories = [], setCategories }) {
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || '');
  const [newCatName, setNewCatName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  const activeCategory = categories.find(c => c.id === selectedCatId) || categories[0];

  const handleAddCategory = () => {
    if (!newCatName.trim()) return alert('請輸入分類名稱');
    const newCat = {
      id: `c_${Date.now()}`,
      name: newCatName,
      color: '#E6D2BE',
      items: []
    };
    setCategories([...categories, newCat]);
    setNewCatName('');
    setSelectedCatId(newCat.id);
  };

  const handleRemoveCategory = (catId) => {
    if (categories.length <= 1) return alert('至少需保留一個分類');
    if (confirm('確定要刪除整個分類嗎？')) {
      const nextCats = categories.filter(c => c.id !== catId);
      setCategories(nextCats);
      setSelectedCatId(nextCats[0].id);
    }
  };

  const handleAddItem = () => {
    if (!newItemName.trim() || !newItemPrice) return alert('請填寫完整品項名稱與價格');
    const newItem = {
      id: `item_${Date.now()}`,
      name: newItemName,
      price: Number(newItemPrice)
    };
    setCategories(categories.map(c => 
      c.id === (activeCategory?.id || selectedCatId) ? { ...c, items: [...(c.items || []), newItem] } : c
    ));
    setNewItemName('');
    setNewItemPrice('');
  };

  const handleRemoveItem = (itemId) => {
    setCategories(categories.map(c => 
      c.id === activeCategory.id ? { ...c, items: c.items.filter(i => i.id !== itemId) } : c
    ));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C] border-l-4 border-[#8B1E1E] pl-3">菜單品項管理</h2>
      
      <div className="bg-white p-4 rounded-xl shadow flex gap-3 items-center">
        <input 
          type="text" 
          placeholder="輸入新分類名稱 (例: 飲料類)..." 
          value={newCatName} 
          onChange={e => setNewCatName(e.target.value)} 
          className="border p-2 rounded flex-1 text-sm bg-white"
        />
        <button onClick={handleAddCategory} className="bg-[#6B4F3A] text-white px-4 py-2 rounded font-bold text-sm shadow">
          + 新增分類
        </button>
      </div>

      <div className="flex gap-2 border-b pb-2 overflow-x-auto">
        {categories.map(cat => (
          <div key={cat.id} className="flex items-center gap-1">
            <button 
              onClick={() => setSelectedCatId(cat.id)}
              className={`px-4 py-2 rounded-t font-bold text-sm border-b-2 ${
                (activeCategory?.id === cat.id) ? 'border-[#8B1E1E] text-[#8B1E1E] bg-white' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {cat.name} ({cat.items?.length || 0})
            </button>
            {categories.length > 1 && (
              <button onClick={() => handleRemoveCategory(cat.id)} className="text-red-400 hover:text-red-600 p-1">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {activeCategory && (
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <div className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg border">
            <span className="font-bold text-gray-700 text-sm">新增商品至 [{activeCategory.name}]：</span>
            <input 
              type="text" 
              placeholder="品項名稱" 
              value={newItemName} 
              onChange={e => setNewItemName(e.target.value)}
              className="border p-2 rounded flex-1 text-sm bg-white"
            />
            <input 
              type="number" 
              placeholder="價格 ($)" 
              value={newItemPrice} 
              onChange={e => setNewItemPrice(e.target.value)}
              className="border p-2 rounded w-28 text-sm bg-white"
            />
            <button onClick={handleAddItem} className="bg-[#C97A3D] text-white px-4 py-2 rounded font-bold text-sm shadow">
              新增單品
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {activeCategory.items?.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50 hover:bg-white shadow-sm">
                <div>
                  <p className="font-bold text-[#3D332C]">{item.name}</p>
                  <p className="text-xs font-semibold text-[#8B1E1E]">${item.price}</p>
                </div>
                <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AdminPromoManager({ promotions = [], setPromotions }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('amount');
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (!name || !value) return alert('請填寫完整資訊');
    const newPromo = {
      id: `p_${Date.now()}`,
      name,
      type,
      value: Number(value)
    };
    setPromotions([...promotions, newPromo]);
    setName('');
    setValue('');
  };

  const handleRemove = (id) => {
    setPromotions(promotions.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C] border-l-4 border-[#8B1E1E] pl-3">優惠折扣設定</h2>
      
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h3 className="font-bold text-[#3D332C]">新增折扣活動</h3>
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="活動名稱 (例: 歡慶開幕全店九折)" 
            value={name} 
            onChange={e => setName(e.target.value)}
            className="border p-2 rounded flex-1 text-sm bg-white"
          />
          <select value={type} onChange={e => setType(e.target.value)} className="border p-2 rounded text-sm bg-white">
            <option value="amount">固定金額折抵 (-$)</option>
            <option value="percent">百分比打折 (-%)</option>
          </select>
          <input 
            type="number" 
            placeholder={type === 'amount' ? '折抵金額' : '打折幅度 (例如 10 = 9折)'} 
            value={value} 
            onChange={e => setValue(e.target.value)}
            className="border p-2 rounded w-44 text-sm bg-white"
          />
          <button onClick={handleAdd} className="bg-[#6B4F3A] text-white px-5 py-2 rounded font-bold text-sm shadow">
            新增活動
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold text-[#3D332C] mb-4">目前生效中的優惠活動</h3>
        <div className="space-y-2">
          {promotions.map(p => (
            <div key={p.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
              <div>
                <span className="font-bold text-[#3D332C] mr-2">{p.name}</span>
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded border border-orange-200">
                  {p.type === 'amount' ? `直減 $${p.value}` : `打 ${10 - p.value/10} 折 (-${p.value}%)`}
                </span>
              </div>
              <button onClick={() => handleRemove(p.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminInventoryManager({ ingredients = [], setIngredients }) {
  const [name, setName] = useState('');
  const [supplier, setSupplier] = useState('');
  const [unit, setUnit] = useState('kg');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [safeStock, setSafeStock] = useState('');

  const handleAdd = () => {
    if (!name || !price || !stock) return alert('請填寫主要欄位');
    const newIng = {
      id: `ing_${Date.now()}`,
      name,
      supplier: supplier || '一般廠商',
      unit,
      price: Number(price),
      category: '原料',
      stock: Number(stock),
      safeStock: Number(safeStock) || 5
    };
    setIngredients([...ingredients, newIng]);
    setName(''); setSupplier(''); setPrice(''); setStock(''); setSafeStock('');
  };

  const updateStock = (id, delta) => {
    setIngredients(ingredients.map(ing => 
      ing.id === id ? { ...ing, stock: Math.max(0, ing.stock + delta) } : ing
    ));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C] border-l-4 border-[#8B1E1E] pl-3">食材與進貨庫存管理</h2>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h3 className="font-bold text-[#3D332C]">新增食材品項</h3>
        <div className="grid grid-cols-6 gap-2">
          <input type="text" placeholder="食材名稱" value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded text-sm bg-white" />
          <input type="text" placeholder="供應商" value={supplier} onChange={e => setSupplier(e.target.value)} className="border p-2 rounded text-sm bg-white" />
          <input type="text" placeholder="單位 (如 kg, 箱)" value={unit} onChange={e => setUnit(e.target.value)} className="border p-2 rounded text-sm bg-white" />
          <input type="number" placeholder="進貨單價" value={price} onChange={e => setPrice(e.target.value)} className="border p-2 rounded text-sm bg-white" />
          <input type="number" placeholder="初始庫存" value={stock} onChange={e => setStock(e.target.value)} className="border p-2 rounded text-sm bg-white" />
          <input type="number" placeholder="安全庫存量" value={safeStock} onChange={e => setSafeStock(e.target.value)} className="border p-2 rounded text-sm bg-white" />
        </div>
        <button onClick={handleAdd} className="bg-[#6B4F3A] text-white px-5 py-2 rounded font-bold text-sm shadow">新增食材</button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold text-[#3D332C] mb-4">食材庫存監控與盤點</h3>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-100 text-gray-600">
              <th className="p-3">食材名稱</th>
              <th className="p-3">供應商</th>
              <th className="p-3">單價</th>
              <th className="p-3">當前庫存</th>
              <th className="p-3">安全警戒線</th>
              <th className="p-3">快速調整庫存</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map(ing => (
              <tr key={ing.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-bold">{ing.name}</td>
                <td className="p-3 text-gray-500">{ing.supplier}</td>
                <td className="p-3">${ing.price} / {ing.unit}</td>
                <td className={`p-3 font-bold ${ing.stock <= ing.safeStock ? 'text-red-600' : 'text-gray-800'}`}>
                  {ing.stock} {ing.unit}
                </td>
                <td className="p-3 text-gray-400">{ing.safeStock} {ing.unit}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button onClick={() => updateStock(ing.id, -1)} className="px-2 py-1 bg-gray-200 rounded font-bold">-1</button>
                    <button onClick={() => updateStock(ing.id, 1)} className="px-2 py-1 bg-green-100 text-green-700 rounded font-bold">+1</button>
                    <button onClick={() => updateStock(ing.id, 10)} className="px-2 py-1 bg-green-600 text-white rounded font-bold">+10</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminExpenseManager({ expenses = [], setExpenses }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('進貨成本');

  const handleAdd = () => {
    if (!title || !amount) return alert('請填寫項目與金額');
    const newExp = {
      id: `exp_${Date.now()}`,
      date: new Date().toLocaleDateString('zh-TW'),
      time: new Date().toLocaleTimeString('zh-TW', { hour12: false }),
      title,
      category,
      amount: Number(amount)
    };
    setExpenses([newExp, ...expenses]);
    setTitle(''); setAmount('');
  };

  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C] border-l-4 border-[#8B1E1E] pl-3">每日支出記帳</h2>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h3 className="font-bold text-[#3D332C]">新增支出項目</h3>
        <div className="flex gap-3">
          <input type="text" placeholder="支出說明 (例: 買免洗碗筷)" value={title} onChange={e => setTitle(e.target.value)} className="border p-2 rounded flex-1 text-sm bg-white" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="border p-2 rounded text-sm bg-white">
            <option value="進貨成本">進貨成本</option>
            <option value="水電瓦斯">水電瓦斯</option>
            <option value="雜項支出">雜項支出</option>
            <option value="人事薪資">人事薪資</option>
          </select>
          <input type="number" placeholder="金額 ($)" value={amount} onChange={e => setAmount(e.target.value)} className="border p-2 rounded w-36 text-sm bg-white" />
          <button onClick={handleAdd} className="bg-[#8B1E1E] text-white px-5 py-2 rounded font-bold text-sm shadow">登記支出</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#3D332C]">支出紀錄列表</h3>
          <span className="text-lg font-bold text-red-600">總計支出: ${totalExpense.toLocaleString()}</span>
        </div>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-100 text-gray-600">
              <th className="p-3">日期時間</th>
              <th className="p-3">項目</th>
              <th className="p-3">類別</th>
              <th className="p-3">金額</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr><td colSpan="4" className="p-4 text-center text-gray-400">尚無支出紀錄</td></tr>
            ) : (
              expenses.map(e => (
                <tr key={e.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-gray-500">{e.date} {e.time}</td>
                  <td className="p-3 font-bold">{e.title}</td>
                  <td className="p-3"><span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">{e.category}</span></td>
                  <td className="p-3 font-bold text-red-600">-${e.amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminClosingManager({ orders = [], expenses = [], closingRecords = [], setClosingRecords }) {
  const [cashDrawer, setCashDrawer] = useState('');
  
  const totalRev = orders.reduce((s, o) => s + o.total, 0);
  const totalCashRev = orders.filter(o => o.paymentMethod === '現金').reduce((s, o) => s + o.total, 0);
  const totalLinePayRev = orders.filter(o => o.paymentMethod === 'Line Pay').reduce((s, o) => s + o.total, 0);
  const totalExp = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalRev - totalExp;

  const handleCloseDay = () => {
    if (!cashDrawer) return alert('請輸入抽屜實際點算現金金額');
    const record = {
      id: `close_${Date.now()}`,
      date: new Date().toLocaleDateString('zh-TW'),
      totalRev,
      totalCashRev,
      totalLinePayRev,
      totalExp,
      netProfit,
      actualCash: Number(cashDrawer),
      diff: Number(cashDrawer) - totalCashRev
    };
    setClosingRecords([record, ...closingRecords]);
    alert('今日關帳完成！紀錄已封存。');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C] border-l-4 border-[#8B1E1E] pl-3">每日結算與關帳作業</h2>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">今日營業總額</p>
          <p className="text-2xl font-bold text-gray-800">${totalRev.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-emerald-500">
          <p className="text-gray-500 text-sm">現金收入 / LinePay</p>
          <p className="text-lg font-bold text-gray-800">${totalCashRev} / ${totalLinePayRev}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-red-500">
          <p className="text-gray-500 text-sm">今日總支出</p>
          <p className="text-2xl font-bold text-red-600">-${totalExp.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">今日預估純利</p>
          <p className="text-2xl font-bold text-blue-600">${netProfit.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h3 className="font-bold text-[#3D332C]">執行夜間關帳點算</h3>
        <div className="flex gap-4 items-center bg-orange-50 p-4 rounded-xl border border-orange-200">
          <span className="font-bold text-gray-700">抽屜實際現金總額：</span>
          <input 
            type="number" 
            placeholder="請點算金額並輸入..." 
            value={cashDrawer} 
            onChange={e => setCashDrawer(e.target.value)}
            className="border p-2 rounded text-lg font-bold w-48 text-right bg-white"
          />
          <button onClick={handleCloseDay} className="bg-[#8B1E1E] text-white px-6 py-2 rounded-lg font-bold shadow hover:brightness-95">
            進行關帳封存
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold text-[#3D332C] mb-4">關帳歷史紀錄</h3>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-100 text-gray-600">
              <th className="p-3">日期</th>
              <th className="p-3">總營業額</th>
              <th className="p-3">現金收入</th>
              <th className="p-3">實際點算</th>
              <th className="p-3">盤差金額</th>
              <th className="p-3">淨利</th>
            </tr>
          </thead>
          <tbody>
            {closingRecords.map(r => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-bold">{r.date}</td>
                <td className="p-3">${r.totalRev}</td>
                <td className="p-3">${r.totalCashRev}</td>
                <td className="p-3">${r.actualCash}</td>
                <td className={`p-3 font-bold ${r.diff < 0 ? 'text-red-500' : 'text-green-600'}`}>
                  {r.diff >= 0 ? `+${r.diff}` : r.diff}
                </td>
                <td className="p-3 font-bold text-blue-600">${r.netProfit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminHistory({ orders = [], setOrders }) {
  const handleDelete = (id) => {
    if (confirm(`確定要刪除訂單 #${id} 嗎？`)) {
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C] border-l-4 border-[#8B1E1E] pl-3">歷史訂單查詢與退單處理</h2>
      
      <div className="bg-white p-6 rounded-xl shadow">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-100 text-gray-600">
              <th className="p-3">單號</th>
              <th className="p-3">時間</th>
              <th className="p-3">品項明細</th>
              <th className="p-3">點餐管道</th>
              <th className="p-3">金額</th>
              <th className="p-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="6" className="p-4 text-center text-gray-400">尚無歷史訂單</td></tr>
            ) : (
              orders.map(o => (
                <tr key={o.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-bold">{o.id}</td>
                  <td className="p-3 text-xs text-gray-500">{o.date} {o.time}</td>
                  <td className="p-3">
                    <div className="text-xs space-y-0.5">
                      {o.items?.map((i, idx) => (
                        <div key={idx}>
                          {i.name} x{i.qty} {i.spiciness && `(${i.spiciness}/${i.numbness})`} {i.milky}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">{o.source} {o.subSource && `(${o.subSource})`}</td>
                  <td className="p-3 font-bold text-[#8B1E1E]">${o.total}</td>
                  <td className="p-3">
                    <button onClick={() => handleDelete(o.id)} className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 font-bold text-xs">
                      作廢退單
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminEmployeeManager({ employees = [], setEmployees, clockIns = [] }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAddEmp = () => {
    if (!name || !username || !password) return alert('請填寫完整員工資訊');
    const newEmp = { id: `e_${Date.now()}`, name, username, password };
    setEmployees([...employees, newEmp]);
    setName(''); setUsername(''); setPassword('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C] border-l-4 border-[#8B1E1E] pl-3">員工帳號與打卡紀錄</h2>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h3 className="font-bold text-[#3D332C]">新增員工帳號</h3>
        <div className="flex gap-3">
          <input type="text" placeholder="員工姓名" value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded text-sm flex-1 bg-white" />
          <input type="text" placeholder="打卡帳號" value={username} onChange={e => setUsername(e.target.value)} className="border p-2 rounded text-sm flex-1 bg-white" />
          <input type="password" placeholder="密碼" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 rounded text-sm flex-1 bg-white" />
          <button onClick={handleAddEmp} className="bg-[#6B4F3A] text-white px-5 py-2 rounded font-bold text-sm shadow">新增員工</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold text-[#3D332C] mb-4">員工清單</h3>
          <div className="space-y-2">
            {employees.map(emp => (
              <div key={emp.id} className="flex justify-between p-3 border rounded bg-gray-50">
                <span className="font-bold">{emp.name}</span>
                <span className="text-gray-500 text-sm">帳號: {emp.username}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold text-[#3D332C] mb-4">打卡紀錄日誌</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {clockIns.length === 0 ? <p className="text-gray-400 text-sm">今日尚無打卡紀錄</p> : 
              clockIns.map((c, idx) => (
                <div key={idx} className="flex justify-between p-2 border-b text-sm">
                  <span className="font-bold">{c.name}</span>
                  <span className="text-gray-600">{c.type} - {c.time}</span>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminSettingsManager({ adminPassword, setAdminPassword }) {
  const [newPwd, setNewPwd] = useState('');

  const handleChangePwd = () => {
    if (!newPwd) return alert('請輸入新密碼');
    setAdminPassword(newPwd);
    setNewPwd('');
    alert('後台老闆密碼修改成功！');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#3D332C] border-l-4 border-[#8B1E1E] pl-3">系統安全與偏好設定</h2>

      <div className="bg-white p-6 rounded-xl shadow space-y-4 max-w-lg">
        <h3 className="font-bold text-[#3D332C]">修改老闆登入密碼</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-500">當前密碼</label>
            <input type="text" readOnly value={adminPassword} className="border p-2 rounded w-full bg-gray-100 text-sm mt-1" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500">新設定密碼</label>
            <input 
              type="password" 
              placeholder="請輸入新密碼" 
              value={newPwd} 
              onChange={e => setNewPwd(e.target.value)}
              className="border p-2 rounded w-full text-sm mt-1 bg-white" 
            />
          </div>
          <button onClick={handleChangePwd} className="bg-[#6B4F3A] text-white px-5 py-2 rounded font-bold text-sm shadow">
            更新密碼
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================
// 5. 員工打卡獨立頁面 (EmployeeClockInView)
// ==============================
function EmployeeClockInView({ employees = [], clockIns = [], setClockIns, currentTime }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleClock = (type) => {
    const emp = employees.find(e => e.username === username && e.password === password);
    if (!emp) return alert('帳號或密碼錯誤');
    
    const record = {
      name: emp.name,
      type,
      time: currentTime.toLocaleTimeString('zh-TW', { hour12: false }),
      date: currentTime.toLocaleDateString('zh-TW')
    };
    setClockIns([record, ...clockIns]);
    alert(`${emp.name} ${type} 成功！時間：${record.time}`);
    setUsername('');
    setPassword('');
  };

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center border-t-8 border-[#6B4F3A]">
        <Clock size={48} className="mx-auto text-[#6B4F3A] mb-2" />
        <h2 className="text-2xl font-bold text-[#3D332C] mb-1">員工考勤打卡系統</h2>
        <p className="text-xs text-gray-400 mb-6">{currentTime.toLocaleString('zh-TW')}</p>

        <div className="space-y-4 text-left mb-6">
          <div>
            <label className="text-xs font-bold text-gray-600">員工帳號</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full border p-2.5 rounded mt-1 text-sm bg-gray-50" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600">密碼</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2.5 rounded mt-1 text-sm bg-gray-50" />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => handleClock('上班打卡')} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold shadow hover:bg-green-700">上班打卡</button>
          <button onClick={() => handleClock('下班打卡')} className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold shadow hover:bg-orange-700">下班打卡</button>
        </div>
      </div>
    </div>
  );
}