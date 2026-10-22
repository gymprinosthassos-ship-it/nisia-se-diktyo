# ΙΣΤΟΡΙΚΟΙ ΔΕΣΜΟΙ — Διασχολικό Εργαστήριο Ιστορίας

Πρότυπη εκπαιδευτική διαδικτυακή πλατφόρμα για τη συνεργασία δύο σχολικών μονάδων (1ο Γυμνάσιο Ιωαννίνων & 3ο Γυμνάσιο Κέρκυρας).

## 🚀 Χαρακτηριστικά & Αρχιτεκτονική (100% Δωρεάν)
1. **Διαδραστικό Χρονολόγιο (Timeline):** Φίλτρα ανά περίοδο, σχολείο, αναζήτηση και Accessible List View.
2. **Zero-Storage Video Policy:** Ενσωμάτωση βίντεο από το **video.sch.gr** (Πανελλήνιο Σχολικό Δίκτυο) και το **YouTube Unlisted** (0 MB επιβάρυνση cloud).
3. **Client-Side Image Compression:** Αυτόματη συμπίεση εικόνων σε WebP κάτω από 300 KB πριν από την αποστολή.
4. **Προστασία Δεδομένων & Ασφάλεια:** Είσοδος μαθητικών ομάδων με κωδικό ομάδας (χωρίς ανάγκη μαθητικών emails), PostgreSQL Row Level Security (RLS).
5. **Ταμπλό Εκπαιδευτικών (Moderation):** Έγκριση, σχόλια διόρθωσης, προσθήκη διασχολικής συνεισφοράς και εξαγωγή σε JSON / Εκτύπωση PDF.
6. **Keep-Alive Automation:** GitHub Action workflow για αποτροπή της 7ήμερης αδράνειας του δωρεάν Supabase.

## 🛠️ Τοπική Εκτέλεση (Local Development)
```bash
# Εγκατάσταση εξαρτήσεων
npm install

# Εκκίνηση σε τοπικό server
npm run dev
```

## 📦 Δωρεάν Δημοσίευση (Deploy στο Cloudflare Pages)
1. Ανεβάστε τον κώδικα στο GitHub σας.
2. Συνδεθείτε στο [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Workers & Pages** -> **Create application** -> **Pages**.
3. Συνδέστε το repository:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Η εφαρμογή είναι online με δωρεάν SSL και απεριόριστο bandwidth!
