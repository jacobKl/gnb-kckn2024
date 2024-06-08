import ReactDOM from 'react-dom/client';
import App from './App'
import {
    QueryClient,
    QueryClientProvider,
  } from 'react-query'


const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('app')).render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
);
