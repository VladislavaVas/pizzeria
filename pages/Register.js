import { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { findUserByLogin, findUserByEmail, saveUser } from '../utils/storage';

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    surname: '',
    patronymic: '',
    login: '',
    email: '',
    password: '',
    password_repeat: '',
    rules: false,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const changeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const cyrillic = /^[А-Яа-яЁё\s-]+$/;
  const latinAndDigits = /^[A-Za-z0-9-]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const err = {};

    if (!form.name.trim()) {
      err.name = 'Имя обязательно для заполнения';
    } else if (!cyrillic.test(form.name)) {
      err.name = 'Разрешены только кириллица, пробел и тире';
    }

    if (!form.surname.trim()) {
      err.surname = 'Фамилия обязательна для заполнения';
    } else if (!cyrillic.test(form.surname)) {
      err.surname = 'Разрешены только кириллица, пробел и тире';
    }

    if (form.patronymic && !cyrillic.test(form.patronymic)) {
      err.patronymic = 'Разрешены только кириллица, пробел и тире';
    }

    if (!form.login.trim()) {
      err.login = 'Логин обязателен для заполнения';
    } else if (!latinAndDigits.test(form.login)) {
      err.login = 'Разрешены только латиница, цифры и тире';
    } else if (findUserByLogin(form.login)) {
      err.login = 'Такой логин уже занят';
    }

    if (!form.email.trim()) {
      err.email = 'Email обязателен для заполнения';
    } else if (!emailRegex.test(form.email)) {
      err.email = 'Некорректный email';
    } else if (findUserByEmail(form.email)) {
      err.email = 'Этот email уже зарегистрирован';
    }

    if (!form.password) {
      err.password = 'Пароль обязателен';
    } else if (form.password.length < 6) {
      err.password = 'Пароль должен быть не менее 6 символов';
    }

    if (!form.password_repeat) {
      err.password_repeat = 'Подтвердите пароль';
    } else if (form.password_repeat !== form.password) {
      err.password_repeat = 'Пароли не совпадают';
    }

    if (!form.rules) {
      err.rules = 'Необходимо согласиться с правилами регистрации';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!validate()) return;

    saveUser({
      name: form.name.trim(),
      surname: form.surname.trim(),
      patronymic: form.patronymic.trim(),
      login: form.login.trim(),
      email: form.email.trim(),
      password: form.password, 
    });

    setSuccess(true);
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <Container style={{ maxWidth: 600 }}>
      <h2 className="mb-4">Регистрация</h2>

      {success && (
        <Alert variant="success">
          Регистрация прошла успешно! Перенаправляем на страницу входа...
        </Alert>
      )}

      <Form noValidate onSubmit={submitHandler}>
        <Form.Group className="mb-3">
          <Form.Label>Имя *</Form.Label>
          <Form.Control
            name="name"
            value={form.name}
            onChange={changeHandler}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Фамилия *</Form.Label>
          <Form.Control
            name="surname"
            value={form.surname}
            onChange={changeHandler}
            isInvalid={!!errors.surname}
          />
          <Form.Control.Feedback type="invalid">{errors.surname}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Отчество</Form.Label>
          <Form.Control
            name="patronymic"
            value={form.patronymic}
            onChange={changeHandler}
            isInvalid={!!errors.patronymic}
          />
          <Form.Control.Feedback type="invalid">{errors.patronymic}</Form.Control.Feedback>
        </Form.Group>

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
          <Form.Label>Email *</Form.Label>
          <Form.Control
            name="email"
            type="email"
            value={form.email}
            onChange={changeHandler}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
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

        <Form.Group className="mb-3">
          <Form.Label>Повторите пароль *</Form.Label>
          <Form.Control
            name="password_repeat"
            type="password"
            value={form.password_repeat}
            onChange={changeHandler}
            isInvalid={!!errors.password_repeat}
          />
          <Form.Control.Feedback type="invalid">{errors.password_repeat}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id="rules"
            name="rules"
            label="Я согласен с правилами регистрации"
            checked={form.rules}
            onChange={changeHandler}
            isInvalid={!!errors.rules}
          />
          {errors.rules && (
            <div className="text-danger small mt-1">{errors.rules}</div>
          )}
        </Form.Group>

        <Button variant="warning" type="submit" className="w-100 mb-3">
          Зарегистрироваться
        </Button>

        <p className="text-center">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </Form>
    </Container>
  );
}

export default Register;