BEGIN;

WITH genre_seed(name) AS (
  VALUES
    ('Фантастика'),
    ('Драма'),
    ('Комедия'),
    ('Приключения'),
    ('Триллер'),
    ('Анимация')
), missing_genres AS (
  SELECT genre_seed.name
  FROM genre_seed
  WHERE NOT EXISTS (
    SELECT 1 FROM public.genres WHERE genres.name = genre_seed.name
  )
)
INSERT INTO public.genres (name)
SELECT name
FROM missing_genres;

WITH movie_seed(title, description, year, image, src) AS (
  VALUES
    (
      'Орбита молчания',
      'Экипаж исследовательской станции пытается восстановить связь с Землёй после загадочного импульса.',
      2024,
      'https://placehold.co/600x900?text=Poster',
      'https://example.com/video-placeholder'
    ),
    (
      'Последний фонарь',
      'Смотритель старого маяка находит дневник, который меняет историю небольшого приморского города.',
      2021,
      'https://placehold.co/600x900?text=Poster',
      'https://example.com/video-placeholder'
    ),
    (
      'Кофе на Марсе',
      'Два инженера открывают первое кафе в марсианской колонии и случайно становятся местными знаменитостями.',
      2025,
      'https://placehold.co/600x900?text=Poster',
      'https://example.com/video-placeholder'
    ),
    (
      'Карта северного ветра',
      'Молодая картограф отправляется на поиски острова, которого нет ни на одной современной карте.',
      2020,
      'https://placehold.co/600x900?text=Poster',
      'https://example.com/video-placeholder'
    ),
    (
      'Тень в архиве',
      'Архивист замечает, что документы о давно закрытом деле начинают исчезать прямо у него на глазах.',
      2023,
      'https://placehold.co/600x900?text=Poster',
      'https://example.com/video-placeholder'
    ),
    (
      'Робот по имени Пиксель',
      'Маленький ремонтный робот покидает завод, чтобы найти создателя своей любимой мелодии.',
      2022,
      'https://placehold.co/600x900?text=Poster',
      'https://example.com/video-placeholder'
    ),
    (
      'Параллельный маршрут',
      'Водитель ночного автобуса обнаруживает остановку, которая появляется только раз в десять лет.',
      2019,
      'https://placehold.co/600x900?text=Poster',
      'https://example.com/video-placeholder'
    ),
    (
      'Выходной для героя',
      'Уставший супергерой пытается провести обычный выходной, но город постоянно просит его о помощи.',
      2024,
      'https://placehold.co/600x900?text=Poster',
      'https://example.com/video-placeholder'
    )
), missing_movies AS (
  SELECT movie_seed.*
  FROM movie_seed
  WHERE NOT EXISTS (
    SELECT 1 FROM public.movies WHERE movies.title = movie_seed.title
  )
)
INSERT INTO public.movies (title, description, year, image, src)
SELECT
  title,
  description,
  year,
  image,
  src
FROM missing_movies;

INSERT INTO public.users (name, email, role)
VALUES
  ('Администратор', 'admin@example.com', 'admin'),
  ('Анна Смирнова', 'anna@example.com', 'client'),
  ('Михаил Орлов', 'mikhail@example.com', 'client'),
  ('Елена Волкова', 'elena@example.com', 'client')
ON CONFLICT (email) DO NOTHING;

WITH relation_seed(movie_title, genre_name) AS (
  VALUES
    ('Орбита молчания', 'Фантастика'),
    ('Орбита молчания', 'Триллер'),
    ('Последний фонарь', 'Драма'),
    ('Кофе на Марсе', 'Фантастика'),
    ('Кофе на Марсе', 'Комедия'),
    ('Карта северного ветра', 'Приключения'),
    ('Карта северного ветра', 'Драма'),
    ('Тень в архиве', 'Триллер'),
    ('Тень в архиве', 'Драма'),
    ('Робот по имени Пиксель', 'Анимация'),
    ('Робот по имени Пиксель', 'Приключения'),
    ('Параллельный маршрут', 'Триллер'),
    ('Параллельный маршрут', 'Фантастика'),
    ('Выходной для героя', 'Комедия'),
    ('Выходной для героя', 'Приключения')
)
INSERT INTO public.movie_genres (movie_id, genre_id)
SELECT movies.id, genres.id
FROM relation_seed
JOIN public.movies ON movies.title = relation_seed.movie_title
JOIN public.genres ON genres.name = relation_seed.genre_name
ON CONFLICT (movie_id, genre_id) DO NOTHING;

WITH review_seed(movie_title, user_email, rating, comment) AS (
  VALUES
    ('Орбита молчания', 'anna@example.com', 9, 'Атмосферная фантастика с сильной концовкой.'),
    ('Орбита молчания', 'mikhail@example.com', 8, 'Хорошее напряжение и интересная идея.'),
    ('Последний фонарь', 'elena@example.com', 8, 'Тихая и красивая история.'),
    ('Кофе на Марсе', 'anna@example.com', 7, 'Лёгкая комедия для вечернего просмотра.'),
    ('Карта северного ветра', 'mikhail@example.com', 9, 'Отличное приключение и живые персонажи.'),
    ('Тень в архиве', 'elena@example.com', 8, 'Интрига держится почти до самого финала.'),
    ('Робот по имени Пиксель', 'anna@example.com', 10, 'Добрый мультфильм с отличным юмором.'),
    ('Параллельный маршрут', 'mikhail@example.com', 7, 'Необычная задумка, хотелось бы больше деталей.'),
    ('Выходной для героя', 'elena@example.com', 9, 'Смешно и динамично, герои запоминаются.')
)
INSERT INTO public.reviews (movie_id, user_id, rating, comment)
SELECT movies.id, users.id, review_seed.rating, review_seed.comment
FROM review_seed
JOIN public.movies ON movies.title = review_seed.movie_title
JOIN public.users ON users.email = review_seed.user_email
ON CONFLICT (movie_id, user_id) DO NOTHING;

COMMIT;
