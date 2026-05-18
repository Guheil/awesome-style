const baseToday = new Date();
baseToday.setHours(0, 0, 0, 0);

const defaultCheckin = new Date(baseToday);
defaultCheckin.setDate(defaultCheckin.getDate() + 7);

const defaultCheckout = new Date(defaultCheckin);
defaultCheckout.setDate(defaultCheckout.getDate() + 3);

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const state = {
  checkin: defaultCheckin,
  checkout: defaultCheckout,
  guests: 2,
  activeModal: null,
  pendingDate: null,
  calendarYear: defaultCheckin.getFullYear(),
  calendarMonth: defaultCheckin.getMonth(),
};

let heroPlayer;
let heroVideoHasPlayed = false;
let burgerBtn;
let mobileMenu;
let mobileMenuClose;
let navDropdownItems = [];

let resortCarouselTrack;
let resortCarouselDots = [];
let resortCarouselIndex;
let activeResortSlide = 0;

let amenitiesTrack;
let amenitiesThumbs = [];
let amenitiesIndex;
let activeAmenitiesSlide = 0;

let diningTrack;
let diningDots = [];
let diningIndex;
let activeDiningSlide = 0;

let diningVenueTabs = [];
let diningVenueImage;
let diningVenueTitle;
let diningVenueCuisine;
let diningVenueDescription;
let diningVenueHours;

let daytourTrack;
let daytourStops = [];
let activeDaytourSlide = 0;

let eventTabs = [];
let eventHeading;
let eventDescription;
let eventImage;
let eventGalleries = [];

let reviewsTrack;
let reviewsDotsWrap;
let reviewsPrevButton;
let reviewsNextButton;
let reviewsCards = [];
let reviewsPerPage = 3;
let reviewsPage = 0;

let galleryLightbox;
let galleryLightboxLabel;
let galleryLightboxCount;
let galleryLightboxImage;
let galleryLightboxPrev;
let galleryLightboxNext;
let galleryLightboxClose;
let galleryCollections = [];
let activeGalleryCollectionIndex = -1;
let activeGalleryImageIndex = 0;
let lastGalleryTrigger = null;

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
    image: "https://awesomehotel.com/wp-content/uploads/2025/09/lobby-cafe.jpg",
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
    image: "https://awesomehotel.com/wp-content/uploads/2025/09/sports-bar.jpg",
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
      { name: "Charcuterie with Gherkins (Baguette)", price: 350, desc: "" },
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
      { name: "Guava-Lupe", price: 180, desc: "Guava juice, lime juice\u2026" },
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
      { name: "Abbazia Rose", price: 2200, desc: "(Piemonte, Italy) Moscato" },
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

let activeMenuVenueKey = "restaurant";

const VENUE_MENU_LABELS = {
  restaurant: "Restaurant",
  lobbyCafe: "Lobby Cafe",
  sportsBar: "Sports Bar",
};

function renderVenueSwitch() {
  const container = document.getElementById("venueMenuSwitch");
  if (!container) {
    return;
  }
  container.innerHTML = Object.keys(allVenueMenus)
    .map(function (key) {
      const isActive = key === activeMenuVenueKey;
      return (
        '<button class="dining-menu-venue-btn' +
        (isActive ? " is-active" : "") +
        '" onclick="setMenuVenue(\'' +
        key +
        "')\">" +
        (VENUE_MENU_LABELS[key] || key) +
        "</button>"
      );
    })
    .join("");
}

function setMenuVenue(key) {
  if (!allVenueMenus[key]) {
    return;
  }
  renderVenueMenuTabs(key);
  setMenuCategory(allVenueMenus[key].defaultCategory);
}

function renderVenueMenuTabs(venueKey) {
  activeMenuVenueKey = venueKey;
  const venueMenu = allVenueMenus[venueKey];
  if (!venueMenu) {
    return;
  }
  const tabsContainer = document.getElementById("venueMenuTabs");
  if (!tabsContainer) {
    return;
  }
  const categoryKeys = Object.keys(venueMenu.categories);
  tabsContainer.innerHTML = categoryKeys
    .map(function (catKey, i) {
      return (
        '<button class="dining-menu-tab' +
        (i === 0 ? " is-active" : "") +
        '" data-category="' +
        catKey +
        '" role="tab" aria-selected="' +
        (i === 0 ? "true" : "false") +
        '" onclick="setMenuCategory(\'' +
        catKey +
        "')\">" +
        venueMenu.categories[catKey].label +
        "</button>"
      );
    })
    .join("");
  const viewAllLink = document.getElementById("venueMenuViewAll");
  if (viewAllLink) {
    viewAllLink.href = venueMenu.viewAllUrl;
  }
  renderVenueSwitch();
}

function setMenuCategory(key) {
  const tabs = document.querySelectorAll(".dining-menu-tab");
  tabs.forEach(function (tab) {
    const isActive = tab.dataset.category === key;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  const grid = document.getElementById("diningMenuGrid");
  if (!grid) {
    return;
  }

  const venueMenu = allVenueMenus[activeMenuVenueKey];
  if (!venueMenu) {
    return;
  }

  const data = venueMenu.categories[key];
  if (!data) {
    return;
  }

  const icon = venueMenu.icon;
  const newHtml = data.items
    .map(function (item) {
      const priceHtml = item.price
        ? '<span class="dining-menu-price">' + item.price + "</span>"
        : "";
      const descHtml = item.desc
        ? '<p class="dining-menu-desc">' + item.desc + "</p>"
        : "";
      return (
        '<div class="dining-menu-item">' +
        '<div class="dining-menu-icon">' +
        icon +
        "</div>" +
        '<div class="dining-menu-info">' +
        '<div class="dining-menu-name">' +
        '<span class="dining-menu-dish">' +
        item.name +
        "</span>" +
        priceHtml +
        "</div>" +
        descHtml +
        "</div></div>"
      );
    })
    .join("");

  grid.classList.add("is-fading");
  clearTimeout(grid._fadeTimer);
  grid._fadeTimer = setTimeout(function () {
    grid.innerHTML = newHtml;
    grid.classList.remove("is-fading");
  }, 210);
}

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

function fmtDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  return `${day} ${MONTHS[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
}

function nightsDiff(startDate, endDate) {
  return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
}

function sameDay(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function renderBar() {
  const checkInDate = document.getElementById("checkInDate");
  const checkOutDate = document.getElementById("checkOutDate");
  const checkInField = document.getElementById("checkInField");
  const checkOutField = document.getElementById("checkOutField");
  const guestCount = document.getElementById("guestCount");

  if (
    !checkInDate ||
    !checkOutDate ||
    !checkInField ||
    !checkOutField ||
    !guestCount
  ) {
    return;
  }

  checkInDate.textContent = fmtDate(state.checkin);
  checkOutDate.textContent = fmtDate(state.checkout);
  checkInField.querySelector(".field-label").textContent = "Check In";
  checkInField.querySelector(".field-value-sub").textContent =
    DAYS[state.checkin.getDay()];

  const nights = nightsDiff(state.checkin, state.checkout);
  checkOutField.querySelector(".field-label").textContent = "Check Out";
  checkOutField.querySelector(".field-value-sub").textContent =
    `${DAYS[state.checkout.getDay()]} | ${nights} night${nights !== 1 ? "s" : ""}`;
  guestCount.textContent = state.guests;
}

function adjustGuests(delta) {
  state.guests = Math.max(1, Math.min(12, state.guests + delta));
  renderBar();
}

function renderCalendar(calendarNumber, year, month) {
  const title = document.getElementById(`cal${calendarNumber}Title`);
  const grid = document.getElementById(`cal${calendarNumber}`);
  if (!title || !grid) {
    return;
  }

  title.textContent = `${MONTHS[month]} ${year}`;
  grid.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let index = 0; index < firstDay; index += 1) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "cal-day empty";
    grid.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const cell = document.createElement("div");
    cell.className = "cal-day";
    cell.textContent = String(day);

    if (date < today) {
      cell.classList.add("past");
    } else {
      if (state.pendingDate && sameDay(date, state.pendingDate)) {
        cell.classList.add("selected");
      }
      cell.addEventListener("click", function () {
        selectDate(date);
      });
    }

    grid.appendChild(cell);
  }
}

function renderCalendars() {
  renderCalendar(1, state.calendarYear, state.calendarMonth);
  const nextMonth = new Date(state.calendarYear, state.calendarMonth + 1, 1);
  renderCalendar(2, nextMonth.getFullYear(), nextMonth.getMonth());
}

function openDateModal(type, event) {
  if (event) {
    event.stopPropagation();
  }

  state.activeModal = type;
  state.pendingDate =
    type === "checkin" ? new Date(state.checkin) : new Date(state.checkout);

  const modalTitle = document.getElementById("modalTitle");
  const overlay = document.getElementById("dateModalOverlay");
  const backdrop = document.getElementById("dateBgBackdrop");
  if (!modalTitle || !overlay || !backdrop) {
    return;
  }

  modalTitle.textContent =
    type === "checkin" ? "Select Check-In Date" : "Select Check-Out Date";
  overlay.classList.add("open");
  backdrop.classList.add("visible");
  document.body.style.overflow = "hidden";

  state.calendarMonth =
    type === "checkin" ? state.checkin.getMonth() : state.checkout.getMonth();
  state.calendarYear =
    type === "checkin"
      ? state.checkin.getFullYear()
      : state.checkout.getFullYear();
  renderCalendars();
}

function closeDateModal() {
  const overlay = document.getElementById("dateModalOverlay");
  const backdrop = document.getElementById("dateBgBackdrop");
  if (overlay) {
    overlay.classList.remove("open");
  }
  if (backdrop) {
    backdrop.classList.remove("visible");
  }

  document.body.style.overflow = "";
  state.activeModal = null;
  state.pendingDate = null;
}

function selectDate(date) {
  state.pendingDate = new Date(date);
  renderCalendars();
}

function confirmDate() {
  if (!state.pendingDate) {
    closeDateModal();
    return;
  }

  if (state.activeModal === "checkin") {
    state.checkin = new Date(state.pendingDate);
    if (state.checkout <= state.checkin) {
      state.checkout = new Date(state.checkin);
      state.checkout.setDate(state.checkout.getDate() + 1);
    }
  } else {
    if (state.pendingDate <= state.checkin) {
      window.alert("Check-out must be after check-in.");
      return;
    }
    state.checkout = new Date(state.pendingDate);
  }

  renderBar();
  closeDateModal();
}

function handleDocumentClick(event) {
  if (
    navDropdownItems.length > 0 &&
    !event.target.closest(".nav-item--has-menu")
  ) {
    closeNavDropdowns();
  }

  if (!state.activeModal) {
    return;
  }

  const popupShell = document.getElementById("dateModalOverlay");
  const checkInField = document.getElementById("checkInField");
  const checkOutField = document.getElementById("checkOutField");

  if (
    (popupShell && popupShell.contains(event.target)) ||
    (checkInField && checkInField.contains(event.target)) ||
    (checkOutField && checkOutField.contains(event.target))
  ) {
    return;
  }

  closeDateModal();
}

function handleDocumentKeydown(event) {
  if (isGalleryLightboxOpen()) {
    if (event.key === "Escape") {
      closeGalleryLightbox();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveGalleryLightbox(-1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveGalleryLightbox(1);
      return;
    }
  }

  if (event.key === "Escape" && state.activeModal) {
    closeDateModal();
  }

  if (
    event.key === "Escape" &&
    mobileMenu &&
    mobileMenu.classList.contains("open")
  ) {
    closeMobileMenu();
  }

  if (event.key === "Escape" && navDropdownItems.length > 0) {
    closeNavDropdowns();
  }
}

function handleBook() {
  const nights = nightsDiff(state.checkin, state.checkout);
  window.alert(
    `Reservation Summary\n\nCheck-in: ${fmtDate(state.checkin)}\nCheck-out: ${fmtDate(state.checkout)}\nNights: ${nights}\nGuests: ${state.guests}\n\nProceeding to secure booking...`,
  );
}

function setNavDropdownState(item, isOpen) {
  const button = item.querySelector(".nav-link--button");
  item.classList.toggle("is-open", isOpen);
  if (button) {
    button.setAttribute("aria-expanded", String(isOpen));
  }
}

function clearNavDropdownTimer(item) {
  if (item && item.navCloseTimer) {
    window.clearTimeout(item.navCloseTimer);
    item.navCloseTimer = null;
  }
}

function closeNavDropdown(item) {
  if (!item) {
    return;
  }

  clearNavDropdownTimer(item);
  setNavDropdownState(item, false);
}

function closeNavDropdowns(exceptItem = null) {
  navDropdownItems.forEach(function (item) {
    if (item !== exceptItem) {
      closeNavDropdown(item);
    }
  });
}

function openNavDropdown(item) {
  if (!item) {
    return;
  }

  clearNavDropdownTimer(item);
  closeNavDropdowns(item);
  setNavDropdownState(item, true);
}

function scheduleNavDropdownClose(item) {
  if (!item) {
    return;
  }

  clearNavDropdownTimer(item);
  item.navCloseTimer = window.setTimeout(function () {
    closeNavDropdown(item);
  }, 180);
}

function initNavDropdowns() {
  navDropdownItems = Array.from(
    document.querySelectorAll(".nav-item--has-menu"),
  );

  navDropdownItems.forEach(function (item) {
    const button = item.querySelector(".nav-link--button");
    const links = item.querySelectorAll(".nav-dropdown-link");
    if (!button) {
      return;
    }

    button.setAttribute("aria-expanded", "false");

    item.addEventListener("pointerenter", function () {
      openNavDropdown(item);
    });

    item.addEventListener("pointerleave", function () {
      scheduleNavDropdownClose(item);
    });

    item.addEventListener("focusin", function () {
      openNavDropdown(item);
    });

    item.addEventListener("focusout", function (event) {
      const nextFocused = event.relatedTarget;
      if (!nextFocused || !item.contains(nextFocused)) {
        scheduleNavDropdownClose(item);
      }
    });

    button.addEventListener("click", function (event) {
      if (button.tagName === "A" && button.getAttribute("href")) {
        closeNavDropdowns();
        return;
      }

      event.preventDefault();

      if (item.classList.contains("is-open")) {
        closeNavDropdown(item);
        return;
      }

      openNavDropdown(item);
    });

    links.forEach(function (link) {
      link.addEventListener("click", function () {
        closeNavDropdowns();
      });
    });
  });
}

function updateResortCarousel() {
  if (!resortCarouselTrack || resortCarouselDots.length === 0) {
    return;
  }

  resortCarouselTrack.style.transform = `translateX(-${activeResortSlide * 100}%)`;
  resortCarouselDots.forEach(function (dot, index) {
    dot.classList.toggle("is-active", index === activeResortSlide);
  });

  if (resortCarouselIndex) {
    resortCarouselIndex.textContent = `${String(activeResortSlide + 1).padStart(2, "0")} / ${String(resortCarouselDots.length).padStart(2, "0")}`;
  }
}

function moveResortCarousel(step) {
  if (resortCarouselDots.length === 0) {
    return;
  }

  activeResortSlide =
    (activeResortSlide + step + resortCarouselDots.length) %
    resortCarouselDots.length;
  updateResortCarousel();
}

function goToResortSlide(index) {
  if (index < 0 || index >= resortCarouselDots.length) {
    return;
  }

  activeResortSlide = index;
  updateResortCarousel();
}

function updateAmenitiesCarousel() {
  if (!amenitiesTrack || amenitiesThumbs.length === 0) {
    return;
  }

  amenitiesTrack.style.transform = `translateX(-${activeAmenitiesSlide * 100}%)`;
  amenitiesThumbs.forEach(function (thumb, index) {
    const isActive = index === activeAmenitiesSlide;
    thumb.classList.toggle("is-active", isActive);
    thumb.setAttribute("aria-pressed", String(isActive));
  });

  if (amenitiesIndex) {
    amenitiesIndex.textContent = `${String(activeAmenitiesSlide + 1).padStart(2, "0")} / ${String(amenitiesThumbs.length).padStart(2, "0")}`;
  }
}

function moveAmenitiesCarousel(step) {
  if (amenitiesThumbs.length === 0) {
    return;
  }

  activeAmenitiesSlide =
    (activeAmenitiesSlide + step + amenitiesThumbs.length) %
    amenitiesThumbs.length;
  updateAmenitiesCarousel();
}

function goToAmenitiesSlide(index) {
  if (index < 0 || index >= amenitiesThumbs.length) {
    return;
  }

  activeAmenitiesSlide = index;
  updateAmenitiesCarousel();
}

function updateDiningCarousel() {
  if (!diningTrack || diningDots.length === 0) {
    return;
  }

  diningTrack.style.transform = `translateX(-${activeDiningSlide * 100}%)`;
  diningDots.forEach(function (dot, index) {
    dot.classList.toggle("is-active", index === activeDiningSlide);
  });

  if (diningIndex) {
    diningIndex.textContent = `${String(activeDiningSlide + 1).padStart(2, "0")} / ${String(diningDots.length).padStart(2, "0")}`;
  }
}

function moveDiningCarousel(step) {
  if (diningDots.length === 0) {
    return;
  }

  activeDiningSlide =
    (activeDiningSlide + step + diningDots.length) % diningDots.length;
  updateDiningCarousel();
}

function goToDiningSlide(index) {
  if (index < 0 || index >= diningDots.length) {
    return;
  }

  activeDiningSlide = index;
  updateDiningCarousel();
}

function getDiningVenueFromHash() {
  var hash = window.location.hash ? window.location.hash.slice(1) : "";
  return hash && diningVenueData[hash] ? hash : "";
}

function setDiningVenue(key) {
  const venue = diningVenueData[key];
  if (!venue) {
    return;
  }

  diningVenueTabs.forEach(function (tab) {
    const isActive = tab.dataset.venue === key;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  if (diningVenueImage) {
    diningVenueImage.src = venue.image;
    diningVenueImage.alt = venue.alt;
  }
  if (diningVenueTitle) {
    diningVenueTitle.textContent = venue.title;
  }
  if (diningVenueCuisine) {
    diningVenueCuisine.textContent = venue.cuisine;
  }
  if (diningVenueDescription) {
    diningVenueDescription.innerHTML = "";
    const paragraph = document.createElement("p");
    paragraph.textContent = venue.description;
    diningVenueDescription.appendChild(paragraph);
  }
  if (diningVenueHours) {
    diningVenueHours.innerHTML = "";
    venue.hours.forEach(function (line) {
      const paragraph = document.createElement("p");
      paragraph.textContent = line;
      diningVenueHours.appendChild(paragraph);
    });
  }

  const menuSection = document.getElementById("venueMenuSection");
  if (menuSection) {
    const hasMenu = Boolean(allVenueMenus[key]);
    menuSection.classList.toggle("is-visible", hasMenu);
    if (hasMenu) {
      renderVenueMenuTabs(key);
      setMenuCategory(allVenueMenus[key].defaultCategory);
    }
  }
}

function updateDaytourCarousel() {
  if (!daytourTrack || daytourStops.length === 0) {
    return;
  }

  daytourTrack.style.transform = `translateX(-${activeDaytourSlide * 100}%)`;
  daytourStops.forEach(function (stop, index) {
    const isActive = index === activeDaytourSlide;
    stop.classList.toggle("is-active", isActive);
    stop.setAttribute("aria-pressed", String(isActive));
  });
}

function moveDaytourCarousel(step) {
  if (daytourStops.length === 0) {
    return;
  }

  activeDaytourSlide =
    (activeDaytourSlide + step + daytourStops.length) % daytourStops.length;
  updateDaytourCarousel();
}

function goToDaytourSlide(index) {
  if (index < 0 || index >= daytourStops.length) {
    return;
  }

  activeDaytourSlide = index;
  updateDaytourCarousel();
}

function setEventType(key) {
  const event = eventData[key];
  if (!event) {
    return;
  }

  eventTabs.forEach(function (tab) {
    const isActive = tab.dataset.event === key;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  if (eventHeading) {
    eventHeading.textContent = event.heading;
  }
  if (eventDescription) {
    eventDescription.textContent = event.description;
  }
  if (eventImage) {
    eventImage.src = event.image;
    eventImage.alt = event.alt;
  }
}

function setEventGallerySlide(gallery, nextIndex) {
  const slides = Array.from(gallery.querySelectorAll(".events-gallery-slide"));
  const thumbs = Array.from(gallery.querySelectorAll(".events-gallery-thumb"));
  const dots = Array.from(gallery.querySelectorAll(".events-gallery-dot"));
  if (slides.length === 0) {
    return;
  }

  const slideIndex = (nextIndex + slides.length) % slides.length;
  gallery.eventsGalleryIndex = slideIndex;

  slides.forEach(function (slide, index) {
    slide.classList.toggle("is-active", index === slideIndex);
  });
  thumbs.forEach(function (thumb, index) {
    thumb.classList.toggle("is-active", index === slideIndex);
  });
  dots.forEach(function (dot, index) {
    dot.classList.toggle("is-active", index === slideIndex);
  });
}

function moveEventGallery(gallery, step) {
  const currentIndex = gallery.eventsGalleryIndex || 0;
  setEventGallerySlide(gallery, currentIndex + step);
}

function initEventGalleries() {
  eventGalleries = Array.from(
    document.querySelectorAll("[data-events-gallery]"),
  );

  eventGalleries.forEach(function (gallery) {
    const slides = Array.from(
      gallery.querySelectorAll(".events-gallery-slide"),
    );
    const thumbs = Array.from(
      gallery.querySelectorAll(".events-gallery-thumb"),
    );
    const dotsWrap = gallery.querySelector(".events-gallery-dots");
    const prevButton = gallery.querySelector("[data-events-gallery-prev]");
    const nextButton = gallery.querySelector("[data-events-gallery-next]");

    if (slides.length === 0) {
      return;
    }

    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      slides.forEach(function (_, index) {
        const dot = document.createElement("span");
        dot.className = `events-gallery-dot${index === 0 ? " is-active" : ""}`;
        dotsWrap.appendChild(dot);
      });
    }

    thumbs.forEach(function (thumb, index) {
      thumb.setAttribute("aria-label", `View image ${index + 1}`);
      thumb.addEventListener("click", function () {
        setEventGallerySlide(gallery, index);
      });
    });

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        moveEventGallery(gallery, -1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        moveEventGallery(gallery, 1);
      });
    }

    setEventGallerySlide(gallery, 0);
  });
}

function isGalleryLightboxOpen() {
  return Boolean(
    galleryLightbox && galleryLightbox.classList.contains("is-open"),
  );
}

function preloadGalleryLightboxImage(src) {
  if (!src) {
    return;
  }

  const image = new Image();
  image.src = src;
}

function setGalleryLightboxSlide(nextIndex) {
  const collection = galleryCollections[activeGalleryCollectionIndex];
  if (!collection || collection.items.length === 0 || !galleryLightboxImage) {
    return;
  }

  activeGalleryImageIndex =
    (nextIndex + collection.items.length) % collection.items.length;

  const currentItem = collection.items[activeGalleryImageIndex];
  galleryLightboxImage.src = currentItem.src;
  galleryLightboxImage.alt = currentItem.alt;

  if (galleryLightboxLabel) {
    galleryLightboxLabel.textContent = collection.label;
  }

  if (galleryLightboxCount) {
    galleryLightboxCount.textContent = `${String(activeGalleryImageIndex + 1).padStart(2, "0")} / ${String(collection.items.length).padStart(2, "0")}`;
  }

  const controlsDisabled = collection.items.length <= 1;
  if (galleryLightboxPrev) {
    galleryLightboxPrev.disabled = controlsDisabled;
  }
  if (galleryLightboxNext) {
    galleryLightboxNext.disabled = controlsDisabled;
  }

  if (collection.items.length > 1) {
    preloadGalleryLightboxImage(
      collection.items[(activeGalleryImageIndex + 1) % collection.items.length]
        .src,
    );
    preloadGalleryLightboxImage(
      collection.items[
        (activeGalleryImageIndex - 1 + collection.items.length) %
          collection.items.length
      ].src,
    );
  }
}

function moveGalleryLightbox(step) {
  if (!isGalleryLightboxOpen()) {
    return;
  }

  setGalleryLightboxSlide(activeGalleryImageIndex + step);
}

function openGalleryLightbox(collectionIndex, imageIndex, triggerElement) {
  if (!galleryLightbox) {
    return;
  }

  const collection = galleryCollections[collectionIndex];
  if (!collection || collection.items.length === 0) {
    return;
  }

  activeGalleryCollectionIndex = collectionIndex;
  activeGalleryImageIndex = imageIndex;
  lastGalleryTrigger = triggerElement || null;

  setGalleryLightboxSlide(imageIndex);
  galleryLightbox.scrollTop = 0;
  galleryLightbox.hidden = false;
  galleryLightbox.setAttribute("aria-hidden", "false");
  galleryLightbox.classList.add("is-open");

  if (galleryLightboxClose) {
    galleryLightboxClose.focus();
  }
}

function closeGalleryLightbox() {
  if (!galleryLightbox || !isGalleryLightboxOpen()) {
    return;
  }

  galleryLightbox.classList.remove("is-open");
  galleryLightbox.hidden = true;
  galleryLightbox.setAttribute("aria-hidden", "true");

  if (galleryLightboxImage) {
    galleryLightboxImage.removeAttribute("src");
    galleryLightboxImage.alt = "";
  }

  activeGalleryCollectionIndex = -1;
  activeGalleryImageIndex = 0;

  if (lastGalleryTrigger && typeof lastGalleryTrigger.focus === "function") {
    lastGalleryTrigger.focus();
  }

  lastGalleryTrigger = null;
}

function initGalleryLightbox() {
  galleryLightbox = document.getElementById("galleryLightbox");
  galleryLightboxLabel = document.getElementById("galleryLightboxLabel");
  galleryLightboxCount = document.getElementById("galleryLightboxCount");
  galleryLightboxImage = document.getElementById("galleryLightboxImage");
  galleryLightboxPrev = document.getElementById("galleryLightboxPrev");
  galleryLightboxNext = document.getElementById("galleryLightboxNext");
  galleryLightboxClose = document.getElementById("galleryLightboxClose");

  if (!galleryLightbox || !galleryLightboxImage) {
    return;
  }

  galleryCollections = Array.from(
    document.querySelectorAll(".gallery-collection"),
  )
    .map(function (section, collectionIndex) {
      const title = section.querySelector(".gallery-collection-heading h2");
      const label = title ? title.textContent.trim() : "Gallery";
      const figures = Array.from(section.querySelectorAll(".gallery-photo"));

      const items = figures
        .map(function (figure, imageIndex) {
          const image = figure.querySelector("img");
          if (!image) {
            return null;
          }

          const fallbackAlt = `${label} image ${imageIndex + 1}`;
          figure.setAttribute("role", "button");
          figure.setAttribute("tabindex", "0");
          figure.setAttribute("aria-label", `Open ${fallbackAlt}`);

          figure.addEventListener("click", function () {
            openGalleryLightbox(collectionIndex, imageIndex, figure);
          });

          figure.addEventListener("keydown", function (event) {
            if (event.key !== "Enter" && event.key !== " ") {
              return;
            }

            event.preventDefault();
            openGalleryLightbox(collectionIndex, imageIndex, figure);
          });

          return {
            src: image.currentSrc || image.getAttribute("src") || "",
            alt: image.alt || fallbackAlt,
          };
        })
        .filter(Boolean);

      return items.length > 0 ? { label, items } : null;
    })
    .filter(Boolean);

  if (galleryLightboxClose) {
    galleryLightboxClose.addEventListener("click", closeGalleryLightbox);
  }

  if (galleryLightboxPrev) {
    galleryLightboxPrev.addEventListener("click", function () {
      moveGalleryLightbox(-1);
    });
  }

  if (galleryLightboxNext) {
    galleryLightboxNext.addEventListener("click", function () {
      moveGalleryLightbox(1);
    });
  }

  galleryLightbox.addEventListener("click", function (event) {
    if (event.target === galleryLightbox) {
      closeGalleryLightbox();
    }
  });
}

function closeFaqItem(details) {
  const content = details.querySelector("p");
  if (!content) {
    return;
  }

  if (details.faqTimer) {
    window.clearTimeout(details.faqTimer);
  }

  content.style.maxHeight = `${content.scrollHeight}px`;
  window.requestAnimationFrame(function () {
    details.classList.remove("is-open");
    content.style.maxHeight = "0px";
  });

  details.faqTimer = window.setTimeout(function () {
    details.open = false;
    details.faqTimer = null;
  }, 340);
}

function openFaqItem(details) {
  const content = details.querySelector("p");
  if (!content) {
    return;
  }

  if (details.faqTimer) {
    window.clearTimeout(details.faqTimer);
    details.faqTimer = null;
  }

  details.open = true;
  details.classList.add("is-open");
  content.style.maxHeight = "0px";

  window.requestAnimationFrame(function () {
    content.style.maxHeight = `${content.scrollHeight}px`;
  });
}

function initFaqAccordions() {
  const faqGroups = Array.from(document.querySelectorAll(".events-page-faq"));
  if (faqGroups.length === 0) {
    return;
  }

  faqGroups.forEach(function (group) {
    const faqItems = Array.from(group.querySelectorAll("details"));
    faqItems.forEach(function (details) {
      const summary = details.querySelector("summary");
      const content = details.querySelector("p");
      if (!summary || !content) {
        return;
      }

      details.open = false;
      details.classList.remove("is-open");
      content.style.maxHeight = "0px";

      summary.addEventListener("click", function (event) {
        event.preventDefault();

        if (details.classList.contains("is-open")) {
          closeFaqItem(details);
          return;
        }

        faqItems.forEach(function (item) {
          if (item !== details && item.classList.contains("is-open")) {
            closeFaqItem(item);
          }
        });

        openFaqItem(details);
      });
    });
  });
}

function getReviewsPerPage() {
  if (window.innerWidth <= 720) {
    return 1;
  }
  if (window.innerWidth <= 1040) {
    return 2;
  }
  return 3;
}

function totalReviewPages() {
  return Math.ceil(reviewsCards.length / reviewsPerPage);
}

function buildReviewsDots() {
  if (!reviewsDotsWrap) {
    return;
  }

  reviewsDotsWrap.innerHTML = "";
  for (let index = 0; index < totalReviewPages(); index += 1) {
    const button = document.createElement("button");
    button.className = `reviews-dot${index === reviewsPage ? " is-active" : ""}`;
    button.setAttribute("aria-label", `Go to page ${index + 1}`);
    button.addEventListener("click", function () {
      goToReviewPage(index);
    });
    reviewsDotsWrap.appendChild(button);
  }
}

function renderReviews() {
  if (!reviewsTrack || !reviewsDotsWrap) {
    return;
  }

  const start = reviewsPage * reviewsPerPage;
  reviewsCards.forEach(function (card, index) {
    const isVisible = index >= start && index < start + reviewsPerPage;
    card.style.display = isVisible ? "" : "none";
  });

  reviewsDotsWrap
    .querySelectorAll(".reviews-dot")
    .forEach(function (dot, index) {
      dot.classList.toggle("is-active", index === reviewsPage);
    });

  if (reviewsPrevButton) {
    reviewsPrevButton.disabled = reviewsPage === 0;
  }
  if (reviewsNextButton) {
    reviewsNextButton.disabled = reviewsPage >= totalReviewPages() - 1;
  }
}

function goToReviewPage(index) {
  reviewsPage = Math.max(0, Math.min(index, totalReviewPages() - 1));
  renderReviews();
}

function shiftReviews(step) {
  goToReviewPage(reviewsPage + step);
}

function handleReviewsResize() {
  const nextPerPage = getReviewsPerPage();
  if (nextPerPage !== reviewsPerPage) {
    reviewsPerPage = nextPerPage;
    reviewsPage = 0;
    buildReviewsDots();
  }
  renderReviews();
}

function initLeafletMap() {
  const locationMap = document.getElementById("locationMap");
  if (!locationMap || typeof window.L === "undefined") {
    return;
  }

  const latitude = 16.678407713843825;
  const longitude = 120.33690274114296;

  const map = window.L.map("locationMap", {
    zoomControl: true,
    scrollWheelZoom: false,
    attributionControl: true,
  });

  map.setView([latitude, longitude], 16);
  window.setTimeout(function () {
    map.invalidateSize();
  }, 100);

  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
  }).addTo(map);

  const goldIcon = window.L.divIcon({
    className: "",
    html: '<div style="width:20px;height:20px;background:#b78a48;border:3px solid #fbf5ea;border-radius:50%;box-shadow:0 2px 10px rgba(0,0,0,0.3);"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -14],
  });

  window.L.marker([latitude, longitude], { icon: goldIcon })
    .addTo(map)
    .bindPopup(
      "<strong style='font-family:Jost,sans-serif;color:#37291d'>Awesome Hotel</strong><br><span style='font-size:12px;font-family:Jost,sans-serif;color:rgba(55,41,29,0.65)'>319 Eagle St, San Juan, La Union</span>",
    )
    .openPopup();
}

function initRoomsGuestSearch() {
  const form = document.getElementById("roomsGuestForm");
  const input = document.getElementById("roomsGuestInput");
  const roomCards = Array.from(document.querySelectorAll("[data-room-card]"));
  const pageButtons = Array.from(document.querySelectorAll("[data-room-page]"));
  const decrementButton = document.querySelector("[data-room-guests-dec]");
  const incrementButton = document.querySelector("[data-room-guests-inc]");
  const prevButton = document.querySelector("[data-room-page-prev]");
  const nextButton = document.querySelector("[data-room-page-next]");
  const featuredPageRoomCount = 4;
  const followingPageRoomCount = 6;
  let activePage = 0;
  let requestedGuests = null;

  if (!form || !input || roomCards.length === 0) {
    return;
  }

  function getMatchingRooms() {
    return roomCards.filter(function (card) {
      const capacity = Number.parseInt(card.dataset.guests || "0", 10);
      return !Number.isFinite(requestedGuests) || capacity >= requestedGuests;
    });
  }

  function adjustRoomGuestInput(delta) {
    const currentGuests = Number.parseInt(input.value, 10);
    const nextGuests = Math.max(
      0,
      Math.min(
        12,
        (Number.isFinite(currentGuests) ? currentGuests : 0) + delta,
      ),
    );

    input.value = nextGuests > 0 ? String(nextGuests) : "";
  }

  function renderRooms() {
    const matchingRooms = getMatchingRooms();
    const totalPages = Math.max(
      1,
      matchingRooms.length <= featuredPageRoomCount
        ? 1
        : 1 +
            Math.ceil(
              (matchingRooms.length - featuredPageRoomCount) /
                followingPageRoomCount,
            ),
    );

    activePage = Math.min(activePage, totalPages - 1);
    const pageStart =
      activePage === 0
        ? 0
        : featuredPageRoomCount + (activePage - 1) * followingPageRoomCount;
    const pageEnd =
      activePage === 0
        ? featuredPageRoomCount
        : pageStart + followingPageRoomCount;

    roomCards.forEach(function (card) {
      const matchingIndex = matchingRooms.indexOf(card);
      card.hidden =
        matchingIndex === -1 ||
        matchingIndex < pageStart ||
        matchingIndex >= pageEnd;
    });

    pageButtons.forEach(function (button) {
      const buttonPage = Number.parseInt(button.dataset.roomPage || "0", 10);
      const isCurrent = buttonPage === activePage;
      button.hidden = buttonPage >= totalPages;
      button.disabled = buttonPage >= totalPages;
      button.classList.toggle("is-current", isCurrent);

      if (isCurrent) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    if (prevButton) {
      prevButton.disabled = activePage === 0;
    }
    if (nextButton) {
      nextButton.disabled = activePage >= totalPages - 1;
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const nextGuests = Number.parseInt(input.value, 10);
    requestedGuests =
      Number.isFinite(nextGuests) && nextGuests > 0 ? nextGuests : null;
    activePage = 0;
    renderRooms();
  });

  pageButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activePage = Number.parseInt(button.dataset.roomPage || "0", 10);
      renderRooms();
    });
  });

  if (decrementButton) {
    decrementButton.addEventListener("click", function () {
      adjustRoomGuestInput(-1);
    });
  }

  if (incrementButton) {
    incrementButton.addEventListener("click", function () {
      adjustRoomGuestInput(1);
    });
  }

  if (prevButton) {
    prevButton.addEventListener("click", function () {
      activePage = Math.max(0, activePage - 1);
      renderRooms();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", function () {
      activePage += 1;
      renderRooms();
    });
  }

  renderRooms();
}

function initNavigation() {
  const nav = document.querySelector("nav");
  const hero = document.querySelector(".hero, .contact-hero");
  if (!nav || !hero) {
    return;
  }

  let ticking = false;

  function updateNav() {
    if (window.scrollY >= hero.offsetHeight - 100) {
      nav.classList.add("nav--solid");
    } else {
      nav.classList.remove("nav--solid");
    }
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(updateNav);
        ticking = true;
      }
    },
    { passive: true },
  );

  updateNav();
}

function openMobileMenu() {
  if (!mobileMenu || !burgerBtn) {
    return;
  }

  mobileMenu.classList.add("open");
  burgerBtn.classList.add("open");
  mobileMenu.setAttribute("aria-hidden", "false");
  burgerBtn.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  if (!mobileMenu || !burgerBtn) {
    return;
  }

  mobileMenu.classList.remove("open");
  burgerBtn.classList.remove("open");
  mobileMenu.setAttribute("aria-hidden", "true");
  burgerBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

function initYouTubeHero() {
  const heroVideoFrame = document.getElementById("heroVideoFrame");
  const videoBackground = document.querySelector(".video-bg");

  if (!heroVideoFrame || !videoBackground) {
    return;
  }

  if (window.location.protocol === "file:") {
    return;
  }

  if (window.YT && window.YT.Player) {
    window.onYouTubeIframeAPIReady();
    return;
  }

  if (document.querySelector("script[data-youtube-api='true']")) {
    return;
  }

  const script = document.createElement("script");
  script.src = "https://www.youtube.com/iframe_api";
  script.async = true;
  script.dataset.youtubeApi = "true";
  document.body.appendChild(script);
}

function cacheDom() {
  burgerBtn = document.getElementById("burgerBtn");
  mobileMenu = document.getElementById("mobileMenu");
  mobileMenuClose = document.getElementById("mobileMenuClose");

  resortCarouselTrack = document.getElementById("resortCarouselTrack");
  resortCarouselDots = Array.from(
    document.querySelectorAll(".resort-carousel-dot"),
  );
  resortCarouselIndex = document.getElementById("resortCarouselIndex");

  amenitiesTrack = document.getElementById("amenitiesTrack");
  amenitiesThumbs = Array.from(document.querySelectorAll(".amenities-thumb"));
  amenitiesIndex = document.getElementById("amenitiesIndex");

  diningTrack = document.getElementById("diningTrack");
  diningDots = Array.from(document.querySelectorAll(".dining-dot"));
  diningIndex = document.getElementById("diningIndex");

  diningVenueTabs = Array.from(document.querySelectorAll(".dining-venue-tab"));
  diningVenueImage = document.getElementById("diningVenueImage");
  diningVenueTitle = document.getElementById("diningVenueTitle");
  diningVenueCuisine = document.getElementById("diningVenueCuisine");
  diningVenueDescription = document.getElementById("diningVenueDescription");
  diningVenueHours = document.getElementById("diningVenueHours");

  daytourTrack = document.getElementById("daytourTrack");
  daytourStops = Array.from(document.querySelectorAll(".daytour-stop"));

  eventTabs = Array.from(document.querySelectorAll(".events-tab"));
  eventHeading = document.getElementById("eventHeading");
  eventDescription = document.getElementById("eventDescription");
  eventImage = document.getElementById("eventImage");

  reviewsTrack = document.getElementById("reviewsTrack");
  reviewsDotsWrap = document.getElementById("reviewsDots");
  reviewsPrevButton = document.querySelector(".reviews-arrow--prev");
  reviewsNextButton = document.querySelector(".reviews-arrow--next");
  reviewsCards = reviewsTrack
    ? Array.from(reviewsTrack.querySelectorAll(".review-card"))
    : [];
}

function initPage() {
  cacheDom();
  renderBar();
  updateResortCarousel();
  updateAmenitiesCarousel();
  updateDiningCarousel();
  setDiningVenue(getDiningVenueFromHash() || "restaurant");
  updateDaytourCarousel();
  setEventType("beachfrontWedding");

  reviewsPerPage = getReviewsPerPage();
  buildReviewsDots();
  renderReviews();

  if (burgerBtn) {
    burgerBtn.addEventListener("click", openMobileMenu);
  }
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", closeMobileMenu);
  }

  initNavDropdowns();
  initEventGalleries();
  initGalleryLightbox();
  initFaqAccordions();

  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handleDocumentKeydown);
  window.addEventListener("resize", handleReviewsResize);

  initLeafletMap();
  initRoomsGuestSearch();
  initNavigation();
  initYouTubeHero();
  initTransitAccordion();
}

window.adjustGuests = adjustGuests;
window.openDateModal = openDateModal;
window.closeDateModal = closeDateModal;
window.confirmDate = confirmDate;
window.handleBook = handleBook;
window.moveResortCarousel = moveResortCarousel;
window.goToResortSlide = goToResortSlide;
window.moveAmenitiesCarousel = moveAmenitiesCarousel;
window.goToAmenitiesSlide = goToAmenitiesSlide;
window.moveDiningCarousel = moveDiningCarousel;
window.goToDiningSlide = goToDiningSlide;
window.setDiningVenue = setDiningVenue;
window.setMenuCategory = setMenuCategory;
window.setMenuVenue = setMenuVenue;
window.moveDaytourCarousel = moveDaytourCarousel;
window.goToDaytourSlide = goToDaytourSlide;
window.setEventType = setEventType;
window.shiftReviews = shiftReviews;
window.openMobileMenu = openMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.onYouTubeIframeAPIReady = function () {
  const heroVideoFrame = document.getElementById("heroVideoFrame");
  const videoBackground = document.querySelector(".video-bg");

  if (!heroVideoFrame || !videoBackground || !window.YT || !window.YT.Player) {
    return;
  }

  heroPlayer = new window.YT.Player("heroVideoFrame", {
    host: "https://www.youtube-nocookie.com",
    videoId: "u9Cpkz8wD8s",
    playerVars: {
      autoplay: 1,
      cc_load_policy: 0,
      controls: 0,
      disablekb: 1,
      enablejsapi: 1,
      fs: 0,
      iv_load_policy: 3,
      loop: 1,
      modestbranding: 1,
      mute: 1,
      origin: window.location.origin,
      playsinline: 1,
      playlist: "u9Cpkz8wD8s",
      rel: 0,
      showinfo: 0,
    },
    events: {
      onReady: function (event) {
        const playerIframe = event.target.getIframe?.();

        if (playerIframe) {
          playerIframe.setAttribute("aria-hidden", "true");
          playerIframe.setAttribute("tabindex", "-1");
          playerIframe.setAttribute("title", "");
        }

        event.target.mute();
        event.target.setPlaybackQuality("hd1080");
        event.target.playVideo();
      },
      onStateChange: function (event) {
        const state = window.YT?.PlayerState;

        if (!state) {
          return;
        }

        if (event.data === state.PLAYING) {
          heroVideoHasPlayed = true;
          videoBackground.classList.add("video-ready");
          return;
        }

        if (event.data === state.ENDED) {
          event.target.seekTo(0);
          event.target.playVideo();
          return;
        }

        if (
          event.data === state.PAUSED &&
          document.visibilityState === "visible"
        ) {
          event.target.playVideo();
          return;
        }

        if (!heroVideoHasPlayed) {
          videoBackground.classList.remove("video-ready");
        }
      },
      onError: function () {
        videoBackground.classList.remove("video-ready");
      },
    },
  });
};

function initTransitAccordion() {
  document.querySelectorAll(".breakfast-transit").forEach(function (details) {
    var summary = details.querySelector("summary");
    var content = details.querySelector("div");
    if (!summary || !content) return;

    var anim = null;
    var isClosing = false;

    summary.addEventListener("click", function (e) {
      e.preventDefault();

      if (anim) {
        anim.cancel();
        anim = null;
      }

      if (isClosing || details.open) {
        isClosing = true;
        var from = content.scrollHeight;
        anim = content.animate([{ height: from + "px" }, { height: "0px" }], {
          duration: 300,
          easing: "ease",
        });
        anim.onfinish = function () {
          details.open = false;
          content.style.height = "";
          isClosing = false;
          anim = null;
        };
      } else {
        details.open = true;
        var to = content.scrollHeight;
        anim = content.animate([{ height: "0px" }, { height: to + "px" }], {
          duration: 300,
          easing: "ease",
        });
        anim.onfinish = function () {
          content.style.height = "";
          anim = null;
        };
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", initPage);
