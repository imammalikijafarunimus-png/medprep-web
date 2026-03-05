# GEMINI.md
AI Development Context for MedPrep Web

This file provides context and rules for AI coding assistants such as Gemini CLI, Roo Code, and other AI agents working in this repository.

---

# Project Overview

MedPrep Web is a web platform designed to help medical students prepare for the Indonesian national medical competency exam (UKMPPD).

The platform provides:

- CBT question bank
- OSCE training stations
- Flashcard spaced repetition learning
- Islamic bioethics insights
- Subscription-based premium learning features

Target users:

- Medical students
- Medical interns preparing for UKMPPD
- Universities running OSCE practice sessions

---

# Core Features

## CBT Center
Computer Based Test simulation including:

- Multiple choice question bank
- Exam timer
- Score calculation
- Performance analytics by organ system
- Progress tracking

## OSCE Center

Objective Structured Clinical Examination preparation:

- Clinical stations
- Physical exam checklists
- Communication guidelines
- Automatic scoring

## Flashcard Drill

Spaced repetition learning system:

- Interactive flashcards
- Mastery tracking
- Long-term retention training

## Additional Features

- Dark / Light theme
- Islamic mode (bioethics + prayer time awareness)
- Multi-university support
- Admin dashboard
- Subscription system

---

# Tech Stack

Frontend

React 19  
TypeScript 5  
Vite 7  
TailwindCSS  

Libraries

React Router  
Lucide React  

Backend

Firebase

Services used:

Firebase Authentication  
Firestore Database  
Firebase Storage (optional)  
Firebase Cloud Functions

Testing

Vitest  
React Testing Library

Deployment

Vercel / Netlify / Firebase Hosting

---

# Project Architecture

Important directories:


src/
components/
pages/
context/
hooks/
lib/
data/
types/
utils/


Firebase configuration:


src/lib/firebase.ts


Auth context:


src/context/AuthContext.tsx


Firestore rules:


firestore.rules


Cloud functions:


functions/src/index.ts


---

# Security Architecture

This project implements several security layers.

## Authentication

Firebase Authentication using:

- Email / Password
- Google Sign-in

User roles are stored using **Firebase Custom Claims**.

Roles:

student  
admin  
superadmin

## Role Based Access Control

student
- Access learning content

admin
- Manage content (questions, OSCE material)

superadmin
- Manage users and roles

Role checks exist in:

AuthContext  
PrivateRoute component

---

# Firestore Data Model (Simplified)

Users


users/{userId}
email
role
subscriptionPlan
subscriptionExpiry
createdAt


Exam Results


examResults/{resultId}
userId
examType
score
completedAt


Audit Logs


audit_logs/{logId}
action
actorId
timestamp


---

# Development Guidelines

AI assistants should follow these guidelines when generating code.

## General Coding Rules

- Use TypeScript
- Prefer functional React components
- Avoid large components (>300 lines)
- Reuse components when possible
- Use hooks for logic reuse

## React Best Practices

Prefer:


function Component() {}


Avoid unnecessary class components.

Use:

- custom hooks
- composition
- small reusable components

---

# Firebase Guidelines

Do NOT:

- expose admin privileges in client code
- bypass Firestore security rules
- store secrets in frontend

Always assume:

Firestore rules enforce security.

AI must never suggest:


allow read, write: if true


---

# Firestore Rules Expectations

Rules must enforce:

- authenticated access
- role-based access
- user isolation

Examples:

Users should only read their own profile.

Admins can manage learning content.

Superadmins can manage roles.

---

# Performance Guidelines

AI should aim to:

- minimize Firestore reads
- avoid unnecessary re-renders
- lazy load heavy components
- split large components

---

# AI Assistant Responsibilities

AI assistants may help with:

- code refactoring
- improving UI components
- optimizing Firestore queries
- improving security rules
- adding tests
- improving performance

---

# AI Assistant Restrictions

AI must NOT:

- expose service account keys
- commit credentials
- weaken Firestore security rules
- disable authentication checks

---

# Useful Commands

Development


npm run dev


Build


npm run build


Testing


npm run test


Lint


npm run lint


---

# Future Improvements

Potential roadmap features:

- Payment gateway integration
- AI question generator
- Learning analytics dashboard
- Adaptive learning system
- Mobile app version

---

# Summary

MedPrep Web is a modern React + Firebase application focused on medical education and UKMPPD preparation.

AI assistants should prioritize:

security  
performance  
maintainability  
clean architecture