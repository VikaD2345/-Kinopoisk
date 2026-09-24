import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import "./Auth.css";

function Auth({ mode, onSubmit, onSwitch }) {
  const isRegister = mode === "register";
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const change = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  const submit = (event) => {
    event.preventDefault();
    setError("");
    if (isRegister && form.password !== form.confirm)
      return setError("Пароли не совпадают");
    if (form.password.length < 6)
      return setError("Пароль должен содержать не менее 6 символов");
    const result = onSubmit(form);
    if (result?.error) setError(result.error);
  };

  return (
    <div className="auth-page">
      <div className="auth-page__glow" />
      <section className="auth-card">
        <p className="eyebrow">VAMS FILMS · ЛИЧНЫЙ ПРОФИЛЬ</p>
        <h1>{isRegister ? "Создать аккаунт" : "С возвращением"}</h1>
        <p className="auth-card__lead">
          {isRegister
            ? "Зарегистрируйтесь, чтобы сохранять фильмы и сериалы."
            : "Войдите, чтобы открыть избранное и продолжить просмотр."}
        </p>
        <form onSubmit={submit}>
          {isRegister && (
            <label>
              <span>Имя</span>
              <div>
                <UserRound />
                <input
                  name="name"
                  value={form.name}
                  onChange={change}
                  required
                  placeholder="Ваше имя"
                  autoComplete="name"
                />
              </div>
            </label>
          )}
          <label>
            <span>Электронная почта</span>
            <div>
              <Mail />
              <input
                name="email"
                value={form.email}
                onChange={change}
                required
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
              />
            </div>
          </label>
          <label>
            <span>Пароль</span>
            <div>
              <LockKeyhole />
              <input
                name="password"
                value={form.password}
                onChange={change}
                required
                type={showPassword ? "text" : "password"}
                placeholder="Не менее 6 символов"
                autoComplete={isRegister ? "new-password" : "current-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label="Показать пароль"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </label>
          {isRegister && (
            <label>
              <span>Повторите пароль</span>
              <div>
                <LockKeyhole />
                <input
                  name="confirm"
                  value={form.confirm}
                  onChange={change}
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Повторите пароль"
                  autoComplete="new-password"
                />
              </div>
            </label>
          )}
          {error && <p className="auth-card__error">{error}</p>}
          <button className="auth-card__submit" type="submit">
            {isRegister ? "Зарегистрироваться" : "Войти"}
            <ArrowRight />
          </button>
        </form>
        <p className="auth-card__switch">
          {isRegister ? "Уже есть аккаунт?" : "Ещё нет аккаунта?"}{" "}
          <button onClick={onSwitch}>
            {isRegister ? "Войти" : "Зарегистрироваться"}
          </button>
        </p>
      </section>
    </div>
  );
}

export default Auth;
