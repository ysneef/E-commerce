import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import 'antd/dist/reset.css';
import '@fortawesome/fontawesome-svg-core/styles.css'; 
import './index.css';
import Router from './Router';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <Router />
    </Provider>
);
