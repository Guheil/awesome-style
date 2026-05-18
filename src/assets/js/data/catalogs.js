(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  const data = (app.data = app.data || {});

  const diningVenueData = {
    restaurant: {
      title: "Restaurant",
      cuisine: "Asian Favorites, Filipino Fusion",
      description:
        "Experience exquisite dining at Awesome Hotel's restaurant in San Juan, La Union. Indulge in breathtaking ocean views and savor delectable cuisine featuring fresh, local ingredients.",
      hours: ["Daily: Open 24/7 (Sunday - Saturday)"],
      image:
        "https://awesomehotel.com/wp-content/uploads/2025/09/restaurant-new.jpg",
      alt: "Restaurant",
    },
    lobbyCafe: {
      title: "Lobby Cafe",
      cuisine: "Freshly Brewed Coffees, Pastries",
      description:
        "Discover a delightful oasis of coffee and coastal charm at our cafe in San Juan, La Union. Whether you are seeking a caffeine fix to kickstart your day or a cozy spot to unwind with a sweet treat, our coffee shop offers a delightful escape.",
      hours: ["Daily: 7:00 AM - 12:00 AM (Sunday - Saturday)"],
      image:
        "https://awesomehotel.com/wp-content/uploads/2025/09/lobby-cafe.jpg",
      alt: "Lobby Cafe",
    },
    sportsBar: {
      title: "Sports Bar",
      cuisine: "Cocktails, Beer, Bar Bites",
      description:
        "Experience the vibrant nightlife of La Union at our stunning beachfront bar. Nestled along the shores of San Juan, unwind with refreshing cocktails, ice-cold beers, and a delicious selection of bar snacks as you soak up the stunning ocean views and lively atmosphere.",
      hours: [
        "Monday - Thursday: 10:00 AM - 12:00 AM",
        "Friday - Sunday: 10:00 AM - 3:00 AM",
        "Happy Hour:",
        "Monday - Friday: 4:00 PM - 7:00 PM",
      ],
      image:
        "https://awesomehotel.com/wp-content/uploads/2025/09/sports-bar.jpg",
      alt: "Sports Bar",
    },
    breakfastBuffet: {
      title: "Breakfast Buffet",
      cuisine: "Western Delight, Filipino Favorites",
      description:
        "At our hotel in La Union, the breakfast buffet is a feast for the senses, featuring a diverse selection of international and local favorites, all prepared with the freshest ingredients. From hearty classics to lighter fare, there is something to tantalize every taste bud.",
      hours: [
        "Daily (Sunday - Saturday)",
        "Breakfast: 7:00 AM - 10:00 AM (Walk-in)",
      ],
      image:
        "https://awesomehotel.com/wp-content/uploads/2025/09/breakfast-buffet.jpg",
      alt: "Breakfast Buffet",
    },
  };

  const restaurantMenuData = {
    whatsNew: {
      label: "What's New",
      items: [
        {
          name: "Slow Roasted Angus Beef",
          price: 700,
          desc: "Slow roasted U.S beef short plate in Kare-Kare\u2026",
        },
        {
          name: "Adobo Overload",
          price: 650,
          desc: "Steamed pork adobo & sticky rice on banana leaf\u2026",
        },
        {
          name: "Authentic Lengua Estofado",
          price: 750,
          desc: "Ox tongue cooked in tomato sauce with green\u2026",
        },
        {
          name: "Rainbow Crab Rolls",
          price: 520,
          desc: "Sushi rice filled with shredded crab sticks topped\u2026",
        },
        {
          name: "The Veggie Mate",
          price: 650,
          desc: "Crispy vegetable burger, topped with mango\u2026",
        },
        {
          name: "Middle Eastern Mezzeh",
          price: 850,
          desc: "Served with arabic bread\u2026",
        },
        {
          name: "Dinakdakan Pizza",
          price: 800,
          desc: "Homemade pizza dough topped with pork ear\u2026",
        },
        {
          name: "Vegetables Truffle Oil Risotto",
          price: 600,
          desc: "Saut\u00e9ed button mushrooms with Arborio risotto\u2026",
        },
        {
          name: "Mussel Provencale",
          price: 850,
          desc: "Black mussels in white wine sauce, vine\u2026",
        },
        {
          name: "Arabic Mix Grill",
          price: 3500,
          desc: "A classic combination of shish tawouk, shish\u2026",
        },
      ],
    },
    hotAppetizers: {
      label: "Hot Appetizers & Soups",
      items: [
        {
          name: "Potato Bacon Chowder",
          price: 320,
          desc: "Rich & creamy potato soup with bacon\u2026",
        },
        {
          name: "Mussel Provencale",
          price: 500,
          desc: "Black mussels in white wine sauce, vine\u2026",
        },
        {
          name: "Garlic Prawns",
          price: 850,
          desc: "Prawn tossed with garlic, white wine, cream\u2026",
        },
        {
          name: "Deep Fried Prawns",
          price: 850,
          desc: "Prawn coated with breadcrumbs; served\u2026",
        },
        {
          name: "Awesome Salad",
          price: 600,
          desc: "Chef\u2019s creation with seasonal lettuce, orange\u2026",
        },
        {
          name: "Smoked Salmon",
          price: 680,
          desc: "Served on a bed of garden greens\u2026",
        },
        {
          name: "Fried Chicken",
          price: 350,
          desc: "Chicken strips skewers marinated\u2026",
        },
        {
          name: "Chicken Satay",
          price: 350,
          desc: "Skewered chicken strips marinated with\u2026",
        },
        {
          name: "Beef Salpicao",
          price: 480,
          desc: "Skewered beef strips marinated with\u2026",
        },
        {
          name: "Cioppino",
          price: 680,
          desc: "Seafood tomato base soup infused with fresh\u2026",
        },
      ],
    },
    sandwichBurger: {
      label: "Sandwich Board & Burger Magic",
      items: [
        {
          name: "Minute Steak Sandwich",
          price: 680,
          desc: "Flattened beef fillet with iceberg lettuce\u2026",
        },
        {
          name: "Bacon & Cheese Steak Sandwich",
          price: 680,
          desc: "French baguette filled with Mongolian beef\u2026",
        },
        {
          name: "Cheese Burger",
          price: 580,
          desc: "250 grams of minced ground beef, charcoal\u2026",
        },
        {
          name: "Beef Burger",
          price: 580,
          desc: "Minced beef grilled to perfection in freshly baked\u2026",
        },
        {
          name: "Submarine Sandwich",
          price: 480,
          desc: "Kraft corn baguette filled with iceberg lettuce\u2026",
        },
        {
          name: "Eggplant, Prosciutto Pesto Sandwich",
          price: 580,
          desc: "Homemade tomato & black olive focaccia filled\u2026",
        },
        {
          name: "Awesome Signature Sandwich",
          price: 480,
          desc: "Toast layered with grilled chicken breast, pork\u2026",
        },
        {
          name: "Mexican Chicken Burger",
          price: 580,
          desc: "Cajun spice-infused chicken breast topped\u2026",
        },
      ],
    },
    asianFavorites: {
      label: "Asian Favorites",
      items: [
        {
          name: "Pad Thai",
          price: 520,
          desc: "Traditional spicy, sweet and sour stir-fried rice\u2026",
        },
        {
          name: "Indian Curry",
          price: null,
          desc: "Authentic with your choice of chicken, shrimp\u2026",
        },
        {
          name: "Chicken Pad Kra Pao",
          price: 450,
          desc: "Stir-fried minced chicken, Thai herbs, spring\u2026",
        },
        {
          name: "Awesome\u2019s Homemade Chicken Biryani",
          price: 480,
          desc: "A popular & delicious rice dish with spices\u2026",
        },
        {
          name: "Shrimp Tempura Maki Rolls",
          price: 750,
          desc: "Batter-fried shrimps rolled with mango and cucumber\u2026",
        },
        {
          name: "Laksa Lemak",
          price: 480,
          desc: "Noodle soup cooked in coconut milk\u2026",
        },
        {
          name: "Awesome Sushi Boat",
          price: 1450,
          desc: "Crazy California maki rolls (8 slices) tuna\u2026",
        },
        {
          name: "Norwegian Sushi Boat",
          price: 1950,
          desc: "Philadelphia Cheese maki rolls (8 slices)\u2026",
        },
        {
          name: "Seafood Tom Yum",
          price: 480,
          desc: "Shrimp, squid & button mushroom cooked\u2026",
        },
        {
          name: "Sweet & Sour Pork",
          price: 480,
          desc: "Fried pork belly, saut\u00e9ed with vegetables\u2026",
        },
      ],
    },
    charcoalGrilled: {
      label: "Charcoal Grilled",
      items: [
        {
          name: "Angus Rib Eye Steak 450 Grams",
          price: 2800,
          desc: "Grilled to your preference served with your choice\u2026",
        },
        {
          name: "Ribeye Steak Midwest 450G",
          price: 2100,
          desc: "Grilled to your preference; served with choice\u2026",
        },
        {
          name: "Fillet Mignon 250 Grams",
          price: 1250,
          desc: "Beef Fillet wrapped with pork bacon grilled to\u2026",
        },
        {
          name: "Lamb Cutlet 375 Grams",
          price: 2100,
          desc: "Grilled to your perfection; served with choice\u2026",
        },
        {
          name: "Chicken Rosemary",
          price: 600,
          desc: "Grilled chicken thigh marinated with fresh\u2026",
        },
        {
          name: "Salmon Tarragon",
          price: 900,
          desc: "Grilled fillet of salmon marinated with garlic\u2026",
        },
        {
          name: "Tiger Prawns",
          price: 950,
          desc: "Grilled & served with choice of seasonal buttered vegetables\u2026",
        },
        {
          name: "Family Mix Seafood Platter",
          price: 6100,
          desc: "Grilled tiger prawns, tuna steak, salmon fillet\u2026",
        },
        {
          name: "Family Mix Meat Platter",
          price: 6800,
          desc: "Charcoal-grilled, Angus ribeye steak, Beef fillet\u2026",
        },
        {
          name: "Sausage Platter",
          price: 2800,
          desc: "International sausages grilled & served on a bed\u2026",
        },
      ],
    },
    filipinoFusion: {
      label: "Filipino Fusion",
      items: [
        {
          name: "Paella Stuffed Squid",
          price: 2500,
          desc: "Traditional wood fire cooked seafood paella\u2026",
        },
        {
          name: "Adobo Overload",
          price: 650,
          desc: "Steamed pork adobo & sticky rice on banana leaf\u2026",
        },
        {
          name: "Authentic Lengua Estofado",
          price: 750,
          desc: "Ox tongue cooked in tomato sauce with green\u2026",
        },
        {
          name: "Prawn Laing",
          price: 720,
          desc: "Grilled tiger prawns with Dijon coconut cream\u2026",
        },
        {
          name: "Foie Gras Laced Lamb",
          price: 980,
          desc: "Slow braised lamb shank in Kaldereta olive sauce\u2026",
        },
        {
          name: "Slow Roasted Angus Beef",
          price: 620,
          desc: "Slow roasted U.S beef short plate in Kare-Kare\u2026",
        },
        {
          name: "Grilled Beef TenderLoin (Bistekstyle)",
          price: 980,
          desc: "Calamansi & soya pepper spiced tenderloin\u2026",
        },
      ],
    },
    vegetarian: {
      label: "Vegetarian",
      items: [
        {
          name: "Indian Vegetable Curry",
          price: 450,
          desc: "Seasonal vegetables infused with Indian spices\u2026",
        },
        {
          name: "Vegetable Tempura",
          price: 550,
          desc: "Seasonal vegetables coated with a light batter\u2026",
        },
        {
          name: "Vegetarian Pizza",
          price: 750,
          desc: "Fresh tomato, mushroom, mozzarella cheese\u2026",
        },
        {
          name: "Napolitana Pizza",
          price: 800,
          desc: "Homemade tomato sauce with fresh torn basil\u2026",
        },
        {
          name: "Aglia E Olio Pasta",
          price: 600,
          desc: "Your choice of pasta cooked in garlic\u2026",
        },
        {
          name: "Vegetables Truffle Oil Risotto",
          price: 600,
          desc: "Saut\u00e9ed button mushrooms with Arborio risotto\u2026",
        },
        {
          name: "Bocconcini Caprese",
          price: 890,
          desc: "Mozzarella cheese balls with sundried tomatoes\u2026",
        },
        {
          name: "Awesome Salad",
          price: 450,
          desc: "Chef\u2019s creation with seasonal lettuce, orange slices\u2026",
        },
        {
          name: "Classic Caesar Salad Plain",
          price: 450,
          desc: "Romaine lettuce tossed in Caesar dressing, topped\u2026",
        },
        {
          name: "The Veggie Mate",
          price: 650,
          desc: "Crispy vegetable burger, topped with mango\u2026",
        },
      ],
    },
  };

  const MENU_ICON_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>';

  const CAFE_ICON_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>';

  const lobbyCafeMenuData = {
    espressoBased: {
      label: "Espresso Based",
      items: [
        { name: "Espresso", price: 140, desc: "" },
        { name: "Affogato", price: 240, desc: "" },
        { name: "Americano", price: 140, desc: "" },
        { name: "Cappuccino", price: 190, desc: "" },
        { name: "Flat White", price: 190, desc: "" },
        { name: "Mocha", price: 210, desc: "" },
        { name: "Macchiato", price: 210, desc: "" },
        { name: "Dirty Horchata", price: 240, desc: "" },
      ],
    },
    coldDrinks: {
      label: "Cold Drinks & Frappes",
      items: [
        { name: "Horchata", price: 120, desc: "" },
        { name: "Matcha Cookie Cheesecake", price: 340, desc: "" },
        { name: "Chocolate Mocha Mousse", price: 300, desc: "" },
        { name: "French Vanilla Toffee", price: 330, desc: "" },
        { name: "Cookies & Cream", price: 350, desc: "" },
        { name: "Roasted Almond Mocha", price: 330, desc: "" },
        { name: "Coco Caramel Mocha", price: 330, desc: "" },
        { name: "Red Velvet", price: 300, desc: "" },
      ],
    },
    pastries: {
      label: "Pastries",
      items: [
        {
          name: "Almond Croissant",
          price: null,
          desc: "Flaky croissant dough filled with almond paste and topped\u2026",
        },
        {
          name: "Paris-Brest",
          price: null,
          desc: "Our rich and decadent take on a classic French pastry\u2026",
        },
        {
          name: "Chocolate Surfer Tart",
          price: null,
          desc: "Chocolate-y tart, from filling to crust, topped with\u2026",
        },
        {
          name: "Blueberry Danish",
          price: null,
          desc: "Sweet and juicy blueberries baked in a flaky pastry\u2026",
        },
        {
          name: "Chocolate Eclair",
          price: null,
          desc: "Long, delicate choux pastry filled with rich and creamy\u2026",
        },
        {
          name: "Japanese Milkbread",
          price: null,
          desc: "Soft, fluffy, and slightly sweet milk bread with\u2026",
        },
        {
          name: "Ube Cheese Ensaymada",
          price: null,
          desc: "Our best-selling ube-dough ensaymada filled with\u2026",
        },
        {
          name: "White Chocolate Ensaymada",
          price: null,
          desc: "Fluffy ensaymada topped with white chocolate shavings",
        },
        {
          name: "Dark Chocolate Muffin",
          price: null,
          desc: "Rich and decadent dark chocolate muffin with a moist\u2026",
        },
        {
          name: "Soft Brownie",
          price: null,
          desc: "The Awesome take on the classic brownie \u2014 chocolate\u2026",
        },
      ],
    },
    cakes: {
      label: "Cakes",
      items: [
        { name: "Awesome Signature Cake", price: 320, desc: "" },
        { name: "Ube Yema Cake", price: 280, desc: "" },
        { name: "Mango Sansrival", price: 280, desc: "" },
        { name: "Carrot & Walnut Cake", price: 280, desc: "" },
        { name: "Vegan Cake", price: null, desc: "" },
        { name: "Blueberry Cheesecake", price: 280, desc: "" },
        { name: "Exotic Passionfruit Cake", price: null, desc: "" },
        { name: "Mud Cake", price: null, desc: "" },
        { name: "Red Velvet Cake", price: 280, desc: "" },
      ],
    },
    sandwiches: {
      label: "Sandwiches & Freshly Baked Breads",
      items: [
        { name: "Smoked Salmon Bagel", price: 380, desc: "" },
        { name: "Pork Sisig with Gruyere (Panini)", price: 270, desc: "" },
        {
          name: "Charcuterie with Gherkins (Baguette)",
          price: 350,
          desc: "",
        },
        {
          name: "Grilled Vegetables & Pesto Sauce (Ciabbata)",
          price: 290,
          desc: "",
        },
        {
          name: "Roast Beef with Mustard Pickles (Sourdough Baguette)",
          price: 400,
          desc: "",
        },
        { name: "Walnut & Raisin Bread", price: 200, desc: "" },
        { name: "Rye Sour Baguette", price: 180, desc: "" },
        { name: "French Baguette", price: 180, desc: "" },
        { name: "American Rye Bread", price: 200, desc: "" },
        { name: "Sourdough Loaves", price: 200, desc: "" },
      ],
    },
  };

  const SPORTS_BAR_ICON_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M9 12v6"/><path d="M13 12v6"/><path d="M5 7h14l-1.5 9.5A2 2 0 0 1 15.52 18H8.48a2 2 0 0 1-1.98-1.5L5 7z"/><path d="M5 7H3"/></svg>';

  const sportsBarMenuData = {
    awesomeCocktails: {
      label: "Awesome Cocktails",
      items: [
        {
          name: "Awesome Margarita",
          price: 245,
          desc: "Tequila, triple sec, fresh lemon\u2026",
        },
        {
          name: "Amazing Grace",
          price: 200,
          desc: "Amaretto sour, apricot brandy, sour mix\u2026",
        },
        {
          name: "Nutty Me",
          price: 160,
          desc: "Dark rum, amaretto sour, pineapple juice\u2026",
        },
        {
          name: "La-Un-Jito",
          price: 290,
          desc: "White rum, strawberry puree, muscovado sugar\u2026",
        },
        {
          name: "Bauang Red Sangria",
          price: 350,
          desc: "Red wine, fresh orange juice, fresh lemon juice\u2026",
        },
        {
          name: "Ocean Blue",
          price: 280,
          desc: "Gin, guava juice, peach syrup\u2026",
        },
        {
          name: "Surfing Breeze",
          price: 250,
          desc: "White rum, blue curacao, coconut creme\u2026",
        },
        {
          name: "Miss Elyu",
          price: 320,
          desc: "Vodka, aperol, passion fruit syrup\u2026",
        },
        {
          name: "Koko Monkey",
          price: 240,
          desc: "Dark Rum, banana syrup, pineapple juice\u2026",
        },
        {
          name: "Fuzzy Road",
          price: 280,
          desc: "Dark rum, frangelico, pineapple juice\u2026",
        },
      ],
    },
    awesomeMocktails: {
      label: "Awesome Mocktails",
      items: [
        {
          name: "Guava-Lupe",
          price: 180,
          desc: "Guava juice, lime juice\u2026",
        },
        {
          name: "Red Sunset",
          price: 160,
          desc: "Red tea, elderflower syrup\u2026",
        },
        {
          name: "Beach Brat",
          price: 390,
          desc: "Fresh cucumber, honey, mango puree\u2026",
        },
        {
          name: "House Ginger Beer",
          price: 180,
          desc: "Fresh ginger, angostura bitter\u2026",
        },
        {
          name: "Awesome Breeze",
          price: 160,
          desc: "Mint leaves, fresh pineapple\u2026",
        },
        {
          name: "Lemongrass Lemonade with Jasmine Tea",
          price: 160,
          desc: "Infused lemongrass, lime juice\u2026",
        },
        {
          name: "Honey Lychee Smoothie",
          price: 250,
          desc: "Lychee puree, pineapple juice\u2026",
        },
        {
          name: "Freezy Mango Smoothie",
          price: 420,
          desc: "Plain yoghurt, mango puree, honey\u2026",
        },
      ],
    },
    wine: {
      label: "Wine",
      items: [
        {
          name: "Sta. Conchita Cabernet Sauvignon",
          price: 1400,
          desc: "(Central Valley, Chile) Cabernet\u2026",
        },
        {
          name: "Talo Negroamaro",
          price: 2450,
          desc: "(Salento, Italy) Negroamaro",
        },
        {
          name: "Copperlane Premium",
          price: 2900,
          desc: "(Stellenbosch, South Africa) South African\u2026",
        },
        {
          name: "IGP Salento II Pumo Rosso",
          price: 1800,
          desc: "(Salento, Italy) Sangiovese, Aglianico\u2026",
        },
        {
          name: "Mc Guigan Black Label",
          price: 1800,
          desc: "(South Eastern Australia) Shiraz\u2026",
        },
        {
          name: "IGP Salento II Pumo Sauvignon Malvasia",
          price: 1800,
          desc: "(Puglia, Italy) Sauvignon Blanc\u2026",
        },
        {
          name: "AOC Saint-Mont Les Bastions Blanc",
          price: 1800,
          desc: "(South west, France) Arrufiac\u2026",
        },
        {
          name: "Diamond Hill Chardonnay",
          price: 2300,
          desc: "(South Eastern Australia) Australian\u2026",
        },
        {
          name: "Camas Viognier",
          price: 1750,
          desc: "(Languedoc-Rousillon, France) Viognier",
        },
        {
          name: "Abbazia Rose",
          price: 2200,
          desc: "(Piemonte, Italy) Moscato",
        },
      ],
    },
    beersSpirits: {
      label: "Beers & Spirits",
      items: [
        { name: "Heineken Draught Beer", price: 180, desc: "" },
        { name: "Stella Artois", price: 220, desc: "" },
        { name: "Corona Extra", price: 230, desc: "" },
        { name: "San Miguel Pale Pilsen Gold", price: 160, desc: "" },
        { name: "Grey Goose 750ml Vodka", price: 4000, desc: "" },
        { name: "Bombay Sapphire", price: 3300, desc: "" },
        { name: "J\u00e4germeister", price: 2850, desc: "" },
        { name: "Glenfiddich Whisky", price: 8000, desc: "" },
        { name: "Jim Beam Bourbon", price: 1600, desc: "" },
        { name: "Jameson IPA Edition", price: 3150, desc: "" },
        { name: "J&B Blended Scotch", price: 1600, desc: "" },
      ],
    },
    gameDayMenu: {
      label: "Game Day Menu",
      items: [
        { name: "Phyllo Shrimps", price: 450, desc: "" },
        { name: "Bunny Chow", price: 350, desc: "" },
        { name: "Chicken Fajitas", price: 420, desc: "" },
        { name: "Seafood Arancini", price: 520, desc: "" },
        { name: "Vegetable Bruschetta", price: 250, desc: "" },
        { name: "Buffalo Chicken Wings", price: 450, desc: "" },
        { name: "Onion Rings", price: 320, desc: "" },
        { name: "Potato Bacon with Cheese", price: 850, desc: "" },
        { name: "Fried Chicken Burger", price: 490, desc: "" },
        { name: "Crispy and Spicy Pork Belly", price: 360, desc: "" },
      ],
    },
  };

  const allVenueMenus = {
    restaurant: {
      icon: MENU_ICON_SVG,
      categories: restaurantMenuData,
      defaultCategory: "whatsNew",
      viewAllUrl: "./restaurant.html",
    },
    lobbyCafe: {
      icon: CAFE_ICON_SVG,
      categories: lobbyCafeMenuData,
      defaultCategory: "espressoBased",
      viewAllUrl: "./cafe.html",
    },
    sportsBar: {
      icon: SPORTS_BAR_ICON_SVG,
      categories: sportsBarMenuData,
      defaultCategory: "awesomeCocktails",
      viewAllUrl: "./bar.html",
    },
  };

  const VENUE_MENU_LABELS = {
    restaurant: "Restaurant",
    lobbyCafe: "Lobby Cafe",
    sportsBar: "Sports Bar",
  };

  const eventData = {
    beachfrontWedding: {
      heading: "Plan Unforgettable Events at Our La Union Beachfront Venue",
      description:
        "Whether it is a dream beach wedding, a milestone celebration, or a productive corporate gathering, our versatile venues and function rooms are available for rent to suit your specific needs. Book your unforgettable event today and experience the beauty of San Juan, La Union.",
      image:
        "https://awesomehotel.com/wp-content/uploads/2025/08/Awesome-Hotel-Wedding_1.jpg",
      alt: "Beachfront Wedding",
    },
    teamBuilding: {
      heading: "Elevate Your Team Building at Our La Union Beach Resort",
      description:
        "Transform your team's dynamics with an unforgettable team building experience at Awesome Hotel. Our team building venue at La Union offers the perfect blend of work and play, ensuring your team leaves feeling refreshed and motivated. Book your corporate retreat today and discover the difference.",
      image:
        "https://awesomehotel.com/wp-content/uploads/2025/08/Awesome-Hotel-Team-Building_01.jpg",
      alt: "Team Building Activities",
    },
    businessFunction: {
      heading: "Host Seamless Business Events at Our La Union Beachfront Hotel",
      description:
        "Make your next business function effortless and impactful at Awesome Hotel. Whether it is a corporate seminar, strategy meeting, or executive offsite, our professional venue in La Union combines premium amenities with the calm of the coast so you can focus on outcomes, not logistics.",
      image:
        "https://awesomehotel.com/wp-content/uploads/2023/10/convent-serv.jpg",
      alt: "Business Function or Event",
    },
    privateEvents: {
      heading: "Celebrate Life's Best Moments by the Beach",
      description:
        "From birthdays and reunions to anniversaries and milestone moments, Awesome Hotel is your beachfront backdrop for unforgettable private events. With flexible spaces, great food, and a setting made for celebration, your guests will feel the magic from start to finish.",
      image:
        "https://awesomehotel.com/wp-content/uploads/2025/10/Private-event.jpg",
      alt: "Private Events and Parties",
    },
  };

  data.catalogs = {
    allVenueMenus,
    diningVenueData,
    eventData,
    VENUE_MENU_LABELS,
  };
})();
