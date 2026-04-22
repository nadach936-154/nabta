// backend/seedUsers.js
// Script de démarrage : crée les comptes de démonstration dans MongoDB
// Exécuter UNE SEULE FOIS : node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const COMPTES_DEMO = [
  { nom:'Sarah Majjedi',        email:'sarahagri@nabta.tn',        motDePasse:'sarra936154',    role:'agriculteur',  telephone:'+216 29 544 745', adresse:'Tunis, Ariana',  cin:'15226371' },
  { nom:'Loujayen Lahmidi',     email:'loujayenfourni@nabta.tn',   motDePasse:'loujayen936154', role:'fournisseur',  telephone:'+216 21 869 285', adresse:'Sousse',         cin:'12080971' },
  { nom:'Dr. Chourouk Weslati', email:'chouroukveteri@nabta.tn',   motDePasse:'Chourouk123456', role:'veterinaire',  telephone:'+216 22 955 496', adresse:'Nabeul',         cin:'10085090' },
  { nom:'Amani Aslouje',        email:'amanitrans@nabta.tn',       motDePasse:'Amani154936',    role:'transporteur', telephone:'+216 54 571 037', adresse:'Sfax',           cin:'45678901' },
  { nom:'Admin NABTA',          email:'admin@nabta.tn',            motDePasse:'admin123456',    role:'admin',        telephone:'+216 70 000 001', adresse:'Tunis',          cin:'99999999' },
  { nom:'Nada CH',              email:'nadach936@gmail.com',       motDePasse:'936nada154',     role:'admin',        telephone:'+216 52 226 330', adresse:'Tunisie',        cin:'14049071' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connecté');

    let crees = 0, ignores = 0;

    for (const compte of COMPTES_DEMO) {
      const existe = await User.findOne({ email: compte.email });
      if (existe) {
        console.log(`⏭  Ignoré (existe déjà) : ${compte.email}`);
        ignores++;
        continue;
      }

      await new User(compte).save();
      console.log(`✅ Créé : ${compte.email} [${compte.role}]`);
      crees++;
    }

    console.log(`\n🎉 Terminé — ${crees} créé(s), ${ignores} ignoré(s)`);
    console.log('\n📋 Comptes disponibles :');
    COMPTES_DEMO.forEach(c => {
      console.log(`   ${c.role.padEnd(13)} | ${c.email.padEnd(35)} | ${c.motDePasse}`);
    });

  } catch (err) {
    console.error('❌ Erreur :', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();