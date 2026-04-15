// backend/scripts/seedUsers.js
// ✅ TOUS les emails en minuscules obligatoirement

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nabta';

const userSchema = new mongoose.Schema({
  nom:          String,
  email:        { type: String, unique: true },
  motDePasse:   String,
  cin:          { type: String, default: '' },
  role:         String,
  telephone:    { type: String, default: '' },
  adresse:      { type: String, default: '' },
  isActive:     { type: Boolean, default: true },
  dateCreation: { type: Date, default: Date.now },
});
const User = mongoose.model('User', userSchema);

const COMPTES = [
  {
    nom:   'Sarah Majjedi',
    email: 'sarahagri@nabta.tn',         // ✅ minuscules
    mdp:   'sarra936154',
    role:  'agriculteur',
    tel:   '+216 29 544 745',
    adr:   'Tunis, Ariana',
    cin:   '15226371',
  },
  {
    nom:   'Loujayen Lahmidi',
    email: 'loujayenfourni@nabta.tn',    // ✅ minuscules
    mdp:   'loujayen936154',
    role:  'fournisseur',
    tel:   '+216 21 869 285',
    adr:   'Sousse',
    cin:   '12080971',
  },
  {
    nom:   'Dr. Chourouk Weslati',
    email: 'chouroukveteri@nabta.tn',    // ✅ CORRIGÉ (était Chouroukveteri)
    mdp:   'Chourouk123456',
    role:  'veterinaire',
    tel:   '+216 22 955 496',
    adr:   'Nabeul',
    cin:   '10085090',
  },
  {
    nom:   'Amani Aslouje',
    email: 'amanitrans@nabta.tn',        // ✅ CORRIGÉ (était Amanitrans)
    mdp:   'Amani154936',
    role:  'transporteur',
    tel:   '+216 54 571 037',
    adr:   'Sfax',
    cin:   '45678901',
  },
  {
    nom:   'Admin NABTA',
    email: 'admin@nabta.tn',
    mdp:   'admin',
    role:  'admin',
    tel:   '+216 70 000 001',
    adr:   'Tunis',
    cin:   '99999999',
  },
  {
    nom:   'Nada CH',
    email: 'nadach936@gmail.com',
    mdp:   '936nada154',
    role:  'admin',
    tel:   '+216 52 226 330',
    adr:   'Tunisie',
    cin:   '14049071',
  },
];

async function seed() {
  console.log('\n🔄 Connexion à MongoDB...');
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connecté à:', MONGO_URI);
    console.log('');

    for (const c of COMPTES) {
      const emailLower = c.email.toLowerCase().trim(); // ← toujours minuscules
      const hash       = await bcrypt.hash(c.mdp, 10);

      await User.findOneAndUpdate(
        { email: emailLower },
        {
          nom:        c.nom,
          email:      emailLower,   // ← sauvegardé en minuscules
          motDePasse: hash,
          cin:        c.cin,
          role:       c.role,
          telephone:  c.tel,
          adresse:    c.adr,
          isActive:   true,
        },
        { upsert: true, new: true }
      );
      console.log(`✅ ${c.role.padEnd(14)} | ${emailLower.padEnd(35)} | ${c.mdp}`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Comptes disponibles :');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    COMPTES.forEach(c => {
      console.log(`  ${c.role.padEnd(14)} | ${c.email.toLowerCase().padEnd(35)} | ${c.mdp}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (err) {
    console.error('❌ Erreur:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté');
  }
}

seed();