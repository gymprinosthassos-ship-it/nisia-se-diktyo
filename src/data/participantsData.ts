export interface TeacherMember {
  name: string;
  role: string;
}

export interface StudentTeamGroup {
  code: string;
  name: string;
  students: string[];
}

export interface IslandParticipants {
  schoolId: string;
  island: string;
  schoolName: string;
  wingName: string;
  wingBadge: string;
  teachers: TeacherMember[];
  teams: StudentTeamGroup[];
}

export const islandParticipantsData: IslandParticipants[] = [
  {
    schoolId: 'school-prinos',
    island: 'Θάσος',
    schoolName: 'Γυμνάσιο Πρίνου Θάσου',
    wingName: 'Α΄ ΠΤΕΡΥΓΑ — ΑΡΧΕΙΑΚΗ ΕΡΕΥΝΑ',
    wingBadge: 'Βόρειο Αιγαίο',
    teachers: [
      { name: '[Όνομα Εκπαιδευτικού 1]', role: 'Υπεύθυνος Συντονιστής / Καθηγητής' },
      { name: '[Όνομα Εκπαιδευτικού 2]', role: 'Συντονιστής Ιστορικής Έρευνας' }
    ],
    teams: [
      {
        code: 'Α1',
        name: 'Κοινωνία & καθημερινή ζωή στη Θάσο',
        students: [
          '[Όνομα Μαθητή 1]',
          '[Όνομα Μαθητή 2]',
          '[Όνομα Μαθητή 3]',
          '[Όνομα Μαθητή 4]'
        ]
      },
      {
        code: 'Α2',
        name: 'Ο Μεχμέτ Αλή και η Θάσος',
        students: [
          '[Όνομα Μαθητή 1]',
          '[Όνομα Μαθητή 2]',
          '[Όνομα Μαθητή 3]',
          '[Όνομα Μαθητή 4]'
        ]
      },
      {
        code: 'Α3',
        name: 'Εμπόριο, λιμάνια & μεσογειακά δίκτυα',
        students: [
          '[Όνομα Μαθητή 1]',
          '[Όνομα Μαθητή 2]',
          '[Όνομα Μαθητή 3]',
          '[Όνομα Μαθητή 4]'
        ]
      },
      {
        code: 'Α4',
        name: 'Αρχιτεκτονική & υλικός πολιτισμός',
        students: [
          '[Όνομα Μαθητή 1]',
          '[Όνομα Μαθητή 2]',
          '[Όνομα Μαθητή 3]',
          '[Όνομα Μαθητή 4]'
        ]
      }
    ]
  },
  {
    schoolId: 'school-chania',
    island: 'Κρήτη',
    schoolName: '3ο Γενικό Λύκειο Χανίων',
    wingName: 'Β΄ ΠΤΕΡΥΓΑ — ΨΗΦΙΑΚΗ ΔΗΜΙΟΥΡΓΙΑ',
    wingBadge: 'Νότια Μεσόγειος',
    teachers: [
      { name: '[Όνομα Εκπαιδευτικού 1]', role: 'Υπεύθυνος Συντονιστής / Καθηγητής' },
      { name: '[Όνομα Εκπαιδευτικού 2]', role: 'Συντονιστής Ψηφιακής Επιμέλειας' }
    ],
    teams: [
      {
        code: 'Β1',
        name: 'Ιστοσελίδα & διαδραστικός χάρτης',
        students: [
          '[Όνομα Μαθητή 1]',
          '[Όνομα Μαθητή 2]',
          '[Όνομα Μαθητή 3]',
          '[Όνομα Μαθητή 4]'
        ]
      },
      {
        code: 'Β2',
        name: 'Ψηφιακή επιμέλεια & οργάνωση αρχείων',
        students: [
          '[Όνομα Μαθητή 1]',
          '[Όνομα Μαθητή 2]',
          '[Όνομα Μαθητή 3]',
          '[Όνομα Μαθητή 4]'
        ]
      },
      {
        code: 'Β3',
        name: 'Φωτογραφία & οπτικοακουστικές παραγωγές',
        students: [
          '[Όνομα Μαθητή 1]',
          '[Όνομα Μαθητή 2]',
          '[Όνομα Μαθητή 3]',
          '[Όνομα Μαθητή 4]'
        ]
      },
      {
        code: 'Β4',
        name: 'Συνεντεύξεις, κείμενα & αφήγηση',
        students: [
          '[Όνομα Μαθητή 1]',
          '[Όνομα Μαθητή 2]',
          '[Όνομα Μαθητή 3]',
          '[Όνομα Μαθητή 4]'
        ]
      }
    ]
  }
];
