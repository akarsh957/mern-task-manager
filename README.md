
# 🚀 TaskFlow – MERN Tree-Based Task Manager

TaskFlow is a full-stack task management application built using the **MERN stack** with a unique implementation of a **Tree Data Structure** for handling hierarchical tasks and subtasks.

🔗 **Live Demo:**
[https://mern-task-manager-ngk1jhm1-akarsh957s-projects.vercel.app](https://mern-task-manager-ngk1jhm1-akarsh957s-projects.vercel.app)

---

## 📌 Features

* 🌳 Tree-based task architecture (Parent → Child → Subtasks)
* 🔁 Recursive rendering of nested tasks
* 🗑 Cascading delete (removes all child tasks)
* 🎯 Priority levels (Low, Medium, High)
* 📅 Due date support
* 📊 Dashboard with quick stats
* 🔐 JWT-based authentication (Header-based, no cookies)
* 🌐 Fully deployed frontend & backend

---

## 🧠 Why Tree Data Structure?

Instead of using a flat task list, tasks are stored with a `parentId` reference:

```js
parentId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Task",
  default: null,
}
```

This allows:

* Hierarchical task organization
* Efficient recursive building of task tree
* Clean project breakdown structure

---

## 🛠 Tech Stack

### Frontend

* React (Vite)
* Context API
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication

### Deployment

* Vercel (Frontend)
* MongoDB Atlas (Database)

---

## 📂 Project Structure

```
mern-task-manager/
│
├── client/        # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── api/
│
├── server/        # Express Backend
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
```

---

## 🔐 Authentication Flow

1. User registers / logs in
2. Backend generates JWT token
3. Token stored in localStorage
4. Token sent via Authorization header:

```
Authorization: Bearer <token>
```

5. Backend verifies token using middleware

---

## ⚙️ Installation & Setup (Local)

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/mern-task-manager.git
cd mern-task-manager
```

---

### 2️⃣ Setup Backend

```
cd server
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```
npm run dev
```

---

### 3️⃣ Setup Frontend

```
cd client
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🚀 Deployment Notes

* MongoDB hosted on Atlas
* Frontend deployed on Vercel
* Environment variables configured in Vercel dashboard
* CORS configured for production

---

## 📊 Future Improvements

* Drag & Drop priority reordering
* Real-time collaboration
* Role-based access control
* Analytics dashboard
* Notifications system

---

## 📈 Learning Outcomes

* Advanced use of recursive data structures
* Secure JWT authentication implementation
* Debugging CORS & 401 issues
* Production deployment configuration
* Clean modular backend architecture

---

## 👨‍💻 Author

Akarsh Mishra
B.Tech CSE (Cybersecurity)
Full Stack Developer


