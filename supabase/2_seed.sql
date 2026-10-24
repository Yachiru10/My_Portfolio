-- STEP 2 of 2: Run this in Supabase > SQL Editor (after 1_schema.sql).
-- It fills the projects table. This file was made by scripts/make-seed.js.
-- Running it again replaces the old project rows with these.

delete from public.projects;

insert into public.projects
select * from jsonb_populate_recordset(null::public.projects, $json$
[
  {
    "slug": "ecolink",
    "title": "ECOLINK",
    "category": "backend",
    "sort_order": 1,
    "chips": [
      "CAPSTONE",
      "BACKEND"
    ],
    "year": "2026",
    "role": "Sole Developer (4-member team)",
    "card_summary": "A barangay reporting system where residents report problems with a live photo and map pin, and staff resolve them under deadlines.",
    "card_tags": [
      "NODE.JS",
      "EXPRESS",
      "MYSQL",
      "DOCKER",
      "CLOUD RUN"
    ],
    "card_image": "/images/ecolink-admin-map.webp",
    "card_phone_image": "/images/ecolink-resident-home.webp",
    "overview": "ECOLINK is a reporting system for Barangay Santo Cristo. Residents report community problems with a live photo and an exact map location. Barangay staff sort and resolve reports from one queue under deadlines, and residents get updates by SMS. I designed, built and deployed the whole system while my 3 groupmates wrote the capstone paper.",
    "features": [
      "Role-based access for 5 roles, checked on every request",
      "A deadline on every report, with a background job every 5 minutes",
      "4 layers against fake reports: OTP with ID approval, camera-only photos, a geofence and account blocking",
      "Automatic routing of reports to barangay departments",
      "Online requests for 6 barangay documents with reference numbers",
      "Real-time admin alerts and SMS status updates"
    ],
    "decisions": [
      {
        "q": "SSE instead of WebSockets",
        "a": "Notifications only go one way, from the server to the browser, so SSE is simpler and reconnects by itself."
      },
      {
        "q": "Flag suspicious photos instead of rejecting them",
        "a": "Some phones remove photo data, so a real report could get blocked. A staff member makes the final call."
      },
      {
        "q": "Disable categories instead of deleting them",
        "a": "Old reports keep their original labels, so the records stay accurate."
      }
    ],
    "highlight": null,
    "tech": [
      "Node.js",
      "Express.js",
      "MySQL",
      "Google Cloud SQL",
      "JWT",
      "Leaflet",
      "Docker",
      "Google Cloud Run",
      "Cloud Storage"
    ],
    "live_url": "https://ecolink-238164787849.asia-southeast1.run.app/",
    "live_label": "LIVE SITE",
    "note": null,
    "gallery": {
      "tabs": [
        {
          "key": "resident",
          "label": "RESIDENT · MOBILE",
          "note": "Built mobile-first for residents, many of them elderly and non-technical.",
          "images": [
            {
              "src": "/images/ecolink-resident-home.webp",
              "alt": "ECOLINK resident home screen on mobile"
            },
            {
              "src": "/images/ecolink-resident-reports.webp",
              "alt": "ECOLINK all reports summary on mobile"
            }
          ]
        },
        {
          "key": "admin",
          "label": "ADMIN · WEB",
          "note": "Desktop dashboard for barangay staff, with list and map views.",
          "images": [
            {
              "src": "/images/ecolink-admin-map.webp",
              "alt": "ECOLINK admin report map of Barangay Santo Cristo"
            }
          ]
        }
      ]
    }
  },
  {
    "slug": "toyhaven",
    "title": "TOY HAVEN",
    "category": "backend",
    "sort_order": 2,
    "chips": [
      "SCHOOL PROJECT",
      "BACKEND"
    ],
    "year": "2025",
    "role": "Backend Developer",
    "card_summary": "A multi-vendor toy marketplace with buyer, seller and admin roles. I built the Firebase backend, data model and security rules.",
    "card_tags": [
      "FIRESTORE",
      "FIREBASE AUTH",
      "HOSTING",
      "JAVASCRIPT"
    ],
    "card_image": "/images/toyhaven-home.webp",
    "card_phone_image": null,
    "overview": "Toy Haven is an online marketplace where independent shops sell toys and collectibles. Buyers browse and order, sellers manage their own shops, and admins manage accounts. I built the backend with Firebase.",
    "features": [
      "Firestore data model for buyers, sellers and admins",
      "Security rules so users can only change their own data",
      "Order workflow with stock checks and seller status updates",
      "IndexedDB cache and HTTP caching rules for faster loading"
    ],
    "decisions": null,
    "highlight": {
      "big": "96%",
      "sub": "Homepage data load cut, 67.7 MB to 2.6 MB",
      "text": "Product photos were saved as text inside each product record, so every buyer downloaded every full-size photo. I moved the full photos to a separate collection and kept a small thumbnail on each product. Then I migrated all 135 products with no data loss."
    },
    "tech": [
      "Cloud Firestore",
      "Firebase Auth",
      "Firebase Hosting",
      "JavaScript",
      "IndexedDB"
    ],
    "live_url": "https://onlineetoys.web.app/login.html",
    "live_label": "LIVE SITE",
    "note": "Want to explore? Sign up for free with Gmail.",
    "gallery": {
      "images": [
        {
          "src": "/images/toyhaven-home.webp",
          "alt": "Toy Haven home page with featured picks"
        },
        {
          "src": "/images/toyhaven-shop.webp",
          "alt": "Toy Haven anime figures shop page"
        },
        {
          "src": "/images/toyhaven-product.webp",
          "alt": "Toy Haven product page"
        },
        {
          "src": "/images/toyhaven-cart.webp",
          "alt": "Toy Haven shopping cart"
        },
        {
          "src": "/images/toyhaven-login.webp",
          "alt": "Toy Haven sign in page"
        }
      ]
    }
  },
  {
    "slug": "pkmkpi",
    "title": "PKMKPI PORTAL",
    "category": "frontend",
    "sort_order": 3,
    "chips": [
      "VOLUNTEER",
      "FRONTEND"
    ],
    "year": "2026",
    "role": "Volunteer Frontend Developer",
    "card_summary": "The national website for Filipino persons with disabilities, built by a volunteer team of 9 with accessibility first.",
    "card_tags": [
      "HTML5",
      "CSS3",
      "JAVASCRIPT",
      "WCAG"
    ],
    "card_image": "/images/pkmkpi-home.webp",
    "card_phone_image": null,
    "overview": "PKMKPI is the national federation of persons with disabilities in the Philippines. Our volunteer team of 9 built its website. Each frontend developer built a full version, and the project lead combined the best parts into the live portal.",
    "features": [
      "Responsive pages in plain HTML and CSS, with no framework",
      "Regions directory with island group filters, and the Disability Guide",
      "Shared header, navigation and footer used on every page",
      "WCAG contrast checks for visitors with low vision",
      "Keyboard navigation, skip links and ARIA labels",
      "Prototype accessibility panel with an Alt+A shortcut"
    ],
    "decisions": null,
    "highlight": null,
    "tech": [
      "HTML5",
      "CSS3",
      "JavaScript",
      "WCAG",
      "ARIA"
    ],
    "live_url": "https://pkmkpi.org/",
    "live_label": "LIVE SITE (TEAM BUILD)",
    "note": null,
    "gallery": {
      "images": [
        {
          "src": "/images/pkmkpi-home.webp",
          "alt": "PKMKPI portal home page"
        },
        {
          "src": "/images/pkmkpi-regions.webp",
          "alt": "PKMKPI regional chapters directory"
        },
        {
          "src": "/images/pkmkpi-guide.webp",
          "alt": "PKMKPI disability guide page"
        }
      ]
    }
  }
]
$json$::jsonb);
