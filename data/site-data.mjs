// AZ Elevated Builders — SEO site data
// Cities within ~60 miles of Brentwood, CA + service definitions

export const BRAND = {
  name: "AZ Elevated Builders",
  domain: "https://azelevatedbuilders.com",
  phone: "(925) 812-3150",
  phoneHref: "+19258123150",
  email: "Azbuild3rs@gmail.com",
  city: "Brentwood",
  state: "CA",
  license: "CSLB License # 0000000",  // PLACEHOLDER — replace with real CSLB #
};

export const CITIES = [
  // Contra Costa County
  { name: "Brentwood", slug: "brentwood", county: "Contra Costa County", blurb: "Our home base. From Shadow Lakes to Deer Ridge and the older neighborhoods off Balfour Road, we know Brentwood's housing stock street by street." },
  { name: "Oakley", slug: "oakley", county: "Contra Costa County", blurb: "Five minutes from our shop, Oakley's newer subdivisions and Delta-side properties are some of our most frequent job sites." },
  { name: "Antioch", slug: "antioch", county: "Contra Costa County", blurb: "From Rivertown's older homes to the newer builds off Lone Tree Way, Antioch remodels make up a big share of our calendar." },
  { name: "Discovery Bay", slug: "discovery-bay", county: "Contra Costa County", blurb: "Waterfront living puts extra demands on a house. We build and remodel around docks, decks and Delta weather in Discovery Bay." },
  { name: "Pittsburg", slug: "pittsburg", county: "Contra Costa County", blurb: "Pittsburg's mix of mid-century homes and new hillside construction keeps our remodel and concrete crews busy year-round." },
  { name: "Concord", slug: "concord", county: "Contra Costa County", blurb: "Concord's ranchers and split-levels are perfect candidates for the whole-home remodels and additions we specialize in." },
  { name: "Clayton", slug: "clayton", county: "Contra Costa County", blurb: "At the foot of Mt. Diablo, Clayton homeowners call us for high-end kitchens, outdoor living and exterior refreshes." },
  { name: "Walnut Creek", slug: "walnut-creek", county: "Contra Costa County", blurb: "Walnut Creek expects a higher standard of finish — exactly the kind of detailed, quality-first work our crew was built for." },
  { name: "Pleasant Hill", slug: "pleasant-hill", county: "Contra Costa County", blurb: "Pleasant Hill's post-war homes hide surprises behind the walls. Our in-house trades handle them without blowing up the schedule." },
  { name: "Martinez", slug: "martinez", county: "Contra Costa County", blurb: "From downtown Victorians to hillside ranchers, Martinez remodels reward a crew that respects older construction." },
  { name: "Lafayette", slug: "lafayette", county: "Contra Costa County", blurb: "Lafayette clients hire for quality, not price. Our finish carpentry and cabinetry work is built for exactly that bar." },
  { name: "Orinda", slug: "orinda", county: "Contra Costa County", blurb: "Orinda's wooded lots and custom homes call for careful additions, structural know-how and finishes that disappear into the original." },
  { name: "Moraga", slug: "moraga", county: "Contra Costa County", blurb: "In Moraga we handle everything from kitchen and bath remodels to full exterior repaints and new concrete." },
  { name: "Alamo", slug: "alamo", county: "Contra Costa County", blurb: "Alamo estates demand estate-level work — steam showers, custom cabinetry, outdoor kitchens and flawless paint." },
  { name: "Danville", slug: "danville", county: "Contra Costa County", blurb: "From Westside Danville to Blackhawk, we deliver the detailed, high-end remodels this market expects." },
  { name: "San Ramon", slug: "san-ramon", county: "Contra Costa County", blurb: "San Ramon's newer homes are ready for personality — chef's kitchens, spa baths, ADUs and backyard living." },
  { name: "Richmond", slug: "richmond", county: "Contra Costa County", blurb: "Richmond's older bungalows and view homes in the hills both benefit from a crew that owns every trade in-house." },
  { name: "El Cerrito", slug: "el-cerrito", county: "Contra Costa County", blurb: "El Cerrito remodels mean working smart on sloped lots and mid-century layouts — both familiar ground for our crew." },
  // Alameda County
  { name: "Oakland", slug: "oakland", county: "Alameda County", blurb: "From Rockridge craftsman homes to hills contemporaries, Oakland's older housing stock is where our experience pays off." },
  { name: "Berkeley", slug: "berkeley", county: "Alameda County", blurb: "Berkeley homes are full of character — and code surprises. We remodel them with respect for both." },
  { name: "Alameda", slug: "alameda", county: "Alameda County", blurb: "Alameda's Victorians and storybook homes deserve trades with real finish skills. That's the crew we bring." },
  { name: "San Leandro", slug: "san-leandro", county: "Alameda County", blurb: "San Leandro's post-war neighborhoods are prime for kitchen updates, ADU conversions and full interior refreshes." },
  { name: "Castro Valley", slug: "castro-valley", county: "Alameda County", blurb: "Castro Valley's ranchers and hillside homes keep our remodel, concrete and paint crews moving all year." },
  { name: "Hayward", slug: "hayward", county: "Alameda County", blurb: "In Hayward we build ADUs, remodel kitchens and baths, and pour the driveways that finish the job right." },
  { name: "Dublin", slug: "dublin", county: "Alameda County", blurb: "Dublin's newer homes are built fast — we're the crew owners call when they want them finished right." },
  { name: "Pleasanton", slug: "pleasanton", county: "Alameda County", blurb: "Pleasanton expects polish, from downtown cottages to Ruby Hill estates. Quality-first is the only way we work." },
  { name: "Livermore", slug: "livermore", county: "Alameda County", blurb: "Wine country living on the Alameda side — Livermore clients call us for outdoor living, ADUs and whole-home remodels." },
  { name: "Fremont", slug: "fremont", county: "Alameda County", blurb: "Fremont homeowners invest in their houses for the long haul. Our warrantied, quality-first work fits that mindset." },
  // San Joaquin County
  { name: "Tracy", slug: "tracy", county: "San Joaquin County", blurb: "Just over the pass from Brentwood, Tracy is core territory for our concrete, paint and full-remodel crews." },
  { name: "Mountain House", slug: "mountain-house", county: "San Joaquin County", blurb: "Mountain House's newer homes are perfect for the upgrades that make them yours — kitchens, floors, backyards and ADUs." },
  { name: "Lathrop", slug: "lathrop", county: "San Joaquin County", blurb: "From River Islands to established Lathrop neighborhoods, we bring East Bay finish quality over the hill." },
  { name: "Manteca", slug: "manteca", county: "San Joaquin County", blurb: "Manteca homeowners get the same crew, the same standard and the same warranty we bring to our East Bay jobs." },
  { name: "Stockton", slug: "stockton", county: "San Joaquin County", blurb: "Stockton's older neighborhoods reward experienced trades — and our crews have decades in every one of them." },
  // Solano County
  { name: "Rio Vista", slug: "rio-vista", county: "Solano County", blurb: "Delta-side Rio Vista is a quick run from Brentwood, and a regular stop for our remodel and concrete work." },
  { name: "Fairfield", slug: "fairfield", county: "Solano County", blurb: "Fairfield's mix of older ranchers and newer builds keeps every one of our trades — paint to concrete — in demand." },
  { name: "Vacaville", slug: "vacaville", county: "Solano County", blurb: "Vacaville homeowners call us for kitchens, baths, ADUs and the concrete work that ties a property together." },
  { name: "Vallejo", slug: "vallejo", county: "Solano County", blurb: "Vallejo's Victorians and mid-century homes are full of potential — our whole-home remodels bring it out." },
  { name: "Benicia", slug: "benicia", county: "Solano County", blurb: "Benicia's historic downtown homes and waterside properties get the careful, detail-first treatment they deserve." },
  // Napa County
  { name: "Napa", slug: "napa", county: "Napa County", blurb: "Wine country standards, East Bay work ethic. We take remodels, outdoor living and ADU projects across Napa." },
  { name: "American Canyon", slug: "american-canyon", county: "Napa County", blurb: "American Canyon's newer neighborhoods are ideal for the kitchen, flooring and backyard upgrades we do every week." },
];

export const SERVICES = [
  {
    name: "Kitchen Remodeling", slug: "kitchen-remodeling",
    short: "Layout, cabinetry, stone, lighting and fixtures — kitchens rebuilt to be the best room in the house.",
    img: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Remodeled kitchen with custom island and stone countertops",
    body: [
      "The kitchen is the room that earns its keep — in daily use and at resale. We take kitchens down to the layout and rebuild them: new footprints where walls should move, cabinetry that uses every inch, stone and quartz counters templated to the millimeter, and lighting placed where you actually work.",
      "Because plumbing, electrical, drywall, flooring and paint all live on our own crew, your kitchen isn't waiting on a subcontractor's calendar. One schedule, one point of contact, one standard of finish.",
    ],
    features: ["Full kitchen gut-and-rebuild remodels", "Custom & semi-custom cabinetry installation", "Stone, quartz & butcher-block countertops", "Kitchen islands & layout changes", "Tile backsplashes & under-cabinet lighting", "In-house plumbing & electrical rough-in", "Appliance installation & venting", "Radiant heated flooring add-ons"],
    faqs: [
      { q: "How long does a kitchen remodel take?", a: "A pull-and-replace kitchen typically runs 3–5 weeks; a full layout change with structural work runs 6–10 weeks. You'll get a written schedule with your estimate — and because our trades are in-house, we control the timeline instead of waiting on subs." },
      { q: "Do I need permits for a kitchen remodel in {CITY}?", a: "If plumbing, electrical or walls are moving — yes. We handle permitting in {CITY} as part of the job, including plans and inspections, so you never deal with the counter yourself." },
      { q: "What does a kitchen remodel cost?", a: "It depends on scope and finishes, which is why every project starts with a free on-site estimate and a written scope. Financing options are available, and all work carries our written warranty of up to five years." },
    ],
  },
  {
    name: "Bathroom Remodeling", slug: "bathroom-remodeling",
    short: "Spa-level baths — tile, stone, steam showers, heated floors — waterproofed right from the rough-in.",
    img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Modern remodeled bathroom with walk-in shower and custom tile",
    body: [
      "A bathroom remodel is won or lost in the parts you never see: the waterproofing, the slope of the pan, the blocking behind the wall. We build those right first, then finish with the tile, stone and fixtures that make the room feel like a retreat.",
      "Steam showers, saunas and radiant heated floors are the add-ons our clients ask for most — and because we build them from the rough-in instead of retrofitting, they work flawlessly for decades.",
    ],
    features: ["Full bathroom gut remodels", "Walk-in showers & frameless glass", "Steam showers & sauna installation", "Radiant heated bathroom floors", "Custom tile & natural stone work", "Vanities, counters & storage built-ins", "In-house plumbing & electrical", "Primary-suite bath additions"],
    faqs: [
      { q: "How long does a bathroom remodel take?", a: "A standard full remodel runs 2–4 weeks. Steam showers, saunas or layout changes add time, and your written schedule will show it before we start — no surprises mid-job." },
      { q: "Can you add a steam shower or heated floors to an existing bathroom in {CITY}?", a: "Yes — that's one of our most-requested upgrades in {CITY}. We size the steam generator, waterproof the enclosure properly and run the electrical in-house so the whole system is warrantied together." },
      { q: "Do you handle permits and inspections?", a: "Always. Bathroom remodels involving plumbing or electrical changes are permitted and inspected, and we manage the entire process as part of the project." },
    ],
  },
  {
    name: "Whole-Home Remodeling", slug: "whole-home-remodeling",
    short: "Interior and exterior remodeled as one project — layout, systems, finishes and paint under one crew.",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Open-plan whole home remodel with new flooring and glazing",
    body: [
      "When a house no longer fits the life inside it, patching one room at a time gets expensive. A whole-home remodel reworks the place as one project — circulation, light, kitchens and baths, flooring, systems, paint — sequenced by a single crew so the trades never trip over each other.",
      "Much of the East Bay's housing stock is 40 to 80 years old, and surprises behind the walls are the rule, not the exception. With plumbing, electrical, drywall and finish carpentry in-house, we absorb those surprises without losing the schedule.",
    ],
    features: ["Full interior renovations", "Exterior remodels & curb-appeal packages", "Layout changes & wall removal", "Plumbing & electrical updates", "Flooring, drywall, paint & trim", "Kitchen + bath combination scopes", "Energy & comfort upgrades", "Design collaboration available"],
    faqs: [
      { q: "How do you price a whole-home remodel?", a: "We walk the house with you, build a written scope room by room, and price it line by line — free. You'll know what's included, what's optional and what the schedule looks like before signing anything." },
      { q: "Can we live in the house during the remodel?", a: "Often, yes. We sequence the work by zone so part of the house stays livable, keep job sites clean daily, and are upfront when a phase is better done with the house empty." },
      { q: "Do you work with designers in {CITY}?", a: "Yes. Bring your own designer or plans, or we can loop in a designer we trust. Either way, the drawings, the schedule and the build stay coordinated under one roof." },
    ],
  },
  {
    name: "Home Additions & ADUs", slug: "additions-adus",
    short: "New square footage that looks original — plus ADUs that earn rent or house family.",
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Detached ADU guest house with pool at dusk",
    body: [
      "A good addition reads as if it was always there — the rooflines continue, the windows match, the proportions hold. We design and build primary-suite additions, kitchen expansions, family rooms and second-story pop-ups that blend into the original house instead of announcing themselves.",
      "Accessory dwelling units are the best investment in California residential construction right now: rental income, space for family, long-term property value. We handle feasibility, the state's evolving ADU rules, local permitting and utilities through final inspection.",
    ],
    features: ["Room additions & home extensions", "Primary suite & bath additions", "Detached & attached ADUs", "Garage conversions", "Feasibility & permit management", "Utility connections & upsizing", "Full kitchens & baths in every unit", "Finish levels matched to the main house"],
    faqs: [
      { q: "Are ADUs legal in {CITY}?", a: "California law requires cities to allow ADUs on most residential lots, and {CITY} processes them under those state rules. We confirm setbacks, size limits and utility requirements for your specific parcel during the free feasibility visit." },
      { q: "What does an ADU cost to build?", a: "It varies with size, site and finish level — a garage conversion is a different project than a detached new build. We price it in a written scope after walking your property, and financing options are available." },
      { q: "How long does an addition take?", a: "Design and permitting typically run 2–4 months depending on the city; construction runs 3–6 months for most additions and detached ADUs. We give you the real timeline up front and keep you updated weekly." },
    ],
  },
  {
    name: "Concrete & Driveways", slug: "concrete-driveways",
    short: "Driveways, patios, walkways and retaining walls — formed, poured and finished by our own crew.",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Modern home exterior with new concrete driveway and walkways",
    body: [
      "Concrete is one of our highest-volume trades — driveways, patios, walkways, slabs and retaining walls, formed and poured by our own crew with quick turnarounds. The difference between concrete that lasts and concrete that cracks is in the prep: base compaction, reinforcement and joints done right.",
      "We pour standard broom finish, exposed aggregate, and stamped and colored finishes, and we tie new flatwork into drainage so water moves away from the house instead of under it.",
    ],
    features: ["New concrete driveways & extensions", "Patios & outdoor living slabs", "Walkways, steps & porches", "Retaining walls", "Stamped, colored & exposed aggregate finishes", "Old concrete demo & haul-off", "Proper base prep & reinforcement", "Drainage integration"],
    faqs: [
      { q: "How long before I can use my new driveway?", a: "Foot traffic in 24–48 hours, vehicles in about 7 days as the slab cures toward full strength. We'll give you exact numbers for your pour and weather." },
      { q: "How fast can you pour a driveway in {CITY}?", a: "Driveways are one of our quickest turnarounds — most tear-out-and-repour projects in {CITY} run 3–5 working days from demo to finished pour, weather permitting." },
      { q: "Do you build retaining walls?", a: "Yes — engineered where height requires it, with proper drainage behind the wall. Failed retaining walls are almost always drainage failures, so we treat the part you can't see as the most important part." },
    ],
  },
  {
    name: "Interior & Exterior Painting", slug: "painting",
    short: "Full-prep painting inside and out — 22 years on the brush, straight lines, quality coatings.",
    img: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Freshly painted home exterior at dusk",
    body: [
      "Paint is the finish everyone sees, and it's where our family sets the bar: our lead painter has 22 years on the brush. Full prep — wash, scrape, sand, patch, prime — then quality coatings applied to manufacturer spec, with masking and cut lines sharp enough to pass your own inspection.",
      "Exterior repaints are one of our fastest, highest-impact projects: they transform curb appeal in days and protect siding and trim from the Delta sun and winter rain.",
    ],
    features: ["Full exterior repaints", "Interior walls, ceilings & trim", "Cabinet painting & refinishing", "Stucco, siding & trim repair before paint", "Complete prep: wash, scrape, patch, prime", "Premium coatings & color consultation", "Clean masking & daily site cleanup", "Fast, scheduled turnarounds"],
    faqs: [
      { q: "How long does an exterior repaint take?", a: "Most single-family exteriors run 4–7 working days including prep and dry time between coats. Larger homes or heavy repair scopes take longer — the written schedule comes with your free estimate." },
      { q: "What paint brands do you use?", a: "Premium lines from major manufacturers, chosen for the surface and exposure — and we're happy to match a brand or color spec you already have. Every coating is applied to manufacturer spec so warranties hold." },
      { q: "Do you paint in winter in {CITY}?", a: "Yes — {CITY} winters have plenty of paintable windows. We track temperature and moisture and schedule exterior coats when conditions let the coating cure properly." },
    ],
  },
  {
    name: "Flooring Installation", slug: "flooring",
    short: "Hardwood, engineered, tile and laminate — plus radiant heat — installed flat, tight and clean.",
    img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "New hardwood flooring in a bright remodeled living space",
    body: [
      "Floors take more abuse than any other finish in the house, and they show every shortcut. We flatten and prep substrates before a single plank or tile goes down, then install hardwood, engineered hardwood, tile and laminate with tight seams, correct expansion gaps and clean transitions.",
      "Want warmth underfoot? We install radiant heated flooring under tile and engineered floors — a favorite in bathrooms and kitchens.",
    ],
    features: ["Solid hardwood installation", "Engineered hardwood", "Tile flooring — porcelain, ceramic & stone", "Laminate & LVP", "Radiant heated floor systems", "Subfloor repair & leveling", "Baseboard & transition detailing", "Old flooring removal & disposal"],
    faqs: [
      { q: "Which flooring is right for my project?", a: "It depends on the room, the traffic and the look you want — solid hardwood refinishes for generations, engineered handles moisture swings better, tile wins wet rooms, laminate and LVP take a beating for less. We'll walk options and samples at the free estimate." },
      { q: "How long does flooring installation take?", a: "Most single-room installs run 1–3 days; whole-home flooring runs about a week depending on prep. Materials may need days on-site to acclimate first — we build that into the schedule." },
      { q: "Do you level uneven floors in older {CITY} homes?", a: "Constantly — settling and out-of-flat slabs are standard in older {CITY} housing stock. We grind or self-level before install, because flooring is only as good as what's under it." },
    ],
  },
  {
    name: "Drywall Installation & Repair", slug: "drywall",
    short: "Hung, taped, textured and finished by a 20-year specialist — walls you'll never think about again.",
    img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Clean finished interior walls in a remodeled home",
    body: [
      "Drywall is the trade you only notice when it's done badly — a wavy wall in raking light, a texture patch that doesn't match. Our drywall specialist has 20 years in the trade, and it shows in flat walls, crisp corners and repairs you can't find afterward.",
      "We hang, tape, texture and finish for our own remodels and as a standalone service — including matching existing textures, which is where most patch jobs fail.",
    ],
    features: ["New drywall for remodels & additions", "Water & fire damage repair", "Texture matching — orange peel, knockdown, smooth", "Level 5 smooth finishes", "Ceiling repair & popcorn removal", "Soundproofing & insulation upgrades", "Patching after plumbing/electrical work", "Paint-ready finishing"],
    faqs: [
      { q: "Can you match my existing wall texture?", a: "Yes — texture matching is the difference between a repair and an eyesore, and it's a specialty of ours. Orange peel, knockdown, hand troweled or smooth, the patch should disappear after paint." },
      { q: "Do you remove popcorn ceilings in {CITY}?", a: "Yes, including testing considerations for older {CITY} homes. We scrape, skim and refinish to a modern smooth or light texture, and leave the room paint-ready." },
      { q: "How fast can a repair be done?", a: "Small patches are often same-day with a return visit for texture and touch-up after drying. Larger repairs run 2–4 days because mud needs to dry between coats — rushing it is how bad patches happen." },
    ],
  },
  {
    name: "Cabinetry & Countertops", slug: "cabinetry-countertops",
    short: "Custom and semi-custom cabinets with stone and quartz counters — one scope, lines that line up.",
    img: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Custom kitchen cabinetry with stone countertops",
    body: [
      "Cabinets and counters are where a kitchen or bath goes from renovated to custom. We specify, order, template and install as one scope — so door reveals are even, counters land level, and the seam falls where nobody sees it.",
      "From full custom cabinetry to smart semi-custom lines that save budget without looking like it, we'll match the approach to the project — and our finish carpenters install it all.",
    ],
    features: ["Custom & semi-custom cabinetry", "Cabinet refacing & hardware upgrades", "Quartz, granite & natural stone counters", "Butcher block & specialty surfaces", "Precision templating & installation", "Built-ins, pantries & storage systems", "Bathroom vanities", "Soft-close & organization upgrades"],
    faqs: [
      { q: "Custom or semi-custom — which should I choose?", a: "Semi-custom covers most kitchens beautifully at a better price point; full custom earns its cost with unusual spaces, specific woods or furniture-grade details. We'll show you both against your budget at the estimate." },
      { q: "How long do new counters take?", a: "We template after cabinets are set, fabrication runs 1–2 weeks, and installation is usually a day. We sequence plumbing reconnection the same week so you're not without a sink." },
      { q: "Do you install cabinetry outside of full remodels in {CITY}?", a: "Yes — cabinet and counter replacement is a common standalone project for {CITY} homeowners who want the biggest visual upgrade without a full gut." },
    ],
  },
  {
    name: "Finish Carpentry & Trim", slug: "finish-carpentry-trim",
    short: "Baseboards, casing, wainscot, built-ins and stairs — the details that separate remodels from renovations.",
    img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Detailed interior trim and finish carpentry work",
    body: [
      "Trim is the jewelry of the house — and the first place cheap work shows. Our finish carpenters measure twice, scribe to the wall, and fill and caulk so paint looks poured on. Baseboards, door and window casing, crown, wainscot and paneling, floating shelves, built-ins and stair work.",
      "It's also the highest-return finishing touch on a repaint or flooring project: new floors deserve new base, and fresh walls deserve crisp casing.",
    ],
    features: ["Baseboards & door/window casing", "Crown molding", "Wainscot, board-and-batten & paneling", "Custom built-ins & floating shelves", "Stair rails, treads & skirt boards", "Interior door replacement & hanging", "Mantels & feature walls", "Paint-grade & stain-grade work"],
    faqs: [
      { q: "Can you match existing trim profiles?", a: "Usually yes — between stock profiles, combinations and custom knives for larger runs, we can continue what your house already speaks. Bring us a cutoff or we'll pull a profile on site." },
      { q: "What does trim work cost?", a: "It scales with linear footage and profile complexity, which makes it one of the easiest scopes to price accurately at a free estimate — and one of the highest-impact upgrades per dollar." },
      { q: "Do you do standalone trim projects in {CITY}?", a: "All the time. A base-casing-and-doors package is one of the fastest ways to lift an entire {CITY} home, usually inside a week." },
    ],
  },
  {
    name: "Steam Showers, Saunas & Heated Floors", slug: "steam-showers-saunas",
    short: "Spa features built from the rough-in — steam, sauna and radiant heat that work for decades.",
    img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Spa bathroom with steam shower and warm stone finishes",
    body: [
      "These are the upgrades our clients ask for by name: steam showers, saunas and radiant heated floors. They're also the projects where corner-cutting fails worst — steam finds every gap in waterproofing, and heated floors are only as good as the wire layout under them.",
      "We build spa features from the rough-in: vapor-sealed enclosures, correctly sized steam generators, dedicated circuits, and controls placed where you actually use them. Built once, built right, warrantied in writing.",
    ],
    features: ["Steam shower design & construction", "Steam generator sizing & installation", "Indoor & outdoor sauna builds", "Radiant heated floors — bathrooms, kitchens & more", "Full vapor-sealed waterproofing", "Dedicated electrical circuits & controls", "Tile & stone enclosure finishes", "Integration with full bath remodels"],
    faqs: [
      { q: "Can a steam shower go in my existing bathroom?", a: "In most cases yes — the enclosure needs to be sealed and sized to the generator, and we confirm both at the free estimate. Retrofit is very doable when it's planned from the rough-in rather than bolted on." },
      { q: "Are heated floors expensive to run?", a: "Less than most people expect — modern systems zone by room, run on programmable thermostats, and warm the tile you touch rather than the whole house. Bathrooms typically cost pennies a day to run." },
      { q: "Do you install saunas in {CITY}?", a: "Yes — indoor conversions and outdoor builds both. {CITY} homeowners usually pair a sauna with a bath remodel or a backyard project, and we design it into the larger scope." },
    ],
  },
  {
    name: "Pergolas & Outdoor Living", slug: "pergolas-outdoor-living",
    short: "Pergolas, patios, landscaping and outdoor rooms — planned as part of the house, not an afterthought.",
    img: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Backyard pergola and outdoor living space at dusk",
    body: [
      "East Bay weather is an unfair advantage — eight months of outdoor living a year if your backyard is built for it. We design and build pergolas, patio covers, outdoor kitchens, concrete patios and the landscaping that ties it together, as one project with one crew.",
      "Because our concrete, carpentry and electrical are in-house, your pergola gets real footings, your patio drains away from the house, and your string lights are on a switch — details that separate built from bought.",
    ],
    features: ["Custom pergolas & patio covers", "Concrete patios & outdoor slabs", "Outdoor kitchens & BBQ islands", "Landscaping & planting design", "Low-voltage & string lighting", "Fences, gates & privacy screens", "Drainage & irrigation", "Full backyard transformations"],
    faqs: [
      { q: "Do pergolas need permits in {CITY}?", a: "It depends on size, height and attachment to the house — {CITY} exempts some smaller detached structures. We confirm requirements for your design and pull the permit when one's needed." },
      { q: "Wood or aluminum pergola?", a: "Wood wins on warmth and customization; aluminum wins on maintenance. We build both and will talk honestly about how each ages in Delta sun before you choose." },
      { q: "Can you do the whole backyard — concrete, pergola and landscaping?", a: "That's exactly how we prefer to build it: one plan, one schedule, one crew, so grades, drainage, footings and planting work together instead of being three contractors' problems." },
    ],
  },
];

// Intro sentence variants keyed by (cityIdx + serviceIdx) % 3 — keeps 480 pages from opening identically
export const OPENERS = [
  (s, c) => `Looking for ${s.name.toLowerCase()} in ${c.name}? AZ Elevated Builders is a family-run, CA-licensed general contractor based in Brentwood — close enough to ${c.name} to walk your project this week, and experienced enough to build it right the first time.`,
  (s, c) => `AZ Elevated Builders brings quality-first ${s.name.toLowerCase()} to ${c.name}, ${c.county}. We're a family-run, CA-licensed contractor out of Brentwood, and every trade on our crew has 15+ years in that trade.`,
  (s, c) => `${c.name} homeowners choose AZ Elevated Builders for ${s.name.toLowerCase()} because we build like it's our own house: free honest estimates, one crew across every trade, and a written warranty of up to five years.`,
];
