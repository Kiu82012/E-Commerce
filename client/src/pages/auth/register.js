import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { API_BASE } from '../../lib/config';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm();
  const router = useRouter();
  const { login } = useAuth();

  const onSubmit = async (values) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      login(data.token, data.user);
      router.push('/');
    } catch (e) {
      setError('root', { message: e.message });
    }
  };

  return (
    <>
      <Head><title>Register</title></Head>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card>
              <Card.Body>
                <h3 className="mb-4">Create Account</h3>
                {errors.root && (<Alert variant="danger">{errors.root.message}</Alert>)}
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-3">
                    <Form.Label>First name</Form.Label>
                    <Form.Control {...register('firstName', { required: 'First name is required' })} />
                    {errors.firstName && <small className="text-danger">{errors.firstName.message}</small>}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control {...register('lastName', { required: 'Last name is required' })} />
                    {errors.lastName && <small className="text-danger">{errors.lastName.message}</small>}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" {...register('email', { required: 'Email is required' })} />
                    {errors.email && <small className="text-danger">{errors.email.message}</small>}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })} />
                    {errors.password && <small className="text-danger">{errors.password.message}</small>}
                  </Form.Group>
                  <div className="d-grid gap-2">
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Register'}</Button>
                    <Button variant="outline-secondary" onClick={() => router.push('/auth/login')}>I already have an account</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
