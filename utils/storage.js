const USERS_KEY = 'pizzeria_users';

export function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUserByLogin(login) {
  return getUsers().find(
    (u) => u.login.toLowerCase() === login.toLowerCase()
  );
}

export function findUserByEmail(email) {
  return getUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

export function saveCurrentUser(user) {
  localStorage.setItem(
    'pizzeria_current_user',
    JSON.stringify({ login: user.login, name: user.name })
  );
}

export function getCurrentUser() {
  const raw = localStorage.getItem('pizzeria_current_user');
  return raw ? JSON.parse(raw) : null;
}

export function isAdmin() {
  const u = getCurrentUser();
  return !!u && u.login.toLowerCase() === 'admin';
}