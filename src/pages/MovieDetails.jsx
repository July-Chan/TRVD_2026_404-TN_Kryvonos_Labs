import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css'; // Твої стилі

const TMDB_API_KEY = '15d2ea6d0dc1d476efbca3eba2b9bbfb'; // Твій ключ

const MovieDetails = () => {
  const { id } = useParams();
   // Дістаємо ID фільму з адресної рядка
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Шукаємо всю інформацію про фільм за його ID
    const fetchDetails = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=uk-UA`);
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Помилка завантаження деталей:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [id]);

  if (loading) return <div className="app-container" style={{ textAlign: 'center', paddingTop: '50px', opacity: 0.5 }}>Завантаження магії... 🌙</div>;
  if (!movie || movie.success === false) return <div className="app-container" style={{ textAlign: 'center', paddingTop: '50px' }}>Фільм не знайдено :(</div>;

  return (
    <div className="app-container" style={{ paddingBottom: '30px' }}>
      {/* Кнопка назад */}
      <button 
        onClick={() => navigate(-1)} 
        style={{ background: 'transparent', border: '1px solid #8a3ffc', color: 'white', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px' }}
      >
        ⬅ Назад до списку
      </button>
      
      {/* Інформація про фільм */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px' }}>
        <img 
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://placehold.co/500x750/1a1a2e/ffffff?text=No+Poster'} 
          alt={movie.title} 
          style={{ width: '150px', borderRadius: '10px', objectFit: 'cover', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
        />
        
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>{movie.title}</h1>
          {movie.tagline && <p style={{ color: '#aaa', fontStyle: 'italic', margin: '0 0 15px 0', fontSize: '14px' }}>"{movie.tagline}"</p>}
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', fontSize: '12px', flexWrap: 'wrap' }}>
            <span style={{ background: '#8a3ffc', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>
              ⭐ {movie.vote_average?.toFixed(1)}
            </span>
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '5px' }}>
              📅 {movie.release_date}
            </span>
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '5px' }}>
              ⏱ {movie.runtime} хв
            </span>
          </div>

          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Опис:</h3>
          <p style={{ margin: 0, lineHeight: '1.5', opacity: 0.8, fontSize: '14px' }}>
            {movie.overview || 'Опис українською мовою поки відсутній.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;