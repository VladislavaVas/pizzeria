import { useState } from 'react';
import {
  Container,
  Table,
  Button,
  Form,
  Alert,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getUsers } from '../utils/storage';

function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCheckout = (e) => {
    e.preventDefault();          
    setError('');
    setSuccess(false);

    const currentRaw = localStorage.getItem('pizzeria_current_user');
    if (!currentRaw) {
      setError('Чтобы оформить заказ, войдите в аккаунт');
      return;
    }
    const current = JSON.parse(currentRaw);

    const user = getUsers().find((u) => u.login === current.login);
    if (!user) {
      setError('Пользователь не найден. Войдите заново');
      return;
    }
    if (user.password !== password) {
      setError('Неверный пароль');
      return;
    }

    const order = {
      user: user.login,
      items,
      total,
      date: new Date().toISOString(),
    };
    const ordersRaw = localStorage.getItem('pizzeria_orders');
    const orders = ordersRaw ? JSON.parse(ordersRaw) : [];
    orders.push(order);
    localStorage.setItem('pizzeria_orders', JSON.stringify(orders));

    clearCart();
    setPassword('');
    setSuccess(true);
  };

  if (items.length === 0 && !success) {
    return (
      <Container>
        <h2 className="mb-4">Корзина</h2>
        <p>
          Ваша корзина пуста. <Link to="/catalog">Перейти в каталог</Link>
        </p>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="mb-4">Корзина</h2>

      {success ? (
        <Alert variant="success">
          Заказ успешно сформирован! Спасибо за покупку.
          <div className="mt-2">
            <Link to="/catalog">Вернуться в каталог</Link>
          </div>
        </Alert>
      ) : (
        <>
          <Table responsive>
            <thead>
              <tr>
                <th>Товар</th>
                <th>Цена</th>
                <th>Количество</th>
                <th>Сумма</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.price} ₽</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </Button>
                    <small className="text-muted ms-2">
                      (в наличии: {item.stock})
                    </small>
                  </td>
                  <td>{item.price * item.quantity} ₽</td>
                  <td>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Удалить
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h4 className="text-end">Итого: {total} ₽</h4>

          <hr />

          <h4>Оформление заказа</h4>
          <Form onSubmit={handleCheckout} style={{ maxWidth: 400 }}>
            <Form.Group className="mb-3">
              <Form.Label>Введите пароль для подтверждения</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!error}
                placeholder="Ваш пароль"
              />
              <Form.Control.Feedback type="invalid">
                {error}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" variant="warning">
              Сформировать заказ
            </Button>
          </Form>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </>
      )}
    </Container>
  );
}

export default Cart;