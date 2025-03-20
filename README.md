# 📅 Google Calendar Integration

🚀 **Google Calendar Integration** is a full-stack project that allows users to connect with Google Calendar, view events, add new events, and delete existing events. The project is built using **Next.js** for the frontend and **Node.js** with **Express** for the backend, providing a smooth and attractive user experience.  


---

## 🌟 **Features**
✅ **OAuth2 Authentication** – Secure Google Sign-In using OAuth2  
✅ **View Events** – List upcoming events with details like time and location  
✅ **Add Events** – Create new events with title, date, time, and location  
✅ **Delete Events** – Remove events directly from the calendar  
✅ **Responsive UI** – Fully responsive with an attractive design using Tailwind CSS and Framer Motion  
✅ **Token Management** – Automatic token handling and refreshing  

---

## 🚀 **Tech Stack**
| **Frontend** | **Backend** | **Styling** | **Authentication** |
|-------------|-------------|-------------|-------------|
| Next.js | Node.js | Tailwind CSS | Google OAuth2 |
| React.js | Express.js | Framer Motion | - |

---

## 🎯 **Setup and Installation**

### 🔥 1. Clone the Repository
```bash
git clone https://github.com/Rishmo/google-calendar-integration.git
cd google-calendar-integration
```

---

### ⚙️ 2. Set Up the Backend
1. Navigate to the backend folder:
```bash
cd backend
```
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file in the **backend** folder:
```env
Include your credentials.
```
4. Start the backend server:
```bash
npm start
```

---

### 🖥️ 3. Set Up the Frontend
1. Navigate to the frontend folder:
```bash
cd ../frontend
```
2. Install dependencies:
```bash
npm install
```
3. Start the frontend:
```bash
npm run dev
```

---

## 🌐 **API Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/auth` | Initiates OAuth2 authentication |
| `GET` | `/callback` | Handles OAuth2 callback and saves tokens |
| `GET` | `/events` | Fetches the list of upcoming events |
| `POST` | `/events` | Adds a new event to the calendar |
| `DELETE` | `/events/:id` | Deletes an event by ID |
| `GET` | `/refresh-token` | Refreshes the OAuth2 token |

---

## 🎉 **How It Works**
1. User clicks **"Sign In with Google"**  
2. Google OAuth2 prompts for access  
3. After successful login:
   - Tokens are stored securely  
   - Calendar events are fetched and displayed  
   - User can add or delete events  
4. Tokens are automatically refreshed when they expire  

---


## 🛠️ **Future Improvements**
- 🏆 **Add notifications for events**  
- 🎯 **Color-coded event categories**  
- 🌙 **Dark Mode Support**  

---

## 💖 **Contributing**
Contributions are welcome!  
1. Fork the repository  
2. Create a new branch (`git checkout -b feature-branch`)  
3. Commit your changes (`git commit -m 'Add new feature'`)  
4. Push to your branch (`git push origin feature-branch`)  
5. Create a Pull Request  

---

## 🙌 **Acknowledgements**
Special thanks to **Google** for providing the Calendar API!  

---


⭐️ If you like this project, please **star** it on GitHub!  

---
