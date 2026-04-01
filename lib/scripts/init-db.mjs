import Database from 'better-sqlite3';
const db = new Database('dev.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS Categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Sellers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS Shows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    seller_id INTEGER,
    viewer_count INTEGER,
    notes TEXT,
    date DATETIME,
    url TEXT,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL,
    FOREIGN KEY (seller_id) REFERENCES Sellers(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS GiveawayState (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    show_id INTEGER NOT NULL,
    status TEXT DEFAULT 'IDLE', -- 'IDLE', 'RUNNING', 'PAUSED'
    remaining_ms INTEGER DEFAULT 300000, -- 5 minutes in ms
    end_time DATETIME, -- Only set when RUNNING
    is_continuous BOOLEAN DEFAULT 0,
    FOREIGN KEY (show_id) REFERENCES Shows(id) ON DELETE CASCADE
  );
    
  -- initialize categories
  INSERT OR IGNORE INTO Categories (name) VALUES
    ('3D Prints'), ('Action Figures'), ('AFL Cards'), ('Ancient Coins'), ('and Whatnot'), ('Anime & Manga'), ('Antiques'), ('Antiques & Vintage Decor'), ('Art & Prints'), ('Arts & Handmade'), ('Baby & Kids'), ('Baby & Kids Clothes'), ('Baby & Kids Shoes'), ('Baby & Kids Supplies'), ('Baby & Kids Toys'), ('Bags & Accessories'), ('Baked Goods'), ('Baseball & Softball'), ('Baseball Cards'), ('Baseball Memorabilia'), ('Basketball Cards'), ('Basketball Memorabilia'), ('Bath & Body Essentials'),
    ('Beads, Pens & Keychains'), ('Bearbrick'), ('Beauty'), ('Board Games & Puzzles'), ('Books'), ('Books & Movies'), ('Cameras & Photography'), ('Camping & Hiking Gear'), ('Candles'), ('Candy & Snacks'), ('Case Packs & Bundles'), ('CDs & Cassettes'), ('Chocolate'), ('Coffee & Tea'), ('Coins & Bullion'), ('Coins & Money'), ('Comics'), ('Community'), ('Condiments & Sauces'), ('Consoles & Accessories'), ('Craft Stamps'), ('Crystals & Gems'), ('Cycling'), ('Deal Hunting'), ('Diamonds & Gemstones'),
    ('Diecast'), ('Digimon Cards'), ('Disc Golf'), ('Disney'), ('Disney Cards'), ('Dog & Cat'), ('Dolls'), ('Dragon Ball Cards'), ('Electronics'), ('Embroidery & Needlework'), ('Entertainment Cards'), ('Ephemera'), ('Estate Sales'), ('Estate Sales & Storage Units'), ('Everyday Electronics'), ('Everything Else'), ('Exotic Snacks'), ('F1 Cards'), ('Fast Food & Cereal Toys'), ('FigPin'), ('Fishing'), ('Flesh & Blood'), ('Food & Drink'), ('Football Cards'), ('Football Gear'),
    ('Football Memorabilia'), ('Fossils'), ('Fragrances & Perfume'), ('Fresh & Specialty Food'), ('Funko'), ('Garage Sales'), ('Garbage Pail Kids'), ('Glass Art'), ('Gold & Silver Jewelry'), ('Gold Nuggets'), ('Golf'), ('Guides, Manuals & Cases'), ('Gundam Cards'), ('Hair Products & Wigs'), ('Handcrafted Jewelry'), ('Handmade Clothing'), ('Headphones & Speakers'), ('Heat Transfers & Wraps'), ('Hockey Cards'), ('Holiday Decor'), ('Home & Garden'), ('Home Appliances'), ('Home Decor'), 
    ('Horse Tack'), ('Instruments & Accessories'), ('Jewelry & Watches'), ('Jewelry Making Supplies'), ('Kawaii'), ('Kitchen & Dining'), ('Knitting & Crochet'), ('Knives & EDC'), ('Knives & Hunting'), ('Kryptik'), ('Labubu & Blind Boxes'), ('Laptops, Phones & Tablets'), ('LEGO'), ('Littlest Pet Shop'), ('Lorcana'), ('Loungefly'), ('Luxury Bags & Accessories'), ('Magic: The Gathering'), ('Makeup & Skincare'), ('Marvel Cards'), ('Mens Activewear'), ('Mens Big & Tall Fashion'), ('Mens Fashion'),
    ('Mens Grooming'), ('Mens Jewelry'), ('Mens Modern'), ('Mens Shoes'), ('Mens Vintage Clothing'), ('MetaZoo'), ('Midrange & Fashion Bags'), ('Models & Kits'), ('Modern Comics'), ('Modern Games'), ('Motorsport Cards'), ('Movie Memorabilia'), ('Movies'), ('Music'), ('Music Memorabilia'), ('Nails'), ('Naruto Cards'), ('NASCAR Cards'), ('One Piece Cards'), ('Other Accessories'), ('Other Arts & Handmade'), ('Other Beauty'), ('Other Designer Toys'), ('Other Entertainment Cards'),
    ('Other Estate Sales & Storage Units'), ('Other Food & Drink'), ('Other Home & Garden'), ('Other Jewelry'), ('Other Mens Fashion'), ('Other Music'), ('Other Pets'), ('Other Rocks'), ('Other Sports & Outdoors'), ('Other Sports Cards'), ('Other Sports Memorabilia'), ('Other TCG'), ('Other Toys'), ('Other Womens Fashion'), ('Pallets'), ('Paper Money & Currency'), ('Pet Fish'), ('Pets'), ('Plants & Garden'), ('Plush'), ('Pokémon Cards'), ('Postage Stamps'), ('Quilting, Sewing & Fabrics'),
    ('Racquet Sports'), ('RC Vehicles & Toys'), ('Resin Art'), ('Retro Games'), ('Riftbound'), ('Rocks & Crystals'), ('Scrapbook & Journaling'), ('Skateboard Gear'), ('Slime & Squishy Toys'), ('Slot Cars'), ('Sneakers'), ('Sneakers & Shoes'), ('Soccer Cards'), ('Soccer Gear'), ('Soccer Memorabilia'), ('Soda & Drinks'), ('Sonny Angels & Smiskis'), ('Sorcery: Contested Realm'), ('Sports & Outdoors'), ('Sports Apparel'), ('Sports Cards'), ('Sports Memorabilia'), ('Star Wars'), ('Star Wars Cards'), ('Stickers'),
    ('Storage Unit Finds'), ('Streetwear'), ('Sunglasses & Eyewear'), ('Supplements'), ('Tactical Gear'), ('Thrilljoy'), ('Tools'), ('Toys & Hobbies'), ('Trading Card Games'), ('Tumblers & Water Bottles'), ('TV & Movie Cards'), ('UFC Cards'), ('Union Arena'), ('UniVersus'), ('VeeFriends'), ('Video Games'), ('Vintage & Antique Jewelry'), ('Vintage Comics'), ('Vintage Decor'), ('Vintage Toys'), ('Vinyl Records'), ('Watches'), ('Weiß Schwarz'), ('Western & Southwestern Jewelry'), ('Wholesale & Deals'),
    ('Winter Sports'), ('Womens Activewear'), ('Womens Boutiques'), ('Womens Contemporary'), ('Womens Dresses'), ('Womens Fashion'), ('Womens Jewelry'), ('Womens Plus Size'), ('Womens Shoes'), ('Womens Swimwear'), ('Womens True Vintage'), ('Womens Vintage Clothing'), ('Woodworking'), ('Wrestling Cards'), ('Y2K'), ('Yu-Gi-Oh! Cards');
`);

console.log('Database initialized successfully.');