const fs = require('fs');
const path = require('path');

console.log('🔧 CORRECTION AUTOMATIQUE DES IMPORTS\n');

// 1. Voir quels fichiers models existent
const modelsDir = './src/models';
const models = fs.readdirSync(modelsDir);
console.log('📁 Fichiers models trouvés :');
models.forEach(m => console.log(`   - ${m}`));

// 2. Corriger tous les contrôleurs
const controllersDir = './src/controllers';
const controllers = fs.readdirSync(controllersDir);

controllers.forEach(file => {
  if (file.endsWith('.js')) {
    const filePath = path.join(controllersDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Pour chaque modèle, vérifier si l'import est correct
    models.forEach(model => {
      const modelName = model.replace('.js', '');
      const importVariations = [
        `require('../models/${modelName}')`,
        `require('../models/${modelName}.model')`,
        `require('../models/${modelName.charAt(0).toUpperCase() + modelName.slice(1)}')`,
        `require('../models/${modelName.charAt(0).toUpperCase() + modelName.slice(1)}.model')`
      ];
      
      importVariations.forEach(variation => {
        if (content.includes(variation)) {
          const correctImport = `require('../models/${model}')`;
          if (variation !== correctImport) {
            content = content.replace(new RegExp(variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), correctImport);
            modified = true;
            console.log(`✅ ${file}: ${variation} → ${correctImport}`);
          }
        }
      });
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`   Fichier mis à jour: ${file}`);
    }
  }
});

console.log('\n✨ Correction terminée ! Relancez le serveur.');