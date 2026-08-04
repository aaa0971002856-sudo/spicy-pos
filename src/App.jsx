import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { CheckCircle, ShoppingCart, Plus, Minus } from 'lucide-react';

export default function App() {
  // 狀態管理
  const [cart, setCart] = useState([]);
  const [source, setSource] = useState('現場');
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [successModal, setSuccessModal] = useState(null);

  // 模擬菜單品項
  const products = [
    { id: 1, name: '經典麻辣燙 (小辣)', price: 120 },
    { id: 2, name: '極品麻辣燙 (大辣)', price: 150 },
    { id: 3, name: '雪花牛肉片', price: 60 },
    { id: 4, name: '梅花豬肉片', price: 50 },
    { id: 5, name: '高麗菜', price: 30 },
    { id: 6, name: '手工凍豆腐', price: 30 },
    { id: 7, name: '酸梅湯', price: 40 }
  ];

  // 加入購物車
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // 調整數量
  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  // 計算總金額
  const finalTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totals = { total: finalTotal, finalTotal };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 頂部導覽列 */}
      <header className="bg-red-700 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">🔥 麻辣燙智慧收銀系統</h1>
        <div className="text-sm font-semibold bg-red-800 px-3 py-1 rounded-lg">模式：{source}</div>
      </header>

      {/* 主體內容 */}
      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        {/* 左側：商品點餐區 */}
        <div className="flex-1 bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">快速點餐</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {products.map(p => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                className="p-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl flex flex-col justify-between text-left transition active:scale-95"
              >
                <span className="font-bold text-gray-800">{p.name}</span>
                <span className="text-red-600 font-semibold mt-2">${p.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 右側：購物車與結帳區 */}
        <div className="w-full md:w-96 bg-white p-4 rounded-xl shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <ShoppingCart /> 目前訂單
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-gray-400 text-center py-8">購物車目前是空的</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">${item.price} x {item.qty}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.id, -1)} className="p-1 bg-gray-200 rounded hover:bg-gray-300"><Minus size={14} /></button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="p-1 bg-gray-200 rounded hover:bg-gray-300"><Plus size={14} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 總計與結帳按鈕 */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-xl font-bold mb-4 text-red-700">
              <span>總計</span>
              <span>${finalTotal}</span>
            </div>
            <button
              disabled={cart.length === 0}
              onClick={() => setCheckoutModal(true)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-bold rounded-xl shadow-md transition"
            >
              前往收銀結帳
            </button>
          </div>
        </div>
      </div>

      {/* 結帳確認彈跳視窗 */}
      {checkoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">確認結帳</h3>
            <p className="text-lg text-gray-600 mb-6">應付金額：<span className="font-bold text-red-600">${totals.finalTotal}</span></p>
            
            <div className="flex gap-4">
              <button
                onClick={() => setCheckoutModal(false)}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 font-bold rounded-xl text-gray-700 transition"
              >
                取消
              </button>
              <button
                onClick={async () => {
                  try {
                    // 1. 準備上傳到 Firebase 雲端的訂單資料
                    const orderData = {
                      items: cart,
                      totalAmount: totals.finalTotal,
                      paymentMethod: '現金',
                      createdAt: new Date()
                    };
                    
                    // 2. 寫入 Firebase 資料庫
                    await addDoc(collection(db, "orders"), orderData);
                    console.log("訂單已成功儲存到雲端！");

                    // 3. 成功後清空購物車、關閉結帳視窗、秀出完成畫面
                    setSuccessModal(orderData);
                    setCart([]);
                    setCheckoutModal(false);
                  } catch (err) {
                    console.error("上傳訂單發生錯誤：", err);
                    alert("上傳雲端失敗，請檢查網路連線");
                  }
                }}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 font-bold rounded-xl text-white transition"
              >
                確認收款結帳
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 結帳完成成功彈跳視窗 */}
      {successModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border-t-8 border-green-500">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-2xl font-bold mb-2 text-gray-800">結帳完成！</h3>
            <p className="text-gray-600 mb-6">訂單已成功同步至 Firebase 雲端資料庫。</p>
            <button
              onClick={() => setSuccessModal(null)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition"
            >
              繼續點餐
            </button>
          </div>
        </div>
      )}
    </div>
  );
}