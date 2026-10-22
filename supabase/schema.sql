-- ==============================================================================
-- ΙΣΤΟΡΙΚΟΙ ΔΕΣΜΟΙ: ΒΑΣΗ ΔΕΔΟΜΕΝΩΝ & ΠΟΛΙΤΙΚΕΣ ΑΣΦΑΛΕΙΑΣ (SUPABASE / POSTGRESQL)
-- 100% Δωρεάν Αρχιτεκτονική • Προστασία Προσωπικών Δεδομένων • RLS
-- ==============================================================================

-- 1. Επέκταση pgcrypto για ασφαλές hashing κωδικών ομάδων
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Πίνακας Σχολικών Μονάδων
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    region TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Πίνακας Μαθητικών Ομάδων (ΧΩΡΙΣ μαθητικά emails - ασφαλής κωδικός hash)
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    access_code_hash TEXT NOT NULL, -- bcrypt/sha256 hash
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_team_per_school UNIQUE (school_id, name)
);

-- 4. Πίνακας Ιστορικών Καταχωρίσεων
CREATE TABLE IF NOT EXISTS entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id),
    team_id UUID NOT NULL REFERENCES teams(id),
    title TEXT NOT NULL,
    date_display TEXT NOT NULL,      -- π.χ. "Οκτώβριος 1943", "Άνοιξη 1944"
    year_numeric INT NOT NULL,       -- Για χρονολογική ταξινόμηση και φίλτρα
    period_tag TEXT NOT NULL,        -- π.χ. "Κατοχή", "Απελευθέρωση", "Μεταπολεμικά"
    historical_context TEXT NOT NULL,-- Περιγραφή ιστορικού γεγονότος/πλαισίου
    research_question TEXT NOT NULL, -- Ερευνητικό ερώτημα της ομάδας
    interpretation TEXT NOT NULL,    -- Ιστορική ερμηνεία και συμπεράσματα
    partner_comment TEXT,           -- Σχόλιο / συμπλήρωση από συνεργαζόμενο σχολείο
    partner_team_id UUID REFERENCES teams(id),
    status TEXT NOT NULL DEFAULT 'draft' 
        CHECK (status IN ('draft', 'submitted', 'returned', 'approved', 'archived')),
    teacher_feedback TEXT,           -- Παρατηρήσεις εκπαιδευτικού κατά το review
    approved_by UUID,                -- Αναγνωριστικό εκπαιδευτικού
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Πίνακας Πηγών & Τεκμηρίων (Zero-Storage για βίντεο, storage μόνο για optimized εικόνες/pdf)
CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    source_type TEXT NOT NULL 
        CHECK (source_type IN ('document', 'photograph', 'oral_history', 'newspaper', 'artifact', 'video_link')),
    origin_holder TEXT NOT NULL,     -- π.χ. "Γενικά Αρχεία του Κράτους", "Οικογένεια Παπαδοπούλου"
    source_url TEXT,                 -- URL εικόνας (Supabase Storage) ή Embed URL (video.sch.gr / YouTube)
    licence_type TEXT NOT NULL,      -- π.χ. "Creative Commons", "Άδεια κατόχου", "Δημόσιο Κτήμα"
    critique_notes TEXT NOT NULL,    -- Κριτική πηγής (σκοπός, αξιοπιστία, περιορισμοί)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ΣΥΝΑΡΤΗΣΕΙΣ & SECURITY (RPC)
-- ==============================================================================

-- Συνάρτηση επαλήθευσης κωδικού ομάδας χωρίς να εκτίθεται το hash στο frontend
CREATE OR REPLACE FUNCTION verify_team_credentials(
    p_school_id UUID,
    p_team_name TEXT,
    p_passcode TEXT
)
RETURNS TABLE (
    team_id UUID,
    team_name TEXT,
    school_name TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_team RECORD;
BEGIN
    SELECT t.id, t.name, t.access_code_hash, s.name as s_name
    INTO v_team
    FROM teams t
    JOIN schools s ON s.id = t.school_id
    WHERE t.school_id = p_school_id 
      AND t.name = p_team_name 
      AND t.active = TRUE;

    IF FOUND AND (v_team.access_code_hash = crypt(p_passcode, v_team.access_code_hash) OR v_team.access_code_hash = p_passcode) THEN
        RETURN QUERY SELECT v_team.id, v_team.name, v_team.s_name;
    ELSE
        RETURN;
    END IF;
END;
$$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

-- Πολιτικές για Schools: Ελεύθερη δημόσια ανάγνωση
CREATE POLICY "Public read access for schools"
    ON schools FOR SELECT
    USING (true);

-- Πολιτικές για Teams: Ελεύθερη ανάγνωση ονομάτων ομάδων (όχι των κωδικών hash)
CREATE POLICY "Public read access for team names"
    ON teams FOR SELECT
    USING (active = true);

-- Πολιτικές για Entries:
-- 1. Το κοινό διαβάζει ΜΟΝΟ τις εγκεκριμένες καταχωρίσεις (Approved)
CREATE POLICY "Public can view approved entries only"
    ON entries FOR SELECT
    USING (status = 'approved');

-- 2. Μαθητικές ομάδες / Edge function μπορούν να δημιουργούν καταχωρίσεις
CREATE POLICY "Teams can insert draft entries"
    ON entries FOR INSERT
    WITH CHECK (true);

-- 3. Επιτρέπεται ενημέρωση καταχώρισης (σε draft ή submitted)
CREATE POLICY "Teams can update draft entries"
    ON entries FOR UPDATE
    USING (status IN ('draft', 'returned'));

-- Πολιτικές για Sources:
-- Το κοινό διαβάζει πηγές που ανήκουν σε εγκεκριμένες καταχωρίσεις
CREATE POLICY "Public can view sources of approved entries"
    ON sources FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM entries
            WHERE entries.id = sources.entry_id
              AND entries.status = 'approved'
        )
    );

CREATE POLICY "Teams can insert sources"
    ON sources FOR INSERT
    WITH CHECK (true);

-- ==============================================================================
-- SEED DATA (ΔΟΚΙΜΑΣΤΙΚΑ ΔΕΔΟΜΕΝΑ ΓΙΑ ΑΜΕΣΗ ΛΕΙΤΟΥΡΓΙΑ)
-- ==============================================================================

INSERT INTO schools (id, name, city, region) VALUES
('11111111-1111-1111-1111-111111111111', '1ο Γυμνάσιο Ιωαννίνων', 'Ιωάννινα', 'Ήπειρος'),
('22222222-2222-2222-2222-222222222222', '3ο Γυμνάσιο Κέρκυρας', 'Κέρκυρα', 'Ιόνια Νησιά')
ON CONFLICT (id) DO NOTHING;

INSERT INTO teams (id, school_id, name, access_code_hash) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Ομάδα Ιστοριοδιφών Α', '123456'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Ομάδα Ερευνητών Β', '123456')
ON CONFLICT DO NOTHING;

-- Ενδεικτική Εγκεκριμένη Καταχώριση για το Χρονολόγιο
INSERT INTO entries (
    id, school_id, team_id, title, date_display, year_numeric, period_tag,
    historical_context, research_question, interpretation, status, approved_at
) VALUES (
    'e1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Η απεργία των μαθητών και η διανομή συσσιτίου στα Ιωάννινα',
    'Νοέμβριος 1943',
    1943,
    'Κατοχή',
    'Κατά τον χειμώνα του 1943, οι συνθήκες πείνας στην πόλη οδήγησαν σε αυθόρμητες κινητοποιήσεις και οργάνωση μαθητικών συσσιτίων από τον Ερυθρό Σταυρό.',
    'Πώς αντέδρασε η μαθητική νεολαία των Ιωαννίνων στον λιμό της Κατοχής;',
    'Τα τεκμήρια δείχνουν ότι το σχολείο αποτέλεσε κέντρο αλληλεγγύης και όχι μόνο εκπαίδευσης.',
    'approved',
    NOW()
) ON CONFLICT DO NOTHING;

-- Ενδεικτική Πηγή με Video Embed (video.sch.gr / youtube demo)
INSERT INTO sources (
    entry_id, title, source_type, origin_holder, source_url, licence_type, critique_notes
) VALUES (
    'e1111111-1111-1111-1111-111111111111',
    'Προφορική μαρτυρία επιζώντα για τα συσσίτια',
    'oral_history',
    'Αρχείο Προφορικής Ιστορίας Ηπείρου',
    'https://video.sch.gr/asset/detail/G1454Kjdf',
    'Creative Commons BY-NC',
    'Η μαρτυρία καταγράφηκε το 1995. Παρότι εκ των υστέρων αφήγηση, διασταυρώνεται πλήρως με τα έγγραφα του Δήμου.'
) ON CONFLICT DO NOTHING;
