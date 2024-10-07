import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './pages/layout/layout.component';
import { JoksContainer } from './pages/joke/joke.container';
import { newGamesService } from './rest-service/joke.service';
// import { Joke } from './pages/joke/joke.component';

const JoksContainerResolved = JoksContainer({ jokeService: newGamesService() });

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                // element: <Joke />,
                element: <JoksContainerResolved />,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
