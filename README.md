## 🏨 Hostel Room Allocation Application

An intelligent and efficient web-based application designed to automate the process of **hostel room allocation** for students. This system simplifies student registration, room management, and communication between students and wardens using **React**, **Firebase**, and **Redux Toolkit**.

---

### 🛠 Tech Stack

* **Frontend:** React.js, Tailwind CSS
* **State Management:** Redux Toolkit
* **Backend & Auth:** Firebase Firestore, Firebase Authentication
* **Messaging:** Firestore-based messaging system

---

### 🚀 Features

#### 👨‍🎓 Student Portal:

* 🔐 **Authentication**: Role-based login system (Student/Warden) using Firebase.
* 🛏 **Room Request**: View available rooms and send room requests to the warden.
* 🗂 **Room Allocation**: Automatically allocates rooms based on **availability** and **predefined criteria** (batch, gender, preferences).
* 📬 **Messages**: View messages/notifications sent by the warden.

#### 🧑‍💼 Warden Dashboard:

* 📋 View all registered student details.
* 🏠 **Room Management**: Allocate, reassign, or bulk assign rooms to students.
* ✉️ **Send Announcements**: Post messages to students, stored and fetched from Firestore.

#### 💬 Messaging:

* Real-time communication from the warden to all students.
* Messages are stored under the `studentData` collection in Firestore for easy retrieval.

#### 📱 Responsive UI:

* Styled with **Tailwind CSS** for a sleek and modern interface.
* Fully responsive across desktop, tablet, and mobile devices.

---

### 📦 Core Functionalities:

* 🔄 Real-time room and student data syncing with Firebase.
* 🧠 Smart allocation logic based on capacity and availability.
* ✅ Secure authentication and role-based access.
* ⚡ Smooth user experience with fast, reactive UI components.

---

### Student Portal:
![Hostel-Allotment-05-27-2025_12_46_PM](https://github.com/user-attachments/assets/d7ba25eb-e094-4eef-93a1-8f5c24b2a298)

### Warden Dashboard:
![Hostel-Allotment-05-27-2025_12_50_PM](https://github.com/user-attachments/assets/e196ecbc-354f-4c77-914a-640aa868cbab)
