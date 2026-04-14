// backend/scripts/seedUsers.js
// Commande : node scripts/seedUsers.js

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nabta';

const userSchema = new mongoose.Schema({
  nom:          String,
  email:        { type:String, unique:true },
  motDePasse:   String,
  cin:          { type:String, default:'' },
  role:         String,
  telephone:    { type:String, default:'' },
  adresse:      { type:String, default:'' },
  isActive:     { type:Boolean, default:true },
  dateCreation: { type:Date, default:Date.now },
});
const User = mongoose.model('User', userSchema);

const COMPTES = [
  {  nom:'Sarah Majjedi',    email:'sarahagri@nabta.tn', mdp:'sarra936154', role:'agriculteur',  tel:'+21629544745', adr:'Tunis, Ariana', cin:'15226371' },
  {  nom:'Loujayen lahmidi',     email:'loujayenfourni@nabta.tn', mdp:'loujayen936154', role:'fournisseur',  tel:'+216 21 869 285', adr:'Sousse',  cin:'12080971' },
  { nom:'Dr.Chourouk Weslati',email:'Chouroukveteri@nabta.tn', mdp:'Chourouk123456', role:'veterinaire',  tel:'+216 22 955 496', adr:'Nabeul',  cin:'10085090' },
  {  nom:'Amani Aslouje',      email:'Amanitrans@nabta.tn',mdp:'Amani154936', role:'transporteur', tel:'+216 54 571 037', adr:'Sfax',   cin:'45678901' },
  { nom:'Admin NABTA2',      email:'admin@nabta.tn',       mdp:'admin',  role:'admin',        tel:'+216 70 000 001', adr:'Tunis', cin:'99999999' },
  {  nom:'Nada CH',          email:'nadach936@gmail.com',  mdp:'936nada154', role:'admin',    tel:'+216 52 226 330', adr:'Tunisie',     cin:'14049071' },
];

async function seed() {
  console.log('🔄 Connexion à MongoDB...');
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connecté à:', MONGO_URI);
    console.log('');

    for (const c of COMPTES) {
      const hash = await bcrypt.hash(c.mdp, 10);
      await User.findOneAndUpdate(
        { email: c.email },
        { nom:c.nom, email:c.email, motDePasse:hash, cin:c.cin, role:c.role, telephone:c.tel, adresse:c.adr, isActive:true },
        { upsert:true, new:true }
      );
      console.log(`✅ ${c.role.padEnd(14)} | ${c.email.padEnd(32)} | mdp: ${c.mdp}`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Seed terminé ! Comptes disponibles :');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    COMPTES.forEach(c => {
      console.log(`  ${c.email.padEnd(35)} → ${c.mdp}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (err) {
    console.error('❌ Erreur:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

seed();