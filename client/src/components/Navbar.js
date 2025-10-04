import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Navbar as BSNavbar, Container, Badge, Button } from 'react-bootstrap';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Link href="/" passHref legacyBehavior>
          <BSNavbar.Brand style={{ cursor: 'pointer' }}>E-Commerce Showcase</BSNavbar.Brand>
        </Link>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <div className="ms-auto d-flex gap-2 align-items-center">
            {user ? (
              <>
                <Button 
                  variant="success" 
                  size="sm"
                  onClick={() => router.push('/post-product')}
                >
                  + Post
                </Button>
                <Button 
                  variant="outline-light" 
                  size="sm"
                  onClick={() => router.push('/cart')}
                  className="position-relative"
                >
                  Cart
                  {cart.itemCount > 0 && (
                    <Badge 
                      bg="danger" 
                      pill 
                      className="position-absolute top-0 start-100 translate-middle"
                    >
                      {cart.itemCount}
                    </Badge>
                  )}
                </Button>
                <Button 
                  variant="outline-light" 
                  size="sm"
                  onClick={() => router.push('/orders')}
                >
                  Orders
                </Button>
                <span className="text-light small ms-2">({user.email})</span>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={logout}
                  className="ms-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline-light" 
                  size="sm"
                  onClick={() => router.push('/auth/login')}
                >
                  Login
                </Button>
                <Button 
                  variant="warning" 
                  size="sm"
                  onClick={() => router.push('/auth/register')}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}
