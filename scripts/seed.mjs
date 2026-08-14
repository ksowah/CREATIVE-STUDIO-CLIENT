import fs from "node:fs";
import path from "node:path";

const GRAPHQL_URL = "https://creative-studio-ksowahsoftwares.koyeb.app/graphql";
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.error(
    "Missing Cloudinary env vars. Run with: node --env-file=.env scripts/seed.mjs"
  );
  process.exit(1);
}

const IMAGES_DIR = path.join(process.cwd(), "public", "images");
const img = (name) => path.join(IMAGES_DIR, name);
const log = (...args) => console.log(new Date().toISOString(), ...args);
const slugify = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function gql(query, variables, token) {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  return json.data;
}

async function cloudinaryUpload(fileValue, publicId) {
  const form = new FormData();
  form.append("file", fileValue);
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("public_id", publicId);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: form }
  );
  const json = await res.json();
  if (json.error)
    throw new Error(
      `Cloudinary upload failed for ${publicId}: ${json.error.message}`
    );
  return { url: json.secure_url, publicId: json.public_id };
}

async function uploadImage(filePath, publicId) {
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime = ext === "jpg" ? "jpeg" : ext;
  const b64 = fs.readFileSync(filePath).toString("base64");
  const dataUri = `data:image/${mime};base64,${b64}`;
  return cloudinaryUpload(dataUri, publicId);
}

// Pulls a free, no-attribution-required stock photo from Picsum (picsum.photos)
// directly into Cloudinary via remote-URL fetch upload - no local download needed.
async function uploadFromPicsum(seed, publicId, width = 1200, height = 900) {
  const remoteUrl = `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
  return cloudinaryUpload(remoteUrl, publicId);
}

async function updateAvatar(token, fullName, avatarUrl) {
  await gql(
    `mutation EditProfile($editProfileInput: EditProfileInput) {
      editProfile(editProfileInput: $editProfileInput) { user { _id avatar } token }
    }`,
    { editProfileInput: { fullName, avatar: avatarUrl } },
    token
  );
}

async function registerAndSetup({
  fullName,
  email,
  password,
  username,
  avatarFile,
  avatarPublicId,
}) {
  log(`Uploading avatar for ${username}...`);
  const avatar = await uploadImage(avatarFile, avatarPublicId);

  log(`Registering ${email}...`);
  let userId;
  let alreadyVerified = false;
  try {
    const data = await gql(
      `mutation Register($registerInput: RegisterInput) {
        register(registerInput: $registerInput) { _id email username }
      }`,
      { registerInput: { fullName, email, password, username, avatar: avatar.url } }
    );
    userId = data.register._id;
    log(`  registered _id=${userId}`);
  } catch (e) {
    log(`  register skipped (${e.message}) - account likely exists, looking it up`);
    const lookup = await gql(
      `query { getUserByUsername(username: "${username}") { _id verified } }`
    );
    userId = lookup.getUserByUsername._id;
    alreadyVerified = lookup.getUserByUsername.verified;
  }

  // login fails outright for unverified accounts, so verify must happen first
  if (!alreadyVerified) {
    await gql(
      `mutation VerifyUser($userId: ID!) { verifyUser(userId: $userId) { _id verified } }`,
      { userId }
    );
    log(`  verified`);
  }

  const loginData = await gql(
    `mutation Login($loginInput: LoginInput) {
      login(loginInput: $loginInput) { user { _id username userType fullName } token }
    }`,
    { loginInput: { email, password } }
  );
  const { user, token } = loginData.login;
  log(`  logged in as ${user.username} (${user.userType})`);

  // NOTE: becomeCreator/becomeArtist/becomeDesigner are all broken server-side
  // right now (return null instead of the updated user) - role elevation is
  // skipped here. Content creation instead routes through pre-existing
  // accounts that already hold the ARTIST/DESIGNER role.

  await updateAvatar(token, fullName, avatar.url);
  log(`  synced avatar for ${user.username}`);

  return { ...user, token, avatarUrl: avatar.url };
}

async function loginOnly(email, password) {
  const loginData = await gql(
    `mutation Login($loginInput: LoginInput) {
      login(loginInput: $loginInput) { user { _id username userType fullName } token }
    }`,
    { loginInput: { email, password } }
  );
  const { user, token } = loginData.login;
  log(`Logged in as ${user.username} (${user.userType})`);
  return { ...user, token };
}

async function resolvePreview(opts) {
  return opts.previewFile
    ? uploadImage(opts.previewFile, opts.previewPublicId)
    : uploadFromPicsum(opts.previewPicsumSeed, opts.previewPublicId);
}

async function resolveImages(opts) {
  const images = [];
  if (opts.imageFiles) {
    for (let i = 0; i < opts.imageFiles.length; i++) {
      images.push(
        await uploadImage(opts.imageFiles[i], `${opts.imagePublicIdPrefix}__${i}`)
      );
    }
  } else if (opts.imagePicsumSeeds) {
    for (let i = 0; i < opts.imagePicsumSeeds.length; i++) {
      images.push(
        await uploadFromPicsum(
          opts.imagePicsumSeeds[i],
          `${opts.imagePublicIdPrefix}__${i}`
        )
      );
    }
  }
  return images;
}

async function createArt(token, owner, opts) {
  const preview = await resolvePreview(opts);
  const images = await resolveImages(opts);

  const now = Date.now();
  const isAuction = opts.artState === "auction";

  const artInput = {
    title: opts.title,
    description: opts.description,
    category: opts.category,
    dimensions: opts.dimensions,
    artPreview: preview.url,
    previewImageRef: preview.publicId,
    artImages: images.map((i) => i.url),
    artImagesRef: images.map((i) => i.publicId),
    artState: opts.artState,
    price: opts.price ?? 0,
    auctionStartPrice: isAuction ? opts.auctionStartPrice : 0,
    auctionStartDate: isAuction ? String(now) : "",
    auctionEndDate: isAuction ? String(now + (opts.auctionDays ?? 7) * 86400000) : "",
  };

  const data = await gql(
    `mutation CreateArt($artInput: ArtInput) {
      createArt(artInput: $artInput) { _id title artState }
    }`,
    { artInput },
    token
  );
  log(`  [${owner}] created art "${data.createArt.title}" (${data.createArt.artState}) _id=${data.createArt._id}`);
  return { ...data.createArt, owner };
}

async function createDesign(token, owner, opts) {
  const preview = await resolvePreview(opts);
  const images = await resolveImages(opts);

  const data = await gql(
    `mutation CreateDesign($createDesignInput: CreateDesignInput) {
      createDesign(createDesignInput: $createDesignInput) { _id title }
    }`,
    {
      createDesignInput: {
        title: opts.title,
        description: opts.description,
        category: opts.category,
        designSubscription: opts.subscription,
        tags: opts.tags,
        designUri: opts.designUri,
        preview: preview.url,
        previewImageRef: preview.publicId,
        designImages: images.map((i) => i.url),
        designImagesRef: images.map((i) => i.publicId),
      },
    },
    token
  );
  log(`  [${owner}] created design "${data.createDesign.title}" _id=${data.createDesign._id}`);
  return { ...data.createDesign, owner };
}

const ART_SPECS = [
  { title: "Amber Fields", description: "A sun-drenched wheat field caught in late afternoon light.", category: "painting", dimensions: "30*40in", artState: "onSale", price: 380 },
  { title: "Steel Bloom", description: "Welded steel sculpture inspired by unfurling petals.", category: "sculpture", dimensions: "20*20in", artState: "showcase" },
  { title: "Midnight Transit", description: "Digital piece exploring motion blur through a city at night.", category: "digitalArt", dimensions: "45*60cm", artState: "auction", auctionStartPrice: 180, auctionDays: 5 },
  { title: "Whispering Reeds", description: "Graphite study of reeds bending in the wind.", category: "pencilDrawing", dimensions: "16*20in", artState: "onSale", price: 150 },
  { title: "Vermillion Study", description: "Bold color-field study in red and ochre.", category: "painting", dimensions: "24*24in", artState: "showcase" },
  { title: "Concrete Garden", description: "Cast concrete forms arranged as a miniature rock garden.", category: "sculpture", dimensions: "14*14in", artState: "onSale", price: 410 },
  { title: "Glass Horizon", description: "Digital rendering of light refracting through glass panels.", category: "digitalArt", dimensions: "50*70cm", artState: "showcase" },
  { title: "Threadbound", description: "Hand-woven wall hanging using reclaimed fabric scraps.", category: "textileArt", dimensions: "36*48in", artState: "onSale", price: 290 },
  { title: "Ink & Ash", description: "Calligraphic piece built from layered ink washes.", category: "calligraphy", dimensions: "18*24in", artState: "showcase" },
  { title: "Departure Lounge", description: "Digital collage assembled from airport signage and light trails.", category: "digitalArt", dimensions: "40*50cm", artState: "auction", auctionStartPrice: 220, auctionDays: 6 },
  { title: "Sunbaked Clay", description: "Terracotta relief study of cracked desert ground.", category: "sculpture", dimensions: "16*16in", artState: "onSale", price: 340 },
  { title: "Paper Lanterns", description: "Pencil study of hanging lanterns at dusk.", category: "pencilDrawing", dimensions: "14*18in", artState: "showcase" },
  { title: "Electric Bloom", description: "Neon-toned digital florals rendered in high contrast.", category: "digitalArt", dimensions: "30*40cm", artState: "onSale", price: 260 },
  { title: "Woven Horizon", description: "Large-format tapestry blending geometric and organic motifs.", category: "textileArt", dimensions: "48*60cm", artState: "auction", auctionStartPrice: 190, auctionDays: 5 },
  { title: "Marble Whisper", description: "Minimalist marble form exploring negative space.", category: "sculpture", dimensions: "22*10in", artState: "showcase" },
  { title: "Copper Tide", description: "Oil painting of waves rendered in metallic tones.", category: "painting", dimensions: "28*36in", artState: "onSale", price: 470 },
  { title: "Faded Script", description: "Calligraphy piece using distressed lettering techniques.", category: "calligraphy", dimensions: "20*20in", artState: "onSale", price: 130 },
  { title: "Neon Orchard", description: "Digital orchard scene rendered in a synthwave palette.", category: "digitalArt", dimensions: "36*48cm", artState: "showcase" },
  { title: "Salt & Stone", description: "Coastal landscape painting capturing salt flats at sunset.", category: "painting", dimensions: "32*44in", artState: "auction", auctionStartPrice: 210, auctionDays: 7 },
  { title: "Loom of Dawn", description: "Textile piece using naturally dyed threads to depict sunrise.", category: "textileArt", dimensions: "30*36in", artState: "showcase" },
];

const DESIGN_SPECS = [
  { title: "Orbit Travel App", description: "Flight booking and itinerary app concept.", category: "Mobile", subscription: "FREE", tags: ["ui", "mobile", "travel"] },
  { title: "Basil Restaurant Site", description: "Warm, editorial website for a neighborhood restaurant.", category: "Web", subscription: "PAID", tags: ["web", "restaurant", "branding"] },
  { title: "Kinfolk Type System", description: "Modular type system built for editorial layouts.", category: "Typography", subscription: "FREE", tags: ["typography", "editorial"] },
  { title: "Solstice Editorial Shoot", description: "Fashion editorial photography series shot at golden hour.", category: "Photography", subscription: "PAID", tags: ["photography", "fashion", "editorial"] },
  { title: "Meadow Skincare Branding", description: "Botanical illustration set for a skincare label.", category: "Illustration", subscription: "FREE", tags: ["illustration", "packaging", "skincare"] },
  { title: "Beacon Onboarding Flow", description: "Multi-step onboarding flow for a productivity app.", category: "Mobile", subscription: "PAID", tags: ["ui", "onboarding", "mobile"] },
  { title: "Fernwood Portfolio Site", description: "Minimalist portfolio site for a landscape architect.", category: "Web", subscription: "FREE", tags: ["web", "portfolio"] },
  { title: "Type & Texture Study", description: "Experimental typography paired with tactile textures.", category: "Typography", subscription: "FREE", tags: ["typography", "experimental"] },
  { title: "Harbor Light Product Shots", description: "Product photography series for a coastal homeware brand.", category: "Photography", subscription: "PAID", tags: ["photography", "product"] },
  { title: "Petal Press Packaging", description: "Illustrated packaging system for a stationery brand.", category: "Illustration", subscription: "PAID", tags: ["illustration", "packaging"] },
  { title: "Loopline Logo Animation", description: "Animated logo reveal for a music streaming startup.", category: "Animation", subscription: "PAID", tags: ["animation", "logo", "motion"] },
  { title: "Nimbus Weather App", description: "Weather app redesign with a focus on data clarity.", category: "Mobile", subscription: "FREE", tags: ["ui", "mobile", "weather"] },
  { title: "Anchor Agency Rebrand", description: "Full rebrand concept for a digital agency.", category: "Web", subscription: "PAID", tags: ["branding", "web", "agency"] },
  { title: "Grain Type Specimen", description: "Display typeface specimen with grain texture overlays.", category: "Typography", subscription: "FREE", tags: ["typography", "type-specimen"] },
  { title: "Wanderlust Travel Series", description: "Documentary-style travel photography series.", category: "Photography", subscription: "FREE", tags: ["photography", "travel"] },
  { title: "Sprout Kids App", description: "Playful learning app concept for young children.", category: "Mobile", subscription: "PAID", tags: ["ui", "mobile", "kids"] },
  { title: "Foundry Studio Site", description: "Bold, type-driven website for a design foundry.", category: "Web", subscription: "FREE", tags: ["web", "typography"] },
  { title: "Thistle Illustration Pack", description: "Botanical illustration pack for editorial use.", category: "Illustration", subscription: "FREE", tags: ["illustration", "botanical"] },
  { title: "Momentum Splash Screen", description: "Animated splash screen concept for a fitness app.", category: "Animation", subscription: "FREE", tags: ["animation", "splash-screen"] },
  { title: "Coastal Table Menu Design", description: "Print and digital menu design for a seaside restaurant.", category: "Web", subscription: "PAID", tags: ["web", "menu", "hospitality"] },
];

const COMMENT_POOL = [
  "Love the color palette here!",
  "This is such a clean concept, great work.",
  "The composition really draws the eye in.",
  "Would love to see this as a full case study.",
  "Really solid execution on this one.",
  "The attention to detail is impressive.",
  "This has such a nice, calm energy to it.",
  "Great use of negative space.",
  "This would look amazing printed large.",
  "One of my favorites in this collection.",
];

const REPLY_POOL = [
  "Thank you, really appreciate that!",
  "Glad it resonates with you.",
  "That means a lot, thanks for checking it out.",
  "Appreciate the kind words!",
];

async function main() {
  log("=== Registering accounts ===");
  const kelvin = await registerAndSetup({
    fullName: "Kelvin Sowah",
    email: "sowahkelvin640@gmail.com",
    password: "123456",
    username: "ksowah",
    avatarFile: img("kev.jpg"),
    avatarPublicId: "seed/avatars/ksowah",
  });

  const studio = await registerAndSetup({
    fullName: "K. Sowah Studio",
    email: "sowahkelvin442@gmail.com",
    password: "CreativeStudio2026!",
    username: "ksowahstudio",
    avatarFile: img("master.png"),
    avatarPublicId: "seed/avatars/ksowahstudio",
  });

  // becomeArtist/becomeDesigner/becomeCreator are broken server-side, so art
  // and design content is created under pre-existing accounts that already
  // hold the ARTIST/DESIGNER role, rather than the two freshly seeded accounts.
  log("=== Logging into existing ARTIST/DESIGNER accounts ===");
  const pim = await loginOnly("ksowahsoftwares@gmail.com", "123456"); // ARTIST
  const davinci = await loginOnly("knosowah@st.ug.edu.gh", "123456"); // ARTIST
  const mj = await loginOnly("ksowahhh@gmail.com", "123456"); // DESIGNER

  log(`=== Creating ${ART_SPECS.length} more art pieces ===`);
  const arts = [];
  for (let i = 0; i < ART_SPECS.length; i++) {
    const spec = ART_SPECS[i];
    const owner = i % 2 === 0 ? pim : davinci;
    const ownerName = i % 2 === 0 ? "Pim" : "davinci";
    const slug = slugify(spec.title);
    arts.push(
      await createArt(owner.token, ownerName, {
        ...spec,
        previewPicsumSeed: `cs2-art-${slug}`,
        previewPublicId: `seed2/arts/${slug}/preview`,
        imagePicsumSeeds: [`cs2-art-${slug}-2`, `cs2-art-${slug}-3`],
        imagePublicIdPrefix: `seed2/arts/${slug}/image`,
      })
    );
  }

  log(`=== Creating ${DESIGN_SPECS.length} more designs ===`);
  const designs = [];
  for (let i = 0; i < DESIGN_SPECS.length; i++) {
    const spec = DESIGN_SPECS[i];
    const owner = i % 2 === 0 ? kelvin : mj;
    const ownerName = i % 2 === 0 ? "ksowah" : "mj";
    const slug = slugify(spec.title);
    designs.push(
      await createDesign(owner.token, ownerName, {
        ...spec,
        designUri: `https://www.figma.com/design/placeholder-${slug}`,
        previewPicsumSeed: `cs2-design-${slug}`,
        previewPublicId: `seed2/designs/${slug}/preview`,
        imagePicsumSeeds: [`cs2-design-${slug}-2`],
        imagePublicIdPrefix: `seed2/designs/${slug}/image`,
      })
    );
  }

  const auctionArts = arts.filter((a) => a.artState === "auction");

  log("=== Wallet deposit + bidding on new auction pieces ===");
  await gql(
    `mutation Deposit($amount: Float!) { deposit(amount: $amount) { balance } }`,
    { amount: 5000 },
    studio.token
  );
  await gql(
    `mutation Deposit($amount: Float!) { deposit(amount: $amount) { balance } }`,
    { amount: 5000 },
    kelvin.token
  );

  auctionArts.forEach((art, i) => {
    art.bidder = i % 2 === 0 ? studio : kelvin;
  });

  for (const art of auctionArts) {
    const bidAmount = 300;
    const data = await gql(
      `mutation PlaceBid($bidAmount: Float!, $artId: ID!) {
        placeBid(bidAmount: $bidAmount, artId: $artId) { _id bidAmount }
      }`,
      { bidAmount, artId: art._id },
      art.bidder.token
    );
    log(`  bid placed on "${art.title}": ${data.placeBid.bidAmount}`);
  }

  log("=== Adding comments to all visible designs ===");
  const allDesignsData = await gql(`{ getAllDesigns { _id title preview } }`);
  const visibleDesigns = (allDesignsData.getAllDesigns || []).filter(
    (d) => !(d.preview || "").includes("firebasestorage.googleapis.com")
  );
  log(`  found ${visibleDesigns.length} visible designs to comment on`);

  const commenters = [kelvin, studio, pim, davinci, mj];
  const commenterNames = ["ksowah", "ksowahstudio", "Pim", "davinci", "mj"];
  let commentCounter = 0;

  for (const design of visibleDesigns) {
    const numComments = 2 + (commentCounter % 2); // alternate between 2 and 3 comments
    for (let c = 0; c < numComments; c++) {
      const commenterIdx = commentCounter % commenters.length;
      const commenter = commenters[commenterIdx];
      const commenterName = commenterNames[commenterIdx];
      const commentText = COMMENT_POOL[commentCounter % COMMENT_POOL.length];

      const data = await gql(
        `mutation CreateComment($designId: String!, $comment: String!) {
          createComment(designId: $designId, comment: $comment) { _id comment }
        }`,
        { designId: design._id, comment: commentText },
        commenter.token
      );
      log(`  [${commenterName}] commented on "${design.title}": "${commentText}"`);

      // reply to roughly every other comment, from a different account
      if (commentCounter % 2 === 0) {
        const replierIdx = (commenterIdx + 1) % commenters.length;
        const replier = commenters[replierIdx];
        const replierName = commenterNames[replierIdx];
        const replyText = REPLY_POOL[commentCounter % REPLY_POOL.length];
        await gql(
          `mutation ReplyToComment($commentId: String!, $reply: String!) {
            replyToComment(commentId: $commentId, reply: $reply) { reply }
          }`,
          { commentId: data.createComment._id, reply: replyText },
          replier.token
        );
        log(`    [${replierName}] replied: "${replyText}"`);
      }

      commentCounter++;
    }
  }

  log("=== Done ===");
  log(`ksowah: ${kelvin._id}`);
  log(`ksowahstudio: ${studio._id}`);
  log(`Pim (artist): ${pim._id}`);
  log(`davinci (artist): ${davinci._id}`);
  log(`mj (designer): ${mj._id}`);
  log(`new arts created: ${arts.length}`);
  log(`new designs created: ${designs.length}`);
  log(`comments added across ${visibleDesigns.length} designs: ${commentCounter}`);
}

main().catch((e) => {
  console.error("SEED FAILED:", e);
  process.exit(1);
});
