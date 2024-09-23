# Study-mentor: 생성형 AI기반 스터디 멘토 서비스

-   2024년 1학기 컴퓨터공학부 졸업설계 프로젝트 최우수작품
-   디지털 혁신 페스타 2024 참가 작품

![alt text](src/assets/로그인화면.png)

![alt text](<src/assets/시험 문제 스타일 설정 화면.png>)

![alt text](<src/assets/시험 문제 화면2.png>)

![alt text](<src/assets/채점 중 화면 .png>)

![alt text](<src/assets/채점 완료 화면.png>)

![alt text](<src/assets/피드백 화면.png>)

![alt text](<src/assets/챗봇 화면.png>)

## Tech Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=amazon-s3&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

## Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/study-mentor.git
```

2. Navigate to the project directory

```bash
cd study-mentor
```

3. Install dependencies using npm

```bash
npm install
```

4. Run

```bash
npm run dev
```

## 👨🏻‍💻 Member

| Name   | Role       |
| ------ | ---------- |
| 곽재우 | Web, AI    |
| 김건우 | Server, AI |
| 김준곤 | Server, AI |
| 전경호 | AI         |
| 윤아현 | Web, AI    |

## Service Architecture

| Client            | Server        | AI              | Infra             | Database        |
| ----------------- | ------------- | --------------- | ----------------- | --------------- |
| React(Javascript) | Flask(Python) | GPT-4o          | Ubuntu (server)   | Google Firebase |
|                   |               | GPT3.5-turbo    | AWS S3 (web)      |                 |
|                   |               | Embedding model | Netlify (hosting) |                 |

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
