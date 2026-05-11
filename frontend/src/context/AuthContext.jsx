import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import api from '../api/axios';

/**
 * Authentication Context for the Scholaro ERP application.
 * 
 * Provides auth state (user, token, loading) and actions (login, register, logout)
 * to all child components via React Context + useReducer.
 * 
 * JWT token and user data are persisted in localStorage for session persistence.
 */

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem('scholaro_user') || 'null'),
  token: localStorage.getItem('scholaro_token') || null,
  loading: true,
  error: null,
};

// Action types
const ACTIONS = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_ERROR: 'AUTH_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
};

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case ACTIONS.AUTH_START:
      return { ...state, loading: true, error: null };
    case ACTIONS.AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case ACTIONS.AUTH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ACTIONS.LOGOUT:
      return { user: null, token: null, loading: false, error: null };
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

// Context
const AuthContext = createContext(null);

/**
 * AuthProvider component — wraps the app and provides auth state/actions.
 */
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On mount, verify the stored token is still valid
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('scholaro_token');
      if (!token) {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return;
      }
      try {
        const response = await api.get('/auth/me');
        const user = {
          email: response.data.email,
          fullName: response.data.fullName,
          role: response.data.role,
        };
        dispatch({
          type: ACTIONS.AUTH_SUCCESS,
          payload: { user, token },
        });
      } catch {
        // Token is invalid — clear everything
        localStorage.removeItem('scholaro_token');
        localStorage.removeItem('scholaro_user');
        dispatch({ type: ACTIONS.LOGOUT });
      }
    };
    verifyToken();
  }, []);

  /**
   * Register a new user account.
   */
  const register = useCallback(async (formData) => {
    dispatch({ type: ACTIONS.AUTH_START });
    try {
      const response = await api.post('/auth/register', formData);
      const { token, email, fullName, role } = response.data;
      const user = { email, fullName, role };

      // Persist to localStorage
      localStorage.setItem('scholaro_token', token);
      localStorage.setItem('scholaro_user', JSON.stringify(user));

      dispatch({ type: ACTIONS.AUTH_SUCCESS, payload: { user, token } });
      return { success: true, message: response.data.message };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.';
      dispatch({ type: ACTIONS.AUTH_ERROR, payload: message });
      return { success: false, message };
    }
  }, []);

  /**
   * Log in with email and password.
   */
  const login = useCallback(async (email, password) => {
    dispatch({ type: ACTIONS.AUTH_START });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, fullName, role } = response.data;
      const user = { email: response.data.email, fullName, role };

      localStorage.setItem('scholaro_token', token);
      localStorage.setItem('scholaro_user', JSON.stringify(user));

      dispatch({ type: ACTIONS.AUTH_SUCCESS, payload: { user, token } });
      return { success: true, message: response.data.message };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Invalid email or password.';
      dispatch({ type: ACTIONS.AUTH_ERROR, payload: message });
      return { success: false, message };
    }
  }, []);

  /**
   * Log out — clear token and user data.
   */
  const logout = useCallback(() => {
    localStorage.removeItem('scholaro_token');
    localStorage.removeItem('scholaro_user');
    dispatch({ type: ACTIONS.LOGOUT });
  }, []);

  /**
   * Clear the current error message.
   */
  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!state.token && !!state.user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access auth context.
 * Must be used within an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
