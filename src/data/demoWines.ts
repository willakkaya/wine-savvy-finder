import { WineInfo } from '@/components/wine/WineCard';
import chateauMargauxImg from '@/assets/wine-chateau-margaux.jpg';
import caymusImg from '@/assets/wine-caymus.jpg';
import cloudyBayImg from '@/assets/wine-cloudy-bay.jpg';
import opusOneImg from '@/assets/wine-opus-one.jpg';
import domPerignonImg from '@/assets/wine-dom-perignon.jpg';
import yquemImg from '@/assets/wine-yquem.jpg';
import penfoldsImg from '@/assets/wine-penfolds-grange.jpg';
import tignanelloImg from '@/assets/wine-tignanello.jpg';
import sassicaiaImg from '@/assets/wine-sassicaia.jpg';
import silverOakImg from '@/assets/wine-silver-oak.jpg';
import whisperingAngelImg from '@/assets/wine-whispering-angel.jpg';
import stagsLeapImg from '@/assets/wine-stags-leap.jpg';

export const demoWines: WineInfo[] = [
  {
    id: '1',
    name: 'Château Margaux',
    winery: 'Château Margaux',
    year: 2018,
    region: 'Margaux',
    country: 'France',
    price: 450,
    marketPrice: 650,
    rating: 4.8,
    valueScore: 92,
    wineType: 'red',
    imageUrl: chateauMargauxImg
  },
  {
    id: '2',
    name: 'Caymus Cabernet Sauvignon',
    winery: 'Caymus Vineyards',
    year: 2020,
    region: 'Napa Valley',
    country: 'USA',
    price: 85,
    marketPrice: 120,
    rating: 4.5,
    valueScore: 88,
    wineType: 'red',
    imageUrl: caymusImg
  },
  {
    id: '3',
    name: 'Cloudy Bay Sauvignon Blanc',
    winery: 'Cloudy Bay',
    year: 2022,
    region: 'Marlborough',
    country: 'New Zealand',
    price: 28,
    marketPrice: 35,
    rating: 4.3,
    valueScore: 85,
    wineType: 'white',
    imageUrl: cloudyBayImg
  },
  {
    id: '4',
    name: 'Opus One',
    winery: 'Opus One Winery',
    year: 2019,
    region: 'Napa Valley',
    country: 'USA',
    price: 320,
    marketPrice: 425,
    rating: 4.7,
    valueScore: 90,
    wineType: 'red',
    imageUrl: opusOneImg
  },
  {
    id: '5',
    name: 'Dom Pérignon',
    winery: 'Moët & Chandon',
    year: 2012,
    region: 'Champagne',
    country: 'France',
    price: 180,
    marketPrice: 220,
    rating: 4.9,
    valueScore: 94,
    wineType: 'sparkling',
    imageUrl: domPerignonImg
  },
  {
    id: '6',
    name: 'Château d\'Yquem',
    winery: 'Château d\'Yquem',
    year: 2017,
    region: 'Sauternes',
    country: 'France',
    price: 280,
    marketPrice: 380,
    rating: 4.8,
    valueScore: 91,
    wineType: 'dessert',
    imageUrl: yquemImg
  },
  {
    id: '7',
    name: 'Penfolds Grange',
    winery: 'Penfolds',
    year: 2018,
    region: 'Barossa Valley',
    country: 'Australia',
    price: 420,
    marketPrice: 580,
    rating: 4.7,
    valueScore: 89,
    wineType: 'red',
    imageUrl: penfoldsImg
  },
  {
    id: '8',
    name: 'Tignanello',
    winery: 'Antinori',
    year: 2019,
    region: 'Tuscany',
    country: 'Italy',
    price: 95,
    marketPrice: 130,
    rating: 4.6,
    valueScore: 87,
    wineType: 'red',
    imageUrl: tignanelloImg
  },
  {
    id: '9',
    name: 'Sassicaia',
    winery: 'Tenuta San Guido',
    year: 2018,
    region: 'Bolgheri',
    country: 'Italy',
    price: 220,
    marketPrice: 290,
    rating: 4.8,
    valueScore: 93,
    wineType: 'red',
    imageUrl: sassicaiaImg
  },
  {
    id: '10',
    name: 'Silver Oak Cabernet Sauvignon',
    winery: 'Silver Oak Cellars',
    year: 2017,
    region: 'Napa Valley',
    country: 'USA',
    price: 110,
    marketPrice: 145,
    rating: 4.4,
    valueScore: 86,
    wineType: 'red',
    imageUrl: silverOakImg
  },
  {
    id: '11',
    name: 'Whispering Angel',
    winery: 'Château d\'Esclans',
    year: 2022,
    region: 'Provence',
    country: 'France',
    price: 22,
    marketPrice: 28,
    rating: 4.2,
    valueScore: 84,
    wineType: 'rose',
    imageUrl: whisperingAngelImg
  },
  {
    id: '12',
    name: 'Stag\'s Leap Wine Cellars Artemis',
    winery: 'Stag\'s Leap Wine Cellars',
    year: 2019,
    region: 'Napa Valley',
    country: 'USA',
    price: 48,
    marketPrice: 65,
    rating: 4.3,
    valueScore: 85,
    wineType: 'red',
    imageUrl: stagsLeapImg
  }
];
