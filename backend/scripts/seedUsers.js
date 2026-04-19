// backend/scripts/seedUsers.js
// ✅ CORRECTION 401 : utilise le vrai modèle User (avec lowercase + bcrypt hook)

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nabta';

// ✅ Utiliser le VRAI modèle User (pas un schéma inline)
// Cela garantit que lowercase:true et le hook bcrypt s'appliquent
const User = require('../models/User');

const COMPTES = [
  {
    nom:       'Sarah Majjedi',
    email:     'sarahagri@nabta.tn',       // ✅ minuscules
    motDePasse:'sarra936154',
    role:      'agriculteur',
    telephone: '+216 29 544 745',
    adresse:   'Tunis, Ariana',
    cin:       '15226371',
  },
  {
    nom:       'Loujayen Lahmidi',
    email:     'loujayenfourni@nabta.tn',  // ✅ minuscules
    motDePasse:'loujayen936154',
    role:      'fournisseur',
    telephone: '+216 21 869 285',
    adresse:   'Sousse',
    cin:       '12080971',
  },
  {
    nom:       'Dr. Chourouk Weslati',
    email:     'chouroukveteri@nabta.tn',  // ✅ CORRIGÉ (était Chouroukveteri)
    motDePasse:'Chourouk123456',
    role:      'veterinaire',
    telephone: '+216 22 955 496',
    adresse:   'Nabeul',
    cin:       '10085090',
  },
  {
    nom:       'Amani Aslouje',
    email:     'amanitrans@nabta.tn',      // ✅ CORRIGÉ (était Amanitrans)
    motDePasse:'Amani154936',
    role:      'transporteur',
    telephone: '+216 54 571 037',
    adresse:   'Sfax',
    cin:       '45678901',
  },
  {
    nom:       'Admin NABTA',
    email:     'admin@nabta.tn',
    motDePasse:'admin123',                 // ✅ min 6 caractères (était 'admin' = 5!)
    role:      'admin',
    telephone: '+216 70 000 001',
    adresse:   'Tunis',
    cin:       '',
  },
  {
    nom:       'Nada CH',
    email:     'nadach936@gmail.com',
    motDePasse:'936nada154',
    role:      'admin',
    telephone: '+216 52 226 330',
    adresse:   'Tunisie',
    cin:       '14049071',
  },
];

async function seed() {
  console.log('\n🔄 Connexion à MongoDB...');
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connecté à:', MONGO_URI);
    console.log('');

    for (const c of COMPTES) {
      const emailLower = c.email.toLowerCase().trim();

      // Supprimer l'ancien document si email en majuscules existe
      await User.deleteOne({ email: emailLower });

      // Créer avec le vrai modèle → bcrypt hook + lowercase automatiques
      const user = new User({
        nom:       c.nom,
        email:     emailLower,
        motDePasse:c.motDePasse,   // ← sera hashé par le hook pre-save
        role:      c.role,
        telephone: c.telephone,
        adresse:   c.adresse,
        cin:       c.cin,
        isActive:  true,
      });
      await user.save();  // ← déclenche le hook bcrypt

      console.log(`✅ ${c.role.padEnd(14)} | ${emailLower.padEnd(35)} | mdp: ${c.motDePasse}`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Seed terminé ! Comptes pour se connecter :');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    COMPTES.forEach(c => {
      console.log(`  ${c.role.padEnd(14)} | ${c.email.toLowerCase().padEnd(35)} | ${c.motDePasse}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  Note : admin@nabta.tn → mot de passe changé à "admin123" (min 6 chars)\n');

  } catch (err) {
    console.error('❌ Erreur:', err.message);
    if (err.code === 11000) {
      console.error('   Doublon email. Réessayez après avoir vidé la collection.');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté\n');
  }
}

seed();