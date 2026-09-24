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
      'https://placehold.co/600x900/101827/67e8f9?text=Silent+Orbit',
      'https://example.com/video-placeholder'
    ),
    (
      'Последний фонарь',
      'Смотритель старого маяка находит дневник, который меняет историю небольшого приморского города.',
      2021,
      'https://placehold.co/600x900/172033/fbbf24?text=Last+Lantern',
      'https://example.com/video-placeholder'
    ),
    (
      'Кофе на Марсе',
      'Два инженера открывают первое кафе в марсианской колонии и случайно становятся местными знаменитостями.',
      2025,
      'https://placehold.co/600x900/7c2d12/fef3c7?text=Coffee+on+Mars',
      'https://example.com/video-placeholder'
    ),
    (
      'Карта северного ветра',
      'Молодая картограф отправляется на поиски острова, которого нет ни на одной современной карте.',
      2020,
      'https://placehold.co/600x900/164e63/ecfeff?text=North+Wind+Map',
      'https://example.com/video-placeholder'
    ),
    (
      'Тень в архиве',
      'Архивист замечает, что документы о давно закрытом деле начинают исчезать прямо у него на глазах.',
      2023,
      'https://placehold.co/600x900/1f2937/f87171?text=Archive+Shadow',
      'https://example.com/video-placeholder'
    ),
    (
      'Робот по имени Пиксель',
      'Маленький ремонтный робот покидает завод, чтобы найти создателя своей любимой мелодии.',
      2022,
      'https://placehold.co/600x900/312e81/a5f3fc?text=Robot+Pixel',
      'https://example.com/video-placeholder'
    ),
    (
      'Параллельный маршрут',
      'Водитель ночного автобуса обнаруживает остановку, которая появляется только раз в десять лет.',
      2019,
      'https://placehold.co/600x900/3f3f46/c4b5fd?text=Parallel+Route',
      'https://example.com/video-placeholder'
    ),
    (
      'Выходной для героя',
      'Уставший супергерой пытается провести обычный выходной, но город постоянно просит его о помощи.',
      2024,
      'https://placehold.co/600x900/7f1d1d/fef08a?text=Hero+Day+Off',
      'https://example.com/video-placeholder'
    ),
    (
      'Дюна: Часть вторая',
      'Пол Атрейдес объединяется с Чани и фременами, чтобы отомстить заговорщикам, уничтожившим его семью. Перед ним выбор между любовью всей жизни и судьбой Вселенной.',
      2024,
      'https://media.themoviedb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg',
      'https://vk.com/video_ext.php?oid=-220018529&id=456249050&hash=f17af595bbee8507&__ref=vk.web2'
    ),
    (
      'Джон Уик',
      'Сын главы русской мафии отнимает у Джона Уика всё, что ему дорого. Бывший наёмный убийца вновь берётся за оружие и выходит на тропу мести.',
      2014,
      'https://media.themoviedb.org/t/p/w500/wXqWR7dHncNRbxoEGybEy7QTe9h.jpg',
      'https://example.com/videos/john-wick'
    ),
    (
      'Джон Уик 2',
      'Джон вынужден вернуться из отставки из-за кровной клятвы. В Риме он сталкивается с опаснейшими убийцами мира и узнаёт, какую цену назначили за его голову.',
      2017,
      'https://media.themoviedb.org/t/p/w500/hXWBc0ioZP3cN4zCu6SN3YHXZVO.jpg',
      'https://example.com/videos/john-wick-2'
    ),
    (
      'Джон Уик 4',
      'Джон Уик находит путь к победе над Правлением кланов. Но прежде ему предстоит сразиться с новым врагом, у которого есть могущественные союзники по всему миру.',
      2023,
      'https://media.themoviedb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
      'https://example.com/videos/john-wick-4'
    ),
    (
      'Мстители: Финал',
      'Оставшиеся в живых Мстители и их союзники пытаются обратить вспять разрушительные действия Таноса и восстановить равновесие во Вселенной.',
      2019,
      'https://media.themoviedb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg',
      'https://example.com/videos/avengers-endgame'
    ),
    (
      'Мстители: Война бесконечности',
      'Мстители и их союзники должны пожертвовать всем, чтобы остановить Таноса, прежде чем он соберёт все Камни Бесконечности и уничтожит половину Вселенной.',
      2018,
      'https://media.themoviedb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
      'https://example.com/videos/infinity-war'
    ),
    (
      'Железный человек',
      'Миллиардер и изобретатель Тони Старк попадает в плен, где создаёт высокотехнологичный костюм. Вернувшись домой, он решает использовать своё изобретение для защиты людей.',
      2008,
      'https://media.themoviedb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
      'https://example.com/videos/iron-man'
    ),
    (
      'Первый мститель: Противостояние',
      'Политическое давление раскалывает команду Мстителей: Стив Роджерс отстаивает независимость героев, а Тони Старк поддерживает государственный контроль.',
      2016,
      'https://media.themoviedb.org/t/p/w500/rAGiXaUfPzY7CDEyNKUofk3Kw2e.jpg',
      'https://example.com/videos/civil-war'
    ),
    (
      'Тор: Рагнарёк',
      'Оказавшись в плену на другой планете, Тор должен победить Халка в гладиаторском поединке и успеть спасти Асгард от беспощадной Хелы.',
      2017,
      'https://media.themoviedb.org/t/p/w500/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg',
      'https://example.com/videos/thor-ragnarok'
    ),
    (
      'Чёрная Пантера',
      'Т’Чалла возвращается в технологически развитую Ваканду, чтобы занять трон. Появление могущественного противника ставит под угрозу судьбу его народа и всего мира.',
      2018,
      'https://media.themoviedb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg',
      'https://example.com/videos/black-panther'
    ),
    (
      'Стражи Галактики. Часть 3',
      'Питер Квилл и команда вновь отправляются в опасную миссию — на этот раз, чтобы спасти жизнь Ракеты и сохранить свою необычную семью.',
      2023,
      'https://media.themoviedb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg',
      'https://example.com/videos/guardians-3'
    ),
    (
      'Лига справедливости Зака Снайдера',
      'Брюс Уэйн и Диана Принс собирают команду людей со сверхспособностями, чтобы защитить Землю от надвигающейся угрозы катастрофического масштаба.',
      2021,
      'https://media.themoviedb.org/t/p/w500/tnAuB8q5vv7Ax9UAEje5Xi4BXik.jpg',
      'https://example.com/videos/justice-league'
    ),
    (
      'Бэтмен',
      'Бэтмен расследует серию загадочных убийств представителей элиты Готэма. Следы приводят его к коррупции, связанной с прошлым собственной семьи.',
      2022,
      'https://media.themoviedb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
      'https://example.com/videos/the-batman'
    ),
    (
      'Оппенгеймер',
      'История физика Роберта Оппенгеймера, который возглавил Манхэттенский проект и оказался в центре моральных и политических последствий создания атомной бомбы.',
      2023,
      'https://media.themoviedb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      'https://example.com/videos/oppenheimer'
    ),
    (
      'Интерстеллар',
      'Когда Земля становится непригодной для жизни, группа исследователей отправляется через червоточину на поиски нового дома для человечества.',
      2014,
      'https://media.themoviedb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg',
      'https://example.com/videos/interstellar'
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

INSERT INTO public.series (
  id,
  title,
  original,
  year,
  end_year,
  rating,
  age,
  duration,
  genres,
  director,
  description,
  image,
  src
)
VALUES
  (
    'breaking-bad',
    'Во все тяжкие',
    'Breaking Bad',
    2008,
    2013,
    9.5,
    '18+',
    '5 сезонов',
    ARRAY['криминал', 'драма'],
    'Винс Гиллиган',
    'Школьный учитель химии Уолтер Уайт узнаёт, что смертельно болен. Чтобы обеспечить будущее семьи, он начинает производить метамфетамин вместе с бывшим учеником.',
    'https://placehold.co/600x900?text=Breaking+Bad',
    'https://example.com/videos/breaking-bad'
  ),
  (
    'the-last-of-us',
    'Одни из нас',
    'The Last of Us',
    2023,
    NULL,
    8.7,
    '18+',
    '2 сезона',
    ARRAY['драма', 'постапокалипсис'],
    'Крейг Мейзин, Нил Дракманн',
    'Спустя двадцать лет после гибели цивилизации Джоэл должен вывести четырнадцатилетнюю Элли из карантинной зоны и пересечь вместе с ней разрушенную Америку.',
    'https://placehold.co/600x900?text=The+Last+of+Us',
    'https://example.com/videos/the-last-of-us'
  ),
  (
    'stranger-things',
    'Очень странные дела',
    'Stranger Things',
    2016,
    NULL,
    8.6,
    '16+',
    '4 сезона',
    ARRAY['фантастика', 'ужасы'],
    'Братья Даффер',
    'Исчезновение мальчика в тихом городке открывает тайну правительственных экспериментов, сверхъестественных сил и девочки с необычными способностями.',
    'https://placehold.co/600x900?text=Stranger+Things',
    'https://example.com/videos/stranger-things'
  ),
  (
    'the-boys',
    'Пацаны',
    'The Boys',
    2019,
    NULL,
    8.7,
    '18+',
    '4 сезона',
    ARRAY['боевик', 'чёрная комедия'],
    'Эрик Крипке',
    'Группа мстителей пытается вывести на чистую воду супергероев, которые злоупотребляют славой и безнаказанностью под защитой могущественной корпорации.',
    'https://placehold.co/600x900?text=The+Boys',
    'https://example.com/videos/the-boys'
  ),
  (
    'loki',
    'Локи',
    'Loki',
    2021,
    2023,
    8.2,
    '16+',
    '2 сезона',
    ARRAY['фантастика', 'приключения'],
    'Майкл Уолдрон',
    'Локи, укравший Тессеракт, попадает в Управление временными изменениями — организацию, которая следит за порядком в бесконечной череде реальностей.',
    'https://placehold.co/600x900?text=Loki',
    'https://example.com/videos/loki'
  ),
  (
    'mandalorian',
    'Мандалорец',
    'The Mandalorian',
    2019,
    NULL,
    8.5,
    '16+',
    '3 сезона',
    ARRAY['фантастика', 'приключения'],
    'Джон Фавро',
    'Одинокий охотник за головами странствует по окраинам галактики и берётся за заказ, который навсегда меняет его жизнь.',
    'https://placehold.co/600x900?text=The+Mandalorian',
    'https://example.com/videos/mandalorian'
  ),
  (
    'wednesday',
    'Уэнздей',
    'Wednesday',
    2022,
    NULL,
    8.0,
    '16+',
    '2 сезона',
    ARRAY['фэнтези', 'детектив'],
    'Альфред Гоф, Майлз Миллар',
    'Уэнздей Аддамс поступает в академию Невермор, где осваивает экстрасенсорные способности и расследует серию загадочных убийств.',
    'https://placehold.co/600x900?text=Wednesday',
    'https://example.com/videos/wednesday'
  ),
  (
    'game-of-thrones',
    'Игра престолов',
    'Game of Thrones',
    2011,
    2019,
    9.2,
    '18+',
    '8 сезонов',
    ARRAY['фэнтези', 'драма'],
    'Дэвид Бениофф, Д. Б. Уайсс',
    'В Вестеросе знатные дома вступают в жестокую борьбу за Железный трон, пока на далёком Севере пробуждается древняя угроза.',
    'https://placehold.co/600x900?text=Game+of+Thrones',
    'https://example.com/videos/game-of-thrones'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  original = EXCLUDED.original,
  year = EXCLUDED.year,
  end_year = EXCLUDED.end_year,
  rating = EXCLUDED.rating,
  age = EXCLUDED.age,
  duration = EXCLUDED.duration,
  genres = EXCLUDED.genres,
  director = EXCLUDED.director,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  src = EXCLUDED.src;

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
