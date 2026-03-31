import express from 'express';
import Joi from 'joi';
import { watchlistService } from '../services/WatchlistService.js';
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

const toMovieDTO = (dbMovie) => {
    return {
        id: dbMovie.id,
        movieId: dbMovie.movieId,
        title: dbMovie.title,
        posterUrl: dbMovie.posterPath ? `https://image.tmdb.org/t/p/w500${dbMovie.posterPath}` : null,
        addedAt: dbMovie.addedAt
    };
};

router.get('/:userId', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const movies = await watchlistService.getUserWatchlist(userId);
        const moviesDTO = movies.map(toMovieDTO);
        res.status(200).json(moviesDTO);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const movieValidationSchema = Joi.object({
    userId: Joi.string().required().messages({
        'string.empty': 'Error: User ID cannot be empty',
        'any.required': 'Error: userId field is required'
    }),
    movieId: Joi.number().required().messages({
        'number.base': 'Error: Movie ID (movieId) must be a number',
        'any.required': 'Error: movieId field is required'
    }),
    title: Joi.string().required().messages({
        'string.empty': 'Error: Movie title cannot be empty',
        'any.required': 'Error: title field is required'
    }),
    posterPath: Joi.string().allow(null, '')
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { error } = movieValidationSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                status: 'Validation Error',
                message: error.details[0].message
            });
        }

        const movieData = req.body;
        const savedMovie = await watchlistService.addMovieToWatchlist(movieData);
        res.status(201).json(toMovieDTO(savedMovie));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const docId = req.params.id;
        await watchlistService.removeMovie(docId);
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/admin/secret', authenticateToken, isAdmin, (req, res) => {
    res.status(200).json({ message: 'Вітаємо в адмін-панелі! Доступ дозволено.' });
});

export default router;