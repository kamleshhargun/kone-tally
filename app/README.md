# 🏭 Production KONE (Garment / Manufacturing)

## 📌 Overview

Production KONE ek simple web-based system hai jo garment/manufacturing workflow ko manage karta hai.

Ye system **pure frontend (HTML, CSS, JavaScript)** pe based hai aur **LocalStorage** use karta hai data store karne ke liye — koi backend required nahi hai.

---

## 🚀 Features

* 📊 Dashboard Overview
* 🧵 Fabric Purchase Management
* ✂️ Cutting Management
* 🪡 Stitching Tracking
* 📦 Finished Goods Management
* 💰 Sales Management
* 🔄 Return Handling
* ⚙️ Settings Panel

---

## 🧠 Data Flow

Fabric → Cutting → Stitching → Finished → Sales → Inventory

* Cutting consumes Fabric
* Stitching consumes Cutting
* Finished adds to Inventory
* Sales reduces Inventory

---

## 💻 Tech Stack

* HTML
* CSS
* JavaScript (Vanilla JS)
* LocalStorage (Client-side database)

---

## 📂 Project Structure

```
common.js        → All reusable JS functions  
style.css        → Common styling  

index.html       → Dashboard  
fabric.html      → Fabric module  
cutting.html     → Cutting module  
stiching.html    → Stitching module  
furnished.html   → Finished goods  
sales.html       → Sales module  
return.html      → Return module  
setting.html     → Settings  
```

---

## ⚙️ How to Use

1. Project download / clone kare
2. Kisi bhi browser me `index.html` open kare
3. Sidebar se modules use kare
4. Data automatically browser me save ho jayega

---

## 💾 Data Storage

* Saara data browser ke **LocalStorage** me store hota hai
* Clear hone par data delete ho jayega

---

## ⚠️ Limitations

* No backend (data secure nahi hai)
* Multi-user support nahi hai
* Sirf single device ke liye

---

## 🚀 Future Scope

* Google Sheets / API Integration
* User Login System
* Cloud Storage
* Mobile Responsive UI
* Reports & Analytics

---

## 👨‍💻 Developer

Developed by: **Kamlesh Hargun**

---

## 📜 License

Free to use for personal & learning purpose
