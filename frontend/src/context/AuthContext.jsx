// src/context/AuthContext.jsx
// ✅ Corrections BUG 3, 5, 8 : usersStore complet avec updateUser + removeUser
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { MOCK_USERS } from '../data/mockData';

const AuthContext = createContext();
const USERS_KEY   = 'nabta_all_users_v3';
const TOKEN_KEY   = 'nabta_token';

// ════════════════════════════════════════════════════════════════════════════
// USERS STORE — persiste dans localStorage
// ════════════════════════════════════════════════════════════════════════════
export const usersStore = {
  _getLocal() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
  },
  _saveLocal(list) {
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
  },

  // Tous les utilisateurs = MOCK + localStorage (sans doublons)
  getAll() {
    try {
      const local     = this._getLocal();
      const localEmails = new Set(local.map(u => u.email?.toLowerCase()));
      const mocks     = MOCK_USERS.filter(u => !localEmails.has(u.email?.toLowerCase()));
      return [...mocks, ...local];
    } catch { return MOCK_USERS; }
  },

  // ✅ Ajouter un nouvel inscrit (avec toutes ses coordonnées)
  add(user) {
    try {
      const local   = this._getLocal();
      const existe  = local.find(u => u.email?.toLowerCase() === user.email?.toLowerCase());
      if (!existe) {
        local.push({
          ...user,
          actif:       true,
          dateCreation: new Date().toISOString(),
        });
        this._saveLocal(local);
      }
    } catch {}
  },

  // ✅ BUG 5 : Mettre à jour les coordonnées d'un utilisateur
  updateUser(email, updates) {
    try {
      const local = this._getLocal();
      const idx   = local.findIndex(u => u.email?.toLowerCase() === email?.toLowerCase());
      if (idx !== -1) {
        local[idx] = { ...local[idx], ...updates };
        this._saveLocal(local);
      }
    } catch {}
  },

  // ✅ BUG 5 : Supprimer un compte
  removeUser(email) {
    try {
      const local = this._getLocal().filter(u => u.email?.toLowerCase() !== email?.toLowerCase());
      this._saveLocal(local);
    } catch {}
  },

  findByEmail(email) {
    return this.getAll().find(u => u.email?.toLowerCase() === email?.toLowerCase());
  },
};

// ════════════════════════════════════════════════════════════════════════════
// AUTH PROVIDER
// ════════════════════════════════════════════════════════════════════════════
export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
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
      setUser({ ...data.user, actif: true });
    } catch {
      localStorage.removeItem(TOKEN_KEY);
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
      localStorage.setItem(TOKEN_KEY, data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      const userData = {
        id:        data.user.id || data.user._id,
        nom:       data.user.nom,
        email:     data.user.email,
        role:      data.user.role,
        telephone: data.user.telephone || '',
        adresse:   data.user.adresse   || '',
        actif:     true,
      };
      setUser(userData);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Email ou mot de passe incorrect.' };
    }
  }, []);

  const register = useCallback(async (formData) => {
    try {
      const { data } = await axios.post('/api/auth/inscription', {
        ...formData,
        email: formData.email.toLowerCase().trim(),
      });
      localStorage.setItem(TOKEN_KEY, data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      const userData = {
        id:        data.user.id || data.user._id,
        nom:       formData.nom,
        email:     formData.email.toLowerCase().trim(),
        role:      formData.role,
        telephone: formData.telephone || '',
        adresse:   formData.adresse   || '',
        cin:       formData.cin       || '',
        actif:     true,
        dateCreation: new Date().toISOString(),
      };
      setUser(userData);

      // ✅ BUG 3 & 8 : Sauvegarde COMPLÈTE avec toutes les coordonnées
      usersStore.add(userData);

      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Erreur lors de l'inscription." };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
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