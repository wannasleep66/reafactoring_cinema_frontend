/**
 * Configuration constants for the application
 */

export const CONFIG = {
  // API Configuration
  API: {
    BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 0,
    DEFAULT_SIZE: 10,
    PURCHASE_PAGE_SIZE: 5,
    SESSIONS_PAGE_SIZE: 50,
    MOVIES_PAGE_SIZE: 100,
    CATEGORIES_PAGE_SIZE: 20,
  },

  // UI Dimensions
  UI: {
    MOVIE_CARD_WIDTH: "18rem",
    SEAT_BUTTON_SIZE: "50px",
    SEAT_BUTTON_GAP: "5px",
    SEAT_LEGEND_GAP: "4px",
  },

  // Review settings
  REVIEW: {
    MIN_RATING: 0,
    MAX_RATING: 5,
  },

  // Local storage keys
  STORAGE_KEYS: {
    SESSION_TOKEN: "session",
    AUTH_TOKEN: "token",
  },
} as const;
