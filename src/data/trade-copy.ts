/**
 * Per-trade SEO copy for service pages.
 *
 * Each entry includes:
 *  - `vettedIntro`:  The "why these contractors" blurb (hand-picked, small list, local vetting)
 *  - `localContext`:  Trade-specific Gold Country context paragraph
 *  - `whatToLookFor`: Practical hiring advice bullets
 *  - `costDisclaimer`: Honest cost framing sentence
 */

export interface TradeCopy {
  tradeSlug: string;
  vettedIntro: string;
  localContext: string;
  whatToLookFor: string[];
  costDisclaimer: string;
}

export const tradeCopy: TradeCopy[] = [
  {
    tradeSlug: "electricians",
    vettedIntro:
      "Here's the thing  - we don't list every electrician with a website and a truck. The electricians on this page were hand-picked and vetted by other contractors in the Gold Country trades community. Guys who've worked alongside them on jobs, seen their work up close, and would hire them for their own homes. We keep the list small on purpose. You're not scrolling through 50 random results hoping for the best. You're choosing from a short list of licensed pros that the local trades actually vouch for.",
    localContext:
      "Electrical work in Gold Country isn't the same as in a Sacramento subdivision. Up here you've got homes on well pumps that need dedicated circuits, older panels from the '70s and '80s that are way past due for an upgrade, and more homeowners adding EV chargers and battery backup systems every year. If you've been through a PSPS shutoff, you already know how important it is to have your electrical system dialed in. The electricians on this page understand foothill properties  - the longer runs, the backup power needs, the permit process in both Placer and Nevada counties.",
    whatToLookFor: [
      "Active C-10 electrical license (verify at cslb.ca.gov)",
      "Experience with rural properties, well pumps, and backup power",
      "Familiarity with Placer County and Nevada County permit processes",
      "Clear, written estimates before work begins",
      "Warranty on labor and materials",
    ],
    costDisclaimer:
      "Electrical work up here typically runs $85\u2013$150/hour for standard residential jobs. Panel upgrades, EV chargers, and whole-home rewires are bigger tickets  - expect written quotes for those.",
  },
  {
    tradeSlug: "plumbers",
    vettedIntro:
      "Look, finding a reliable plumber in Gold Country can be a process. Some are booked out for weeks, others show up once and disappear. The plumbers listed here? They were recommended by other local contractors  - the roofers, electricians, and GCs who work alongside them on real jobs and know who actually shows up and does solid work. We intentionally keep this list short. No filler, no pay-to-play. Just licensed plumbers that the local trades community stands behind.",
    localContext:
      "Plumbing in the foothills is a different animal than plumbing in the valley. A lot of Gold Country homes are on private wells and septic systems, which changes everything from water pressure to what you can put down a drain. You've got older homes with galvanized pipes that are on borrowed time, properties on slopes where gravity isn't doing you any favors, and freezing temps in winter that can catch people off guard. The plumbers on this page know the territory. They've dealt with well pump failures, septic-connected homes, and the quirks that come with foothill properties.",
    whatToLookFor: [
      "Active C-36 plumbing license (verify at cslb.ca.gov)",
      "Experience with well systems and septic-connected homes",
      "Emergency/after-hours availability  - water doesn't wait",
      "Upfront pricing or written estimates before starting",
      "Solid references from local homeowners",
    ],
    costDisclaimer:
      "Service calls typically run $75\u2013$150, with standard repairs in the $150\u2013$400 range. Bigger jobs like water heater replacements or repiping need individual quotes, and the good plumbers will give you a straight number before they start.",
  },
  {
    tradeSlug: "roofers",
    vettedIntro:
      "Real talk  - roofing is one of those trades where the gap between a good contractor and a bad one is enormous. A bad roof job can cost you tens of thousands in water damage. That's why the roofers on this page aren't just licensed  - they were vetted by other contractors in the Gold Country community. GCs, electricians, and other tradespeople who've seen their work on shared job sites and trust them enough to recommend them to their own clients. We keep the list tight for a reason: so you're picking from the best, not sorting through the rest.",
    localContext:
      "Roofing in Gold Country means dealing with conditions that valley contractors don't always account for. The summer heat is intense  - we're talking 100\u00b0+ days that punish cheap materials. Then you've got pine needle buildup, oak debris clogging valleys and gutters, and the occasional heavy snow at higher elevations. Fire-rated materials aren't optional in most foothill areas, they're required. And if you've been here long enough, you've seen what happens when a roof isn't installed right before a heavy rain year. The roofers on this page know what Gold Country weather does to a roof and build accordingly.",
    whatToLookFor: [
      "Active C-39 roofing license (verify at cslb.ca.gov)",
      "Experience with fire-rated roofing materials (Class A required in many areas)",
      "Written warranty on both materials and labor",
      "Proof of workers' comp and liability insurance",
      "Portfolio of completed jobs in Gold Country specifically",
    ],
    costDisclaimer:
      "A full roof replacement in Gold Country typically runs $12,000\u2013$30,000+ depending on size, pitch, and materials. Repairs and patches are obviously less. Get at least two or three written quotes  - the good roofers expect that and won't be offended.",
  },
  {
    tradeSlug: "hvac",
    vettedIntro:
      "Here's what most people don't realize about HVAC contractors  - there's a huge range in quality, and you usually don't find out until your first 105\u00b0 day or your first cold snap. The HVAC contractors on this page were recommended by other tradespeople in Gold Country. Electricians who've wired alongside them, GCs who've brought them onto builds, plumbers who see their ductwork in crawl spaces. We keep the list intentionally small. A few solid options that the local trades community actually trusts, not a phone book of everyone with a license.",
    localContext:
      "HVAC matters more in Gold Country than a lot of people expect when they move here. Summers are brutal  - triple digits for weeks at a stretch  - and winters get genuinely cold, especially at elevation. A lot of homes up here have older systems that were undersized to begin with, or ductwork running through unconditioned crawl spaces and attics that leak like a sieve. If you're on a well with a pressure tank, the HVAC tech needs to understand your electrical capacity too. And with more people adding whole-house generators and solar, the HVAC system often needs to be part of that conversation. These contractors get the full picture.",
    whatToLookFor: [
      "Active C-20 HVAC license (verify at cslb.ca.gov)",
      "EPA 608 certification for refrigerant handling",
      "Experience sizing systems for foothill elevations and older homes",
      "Maintenance plan options  - regular tune-ups save money long-term",
      "Clear explanation of options, not just upselling the most expensive unit",
    ],
    costDisclaimer:
      "A full HVAC system replacement runs $8,000\u2013$20,000+ depending on your home size, ductwork condition, and equipment choice. Repairs and tune-ups are typically $150\u2013$500. Get everything in writing before work starts.",
  },
  {
    tradeSlug: "landscape",
    vettedIntro:
      "Landscaping up here isn't just about curb appeal  - it's about fire safety, water management, and working with the terrain instead of against it. The landscape professionals on this page were vetted by other local contractors. The GCs and builders who see their grading work, the arborists who trust their tree care, the concrete guys who know whose drainage actually works. We keep this list short because when someone's working on your property with chainsaws, heavy equipment, and a plan that affects your home's safety, you want people the trades community actually stands behind.",
    localContext:
      "Gold Country landscaping is its own specialty. You're dealing with native oaks that have legal protections, steep terrain that needs proper grading and drainage, and defensible space requirements that aren't optional. Most properties up here need a landscape plan that balances fire safety with erosion control  - clear too aggressively and you've got a mudslide problem; don't clear enough and your insurance company has questions. Add in well water limitations during drought years, rocky soil that laughs at a standard trencher, and the reality that deer will eat anything you plant that isn't native, and you need someone who actually knows this area. These contractors do.",
    whatToLookFor: [
      "Active C-27 landscaping or D-49 tree service license as applicable",
      "Knowledge of defensible space requirements (PRC 4291)",
      "Experience with native plants, oak preservation, and erosion control",
      "Proper insurance  - especially for tree removal and heavy equipment work",
      "References from foothill properties, not just valley subdivisions",
    ],
    costDisclaimer:
      "Landscape work varies wildly depending on scope. Defensible space clearing might run $2,000\u2013$8,000 depending on your property, while a full landscape design and install starts around $10,000 and goes up from there. Tree removal is typically $500\u2013$3,000 per tree depending on size and access.",
  },
  {
    tradeSlug: "general-contractors",
    vettedIntro:
      "Let me save you some headaches. Hiring a general contractor is probably the biggest decision you'll make on any home project, and getting it wrong is expensive. The GCs on this page weren't found on a search engine  - they were recommended by other tradespeople in Gold Country. The subs who work under them, the suppliers who see how they run jobs, the inspectors who review their work. That's the vetting that actually matters. We intentionally keep this list small. A handful of contractors who've earned their reputation by doing good work for Gold Country homeowners, year after year.",
    localContext:
      "Building and remodeling in Gold Country comes with challenges that general contractors from the valley don't always anticipate. Steep lots that need engineered foundations. Fire-safe construction requirements in WUI zones. Permit processes that differ between Placer County, Nevada County, and each incorporated city. Septic and well considerations for additions and ADUs. Access roads that limit what equipment can get to your site. The GCs on this page have built in these foothills. They know the inspectors, they know the soil, and they know how to keep a project moving when the terrain and the county throw curveballs.",
    whatToLookFor: [
      "Active B general contractor license (verify at cslb.ca.gov)",
      "Experience with your specific project type (remodel, addition, new build, ADU)",
      "Familiarity with your local jurisdiction's permit process",
      "A clear, detailed contract with scope, timeline, and payment schedule",
      "Willingness to provide recent local references you can actually call",
    ],
    costDisclaimer:
      "General contracting costs depend entirely on scope. Kitchen remodels in Gold Country typically run $40,000\u2013$120,000+, ADUs start around $150,000\u2013$250,000, and custom homes are $300/sqft and up. Get detailed bids and compare apples to apples.",
  },
  {
    tradeSlug: "concrete-contractors",
    vettedIntro:
      "Here's the deal with concrete  - it's permanent. A bad concrete job is something you stare at every day for decades, or pay a fortune to tear out and redo. That's why the concrete contractors on this page were vetted through the local trades network. GCs who've poured alongside them, other subs who've seen their prep work and forming, homeowners who can show you driveways and patios that still look good years later. We keep the list small because concrete is one of those trades where experience and attention to detail make all the difference.",
    localContext:
      "Concrete work in Gold Country has specific challenges that valley contractors sometimes underestimate. The soil up here is often rocky, with decomposed granite and clay that expand and contract with moisture. You need proper base prep or your slab is going to crack  - and not the cosmetic kind. Slopes mean retaining walls need engineering. Freeze-thaw cycles at higher elevations affect curing and longevity. And if you're on a septic system, your contractor needs to know where the leach field is before they pour anything. The concrete contractors here have worked this terrain and know what it takes to get a pour that lasts.",
    whatToLookFor: [
      "Active C-8 concrete license (verify at cslb.ca.gov)",
      "Experience with foothill terrain, slopes, and retaining walls",
      "Proper base preparation  - this is where most bad jobs start",
      "Clear communication about curing time and weather limitations",
      "Examples of completed work on similar Gold Country properties",
    ],
    costDisclaimer:
      "Concrete pricing depends on square footage, thickness, and finishing. Standard driveways and patios typically run $8\u2013$15 per square foot for basic work, with stamped or decorative concrete running higher. Retaining walls and foundations are quoted per project. Get everything in writing, including base prep.",
  },
  {
    tradeSlug: "architects",
    vettedIntro:
      "This one's pretty straightforward  - the right architect saves you money by getting the design right before construction starts. The wrong one costs you money in change orders and rework. The architects on this page were recommended by general contractors and builders in Gold Country. The people who actually have to build what an architect draws. That's a different kind of vetting than reviews on a website. We keep this list small because a good architect-contractor relationship is the foundation of a smooth project, and these architects have those relationships already built.",
    localContext:
      "Designing a home or addition in Gold Country isn't like designing in a flat subdivision. You're working with topography  - slopes, views, tree canopy, and setbacks that change the game. Fire-safe design isn't optional; it's code. Many properties have specific requirements around oak tree preservation, creek setbacks, and grading limitations. And if you're building an ADU or converting a garage, the rules are evolving fast in both Placer and Nevada counties. The architects on this page design for this specific environment. They know the local codes, they have relationships with the planning departments, and they design homes that actually work on Gold Country terrain.",
    whatToLookFor: [
      "Licensed architect in the State of California",
      "Portfolio of residential work in foothill/rural settings",
      "Experience with your local jurisdiction's planning and design review",
      "Clear fee structure (hourly vs. percentage of construction cost)",
      "Good working relationships with local contractors and engineers",
    ],
    costDisclaimer:
      "Architectural fees typically run 8\u201315% of construction cost for custom homes, with flat fees more common for smaller projects like ADUs and remodels. A good set of plans pays for itself by reducing surprises during construction.",
  },
];

export function getTradeCopy(tradeSlug: string): TradeCopy | undefined {
  return tradeCopy.find((tc) => tc.tradeSlug === tradeSlug);
}
