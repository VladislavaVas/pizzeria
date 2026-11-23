import { useState } from 'react';
import {
  Container,
  Tabs,
  Tab,
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Alert,
} from 'react-bootstrap';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  addCategory,
  deleteCategory,
} from '../utils/productsStorage';
import { getUsers, isAdmin } from '../utils/storage';

function Admin() {
  if (!isAdmin()) {
    return (
      <Container>
        <Alert variant="danger">
          Эта страница доступна только администратору.
          <br />
          Зарегистрируйтесь с логином <strong>admin</strong>, чтобы получить доступ.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="mb-4">Админ-панель</h2>
      <Tabs defaultActiveKey="orders" className="mb-3">
        <Tab eventKey="orders" title="Заказы">
          <OrdersTab />
        </Tab>
        <Tab eventKey="products" title="Товары">
          <ProductsTab />
        </Tab>
        <Tab eventKey="categories" title="Категории">
          <CategoriesTab />
        </Tab>
      </Tabs>
    </Container>
  );
}

// ---------- Вкладка «Заказы» ----------
function OrdersTab() {
  const [filter, setFilter] = useState('все');
  const [refresh, setRefresh] = useState(false);

  const [cancelOrder, setCancelOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState('');

  const users = getUsers();

  const ordersRaw = localStorage.getItem('pizzeria_orders');
  const allOrders = ordersRaw ? JSON.parse(ordersRaw) : [];

  const normalized = allOrders.map((o) => ({ ...o, status: o.status || 'новый' }));

  const filtered = normalized
    .filter((o) => (filter === 'все' ? true : o.status === filter))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const getCustomerName = (login) => {
    const u = users.find((x) => x.login === login);
    if (!u) return login;
    return [u.surname, u.name, u.patronymic].filter(Boolean).join(' ');
  };

  const getItemsCount = (o) =>
    o.items.reduce((s, i) => s + i.quantity, 0);

  const handleConfirm = (orderId) => {
    const updated = allOrders.map((o) =>
      o.id === orderId ? { ...o, status: 'подтверждён' } : o
    );
    localStorage.setItem('pizzeria_orders', JSON.stringify(updated));
    setRefresh((v) => !v);
  };

  const openCancel = (order) => {
    setCancelOrder(order);
    setCancelReason('');
    setCancelError('');
  };

  const handleCancelConfirm = () => {
    if (!cancelReason.trim()) {
      setCancelError('Укажите причину отказа');
      return;
    }
    const updated = allOrders.map((o) =>
      o.id === cancelOrder.id
        ? { ...o, status: 'отменён', cancelReason: cancelReason.trim() }
        : o
    );
    localStorage.setItem('pizzeria_orders', JSON.stringify(updated));
    setCancelOrder(null);
    setCancelReason('');
    setRefresh((v) => !v);
  };

  return (
    <div>
      <div className="mb-3">
        <strong className="me-2">Статус:</strong>
        {['все', 'новый', 'подтверждён', 'отменён'].map((s) => (
          <Button
            key={s}
            size="sm"
            variant={filter === s ? 'warning' : 'outline-secondary'}
            className="me-2"
            onClick={() => setFilter(s)}
          >
            {s}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted">Заказов с таким статусом нет.</p>
      ) : (
        <Table responsive>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Заказчик</th>
              <th>Товаров</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id || o.date}>
                <td>{new Date(o.date).toLocaleString('ru-RU')}</td>
                <td>{getCustomerName(o.user)}</td>
                <td>{getItemsCount(o)} шт.</td>
                <td>{o.total} ₽</td>
                <td>
                  <Badge
                    bg={
                      o.status === 'новый'
                        ? 'warning'
                        : o.status === 'подтверждён'
                        ? 'success'
                        : 'danger'
                    }
                  >
                    {o.status}
                  </Badge>
                  {o.status === 'отменён' && o.cancelReason && (
                    <div className="small text-muted mt-1">
                      Причина: {o.cancelReason}
                    </div>
                  )}
                </td>
                <td>
                  {o.status === 'новый' && o.id && (
                    <>
                      <Button
                        size="sm"
                        variant="success"
                        className="me-2"
                        onClick={() => handleConfirm(o.id)}
                      >
                        Подтвердить
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => openCancel(o)}
                      >
                        Отменить
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={!!cancelOrder} onHide={() => setCancelOrder(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Отмена заказа</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Причина отказа</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              isInvalid={!!cancelError}
            />
            <Form.Control.Feedback type="invalid">
              {cancelError}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setCancelOrder(null)}>
            Назад
          </Button>
          <Button variant="danger" onClick={handleCancelConfirm}>
            Отменить заказ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

// ---------- Вкладка «Товары» ----------
function ProductsTab() {
  const [refresh, setRefresh] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const products = getProducts();
  const categories = getCategories().filter((c) => c.id !== 'all');

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Удалить товар?')) return;
    deleteProduct(id);
    setRefresh((v) => !v);
  };

  return (
    <div>
      <Button variant="warning" className="mb-3" onClick={openCreate}>
        + Добавить товар
      </Button>

      <Table responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Категория</th>
            <th>Цена</th>
            <th>Остаток</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.price} ₽</td>
              <td>{p.stock} шт.</td>
              <td>
                <Button
                  size="sm"
                  variant="outline-primary"
                  className="me-2"
                  onClick={() => openEdit(p)}
                >
                  Редактировать
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => handleDelete(p.id)}
                >
                  Удалить
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ProductFormModal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        editing={editing}
        categories={categories}
        onSaved={() => {
          setModalOpen(false);
          setRefresh((v) => !v);
        }}
      />
    </div>
  );
}

function ProductFormModal({ show, onHide, editing, categories, onSaved }) {
  const empty = {
    name: '',
    category: categories[0]?.id || '',
    price: 0,
    image: '',
    country: '',
    year: new Date().getFullYear(),
    model: '',
    stock: 0,
  };

  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  const change = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]:
        ['price', 'year', 'stock'].includes(name) ? Number(value) : value,
    });
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = 'Введите название';
    if (!form.category) err.category = 'Выберите категорию';
    if (form.price <= 0) err.price = 'Цена должна быть больше нуля';
    if (form.stock < 0) err.stock = 'Остаток не может быть отрицательным';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editing) {
      updateProduct(editing.id, form);
    } else {
      addProduct(form);
    }
    onSaved();
  };

  const value = (field) => (editing ? editing[field] : form[field]);

  useState(() => {
    if (editing) setForm({ ...empty, ...editing });
    else setForm(empty);
  }, [editing, show]);

  return (
    <Modal show={show} onHide={onHide} key={editing ? editing.id : 'new'}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editing ? 'Редактировать товар' : 'Добавить товар'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-2">
          <Form.Label>Название *</Form.Label>
          <Form.Control
            name="name"
            defaultValue={value('name')}
            onChange={change}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Категория *</Form.Label>
          <Form.Select
            name="category"
            defaultValue={value('category')}
            onChange={change}
            isInvalid={!!errors.category}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.category}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Цена, ₽ *</Form.Label>
          <Form.Control
            name="price"
            type="number"
            defaultValue={value('price')}
            onChange={change}
            isInvalid={!!errors.price}
          />
          <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Ссылка на изображение</Form.Label>
          <Form.Control
            name="image"
            defaultValue={value('image')}
            onChange={change}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Страна-производитель</Form.Label>
          <Form.Control
            name="country"
            defaultValue={value('country')}
            onChange={change}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Год выпуска</Form.Label>
          <Form.Control
            name="year"
            type="number"
            defaultValue={value('year')}
            onChange={change}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Модель</Form.Label>
          <Form.Control
            name="model"
            defaultValue={value('model')}
            onChange={change}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Остаток, шт. *</Form.Label>
          <Form.Control
            name="stock"
            type="number"
            defaultValue={value('stock')}
            onChange={change}
            isInvalid={!!errors.stock}
          />
          <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Отмена
        </Button>
        <Button variant="warning" onClick={handleSave}>
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// ---------- Вкладка «Категории» ----------
function CategoriesTab() {
  const [refresh, setRefresh] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const categories = getCategories();

  const handleAdd = (e) => {
    e.preventDefault();
    setError('');
    const res = addCategory(name);
    if (res.error) {
      setError(res.error);
      return;
    }
    setName('');
    setRefresh((v) => !v);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Удалить категорию? Товары этой категории останутся, но фильтр по ним пропадёт.')) return;
    deleteCategory(id);
    setRefresh((v) => !v);
  };

  return (
    <div>
      <Form onSubmit={handleAdd} className="mb-4" style={{ maxWidth: 400 }}>
        <Form.Group className="d-flex gap-2">
          <Form.Control
            placeholder="Название новой категории"
            value={name}
            onChange={(e) => setName(e.target.value)}
            isInvalid={!!error}
          />
          <Button type="submit" variant="warning">
            Добавить
          </Button>
        </Form.Group>
        {error && <div className="text-danger small mt-1">{error}</div>}
      </Form>

      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>
                {c.id !== 'all' && (
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDelete(c.id)}
                  >
                    Удалить
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Admin;