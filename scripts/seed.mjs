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
  return data.createDesign;
}

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

  log("=== Creating art pieces ===");
  const arts = [];
  arts.push(
    await createArt(pim.token, "Pim", {
      title: "Golden Hour Reverie",
      description: "An oil painting exploring warm light and quiet stillness.",
      category: "painting",
      dimensions: "24*36in",
      artState: "onSale",
      price: 450,
      previewFile: img("art10.jpg"),
      previewPublicId: "seed/arts/golden_hour/preview",
      imageFiles: [img("work1.jpg"), img("work2.jpg")],
      imagePublicIdPrefix: "seed/arts/golden_hour/image",
    })
  );
  arts.push(
    await createArt(davinci.token, "davinci", {
      title: "Fractured Light",
      description: "Digital art piece experimenting with refraction and color.",
      category: "digitalArt",
      dimensions: "40*60cm",
      artState: "auction",
      auctionStartPrice: 100,
      auctionDays: 5,
      previewFile: img("drawings.png"),
      previewPublicId: "seed/arts/fractured_light/preview",
      imageFiles: [img("drawings2.png")],
      imagePublicIdPrefix: "seed/arts/fractured_light/image",
    })
  );
  arts.push(
    await createArt(pim.token, "Pim", {
      title: "Silent Grove",
      description: "Pencil drawing study of a quiet forest scene.",
      category: "pencilDrawing",
      dimensions: "18*24in",
      artState: "showcase",
      previewFile: img("work3.jpg"),
      previewPublicId: "seed/arts/silent_grove/preview",
      imageFiles: [img("more1.jpg")],
      imagePublicIdPrefix: "seed/arts/silent_grove/image",
    })
  );
  arts.push(
    await createArt(davinci.token, "davinci", {
      title: "Terracotta Vessel Study",
      description: "Sculpture study inspired by ancient pottery forms.",
      category: "sculpture",
      dimensions: "12*18in",
      artState: "onSale",
      price: 620,
      previewFile: img("card1.png"),
      previewPublicId: "seed/arts/terracotta_vessel/preview",
      imageFiles: [img("card2.png"), img("card3.png")],
      imagePublicIdPrefix: "seed/arts/terracotta_vessel/image",
    })
  );
  arts.push(
    await createArt(pim.token, "Pim", {
      title: "Woven Threads",
      description: "Textile art piece combining traditional weaving with modern motifs.",
      category: "textileArt",
      dimensions: "30*45cm",
      artState: "auction",
      auctionStartPrice: 150,
      auctionDays: 4,
      previewFile: img("card4.png"),
      previewPublicId: "seed/arts/woven_threads/preview",
      imageFiles: [img("card5.png")],
      imagePublicIdPrefix: "seed/arts/woven_threads/image",
    })
  );
  arts.push(
    await createArt(davinci.token, "davinci", {
      title: "Ink Calligraphy No. 3",
      description: "Traditional calligraphy piece exploring rhythm and negative space.",
      category: "calligraphy",
      dimensions: "20*30in",
      artState: "showcase",
      previewFile: img("card6.png"),
      previewPublicId: "seed/arts/ink_calligraphy/preview",
      imageFiles: [img("card7.png")],
      imagePublicIdPrefix: "seed/arts/ink_calligraphy/image",
    })
  );
  arts.push(
    await createArt(davinci.token, "davinci", {
      title: "Coastal Drift",
      description: "A study in tide lines and shifting sand, shot on location.",
      category: "digitalArt",
      dimensions: "36*24in",
      artState: "onSale",
      price: 320,
      previewPicsumSeed: "cs-art-coastal-drift",
      previewPublicId: "seed/arts/coastal_drift/preview",
      imagePicsumSeeds: ["cs-art-coastal-drift-2", "cs-art-coastal-drift-3"],
      imagePublicIdPrefix: "seed/arts/coastal_drift/image",
    })
  );
  arts.push(
    await createArt(pim.token, "Pim", {
      title: "Urban Fragments",
      description: "Mixed-media piece assembled from cityscape photography.",
      category: "digitalArt",
      dimensions: "50*70cm",
      artState: "auction",
      auctionStartPrice: 200,
      auctionDays: 6,
      previewPicsumSeed: "cs-art-urban-fragments",
      previewPublicId: "seed/arts/urban_fragments/preview",
      imagePicsumSeeds: ["cs-art-urban-fragments-2"],
      imagePublicIdPrefix: "seed/arts/urban_fragments/image",
    })
  );
  arts.push(
    await createArt(pim.token, "Pim", {
      title: "Highland Study",
      description: "Landscape study capturing early morning fog over the hills.",
      category: "painting",
      dimensions: "28*40in",
      artState: "showcase",
      previewPicsumSeed: "cs-art-highland-study",
      previewPublicId: "seed/arts/highland_study/preview",
      imagePicsumSeeds: ["cs-art-highland-study-2"],
      imagePublicIdPrefix: "seed/arts/highland_study/image",
    })
  );
  arts.push(
    await createArt(davinci.token, "davinci", {
      title: "Quiet Harbor",
      description: "A calm harbor scene rendered in muted tones.",
      category: "painting",
      dimensions: "24*30in",
      artState: "onSale",
      price: 275,
      previewPicsumSeed: "cs-art-quiet-harbor",
      previewPublicId: "seed/arts/quiet_harbor/preview",
      imagePicsumSeeds: ["cs-art-quiet-harbor-2", "cs-art-quiet-harbor-3"],
      imagePublicIdPrefix: "seed/arts/quiet_harbor/image",
    })
  );

  log("=== Creating designs ===");
  const designs = [];
  designs.push(
    await createDesign(kelvin.token, "ksowah", {
      title: "Finch Mobile Banking App",
      description: "A clean, modern mobile banking experience concept.",
      category: "Mobile",
      subscription: "FREE",
      tags: ["ui", "mobile", "fintech"],
      designUri: "https://www.figma.com/design/placeholder-finch-app",
      previewFile: img("smallpic.png"),
      previewPublicId: "seed/designs/finch_app/preview",
      imageFiles: [img("smallpic1.png")],
      imagePublicIdPrefix: "seed/designs/finch_app/image",
    })
  );
  designs.push(
    await createDesign(kelvin.token, "ksowah", {
      title: "Lumen Web Landing Page",
      description: "Landing page design for a lighting brand.",
      category: "Web",
      subscription: "PAID",
      tags: ["web", "landing-page", "branding"],
      designUri: "https://www.figma.com/design/placeholder-lumen-web",
      previewFile: img("slide1.jpg"),
      previewPublicId: "seed/designs/lumen_web/preview",
      imageFiles: [img("slide2.jpg")],
      imagePublicIdPrefix: "seed/designs/lumen_web/image",
    })
  );
  designs.push(
    await createDesign(kelvin.token, "ksowah", {
      title: "Nova Type Specimen",
      description: "Typography exploration for a display typeface.",
      category: "Typography",
      subscription: "FREE",
      tags: ["typography", "type-specimen"],
      designUri: "https://www.figma.com/design/placeholder-nova-type",
      previewFile: img("slide3.jpg"),
      previewPublicId: "seed/designs/nova_type/preview",
      imageFiles: [img("more2.jpg")],
      imagePublicIdPrefix: "seed/designs/nova_type/image",
    })
  );
  designs.push(
    await createDesign(mj.token, "mj", {
      title: "Golden Coast Photo Series",
      description: "Editorial photography series shot along the coastline.",
      category: "Photography",
      subscription: "PAID",
      tags: ["photography", "editorial"],
      designUri: "https://www.figma.com/design/placeholder-golden-coast",
      previewFile: img("art-overlay.jpg"),
      previewPublicId: "seed/designs/golden_coast/preview",
      imageFiles: [img("authbg.jpg")],
      imagePublicIdPrefix: "seed/designs/golden_coast/image",
    })
  );
  designs.push(
    await createDesign(mj.token, "mj", {
      title: "Botanica Illustration Set",
      description: "Hand-illustrated botanical set for packaging use.",
      category: "Illustration",
      subscription: "FREE",
      tags: ["illustration", "botanical", "packaging"],
      designUri: "https://www.figma.com/design/placeholder-botanica",
      previewFile: img("card8.png"),
      previewPublicId: "seed/designs/botanica/preview",
      imageFiles: [img("designoverlay.png")],
      imagePublicIdPrefix: "seed/designs/botanica/image",
    })
  );
  designs.push(
    await createDesign(mj.token, "mj", {
      title: "Motionwave Logo Reveal",
      description: "Animated logo reveal concept for a media startup.",
      category: "Animation",
      subscription: "PAID",
      tags: ["animation", "motion", "logo"],
      designUri: "https://www.figma.com/design/placeholder-motionwave",
      previewFile: img("mainpicture.png"),
      previewPublicId: "seed/designs/motionwave/preview",
      imageFiles: [img("figma_logo.png")],
      imagePublicIdPrefix: "seed/designs/motionwave/image",
    })
  );
  designs.push(
    await createDesign(kelvin.token, "ksowah", {
      title: "Aster Dashboard UI",
      description: "Analytics dashboard concept for a SaaS product.",
      category: "Web",
      subscription: "FREE",
      tags: ["ui", "dashboard", "saas"],
      designUri: "https://www.figma.com/design/placeholder-aster-dashboard",
      previewPicsumSeed: "cs-design-aster-dashboard",
      previewPublicId: "seed/designs/aster_dashboard/preview",
      imagePicsumSeeds: ["cs-design-aster-dashboard-2"],
      imagePublicIdPrefix: "seed/designs/aster_dashboard/image",
    })
  );
  designs.push(
    await createDesign(kelvin.token, "ksowah", {
      title: "Pulse Fitness App",
      description: "Onboarding and workout tracking flow for a fitness app.",
      category: "Mobile",
      subscription: "PAID",
      tags: ["ui", "mobile", "fitness"],
      designUri: "https://www.figma.com/design/placeholder-pulse-fitness",
      previewPicsumSeed: "cs-design-pulse-fitness",
      previewPublicId: "seed/designs/pulse_fitness/preview",
      imagePicsumSeeds: ["cs-design-pulse-fitness-2"],
      imagePublicIdPrefix: "seed/designs/pulse_fitness/image",
    })
  );
  designs.push(
    await createDesign(mj.token, "mj", {
      title: "Marble & Co. Branding",
      description: "Brand identity and packaging concept for a stationery label.",
      category: "Illustration",
      subscription: "PAID",
      tags: ["branding", "packaging", "identity"],
      designUri: "https://www.figma.com/design/placeholder-marble-co",
      previewPicsumSeed: "cs-design-marble-co",
      previewPublicId: "seed/designs/marble_co/preview",
      imagePicsumSeeds: ["cs-design-marble-co-2"],
      imagePublicIdPrefix: "seed/designs/marble_co/image",
    })
  );
  designs.push(
    await createDesign(mj.token, "mj", {
      title: "Wildlight Photography Portfolio",
      description: "Portfolio site concept for a nature photographer.",
      category: "Photography",
      subscription: "FREE",
      tags: ["photography", "portfolio", "web"],
      designUri: "https://www.figma.com/design/placeholder-wildlight",
      previewPicsumSeed: "cs-design-wildlight",
      previewPublicId: "seed/designs/wildlight/preview",
      imagePicsumSeeds: ["cs-design-wildlight-2", "cs-design-wildlight-3"],
      imagePublicIdPrefix: "seed/designs/wildlight/image",
    })
  );

  log("=== Social interactions ===");
  const tryFollow = async (follower, followed, followerName, followedName) => {
    try {
      await gql(
        `mutation Follow($followedUser: ID!) { follow(followedUser: $followedUser) { followedUser } }`,
        { followedUser: followed._id },
        follower.token
      );
      log(`  ${followerName} followed ${followedName}`);
    } catch (e) {
      log(`  ${followerName} -> ${followedName} follow skipped (${e.message})`);
    }
  };

  await tryFollow(kelvin, studio, "ksowah", "ksowahstudio");
  await tryFollow(studio, kelvin, "ksowahstudio", "ksowah");
  await tryFollow(studio, pim, "ksowahstudio", "Pim");
  await tryFollow(studio, davinci, "ksowahstudio", "davinci");
  await tryFollow(studio, mj, "ksowahstudio", "mj");
  await tryFollow(kelvin, pim, "ksowah", "Pim");
  await tryFollow(kelvin, davinci, "ksowah", "davinci");

  const auctionArts = arts.filter((a) => a.artState === "auction");

  log("=== Wallet deposit + bidding ===");
  await gql(
    `mutation Deposit($amount: Float!) { deposit(amount: $amount) { balance } }`,
    { amount: 5000 },
    studio.token
  );
  log(`  ksowahstudio deposited 5000 to wallet`);
  await gql(
    `mutation Deposit($amount: Float!) { deposit(amount: $amount) { balance } }`,
    { amount: 5000 },
    kelvin.token
  );
  log(`  ksowah deposited 5000 to wallet`);

  auctionArts.forEach((art, i) => {
    art.bidder = i % 2 === 0 ? studio : kelvin;
  });

  for (const art of auctionArts) {
    const bidAmount = 250;
    const data = await gql(
      `mutation PlaceBid($bidAmount: Float!, $artId: ID!) {
        placeBid(bidAmount: $bidAmount, artId: $artId) { _id bidAmount }
      }`,
      { bidAmount, artId: art._id },
      art.bidder.token
    );
    log(`  bid placed on "${art.title}": ${data.placeBid.bidAmount}`);
  }

  log("=== Done ===");
  log(`ksowah: ${kelvin._id}`);
  log(`ksowahstudio: ${studio._id}`);
  log(`Pim (artist): ${pim._id}`);
  log(`davinci (artist): ${davinci._id}`);
  log(`mj (designer): ${mj._id}`);
  log(`arts created: ${arts.length}`);
  log(`designs created: ${designs.length}`);
}

main().catch((e) => {
  console.error("SEED FAILED:", e);
  process.exit(1);
});
