import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
// import './styles/index.css';
import Root from './routes/root.jsx';

import ErrorPage from './pages/error-page.jsx';
// import App.css
import './styles/App.css';

import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query';
import NewChatbotPage from './pages/ChatbotPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ChatbotPage from './pages/ChatbotPage.jsx';

import { AuthProvider } from './contexts/AuthContext.jsx';
import MainPage from './pages/MainPage.jsx';
import DataUpload from './pages/DataUpload.jsx';

import CheckListPage from './pages/CheckListPage.jsx';

const queryClient = new QueryClient();
const address = 'http://13.124.221.128:5000/';
const localAddress = 'http://127.0.0.1:5000/';

function Example() {
    const { isPending, error, data } = useQuery({
        queryKey: ['repoData'],
        queryFn: () => fetch(address).then((res) => res.json()),
    });

    if (isPending) return 'Loading...';

    if (error) return 'An error has occurred: ' + error.message;

    console.log(data);

    return (
        <div>
            <h1>{data.name}</h1>
            <p>{data.description}</p>
            <strong>👀 {data.subscribers_count}</strong>{' '}
            <strong>✨ {data.stargazers_count}</strong>{' '}
            <strong>🍴 {data.forks_count}</strong>
        </div>
    );
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/upload',
        element: <DataUpload />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/chatbot',
        element: <ChatbotPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/checklist',
        element: <CheckListPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/login',
        element: <Login />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/register',
        element: <Register />,
        errorElement: <ErrorPage />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </AuthProvider>
);
