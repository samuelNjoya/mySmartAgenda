import sqlite3 from 'sqlite3'; // commande pour voir le contenu de la bd "node scripts/view_db.js"
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, '../database.yaml');
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, 'utf8'));

const {
  'sqlite_path': sqlitePath,
} = dbConfig;

const db = new sqlite3.Database(sqlitePath);

console.log('========================================');
console.log(' CONTENU DE LA BASE DE DONNÉES');
console.log('========================================\n');

db.serialize(() => {
  // Afficher les employés
  console.log('👥 EMPLOYÉS\n');
  console.log('─'.repeat(120));
  
  db.all('SELECT * FROM employees', [], (err, rows) => {
    if (err) {
      console.error('Erreur:', err);
      return;
    }
    
    if (rows.length === 0) {
      console.log('Aucun employé trouvé.\n');
    } else {
      rows.forEach((row, index) => {
        console.log(`\n[${index + 1}] ID: ${row.id}`);
        console.log(`    Nom: ${row.full_name}`);
        console.log(`    Email: ${row.email}`);
        console.log(`    Téléphone: ${row.phone_number || 'N/A'}`);
        console.log(`    Date de naissance: ${row.date_of_birth}`);
        console.log(`    Poste: ${row.job_title}`);
        console.log(`    Département: ${row.department}`);
        console.log(`    Salaire: ${row.salary} FCFA`);
        console.log(`    Date de début: ${row.start_date}`);
        console.log(`    Date de fin: ${row.end_date || 'En cours'}`);
      });
      console.log(`\n Total: ${rows.length} employés`);
    }
    
    console.log('\n' + '─'.repeat(120));
    
    // Afficher les feuilles de temps
    console.log('\n FEUILLES DE TEMPS\n');
    console.log('─'.repeat(120));
    
    const query = `
      SELECT 
        t.id,
        t.start_time,
        t.end_time,
        t.summary,
        e.full_name as employee_name,
        e.job_title
      FROM timesheets t
      JOIN employees e ON t.employee_id = e.id
      ORDER BY t.start_time DESC
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('Erreur:', err);
        return;
      }
      
      if (rows.length === 0) {
        console.log('Aucune feuille de temps trouvée.\n');
      } else {
        rows.forEach((row, index) => {
          console.log(`\n[${index + 1}] ID: ${row.id}`);
          console.log(`    Employé: ${row.employee_name} (${row.job_title})`);
          console.log(`    Début: ${row.start_time}`);
          console.log(`    Fin: ${row.end_time}`);
          console.log(`    Résumé: ${row.summary || 'N/A'}`);
          
          // Calculer la durée
          const start = new Date(row.start_time);
          const end = new Date(row.end_time);
          const hours = (end - start) / (1000 * 60 * 60);
          console.log(`    Durée: ${hours.toFixed(1)} heures`);
        });
        console.log(`\n Total: ${rows.length} feuilles de temps`);
      }
      
      console.log('\n' + '─'.repeat(120));
      
      // Statistiques
      console.log('\n STATISTIQUES\n');
      console.log('─'.repeat(120));
      
      db.get('SELECT COUNT(*) as count FROM employees', [], (err, row) => {
        if (!err) console.log(`✓ Nombre d'employés: ${row.count}`);
      });
      
      db.get('SELECT COUNT(*) as count FROM timesheets', [], (err, row) => {
        if (!err) console.log(`✓ Nombre de feuilles de temps: ${row.count}`);
      });
      
      db.get('SELECT COUNT(DISTINCT department) as count FROM employees', [], (err, row) => {
        if (!err) console.log(`✓ Nombre de départements: ${row.count}`);
      });
      
      db.get('SELECT AVG(salary) as avg FROM employees', [], (err, row) => {
        if (!err) console.log(`✓ Salaire moyen: ${row.avg?.toFixed(2)} FCFA`);
      });
      
      db.all('SELECT department, COUNT(*) as count FROM employees GROUP BY department', [], (err, rows) => {
        if (!err && rows.length > 0) {
          console.log('\n✓ Employés par département:');
          rows.forEach(row => {
            console.log(`   - ${row.department}: ${row.count}`);
          });
        }
      });
      
      console.log('\n' + '─'.repeat(120));
      console.log('\n Affichage terminé!\n');
      
      db.close();
    });
  });
});