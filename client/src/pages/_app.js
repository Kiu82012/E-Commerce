import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import { SWRConfig } from 'swr';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
          <Component {...pageProps} />
        </SWRConfig>
      </CartProvider>
    </AuthProvider>
  );
}
