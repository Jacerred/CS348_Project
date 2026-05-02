# Overview

This project is a Whatnot Giveaway tracker. For those who don't know [Whatnot](https://www.whatnot.com/), it is a live auction website, and a main feature they have is show-hosted giveaways. However, you can only enter one giveaway at a time, so I created an application for you to manually track the giveaway timers such that you can optimize jumping around to different shows and try to win as much as possible.

The framework used is nextjs with an SQLite backend (`dev.db` file), which is facilitated by the `better-sqlite3` package.

# Hosting

The site is currently hosted on [Render](https://render.com/); see project submission comment for link.

**Note:**

Because I am using a free-tier subscription, my "free instance will spin down with inactivity, which can delay requests by 50 seconds or more." Thus, when you go to open the site, you may have to wait a minute for the site to reactivate before you can see or do anything. Another crutch of this is that the new instance after inactivity will restart the database from its stored Github state, which is empty. Thus, while the data should persist for your particular session, it will not persist across times of the site going inactive. 

# AI Disclosure

Gemini helped me significantly throughout the development of this project. It was primiarly used as a general project consultant and for UI design; otherwise, it was used in bursts for help on writing functions, debugging, etc. That being said, sections of code may be deliberately copied from its output, but that was not done without strict reviewal, verfication, and any necessary modification (as demanded in the project specifications).

# Database Design
See `lib/scripts/init-db.mjs`.
```
  Categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  Sellers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    notes TEXT
  );

  Shows (
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

  GiveawayState (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    show_id INTEGER NOT NULL,
    status TEXT DEFAULT 'IDLE', -- 'IDLE', 'RUNNING', 'PAUSED'
    remaining_ms INTEGER DEFAULT 300000, -- 5 minutes in ms
    end_time DATETIME, -- Only set when RUNNING
    is_continuous BOOLEAN DEFAULT 0,
    FOREIGN KEY (show_id) REFERENCES Shows(id) ON DELETE CASCADE
  );
  -- INDEXES
  -- 1. Index foreign keys to speed up JOINs
  INDEX idx_gs_show_id ON GiveawayState(show_id);
  INDEX idx_shows_seller_id ON Shows(seller_id);
  INDEX idx_shows_category_id ON Shows(category_id);

  -- 2. Index columns used in WHERE range filters
  INDEX idx_shows_viewer_count ON Shows(viewer_count);
```
***Note:** Many fields may not be in use and reflect a more ambitious application to be developed at a later time. Notably, `GiveawayState` is mostly unused, so the current application does not save the current timer countdowns to the database and they will be lost on refresh.*

The main strong entity in the database is the `Seller` table. `Shows` is a weak entity set of `Seller`, and further, `GiveawayState` is a weak entity of `Seller`. In other words, once a show is deleted, all associated giveaways will be deleted, and once a seller is deleted, all their related shows and giveaways are deleted.

See `lib/actions.ts` for the all the backend database functions; this is essentially the "API" of the program. Here, we see that the main data object used in the application is a `Giveaway` object, which requires fields from all tables:
```
export interface Giveaway {
  id: number;
  show_id: number;
  status: 'IDLE' | 'RUNNING' | 'PAUSED';
  remaining_ms: number;
  end_time: string | null; // ISO format
  is_continuous: boolean;
  show_title?: string; // Joined from Shows
  seller_name?: string; // Joined from Sellers
  category_id?: number; // Joined from Shows
  category_name?: string; // Joined from Categories
  viewer_count?: number; // Joined from Shows
  notes?: string | null; // Joined from Shows
  url?: string | null; // Joined from Shows
}
```

# Next.js Boilerplate

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
