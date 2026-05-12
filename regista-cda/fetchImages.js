import puppeteer from 'puppeteer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const playersList = [
    'Pelé', 'Diego Maradona', 'Lionel Messi', 'Cristiano Ronaldo', 'Zinedine Zidane'
];

async function fetchAndUploadImages() {
    console.log("🚀 Changement de cible : Scraping sur Bing Images...");
    const results = [];
    
    const browser = await puppeteer.launch({ 
        headless: false, 
        defaultViewport: null 
    });
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

    for (const playerName of playersList) {
        console.log(`\n🔍 Recherche pour : ${playerName}...`);
        
        try {
            const searchQuery = encodeURIComponent(`${playerName} football render png`);
            // On cible Bing, beaucoup moins strict !
            await page.goto(`https://www.bing.com/images/search?q=${searchQuery}`, { waitUntil: 'networkidle2' });

            // On attend que les images de Bing chargent (classe mimg)
            await page.waitForSelector('img.mimg', { timeout: 5000 }).catch(() => {});

            // Extraction de l'image
            const imageUrl = await page.evaluate(() => {
                // Sur Bing, les images principales ont la classe 'mimg'
                const imgElement = document.querySelector('img.mimg');
                if (imgElement) {
                    return imgElement.getAttribute('src') || imgElement.getAttribute('data-src');
                }
                return null;
            });

            if (imageUrl && imageUrl.startsWith('http')) {
                console.log(`✅ Image détectée sur Bing ! Upload sur Cloudinary...`);
                
                const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
                    folder: "regista_players",
                    public_id: playerName.replace(/\s+/g, '_').toLowerCase() 
                });

                console.log(`☁️ Upload réussi ! URL: ${uploadResponse.secure_url}`);
                results.push({ name: playerName, cloudinary_url: uploadResponse.secure_url });
            } else {
                console.warn(`⚠️ Bing n'a pas trouvé d'image exploitable pour ${playerName}.`);
                results.push({ name: playerName, cloudinary_url: null });
            }
        } catch (error) {
            console.error(`❌ Erreur pour ${playerName}:`, error.message);
            results.push({ name: playerName, cloudinary_url: null });
        }

        // Pause de 2 secondes
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    await browser.close();

    fs.writeFileSync('players_images.json', JSON.stringify(results, null, 2));
    console.log("\n🎉 TERMINE ! Le fichier 'players_images.json' a été mis à jour.");
}

fetchAndUploadImages();