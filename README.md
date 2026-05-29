# 🌿 Breathe ESG Dashboard

A full-stack ESG (Environmental, Social & Governance) dashboard developed as part of the Breathe ESG assessment.

## 🚀 Live Project

https://breathe-esg-project-bnr3ht8q8.vercel.app

## 📂 GitHub Repository

https://github.com/RitikaSingh1203/breathe-ESGProject

---

## 📌 Project Overview

This project is an ESG Dashboard used to manage and visualize emission records.

Users can:

* Login securely
* View ESG emission data
* Filter and search records
* Approve / Reject records
* Add new emission records
* Export reports in CSV and PDF format
* Visualize data using charts

The dashboard supports Scope 1, Scope 2 and Scope 3 emission tracking.

---

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* Axios
* Recharts
* React Router
* jsPDF
* File Saver

### Backend

* Django
* Django REST Framework
* SQLite

---

## ✨ Features

### Authentication

* Login page
* Basic credential validation

### ESG Dashboard

* Total / Approved / Pending / Rejected summary cards
* Pie chart visualization
* Search records
* Status filtering

### Record Management

* Add new emission record
* Approve / Reject emission records
* Scope tracking

### Reporting

* Export CSV
* Export PDF

---

## 📁 Project Structure

```text
breathe-esgProject
│
├── backend
│   ├── config
│   ├── ingestion
│   ├── emissions
│   └── manage.py
│
└── esg-dashboard
    ├── src
    ├── public
    └── package.json
```

---

## ⚙️ Local Setup

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs on:

```text
http://127.0.0.1:8000
```

---

### Frontend Setup

```bash
cd esg-dashboard
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 🔌 API Endpoints

### Login

```text
POST /api/login/
```

### Get All Records

```text
GET /api/all/
```

### Pending Records

```text
GET /api/pending/
```

### Approve Record

```text
POST /api/approve/<id>/
```

### Reject Record

```text
POST /api/reject/<id>/
```

---

## 👩‍💻 Developed By

Ritika Singh
B.Tech CSE (Honors)

---

## 📌 Assessment Submission

This project was created as part of the Breathe ESG technical assessment.
