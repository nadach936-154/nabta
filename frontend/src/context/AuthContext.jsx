// src/context/AuthContext.jsx
// Les nouveaux inscrits sont sauvegardés dans localStorage ET envoyés au backend
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { MOCK_USERS } from '../data/mockData';

const AuthContext = createContext();

const USERS_STORAGE_KEY = 'nabta_all_users_v2';

// ── Gestion des utilisateurs locaux (inscrits depuis l'app) ──────────────────
export const usersStore = {
  getAll() {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      const local = saved ? JSON.parse(saved) : [];
      // Fusionner avec les users mockés (sans doublons)
      const allEmails = new Set(local.map(u => u.email));
      const mocks = MOCK_USERS.filter(u => !allEmails.has(u.email));
      return [...mocks, ...local];
    } catch {
      return MOCK_USERS;
    }
  },
  add(user) {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      const local = saved ? JSON.parse(saved) : [];
      // Éviter les doublons
      const existe = local.find(u => u.email === user.email);
      if (!existe) {
        local.push(user);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(local));
      }
    } catch {}
  },
  findByEmail(email) {
    return this.getAll().find(u => u.email?.toLowerCase() === email?.toLowerCase());
  },
};

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('nabta_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      verifierToken();
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line
  }, []);

  const verifierToken = async () => {
    try {
      const { data } = await axios.get('/api/auth/moi');
      setUser(data.user);
    } catch {
      localStorage.removeItem('nabta_token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email, motDePasse) => {
    try {
      const { data } = await axios.post('/api/auth/connexion', {
        email: email.toLowerCase().trim(),
        motDePasse,
      });
      localStorage.setItem('nabta_token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      const userData = { ...data.user, actif: true };
      setUser(userData);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Email ou mot de passe incorrect.',
      };
    }
  }, []);

  const register = useCallback(async (formData) => {
    try {
      const { data } = await axios.post('/api/auth/inscription', {
        ...formData,
        email: formData.email.toLowerCase().trim(),
      });
      localStorage.setItem('nabta_token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      const userData = {
        id:        data.user.id,
        nom:       data.user.nom,
        email:     data.user.email,
        role:      data.user.role,
        telephone: formData.telephone || '',
        adresse:   formData.adresse   || '',
        actif:     true,
      };
      setUser(userData);

      // ✅ Sauvegarder dans le store local pour que les autres le voient
      usersStore.add(userData);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Erreur lors de l'inscription.",
      };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('nabta_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);