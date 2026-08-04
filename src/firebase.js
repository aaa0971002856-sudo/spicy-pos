// 1. 引入 Firebase 工具
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// 2. 你的專案專屬金鑰
const firebaseConfig = {
  apiKey: "AIzaSyBorwqzdgOx0-R-DTXeiHkOuGG1u69Dw1g",
  authDomain: "project-4394933997126773555.firebaseapp.com",
  projectId: "project-4394933997126773555",
  storageBucket: "project-4394933997126773555.firebasestorage.app",
  messagingSenderId: "984718425705",
  appId: "1:984718425705:web:eff1802005a3a1a877ecf8",
  measurementId: "G-4080F5JQGZ"
};

// 3. 啟動 Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 4. 準備好資料庫 (Firestore)，並開放給其他檔案使用
export const db = getFirestore(app);