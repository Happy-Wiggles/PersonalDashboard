# 📊 Personal Dashboard

Eine vollständige Full-Stack Webanwendung zur Verwaltung von Benutzerkonten und persönlichen Aufgaben mit moderner React Frontend und Express Backend.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Express](https://img.shields.io/badge/Express-5-green?logo=express)
![SQLite](https://img.shields.io/badge/SQLite-3-lightblue?logo=sqlite)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple?logo=redux)

---

## ✨ Features

### Authentifizierung
- Sichere Benutzerregistrierung und Anmeldung
- JWT Token basierte Authentifizierung
- Passwort Hashing mit Bcrypt
- Token Persistierung mit localStorage
- Protected Routes für authentifizierte Bereiche

### Benutzerverwaltung
- Benutzerprofile mit vollständigen Informationen
- Profilbearbeitung mit Validierung
- Benutzerliste für Administratoren
- Admin und User Rollen System

### Aufgabenverwaltung
- Erstellung von ToDo Listen
- Hinzufügen von Aufgaben mit Prioritäten (1 bis 5)
- Aufgaben als erledigt markieren
- Aufgaben löschen
- Automatische Sortierung nach Priorität und Status

### Benutzeroberfläche
- Modernes Glasmorphic Design
- Loading Spinner bei asynchronen Operationen
- Responsive Layout für Desktop und Mobile
- Smooth Scroll Navigation mit automatischem Ausblenden
- Animierte Feedback Effekte

---

## 🛠️ Technologie Stack

### Frontend
```
React 19                  - UI Framework
TypeScript 5.9            - Type Safety
Redux Toolkit             - State Management
React Router 7            - Navigation
Tailwind CSS 4            - Styling
Axios 1.14                - HTTP Client
Vite 8                    - Build Tool
Heroicons                 - UI Icons
```

### Backend
```
Express 5                 - Web Framework
TypeScript 6              - Backend Type Safety
SQLite 3                  - Datenbank
Bcrypt 6                  - Passwort Hashing
JWT                       - Authentifizierung
CORS                      - Cross Origin Requests
```

---

## 🚀 Quick Start

### Voraussetzungen
- Node.js 18+
- npm oder yarn

### Backend Setup

```bash
# In den backend Ordner navigieren
cd backend

# Dependencies installieren
npm install

# Server starten (läuft auf Port 3000)
npm start
```

Die SQLite Datenbank wird automatisch erstellt.

### Frontend Setup

```bash
# In den frontend Ordner navigieren
cd frontend

# Dependencies installieren
npm install

# Entwicklungsserver starten (läuft auf Port 5173)
npm run dev
```

### Gleichzeitig starten
```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm run dev
```

Öffne dann [http://localhost:5173](http://localhost:5173) in deinem Browser.

---

## 📁 Projektstruktur

```
PersonalDashboard/
├── backend/
│   ├── src/
│   │   ├── index.ts           # Express Server
│   │   ├── routes/            # API Endpoints
│   │   └── types/             # TypeScript Interfaces
│   ├── database.db            # SQLite Datenbank
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # React Komponenten
│   │   ├── features/          # Redux Slices
│   │   ├── services/          # API Service
│   │   ├── store/             # Redux Store
│   │   └── models/            # TypeScript Types
│   ├── public/                # Statische Assets
│   └── package.json
│
└── database.db
```

---

## 🔑 API Endpoints

### Authentifizierung
```
POST   /auth/register    - Benutzer registrieren
POST   /auth/login       - Benutzer anmelden
```

### Benutzer (erfordert JWT Token)
```
GET    /users           - Alle Benutzer abrufen
PUT    /users/:id       - Benutzerdaten aktualisieren
DELETE /users/:id       - Benutzer löschen
```

### ToDo Listen (erfordert JWT Token)
```
GET    /todolists/:userId       - Listen eines Benutzers
POST   /todolists                - Neue Liste erstellen
PUT    /todolists/:id            - Liste aktualisieren
DELETE /todolists/:id            - Liste löschen
```

### ToDo Items (erfordert JWT Token)
```
GET    /todos/list/:listId      - Aufgaben einer Liste
POST   /todos                    - Neue Aufgabe erstellen
PUT    /todos/:id                - Aufgabe aktualisieren
DELETE /todos/:id                - Aufgabe löschen
```

---

## 🔐 Sicherheitsfeatures

- Passwörter werden mit Bcrypt gehashed
- JWT Token mit 1 Stunde Validität
- CORS konfiguriert für Frontend Domain
- Protected Routes im Frontend
- Token Authentifizierung an allen sensiblen Endpoints
- Passwort Validierung mit Regex (min. 8 Zeichen, Groß, Klein, Zahl, Symbol)

---

## 📝 Testbenutzer

Nach dem ersten Start kannst du diese Anmeldedaten testen:

```
Email: test@example.com
Passwort: Test123!
```

Oder registriere einen neuen Benutzer über die Register Seite.

---

## 🎓 Lernziele

Dieses Projekt wurde erstellt um folgende Konzepte zu erlernen:

- Redux State Management mit Thunks
- Full Stack TypeScript Development
- JWT Authentifizierung
- RESTful API Design
- React Hooks und Router
- Tailwind CSS Styling
- Bcrypt Passwort Sicherheit

---

## 📦 Build & Deployment

### Frontend bauen
```bash
cd frontend
npm run build    # Erstellt /dist Ordner
npm run preview  # Preview des Builds
```

### Backend produktiv starten
```bash
cd backend
npm start
```

---

## 🐛 Known Issues

- Keine aktuellen bekannten Probleme

---

## 📄 Lizenz

Dieses Projekt wird zu Lernzwecken verwendet und steht unter der MIT Lizenz.

---

## 👨‍💻 Entwickler

Erstellt als Teil des Alfatraining React Kurses.

---

## 📧 Support

Bei Fragen oder Problemen öffne bitte ein GitHub Issue.
