import { useState, useMemo } from 'react';
import { Container, Card, Button, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Profile() {
  const currentRaw = localStorage.getItem('pizzeria_current_user');
  const current = currentRaw ? JSON.parse(currentRaw) : null;

  const [refresh, setRefresh] = useState(false);

  const orders = useMemo(() => {
    if (!current) return [];
    const raw = localStorage.getItem('pizzeria_orders');
    const all = raw ? JSON.parse(raw) : [];

    return all
      .filter((o) => o.user === current.login)         
      .map((o) => ({ ...o, status: o.status || 'новый' })) 
      .sort((a, b) => new Date(b.date) - new Date(a.date)); 
  }, [current, refresh]);

  const handleDelete = (orderId) => {
    if (!window.confirm('Удалить этот заказ?')) return;

    const raw = localStorage.getItem('pizzeria_orders');
    const all = raw ? JSON.parse(raw) : [];
    const filtered = all.filter((o) => o.id !== orderId);
    localStorage.setItem('pizzeria_orders', JSON.stringify(filtered));
    setRefresh((v) => !v);  
  };

  if (!current) {
    return (
      <Container>
        <h2 className="mb-4">Личный кабинет</h2>
        <Alert variant="warning">
          Чтобы увидеть свои заказы, <Link to="/login">войдите</Link> или{' '}
          <Link to="/register">зарегистрируйтесь</Link>.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="mb-4">Личный кабинет</h2>
      <p>
        Вы вошли как <strong>{current.name || current.login}</strong>
      </p>

      <h4 className="mt-4 mb-3">Мои заказы</h4>

      {orders.length === 0 ? (
        <Alert variant="info">
          У вас пока нет заказов. <Link to="/catalog">Перейти в каталог</Link>
        </Alert>
      ) : (
        orders.map((order) => {
          const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);
          const isNew = order.status === 'новый';

          return (
            <Card key={order.id || order.date} className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h5 className="mb-1">
                      Заказ от{' '}
                      {new Date(order.date).toLocaleString('ru-RU')}
                    </h5>
                    <div>
                      <Badge
                        bg={
                          order.status === 'новый'
                            ? 'warning'
                            : order.status === 'подтверждён'
                            ? 'success'
                            : 'danger'
                        }
                      >
                        {order.status}
                      </Badge>
                      <span className="ms-2 text-muted">
                        Товаров: {totalQty} шт.
                      </span>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold mb-2">{order.total} ₽</div>
                    {isNew && order.id && (
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(order.id)}
                      >
                        Удалить
                      </Button>
                    )}
                  </div>
                </div>

                <ul className="mb-0">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.name} — {item.quantity} шт. × {item.price} ₽
                    </li>
                  ))}
                </ul>
                {order.status === 'отменён' && order.cancelReason && (
                  <Alert variant="danger" className="mt-3 mb-0">
                    <strong>Причина отказа:</strong> {order.cancelReason}
                  </Alert>
                )}
              </Card.Body>
            </Card>
          );
        })
      )}
    </Container>
  );
}

export default Profile;