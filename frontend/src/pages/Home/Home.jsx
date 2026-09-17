import { useEffect, useState } from 'react'
import ContinueWatchingCard from '../../components/ContinueWatchingCard/ContinueWatchingCard'
import Hero from '../../components/Hero/Hero'
import MovieCard from '../../components/MovieCard/MovieCard'
import SectionTitle from '../../components/SectionTitle/SectionTitle'
import Sidebar from '../../components/Sidebar/Sidebar'
import { continueWatching, heroMovie, trendingMovies } from '../../data/movies'
import './Home.css'

function Home() {
  const [movies, setMovies] = useState(trendingMovies)
  const [isLoadingMovies, setIsLoadingMovies] = useState(true)

  // Позже эту функцию можно передать в форму добавления фильма.
  const _addMovie = (newMovie) => {
    setMovies((currentMovies) => [...currentMovies, newMovie])
  }

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const response = await fetch('http://localhost:3000/movies')

        if (!response.ok) {
          throw new Error('Не удалось загрузить фильмы')
        }

        const moviesFromServer = await response.json()

        if (Array.isArray(moviesFromServer)) {
          setMovies(moviesFromServer)
        }
      } catch (error) {
        // Пока backend может быть не запущен: оставляем mock-данные на экране.
        console.warn('Используются временные данные фильмов:', error)
      } finally {
        setIsLoadingMovies(false)
      }
    }

    loadMovies()
  }, [])

  return (
    <div className="home">
      <Sidebar />
      <main className="home__main">
        <Hero movie={heroMovie} />
        <div className="home__content">
          <section className="home__section">
            <SectionTitle>Продолжить просмотр</SectionTitle>
            <div className="continue-row">
              {continueWatching.map((movie) => (
                <ContinueWatchingCard {...movie} key={movie.id} />
              ))}
            </div>
          </section>

          <section className="home__section" id="trending">
            <SectionTitle>Сейчас в тренде</SectionTitle>
            <div className="trending-grid">
              {isLoadingMovies && <p className="movies-status">Загрузка фильмов...</p>}

              {movies.map(({ id, title, year, poster, rating }) => (
                <MovieCard
                  id={id}
                  key={id}
                  title={title}
                  year={year}
                  poster={poster}
                  rating={rating}
                  onClick={() => {}}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Home
