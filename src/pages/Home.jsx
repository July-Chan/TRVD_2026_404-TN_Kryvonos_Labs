import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import '../App.css';

const TMDB_API_KEY = 'c8282b948e28647029c446fa9bef20f8'; 

const Home = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Завантаження списку користувача
  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const savedEmail = localStorage.getItem('userEmail') || 'andrey.gdedno@gmail.com'; 
      const response = await api.get(`/watchlist/${savedEmail}`); 
      setMovies(response.data);
    } catch (error) {
      console.error("Помилка завантаження:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWatchlist(); }, []);

  // ФУНКЦІЯ ЖИВОГО ПОШУКУ В TMDB
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 3) {
      setSearchResults([]); // Шукаємо тільки якщо введено 3+ символи
      return;
    }

    try {
      setIsSearching(true);
      // Робимо запит до TMDB українською мовою
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&language=uk-UA`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Помилка пошуку:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // ФУНКЦІЯ ДОДАВАННЯ ФІЛЬМУ ЗІ СПИСКУ ПОШУКУ
  const handleAddFromSearch = async (tmdbMovie) => {
    try {
      const savedEmail = localStorage.getItem('userEmail') || 'andrey.gdedno@gmail.com';
      
      const newMovieData = {
        userId: savedEmail,
        movieId: tmdbMovie.id,
        title: tmdbMovie.title || tmdbMovie.original_title,
        posterPath: tmdbMovie.poster_path 
      };

      const response = await api.post('/watchlist', newMovieData); 
      
      // Додаємо новий фільм у наш список на екрані
      setMovies([response.data, ...movies]);
      
      // Очищаємо пошук після успішного додавання
      setSearchQuery('');
      setSearchResults([]);
      alert(`Фільм "${newMovieData.title}" успішно додано! 🍿`);
    } catch (error) {
      alert("Помилка при додаванні. Можливо, він вже є у списку.");
      console.error(error);
    }
  };

  // ФУНКЦІЯ ВИДАЛЕННЯ
  const handleDelete = async (id) => {
    if (window.confirm("Ви впевнені, що хочете видалити цей фільм?")) {
      try {
        await api.delete(`/watchlist/${id}`);
        setMovies(movies.filter(m => m.id !== id));
      } catch (error) { alert("Помилка видалення"); }
    }
  };

  return (
    <div className="app-container">
      {/* Шапка */}
      <div className="header">
        <div>
          <h2 style={{ margin: 0 }}>Hello, {localStorage.getItem('userName') || 'Movie Fan'}</h2>
          <p style={{ margin: 0, opacity: 0.6, fontSize: '12px' }}>{localStorage.getItem('userEmail')}</p>
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#8a3ffc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            {(localStorage.getItem('userName') || 'M').charAt(0).toUpperCase()}
        </div>
      </div>

      {/* РОЗУМНИЙ ПОШУКОВИЙ РЯДОК */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <div className="search-box">
          <span>🔍</span>
          <input 
            type="text" 
            placeholder="Шукати фільм для додавання..." 
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ width: '100%', background: 'transparent', border: 'none', color: 'white', outline: 'none' }}
          />
        </div>

        {/* ВИПАДАЮЧИЙ СПИСОК РЕЗУЛЬТАТІВ */}
        {searchResults.length > 0 && (
          <div style={{ 
            position: 'absolute', top: '100%', left: 0, right: 0, 
            background: '#1a1a2e', border: '1px solid #8a3ffc', borderRadius: '10px', 
            marginTop: '5px', maxHeight: '300px', overflowY: 'auto', zIndex: 100,
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
          }}>
            {searchResults.map((movie) => (
              <div key={movie.id} style={{ display: 'flex', padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', alignItems: 'center' }}>
                <img 
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : 'https://placehold.co/92x138/1a1a2e/ffffff?text=No+Img'} 
                  alt={movie.title} 
                  style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '5px', marginRight: '15px' }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{movie.title}</h4>
                  <span style={{ fontSize: '11px', opacity: 0.6 }}>★ {movie.vote_average?.toFixed(1)} | {movie.release_date?.substring(0, 4)}</span>
                </div>
                <button 
                  onClick={() => handleAddFromSearch(movie)}
                  style={{ background: '#8a3ffc', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ➕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WATCHLIST */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0' }}>My Watchlist</h3>
        {loading ? <p style={{opacity: 0.5}}>Завантаження списку...</p> : movies.length === 0 ? <p style={{opacity: 0.5}}>Список порожній.</p> : movies.map((movie) => {
          
          // Створення надійний ID для переходу (беремо movieId, якщо нема - звичайний id)
          const validMovieId = movie.movieId || movie.id;

          return (
          <div key={movie.id} className="promo-card" style={{ height: '120px', marginBottom: '10px' }}>
            {/* Картинка з переходом */}
            <img 
              onClick={() => navigate(`/movie/${validMovieId}`)}
              src={movie.posterUrl?.startsWith('http') ? movie.posterUrl : `https://image.tmdb.org/t/p/w500${movie.posterPath || ''}`} 
              alt={movie.title} 
              onError={(e) => e.target.src = "https://placehold.co/500x750/1a1a2e/ffffff?text=Moon+Poster"}
              style={{ cursor: 'pointer', objectFit: 'cover' }} 
            />
            
            <div className="promo-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flex: 1 }}>
              <div>
                {/* Назва з переходом */}
                <h4 
                  onClick={() => navigate(`/movie/${validMovieId}`)}
                  style={{ margin: 0, cursor: 'pointer' }}
                >
                  {movie.title}
                </h4>
                <p style={{ margin: 0, fontSize: '11px', opacity: 0.8 }}>ID: {validMovieId}</p>
              </div>
              
              {/* Кнопка видалення */}
              <button 
                onClick={(e) => { 
                  e.stopPropagation();
                  handleDelete(movie.id); 
                }} 
                style={{ background: '#ff4d4d', border: 'none', borderRadius: '5px', padding: '5px 8px', cursor: 'pointer' }}
              >
                🗑️
              </button>
            </div>
          </div>
        )})}
      </div>

      <div style={{ textAlign: 'center', paddingBottom: '80px' }}>
        <button onClick={logout} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}>Logout (Вийти)</button>
      </div>
    </div>
  );
};

export default Home;