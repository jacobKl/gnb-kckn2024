import ReactDOM from 'react-dom/client';
import App from './app'
import {
    QueryClient,
    QueryClientProvider,
} from 'react-query'
import AppContextProvider from './context/AppContextProvider';


const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('app')).render(
    <AppContextProvider>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </AppContextProvider>
);
