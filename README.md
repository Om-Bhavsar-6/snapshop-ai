 SnapShop AI 🛍️✨

Your personal, AI-powered shopping companion designed to make shopping simple, smart, and fast.

[![Built with Firebase](https://img.shields.io/badge/Built_with-Firebase-orange.svg)](https://firebase.google.com/)
[![Powered by Google Gemini](https://img.shields.io/badge/Powered_by-Google_Gemini-blue.svg)](https://ai.google/gemini/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

 🔴 The Problem

Modern shopping is a chore. Consumers face:
*   Information Overload: Endless products, brands, and biased reviews.
*   Decision Fatigue: The mental drain of making constant purchasing choices.
*   Wasted Time: Hours spent creating lists and manually comparing prices across different websites.
*   Inefficient Planning: Difficulty in planning purchases for events or weekly needs.

 🟢 The Solution: SnapShop AI

SnapShop AI is an intelligent web application that transforms your shopping process. It's a smart assistant that understands your needs, helps you discover products, and finds the best value, all through a simple and intuitive conversational interface.



🚀 Live Demo & Screenshots




<img width="956" height="912" alt="Screenshot 2025-09-16 132816" src="https://github.com/user-attachments/assets/f1565766-15cb-4710-88ca-ee2bec30bfca" />
<img width="954" height="916" alt="Screenshot 2025-09-16 132823" src="https://github.com/user-attachments/assets/9431611b-215f-4d6b-b0db-e9369e1c89da" />




✨ Key Features

*   📸 Visual Product Search: See something you like? Snap a picture, and SnapShop AI will use Gemini Pro Vision to identify the item and find it online for you.
*   💬 Conversational Shopping Assistant: Powered by Gemini Pro, our chatbot can:
    *   Provide personalized product recommendations ("What's a good laptop for a student under $800?").
    *   Compare products side-by-side.
    *   Summarize thousands of user reviews into a few key points.
*   🛒 Intelligent Shopping Lists: Describe an event or need in plain English ("I'm hosting a BBQ for 10 people") and let the AI generate a complete, categorized shopping list.
*   💸 Automated Price Comparison: Automatically finds the best prices for the items on your list from multiple online retailers.
*   👤 Personalized Experience: The app learns your preferences over time to deliver smarter, more relevant suggestions.

---

🛠️ Tech Stack & Architecture

This project is a showcase of building a modern, scalable AI application using the Google Cloud and Firebase ecosystem.

Frontend: React / Next.js
*   Backend & Database:
    *   Google Firebase: The core backend platform.
        *   Firebase Hosting: For global, fast, and secure web hosting.
        *   Firebase Authentication: Secure user sign-up and login.
        *   Firestore: NoSQL database for storing user data and shopping lists.
*   AI & Machine Learning:
    *   Firebase AI Logic: To easily integrate and manage generative AI models.
    *   Google Gemini API (via Vertex AI): The brain of the application, handling all natural language and vision tasks.
*   Development Environment:
    *   Firebase Studio: Cloud-based IDE used for rapid, AI-assisted development.

 System Architecture
The application uses a serverless architecture where the frontend (hosted on Firebase Hosting) communicates directly with Firebase services. The AI logic is handled through Firebase AI Logic, which securely calls the Gemini API.

