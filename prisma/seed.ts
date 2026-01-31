
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sectors = [
    {
        title: "Αγροδιατροφικός Τομέας",
        description: "Λύσεις για ανάλυση δεδομένων πεδίου, παρακολούθηση παραγωγής, και έξυπνη διαχείριση πόρων (νερό, ενέργεια, καλλιέργειες).",
        featuredImage: "https://dgsmart.b-cdn.net/sectors/1769881002118-sector-agrifood.webp",
        slug: "agrifood",
        isFeatured: true,
        sortOrder: 1,
    },
    {
        title: "Βιομηχανία & Παραγωγή",
        description: "Αυτοματοποίηση παραγωγικών διεργασιών, διαχείριση εφοδιαστικής αλυσίδας και συστήματα ποιοτικού ελέγχου.",
        featuredImage: "https://dgsmart.b-cdn.net/sectors/1769881003309-sector-industry.webp",
        slug: "industry",
        isFeatured: true,
        sortOrder: 2,
    },
    {
        title: "Εφοδιαστική Αλυσίδα",
        description: "Συστήματα ιχνηλασιμότητας από το χωράφι έως τον καταναλωτή με IoT, RFID και blockchain τεχνολογίες.",
        featuredImage: "https://dgsmart.b-cdn.net/sectors/1769881004027-sector-supply-chain.webp",
        slug: "supply-chain",
        isFeatured: true,
        sortOrder: 3,
    },
    {
        title: "Βιωσιμότητα & Περιβάλλον",
        description: "Εργαλεία μείωσης ανθρακικού αποτυπώματος, βελτιστοποίησης πόρων και πράσινων πρακτικών λειτουργίας.",
        featuredImage: "https://dgsmart.b-cdn.net/sectors/1769881004723-sector-sustainability.webp",
        slug: "sustainability",
        isFeatured: true,
        sortOrder: 4,
    },
];

const caseStudies = [
    {
        title: "Ψηφιακός Μετασχηματισμός Αγροτικού Συνεταιρισμού",
        description: "Υλοποίηση ολοκληρωμένου συστήματος παρακολούθησης καλλιεργειών και διαχείρισης πόρων.",
        content: "Η DGCONSULT σχεδίασε και υλοποίησε μια πρωτοποριακή πλατφόρμα για την ψηφιοποίηση των λειτουργιών ενός μεγάλου αγροτικού συνεταιρισμού. Το έργο περιελάμβανε την εγκατάσταση αισθητήρων IoT στο πεδίο, τη δημιουργία κεντρικού συστήματοςλ διαχείρισης δεδομένων και την ανάπτυξη εφαρμογής για τους παραγωγούς.",
        featuredImage: "https://dgsmart.b-cdn.net/case-studies/1769881005657-case-study-1.webp",
        slug: "agricultural-cooperative",
        category: "Αγροδιατροφικός",
        clientName: "Αγροτικός Συνεταιρισμός Θεσσαλίας",
        industry: "Αγροδιατροφή",
        technologies: "IoT, Big Data, Mobile App, AI",
        challenge: "Ο συνεταιρισμός αντιμετώπιζε δυσκολίες στην παρακολούθηση της παραγωγής σε πραγματικό χρόνο και στην ορθολογική διαχείριση του νερού άρδευσης, με αποτέλεσμα υψηλό λειτουργικό κόστος και απώλειες στην παραγωγή.",
        solution: "Αναπτύξαμε ένα δίκτυο αισθητήρων υγρασίας εδάφους και μετεωρολογικών σταθμών, συνδεδεμένο με το Cloud. Μέσω αλγορίθμων τεχνητής νοημοσύνης, το σύστημα παρέχει εξατομικευμένες οδηγίες άρδευσης και λίπανσης σε κάθε παραγωγό.",
        results: "30% μείωση στην κατανάλωση νερού, 15% αύξηση της μέσης παραγωγικότητας και πλήρης ιχνηλασιμότητα των προϊόντων από το χωράφι έως τη συσκευασία.",
        sortOrder: 1,
        isPublished: true,
    },
    {
        title: "Σύστημα Ιχνηλασιμότητας για Βιομηχανία Τροφίμων",
        description: "End-to-end ιχνηλασιμότητα από πρώτες ύλες έως τελικό προϊόν με blockchain τεχνολογία.",
        content: "Για μια κορυφαία βιομηχανία επεξεργασίας τροφίμων, αναπτύξαμε ένα σύστημα ιχνηλασιμότητας βασισμένο σε blockchain, διασφαλίζοντας την απόλυτη διαφάνεια και ασφάλεια σε όλα τα στάδια της εφοδιαστικής αλυσίδας.",
        featuredImage: "https://dgsmart.b-cdn.net/case-studies/1769881006701-case-study-2.webp",
        slug: "food-traceability",
        category: "Βιομηχανία",
        clientName: "FoodTech Solutions S.A.",
        industry: "Επεξεργασία Τροφίμων",
        technologies: "Blockchain, RFID, QR Codes, ERP Integration",
        challenge: "Η ανάγκη για άμεση ανάκληση προϊόντων και η απαίτηση των καταναλωτών για πληροφορίες σχετικά με την προέλευση των πρώτων υλών καθιστούσαν το παραδοσιακό σύστημα ανεπαρκές.",
        solution: "Υλοποιήσαμε μια λύση όπου κάθε παρτίδα πρώτης ύλης λαμβάνει μια μοναδική ψηφιακή ταυτότητα. Όλη η διαδρομή καταγράφεται σε αμετάβλητο καθολικό (ledger), προσβάσιμο μέσω QR codes στις συσκευασίες.",
        results: "Μείωση χρόνου ανάκλησης από 48 ώρες σε 15 λεπτά, αύξηση εμπιστοσύνης καταναλωτών και συμμόρφωση με τα αυστηρότερα διεθνή πρότυπα ασφάλειας.",
        sortOrder: 2,
        isPublished: true,
    },
    {
        title: "Αυτοματοποίηση Παραγωγής Οινοποιείου",
        description: "Smart manufacturing λύσεις για βελτιστοποίηση ποιότητας και μείωση κόστους.",
        content: "Το οινοποιείο χρειαζόταν έναν τρόπο να ελέγχει με ακρίβεια τη διαδικασία ζύμωσης και αποθήκευσης, διασφαλίζοντας τη σταθερή ποιότητα των βραβευμένων οίνων του.",
        featuredImage: "https://dgsmart.b-cdn.net/case-studies/1769881007401-case-study-3.webp",
        slug: "winery-automation",
        category: "Παραγωγή",
        clientName: "Κτήμα Φωτεινό",
        industry: "Οινοποιία",
        technologies: "Sensors, Automation, Dashboard, Real-time Monitoring",
        challenge: "Οι διακυμάνσεις της θερμοκρασίας κατά τη ζύμωση και η έλλειψη ψηφιακής καταγραφής ιστορικών δεδομένων δυσκόλευαν τον έλεγχο ποιότητας.",
        solution: "Εγκαταστήσαμε αυτοματοποιημένα συστήματα ελέγχου θερμοκρασίας και πίεσης στις δεξαμενές, με κεντρικό έλεγχο από tablet και ειδοποιήσεις σε πραγματικό χρόνο για οποιαδήποτε απόκλιση.",
        results: "Εξάλειψη σφαλμάτων λόγω ανθρώπινου παράγοντα, 20% εξοικονόμηση ενέργειας και πλήρης ψηφιακός φάκελος κάθε παραγωγής.",
        sortOrder: 3,
        isPublished: true,
    },
];

async function main() {
    console.log("Start seeding...");

    for (const s of sectors) {
        const exists = await prisma.sector.findUnique({ where: { slug: s.slug } });
        if (!exists) {
            await prisma.sector.create({
                data: {
                    ...s,
                    content: s.description,
                }
            });
            console.log(`Created sector: ${s.title}`);
        } else {
            // Optional: Update existing if we want to enforce the CDN URL
            // await prisma.sector.update({ where: { slug: s.slug }, data: { featuredImage: s.featuredImage } });
        }
    }

    for (const c of caseStudies) {
        const exists = await prisma.caseStudy.findUnique({ where: { slug: c.slug } });
        if (!exists) {
            await prisma.caseStudy.create({
                data: c
            });
            console.log(`Created case study: ${c.title}`);
        }
    }

    // Seed Global Settings
    const settingsCount = await prisma.globalSettings.count();
    if (settingsCount === 0) {
        await prisma.globalSettings.create({
            data: {
                email: "info@dgconsult.gr",
                phone: "210 5711581",
                address: "Λεωφ. Κηφισού 48, Περιστέρι – 121 33",
            }
        });
        console.log("Created initial Global Settings.");
    }

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
