# Web

-   2024년 1학기 컴퓨터공학부 졸업설계 프로젝트 프론트엔드 저장소
-   [백엔드 저장소 바로가기](https://github.com/jaewoogwak/flask-server)

## ChatGPT기반 스터디 멘토 서비스

-   사용자의 학습자료를 분석하여 시험 문제 생성
-   시험 문제를 풀고 제출하면 채점 및 피드백 제공
-   대화형 챗봇 서비스 도입

![alt text](로그인화면.png)

![alt text](<시험 문제 설정 화면.png>)

![alt text](<시험 문제 스타일 설정 화면.png>)

![alt text](<시험 문제 화면2.png>)

![alt text](<채점 중 화면 .png>)

![alt text](<채점 완료 화면.png>)

![alt text](<피드백 화면.png>)

![alt text](<챗봇 화면.png>)

### 주요 요소 기술

-   **OCR (Optical Character Recognition):** 사용자의 학습자료에서 텍스트를 추출합니다.

-   **AI Chatbot:** OpenAI API를 사용하여 사용자의 질문에 답변하며 대화할 수 있습니다. 시험 문제에 관해 질문하면 해당 문제에 대해 답변할 수 있습니다.

-   **Embedding:** 텍스트 데이터를 밀집된 벡터 공간에 표현하는 임베딩 기술 적용하였습니다. 사용자의 질문과 저장된 데이터 간의 유사성 비교하여 응답 생성이 용이해집니다.

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

## 🧑🏻‍🔧 Technology Stack

| Role                 | Type              |
| -------------------- | ----------------- |
| Library              | React             |
| Programming Language | JavaScript        |
| Styling              | Styled Components |
| Data Fetching        | Axios             |
| Auth                 | Firebase          |
| Hosting              | Netlify           |

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
