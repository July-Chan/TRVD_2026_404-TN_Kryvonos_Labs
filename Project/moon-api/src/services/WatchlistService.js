import { watchlistRepository } from '../repositories/WatchlistRepository.js';

class WatchlistService {
    constructor(repository) {
        this.repository = repository;
    }

    async getUserWatchlist(userId) {
        if (!userId) {
            throw new Error("Missing userId");
        }
        return await this.repository.getByUserId(userId);
    }

    async addMovieToWatchlist(movieData) {
        return await this.repository.addMovie(movieData);
    }

    async removeMovie(docId) {
        if (!docId) {
            throw new Error("Missing document ID for deletion");
        }
        return await this.repository.deleteMovie(docId);
    }
}

export const watchlistService = new WatchlistService(watchlistRepository);