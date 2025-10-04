import { useEffect, useState } from 'react';
import { Container, Card, Alert, Badge, ListGroup, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../lib/config';
import Navbar from '../../components/Navbar';

export default function OrdersPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      setOrders(data.orders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <Container className="mt-5">
          <Alert variant="warning">
            Please <a href="/auth/login">login</a> to view your orders.
          </Alert>
        </Container>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="mt-5 text-center">
          <p>Loading orders...</p>
        </Container>
      </>
    );
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <h1 className="mb-4">My Orders</h1>

        {error && <Alert variant="danger">{error}</Alert>}

        {orders.length === 0 ? (
          <Alert variant="info">
            You haven't placed any orders yet. <a href="/">Start shopping</a>
          </Alert>
        ) : (
          <div>
            {orders.map((order) => (
              <Card key={order.id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5>Order #{order.id}</h5>
                      <p className="text-muted mb-0">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <Badge bg={getStatusVariant(order.status)}>
                      {order.status.toUpperCase()}
                    </Badge>
                  </div>

                  <ListGroup variant="flush" className="mb-3">
                    {order.items.map((item) => (
                      <ListGroup.Item key={item.id} className="px-0">
                        <div className="d-flex justify-content-between">
                          <div>
                            <strong>{item.product.name}</strong>
                            <div className="text-muted">Quantity: {item.quantity}</div>
                          </div>
                          <div className="text-end">
                            <div>${(Number(item.price) * item.quantity).toFixed(2)}</div>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Total: ${Number(order.total).toFixed(2)}</strong>
                    </div>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => router.push(`/orders/${order.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
