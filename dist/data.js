window.HUB_DATA = {
  quotes: [
    { text: 'Ce qui trouble les hommes, ce ne sont pas les choses, mais leurs opinions sur les choses.', author: 'Épictète', work: 'Manuel, V · traduction J.-M. Guyau, 1875', category: 'Stoïcisme', source: 'https://fr.wikisource.org/wiki/Manuel_d’Épictète_(trad._Guyau)/Manuel' },
    { text: 'Il faut imaginer Sisyphe heureux.', author: 'Albert Camus', work: 'Le Mythe de Sisyphe, 1942', category: 'Littérature', source: 'https://www.cercle-enseignement.com/Ouvrages/Gallimard/NRF-Essais/Le-mythe-de-Sisyphe' },
    { text: 'Que sais-je ?', author: 'Michel de Montaigne', work: 'Essais, livre II, chapitre XII · orthographe modernisée', category: 'Philosophie', source: 'https://fr.wikisource.org/wiki/Essais/Livre_II/Chapitre_12' },
    { text: 'Je pense, donc je suis.', author: 'René Descartes', work: 'Discours de la méthode, quatrième partie · extrait, éd. Cousin, 1824', category: 'Philosophie', source: 'https://fr.wikisource.org/wiki/Discours_de_la_méthode_(éd._Cousin)/Quatrième_partie' }
  ],
  recipes: [
    { id:'risotto', title:'Risotto de saison', subtitle:'Courge rôtie, sauge & parmesan', time:35, category:'Végétarien', servings:2, art:'pumpkin', color:'#e7c9a6', ingredients:[{qty:180,unit:'g',name:'de riz arborio'},{qty:350,unit:'g',name:'de courge'},{qty:600,unit:'ml',name:'de bouillon de légumes'},{qty:1,unit:'',name:'échalote'},{qty:40,unit:'g',name:'de parmesan'},{qty:1,unit:'c. à s.',name:'d’huile d’olive'},{qty:4,unit:'',name:'feuilles de sauge'}], steps:[{text:'Préchauffe le four à 200 °C. Coupe la courge en petits dés, mélange avec la moitié de l’huile et enfourne environ 25 minutes, jusqu’à ce qu’elle soit tendre.',timer:25},{text:'Fais chauffer le bouillon dans une casserole. Émince l’échalote et fais-la revenir à feu doux dans le reste d’huile. Ajoute le riz et remue pendant 2 minutes.',timer:2},{text:'Ajoute le bouillon chaud une louche à la fois. Remue régulièrement et laisse le riz absorber le liquide avant la louche suivante. Goûte après 18 minutes ; prolonge si nécessaire.',timer:18},{text:'Hors du feu, incorpore la courge rôtie et le parmesan. Ajuste l’assaisonnement, ajoute la sauge et sers sans attendre.',timer:0}], source:'Recette originale Hub.' },
    { id:'pasta',title:'Pâtes au citron',subtitle:'Épinards, citron & ricotta',time:20,category:'Rapide',servings:2,art:'lemon',color:'#d9dfb8',ingredients:[{qty:200,unit:'g',name:'de pâtes'},{qty:120,unit:'g',name:'d’épinards'},{qty:100,unit:'g',name:'de ricotta'},{qty:1,unit:'',name:'citron'},{qty:1,unit:'c. à s.',name:'d’huile d’olive'}],steps:[{text:'Porte une grande casserole d’eau salée à ébullition. Fais cuire les pâtes selon les indications du paquet. Garde une tasse d’eau de cuisson avant d’égoutter.',timer:10},{text:'Fais tomber les épinards dans l’huile à feu moyen. Ajoute la ricotta, le zeste du citron et un peu d’eau de cuisson pour obtenir une sauce souple.',timer:3},{text:'Mélange les pâtes avec la sauce. Ajoute le jus de citron selon ton goût, poivre et sers.',timer:0}],source:'Recette originale Hub.'},
    { id:'bowl',title:'Le bol d’automne',subtitle:'Lentilles, carottes & tahini',time:30,category:'Végétarien',servings:2,art:'bowl',color:'#d9c6bc',ingredients:[{qty:140,unit:'g',name:'de lentilles vertes'},{qty:3,unit:'',name:'carottes'},{qty:2,unit:'c. à s.',name:'de tahini'},{qty:0.5,unit:'',name:'citron'},{qty:1,unit:'c. à s.',name:'d’huile d’olive'}],steps:[{text:'Préchauffe le four à 200 °C. Coupe les carottes en bâtonnets, mélange avec l’huile et enfourne pour environ 25 minutes.',timer:25},{text:'Rince les lentilles et cuis-les dans une casserole d’eau frémissante selon les indications du paquet, jusqu’à ce qu’elles soient tendres. Égoutte-les.',timer:25},{text:'Mélange le tahini et le jus de citron. Ajoute de l’eau petit à petit pour obtenir une sauce. Assemble les lentilles, les carottes et la sauce.',timer:0}],source:'Recette originale Hub.'}
  ]
};

HUB_DATA.recipes.push.apply(HUB_DATA.recipes, [
  {
    "id": "shakshuka",
    "title": "Œufs à la tomate",
    "subtitle": "Poivrons fondants & cumin",
    "time": 30,
    "category": "Végétarien",
    "servings": 2,
    "art": "pumpkin",
    "color": "#e7c6bb",
    "ingredients": [
      {
        "qty": 4,
        "unit": "",
        "name": "œufs"
      },
      {
        "qty": 400,
        "unit": "g",
        "name": "de tomates concassées"
      },
      {
        "qty": 1,
        "unit": "",
        "name": "poivron"
      },
      {
        "qty": 1,
        "unit": "",
        "name": "oignon"
      },
      {
        "qty": 1,
        "unit": "c. à c.",
        "name": "de cumin"
      },
      {
        "qty": 1,
        "unit": "c. à s.",
        "name": "d’huile d’olive"
      }
    ],
    "steps": [
      {
        "text": "Émince l’oignon et le poivron. Fais-les revenir dans l’huile pendant 8 minutes à feu moyen.",
        "timer": 8
      },
      {
        "text": "Ajoute les tomates et le cumin, puis laisse réduire 12 minutes. Sale et poivre.",
        "timer": 12
      },
      {
        "text": "Creuse quatre petits puits, casse les œufs dedans et couvre. Fais cuire 6 à 10 minutes, jusqu’à ce que les blancs soient pris. Sers avec du pain.",
        "timer": 6
      }
    ],
    "source": "Recette originale Hub."
  },
  {
    "id": "curry",
    "title": "Curry de pois chiches",
    "subtitle": "Coco, épinards & gingembre",
    "time": 25,
    "category": "Végétarien",
    "servings": 2,
    "art": "bowl",
    "color": "#e6d3bc",
    "ingredients": [
      {
        "qty": 300,
        "unit": "g",
        "name": "de pois chiches cuits égouttés"
      },
      {
        "qty": 200,
        "unit": "ml",
        "name": "de lait de coco"
      },
      {
        "qty": 150,
        "unit": "g",
        "name": "d’épinards"
      },
      {
        "qty": 150,
        "unit": "g",
        "name": "de riz"
      },
      {
        "qty": 1,
        "unit": "c. à s.",
        "name": "de curry doux"
      },
      {
        "qty": 1,
        "unit": "c. à c.",
        "name": "de gingembre râpé"
      },
      {
        "qty": 1,
        "unit": "c. à s.",
        "name": "d’huile"
      }
    ],
    "steps": [
      {
        "text": "Fais cuire le riz selon les indications du paquet. Chauffe l’huile dans une casserole et remue le curry avec le gingembre pendant une minute.",
        "timer": 1
      },
      {
        "text": "Ajoute les pois chiches et le lait de coco. Laisse frémir doucement 12 minutes en remuant.",
        "timer": 12
      },
      {
        "text": "Ajoute les épinards et laisse-les fondre 3 minutes. Ajuste l’assaisonnement et sers avec le riz.",
        "timer": 3
      }
    ],
    "source": "Recette originale Hub."
  },
  {
    "id": "soup",
    "title": "Velouté de carottes",
    "subtitle": "Lentilles corail & cumin",
    "time": 30,
    "category": "Végétarien",
    "servings": 2,
    "art": "pumpkin",
    "color": "#e4c3a9",
    "ingredients": [
      {
        "qty": 400,
        "unit": "g",
        "name": "de carottes"
      },
      {
        "qty": 100,
        "unit": "g",
        "name": "de lentilles corail"
      },
      {
        "qty": 700,
        "unit": "ml",
        "name": "de bouillon de légumes"
      },
      {
        "qty": 1,
        "unit": "",
        "name": "oignon"
      },
      {
        "qty": 1,
        "unit": "c. à c.",
        "name": "de cumin"
      },
      {
        "qty": 1,
        "unit": "c. à s.",
        "name": "d’huile"
      }
    ],
    "steps": [
      {
        "text": "Émince l’oignon et les carottes. Fais revenir l’oignon dans l’huile 3 minutes, ajoute le cumin.",
        "timer": 3
      },
      {
        "text": "Rince les lentilles. Ajoute-les avec les carottes et le bouillon. Laisse cuire environ 20 minutes, jusqu’à ce que les carottes soient tendres.",
        "timer": 20
      },
      {
        "text": "Mixe prudemment hors du feu, sans remplir un blender fermé de liquide brûlant. Ajoute un peu d’eau si besoin et ajuste l’assaisonnement.",
        "timer": 0
      }
    ],
    "source": "Recette originale Hub."
  },
  {
    "id": "gnocchi",
    "title": "Gnocchis à la poêle",
    "subtitle": "Tomates cerises & mozzarella",
    "time": 20,
    "category": "Rapide",
    "servings": 2,
    "art": "bowl",
    "color": "#d6cadf",
    "ingredients": [
      {
        "qty": 400,
        "unit": "g",
        "name": "de gnocchis frais"
      },
      {
        "qty": 250,
        "unit": "g",
        "name": "de tomates cerises"
      },
      {
        "qty": 125,
        "unit": "g",
        "name": "de mozzarella"
      },
      {
        "qty": 1,
        "unit": "c. à s.",
        "name": "d’huile d’olive"
      },
      {
        "qty": 6,
        "unit": "",
        "name": "feuilles de basilic"
      }
    ],
    "steps": [
      {
        "text": "Fais cuire les gnocchis selon le paquet, puis égoutte-les. Coupe les tomates en deux.",
        "timer": 3
      },
      {
        "text": "Fais dorer les gnocchis dans l’huile pendant 5 minutes. Ajoute les tomates et laisse cuire 5 minutes en remuant.",
        "timer": 10
      },
      {
        "text": "Hors du feu, ajoute la mozzarella en morceaux et le basilic. Sale, poivre et sers.",
        "timer": 0
      }
    ],
    "source": "Recette originale Hub."
  },
  {
    "id": "couscous",
    "title": "Couscous express",
    "subtitle": "Pois chiches, concombre & herbes",
    "time": 15,
    "category": "Rapide",
    "servings": 2,
    "art": "lemon",
    "color": "#dfd7bd",
    "ingredients": [
      {
        "qty": 160,
        "unit": "g",
        "name": "de semoule de couscous"
      },
      {
        "qty": 160,
        "unit": "ml",
        "name": "d’eau bouillante"
      },
      {
        "qty": 200,
        "unit": "g",
        "name": "de pois chiches cuits égouttés"
      },
      {
        "qty": 0.5,
        "unit": "",
        "name": "concombre"
      },
      {
        "qty": 1,
        "unit": "",
        "name": "citron"
      },
      {
        "qty": 2,
        "unit": "c. à s.",
        "name": "d’huile d’olive"
      },
      {
        "qty": 6,
        "unit": "",
        "name": "feuilles de menthe"
      }
    ],
    "steps": [
      {
        "text": "Verse l’eau bouillante sur la semoule avec une pincée de sel. Couvre 5 minutes, ou suis les proportions de ton paquet.",
        "timer": 5
      },
      {
        "text": "Coupe le concombre en dés. Rince les pois chiches et cisèle la menthe.",
        "timer": 0
      },
      {
        "text": "Égraine la semoule, puis mélange le tout avec l’huile, le jus de citron à ton goût et la menthe.",
        "timer": 0
      }
    ],
    "source": "Recette originale Hub."
  },
  {
    "id": "tartine",
    "title": "Tartines de champignons",
    "subtitle": "Ricotta & thym",
    "time": 15,
    "category": "Rapide",
    "servings": 2,
    "art": "bowl",
    "color": "#d8c8bc",
    "ingredients": [
      {
        "qty": 4,
        "unit": "",
        "name": "tranches de pain"
      },
      {
        "qty": 250,
        "unit": "g",
        "name": "de champignons"
      },
      {
        "qty": 100,
        "unit": "g",
        "name": "de ricotta"
      },
      {
        "qty": 1,
        "unit": "",
        "name": "gousse d’ail"
      },
      {
        "qty": 1,
        "unit": "c. à s.",
        "name": "d’huile d’olive"
      },
      {
        "qty": 0.5,
        "unit": "c. à c.",
        "name": "de thym"
      }
    ],
    "steps": [
      {
        "text": "Nettoie les champignons et tranche-les. Fais-les sauter dans l’huile 7 à 8 minutes pour faire évaporer leur eau.",
        "timer": 8
      },
      {
        "text": "Ajoute l’ail émincé et le thym. Poursuis 1 minute et assaisonne.",
        "timer": 1
      },
      {
        "text": "Fais griller le pain. Tartine de ricotta, ajoute les champignons chauds et un tour de poivre.",
        "timer": 0
      }
    ],
    "source": "Recette originale Hub."
  },
  {
    "id": "porridge",
    "title": "Porridge du matin",
    "subtitle": "Pomme, cannelle & noix",
    "time": 12,
    "category": "Petit-déjeuner",
    "servings": 2,
    "art": "bowl",
    "color": "#dbcfc6",
    "ingredients": [
      {
        "qty": 90,
        "unit": "g",
        "name": "de flocons d’avoine"
      },
      {
        "qty": 400,
        "unit": "ml",
        "name": "de lait ou boisson végétale"
      },
      {
        "qty": 1,
        "unit": "",
        "name": "pomme"
      },
      {
        "qty": 20,
        "unit": "g",
        "name": "de noix"
      },
      {
        "qty": 0.5,
        "unit": "c. à c.",
        "name": "de cannelle"
      }
    ],
    "steps": [
      {
        "text": "Verse les flocons et le lait dans une casserole. Fais chauffer à feu doux 7 minutes en remuant régulièrement.",
        "timer": 7
      },
      {
        "text": "Coupe la pomme en petits dés. Ajoute la moitié au porridge avec la cannelle et prolonge 2 minutes.",
        "timer": 2
      },
      {
        "text": "Répartis dans deux bols, ajoute le reste de pomme et les noix. Ajuste la texture avec un peu de lait.",
        "timer": 0
      }
    ],
    "source": "Recette originale Hub."
  },
  {
    "id": "pancakes",
    "title": "Pancakes à la banane",
    "subtitle": "Moelleux, pour les matins lents",
    "time": 20,
    "category": "Petit-déjeuner",
    "servings": 2,
    "art": "lemon",
    "color": "#e5d7c4",
    "ingredients": [
      {
        "qty": 1,
        "unit": "",
        "name": "banane mûre"
      },
      {
        "qty": 1,
        "unit": "",
        "name": "œuf"
      },
      {
        "qty": 100,
        "unit": "g",
        "name": "de farine"
      },
      {
        "qty": 100,
        "unit": "ml",
        "name": "de lait"
      },
      {
        "qty": 1,
        "unit": "c. à c.",
        "name": "de levure chimique"
      },
      {
        "qty": 1,
        "unit": "c. à c.",
        "name": "d’huile"
      }
    ],
    "steps": [
      {
        "text": "Écrase la banane, puis incorpore l’œuf et le lait. Mélange la farine avec la levure et incorpore sans trop travailler la pâte.",
        "timer": 0
      },
      {
        "text": "Huile légèrement une poêle et chauffe à feu moyen. Verse de petits tas de pâte. Retourne quand les bords se tiennent et que des bulles apparaissent, environ 2 minutes.",
        "timer": 2
      },
      {
        "text": "Cuis l’autre face 1 à 2 minutes, jusqu’à ce que le cœur soit cuit. Recommence avec le reste de pâte.",
        "timer": 2
      }
    ],
    "source": "Recette originale Hub."
  },
  {
    "id": "crumble",
    "title": "Crumble aux pommes",
    "subtitle": "Une croûte dorée, un cœur fondant",
    "time": 40,
    "category": "Dessert",
    "servings": 2,
    "art": "pumpkin",
    "color": "#e4cebc",
    "ingredients": [
      {
        "qty": 3,
        "unit": "",
        "name": "pommes"
      },
      {
        "qty": 60,
        "unit": "g",
        "name": "de farine"
      },
      {
        "qty": 40,
        "unit": "g",
        "name": "de beurre froid"
      },
      {
        "qty": 35,
        "unit": "g",
        "name": "de sucre"
      },
      {
        "qty": 0.5,
        "unit": "c. à c.",
        "name": "de cannelle"
      }
    ],
    "steps": [
      {
        "text": "Préchauffe le four à 180 °C. Coupe les pommes en petits morceaux et répartis-les dans un petit plat avec la cannelle.",
        "timer": 0
      },
      {
        "text": "Mélange la farine et le sucre. Ajoute le beurre en dés et frotte du bout des doigts pour obtenir de grosses miettes.",
        "timer": 0
      },
      {
        "text": "Répartis les miettes sur les pommes. Enfourne environ 30 minutes, jusqu’à ce que le dessus soit doré et les fruits tendres. Laisse tiédir.",
        "timer": 30
      }
    ],
    "source": "Recette originale Hub."
  }
]);
