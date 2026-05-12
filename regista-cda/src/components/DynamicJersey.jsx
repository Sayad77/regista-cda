import React from 'react';

// Dictionnaire des couleurs
const getJerseyColors = (flagCode) => {
  if (!flagCode) return { primary: '#333', text: '#fff' };

  const colorsMap = {
    'FR': { primary: '#1A237E', text: '#fff' }, // France
    'AR': { primary: '#81D4FA', text: '#333' }, // Argentine
    'PT': { primary: '#B71C1C', text: '#FFD600' }, // Portugal
    'BR': { primary: '#FFEB3B', text: '#1B5E20' }, // Brésil
    'ES': { primary: '#B71C1C', text: '#FFD600' }, // Espagne
    'GB-ENG': { primary: '#fff', text: '#1A237E' }, // Angleterre
    'IT': { primary: '#0D47A1', text: '#FFD600' }, // Italie
    'DE': { primary: '#fff', text: '#000' }, // Allemagne
  };

  return colorsMap[flagCode.toUpperCase()] || { primary: '#2a2a2a', text: '#ffd700' };
};

const getLegendaryNumber = (id) => {
  const luckyNumbers = [10, 7, 9, 8, 5, 21, 14, 1, 11, 23, 4, 6];
  const index = id ? (id % luckyNumbers.length) : 0;
  return luckyNumbers[index];
};

function DynamicJersey({ player }) {
  const { id, name, flag } = player;
  const colors = getJerseyColors(flag);
  const number = getLegendaryNumber(id);
  
  const nameParts = name ? name.split(' ') : ['JOUEUR'];
  const lastName = nameParts[nameParts.length - 1].toUpperCase();

  // 🪄 ICI LES DEUX FICHIERS QUE TU VIENS DE CRÉER
  const maskUrl = '/regista-cda/players/maillot_masque.svg';
  const textureUrl = '/regista-cda/players/maillot_texture.png'; // <-- Bien en .png !

  return (
    <div className="dynamic-jersey-wrapper">
      
      {/* 1. La Couche de Couleur découpée par le SVG */}
      <div 
        className="jersey-color-layer"
        style={{
          backgroundColor: colors.primary,
          WebkitMaskImage: `url('${maskUrl}')`, 
          maskImage: `url('${maskUrl}')`
        }}
      ></div>

      {/* 2. La Couche de Texture (Plis et ombres) superposée */}
      <div 
        className="jersey-shadow-layer"
        style={{ backgroundImage: `url('${textureUrl}')` }}
      ></div>

      {/* 3. Les Textes */}
      <div className="jersey-text-layer">
        <div className="jersey-number" style={{ color: colors.text }}>
          {number}
        </div>
        <div className="jersey-name" style={{ color: colors.text }}>
          {lastName}
        </div>
      </div>

    </div>
  );
}

export default DynamicJersey;