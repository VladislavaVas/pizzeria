import { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { findUserByLogin, saveCurrentUser } from '../utils/storage';

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ login: '', password: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const err = {};
    if (!form.login.trim()) err.login = 'Введите логин';
    if (!form.password) err.password = 'Введите пароль';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const user = findUserByLogin(form.login);
    if (!user) {
      setErrors({ login: 'Пользователь с таким логином не найден' });
      return;
    }
    if (user.password !== form.password) {
      setErrors({ password: 'Неверный пароль' });
      return;
    }

    saveCurrentUser(user);
    setSuccess(true);
    setTimeout(() => navigate('/'), 1000);
  };

  return (
    <Container style={{ maxWidth: 500 }}>
      <h2 className="mb-4">Вход</h2>

      {success && (
        <Alert variant="success">
          Вы успешно вошли! Перенаправляем на главную...
        </Alert>
      )}

      <Form noValidate onSubmit={submitHandler}>
        <Form.Group className="mb-3">
          <Form.Label>Логин *</Form.Label>
          <Form.Control
            name="login"
            value={form.login}
            onChange={changeHandler}
            isInvalid={!!errors.login}
          />
          <Form.Control.Feedback type="invalid">{errors.login}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Пароль *</Form.Label>
          <Form.Control
            name="password"
            type="password"
            value={form.password}
            onChange={changeHandler}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
        </Form.Group>

        <Button variant="warning" type="submit" className="w-100 mb-3">
          Войти
        </Button>

        <p className="text-center">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </Form>
    </Container>
  );
}

export default Login;