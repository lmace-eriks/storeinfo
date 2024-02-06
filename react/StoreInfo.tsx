import React, { ReactChildren, useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Link, canUseDOM } from "vtex.render-runtime";
// import { useDevice } from 'vtex.device-detector';

// Styles
import styles from "./styles.css";

interface StoreInfoProps {
  children: ReactChildren | any
  blockClass: string
  storeDetails: Array<StoreObject>
  defaultHero: HeroObject
}

interface StoreObject {
  __editorItemTitle: string // Store Code
  storeURL: string
  storeAddress: string
  nearbyLocations: string
  closed: boolean
  storeLocation: string
  storeDirectionsLink: string
  aboutHTML: string
  reviewsURL: string
  hero: HeroObject
  storeServices: Array<StoreServicesObject>
  storeProducts: Array<StoreServicesObject>
  storeImages: Array<StoreImageObject>
  seoHTML: string
}

interface HeroObject {
  desktopSrc: string
  mobileSrc: string
  subtitle: string
  ctaText: string
  ctaAltText: string
  ctaLink: string
}

interface StoreImageObject {
  src: string,
  __editorItemTitle: string
}

interface StoreServicesObject {
  __editorItemTitle: string
}

interface NearbyStoreObject {
  __editorItemTitle: string
  storeAddress: string
  storeLink: string
}

const blankStore: StoreObject = {
  __editorItemTitle: "null",
  closed: false,
  storeLocation: "",
  storeURL: "",
  nearbyLocations: "",
  storeAddress: "",
  storeDirectionsLink: "",
  aboutHTML: "",
  reviewsURL: "",
  hero: { ctaAltText: "", ctaLink: "", ctaText: "", desktopSrc: "", mobileSrc: "", subtitle: "" },
  storeServices: [],
  storeProducts: [],
  storeImages: [],
  seoHTML: ""
}

const oneHourInMs = 3.6e+6;

const defaultSEOHTML = "<p>       Our shop features a huge selection of bikes year-round:       <a href='/cycling/bicycles/road'>Road Bikes</a>,       <a href='/cycling/bicycles/mountain'>Mountain Bikes</a>,       <a href='/cycling/bicycles/electric-bikes'>Electric Bikes</a>,       <a href='/cycling/bicycles/mountain/Fat-Bike?map=c,c,c,specificationFilter_254'         >Fat Bikes</a       >, <a href='/cycling/bicycles/comfort?map=c,c,c'>Comfort Bikes</a>,       <a href='/kids%20bikes?_q=kids%20bikes&amp;map=ft'>Kids' Bikes</a>,       <a href='/cycling/bicycles/bmx'>BMX</a> and more! We are the #1       <a href='/specialized'>Specialized</a> bicycle dealer in the country with huge       inventory of bikes like the       <a href='/stumpjumper?_q=stumpjumper&amp;map=ft'>Specialized Stumpjumper</a>,       <a href='/sirrus?_q=sirrus&amp;map=ft'>Specialized Sirrus</a>,       <a href='/roubaix?_q=roubaix&amp;map=ft'>Specialized Roubaix</a>, and       <a href='/como?_q=como&amp;map=ft'>Specialized Como</a> We also have large inventories       of other top brands like <a href='/aventon'>Aventon</a>,       <a href='/rocky-mountain'>Rocky Mountain</a>,       <a href='/bmc'>BMC</a>,       <a href='/cervelo'>Cervelo</a>,       <a href='/haro'>Haro</a>, and many others. We also carry all the       <a href='/153/cycling?map=productClusterIds,c'>cycling apparel and gear</a> you'll need       to maximize your biking comfort, safety, and performance. If it's time for a tune-up, bring your bike(s) into our Service Department. We       <a href='/bike-repair'>repair</a> all brands and types of bikes (including E-Bikes) and       will get you back out riding in no time!     </p>     <p>       From mid-October through February we stock <a href='/winter/skis'>ski</a>,       <a href='/winter/snowboards'>snowboards</a>, and       <a                 href='/winter?_q=winter&amp;fuzzy=0&amp;map=ft,department&amp;operator=and&amp;query=/winter/winter'         >winter apparel and gear</a       >       too. If your <a href='/ski-service-repair'>skis</a> or       <a href='/snowboard-service-repair'>snowboard</a> are in need of repair or service,       like edge tune or wax, our expert technicians will help you get back out there on the slopes. Also, check out our downhill ski and snowboard       <a href='/eriks-kids-downhill-ski-snowboard-leasing'>leasing</a> options for kids!     </p>     <p>       Learn all about our convenient shopping options       <a href='/blog/post/eriks-convenient-shopping-options'>here</a>. We look forward to       seeing you soon!     </p><p><span class='vtex-ebs-bold'>Electric Bike Store</span> - All ERIK'S shopshave Electric Bikes. We have the best selection of e-bikes in the Midwest.Weoffer in-store test rides on a trainer to help you get familiarized withthe controls and the motor assist. And of course we also offer freeon-streettest rides so you can get the full experience of riding anelectric bike. Are you a commuter? Casual rider? Mountain bikers? Roadbiker? However you ride…we have the electric bike for you! We also serviceand repair electric bikes so you can get back to riding fast!<br /><a href='/electric-bikes-at-eriks-bike-shop'>Read our Electric Bike Buying Guide to learn more about E-Bikes</a></p><p><span class='vtex-ebs-bold'>Bikes</span> - ERIK'S has the best selectionof bikes in the Midwest! Every ERIK'S location has a great selection ofbikes for all types of riders.Mountain Bikes, Road Bikes, Electric Bikes,Recreational Bikes, Commuter Bikes, Kids' Bikes, BMX Bikes and more! Weare the #1 <a href='/specialized'>Specialized</a> bicycle dealer in thecountry with huge inventory of bikes like the<a href='/stumpjumper?_q=stumpjumper&amp;map=ft'>Specialized Stumpjumper</a>, <a href='/sirrus?_q=sirrus&amp;map=ft'>Specialized Sirrus</a>,<a href='/roubaix?_q=roubaix&amp;map=ft'>Specialized Roubaix</a>, and<a href='/como?_q=como&amp;map=ft'>Specialized Como</a> We also havelargeinventories of other top brands like <a href='/aventon'>Aventon</a>,<a href='/rocky-mountain'>Rocky Mountain</a>, <a href='/bmc'>BMC</a>,<a href='/cervelo'>Cervelo</a>, <a href='/haro'>Haro</a>, and many others.When you shop at ERIK'S you're buying the best bikes and cycling gearavailableon the market today.Our expert staff will help you find theperfect ride. Wheel on in today and test ride your next bike!<br /><a href='https: //www.eriksbikeshop.com/eriks-bicycle-buying-guide'>Find the right bike for you</a></p><p><span class='vtex-ebs-bold'>Service</span> - We pride ourselves on qualityservice of all bikes; whether it's a brand new bike, or an old favorite,we know you'd rather beriding. ERIK'S offers<a href='/bike-repair'>Same Day Service</a> on many repairs andadjustments to get you in and out quickly. Every bike we sell comeswith a90-Day Safety Check at no additional charge. For ski and snowboard fans,from October through March, ERIK'S services<a href='/ski-service-repair'>skis</a> and<a href='/snowboard-service-repair'>snowboards</a>. Whether you need abasic wax, base repair or edge tune,we'll get you ready to ride.<br /><a href='/repair'>Find out more about Service at ERIK'S</a></p><p><span class='vtex-ebs-bold'>Bike Sizing</span> - The best bikes areproperly sized. Every ERIK'S location has trained staff on hand to sizeyour next bike - a critical step ingetting you on the right road ormountain bike. We start by measuring your body and we use those specificmeasurements to find the perfect bike size foryou. For the ultimate incomfort and performance, look to our Body Geometry Fit services to getyour bike dialed.<br /><a href='/trufit-new-bike-sizing'>Find out more about Bike Sizing</a></p><p><span class='vtex-ebs-bold'>Snowboards</span> - When snow covers theground, that doesn't mean it's time to go inside! From October throughFebruary, ERIK'S carries snowboards(and skis) and winter apparel forriders from young to old, casual to aggressive. We have amazing brandslike <a href='/burton'>Burton</a>, <a href='/ride'>Ride</a>,<a href='/k2'>K2</a>, <a href='/32'>32</a>, <a href='/capita'>Capita</a>,<a href='/union'>Union</a>, <a href='/686'>686</a>,and much more! We'llmatch you with the right board for where and how you ride! And if you needyour board serviced, ERIK'S repairs snowboards. Whetheryou need a basicwax, base repair, or edge tune, we'll get you back on the slopes.<br /><a href='/snowboard-buying-guide'>Find out more about Snowboards</a></p><p><span class='vtex-ebs-bold'>Downhill Skis</span> - Winter... Bring it on!From October through February, ERIK'S has great section of skis (andsnowboards) and winter apparel!Our knowledgeable staff will help find youthe perfect skis to get you on the slopes this winter. We have greatbrands like <a href='/salomon'>Salomon</a>,<a href='/helly-hansen'>Helly Hansen</a>, <a href='/spyder'>Spyder</a>,<a href='/k2'>K2</a>, <a href='/elan'>Elan</a> andmuch more!From a kid intheir first season to the recreational skier to a seasoned park skier,we've got the equipment and knowledge to set you up thiswinter. And if youneed service, ERIK'S repairs skis. Whether you need a basic wax, baserepair, or edge tune, we'll get you back on the slopes.<br /><a href='/ski-buying-guide'>Find out more about Downhill Skis</a></p><p><span class='vtex-ebs-bold'>Leasing</span> - At ERIK'S, we know that kid'sgrow fast! Keeping them in gear from season to season is expensive. That'swhy we offer high qualityequipment for young skiers and snowboardersalike. Available November through March, kid's ski and snowboard leasingis a great way to try out a newsport, or supply a family of growingriders.<br /><a href='/Eriks-Kids-Downhill-Ski-Snowboard-Leasing'>Find out more about our Leasing Program</a></p><p><span class='vtex-ebs-bold'>Performance Scooters</span> - From kickingaround the neighborhood to hitting the local skatepark, scooters are agreat way for young riders toexplore and learn new skills. ERIK'S carriesscooters that are made to last. From street to dirt, see why these littlewheels can be a lot of fun!<br /><a href='/skate-and-scooters/pro-scooters?map=c,c'>Find out more about Pro Scooters</a></p><p><span class='vtex-ebs-bold'>Skateboards and Longboards</span> -Skateboarding knows no age limit! Whether you're most at home in skateparkor cruising the streets and paths ona longboard, we've got the gear youneed. Completes, decks, trucks, wheels, bearings and more! We've got greatbrands and staff that ride to help you makeyour selection. When it's timeto change out wheels or bearings, we've got a great part selection to keepyou rolling as well.<br /><a href='/162/skate-and-scooters?map=productClusterIds,c'>Find out more about Skateboards and Longboards</a></p>";
const defaultServices = ["Bike Repair", "Electric Bike Repair", "Bike Sizing", "Leasing *"];
const defaultProducts = ["Bikes", "Electric Bikes", "Car Racks", "Snowboards *", "Skis *", "Apparel", "Skateboards", "Longboards", "Scooters"];

const StoreInfo: StorefrontFunctionComponent<StoreInfoProps> = ({ children, storeDetails, defaultHero }) => {
  // const { isMobile } = useDevice();

  // State
  const [storeInfo, setStoreInfo] = useState<StoreObject>();
  const [storeOpenStatus, setStoreOpenStatus] = useState("");
  const [trainPosition, setTrainPosition] = useState(0);
  const [trainIndex, setTrainIndex] = useState(0);
  const [pauseTrain, setPauseTrain] = useState(false);
  const [seoExpanded, setSEOExpanded] = useState(false);
  const [nearbyLocations, setNearbyLocations] = useState<Array<NearbyStoreObject>>([]);

  // Ref
  const openGate = useRef(true);
  const tracks = useRef<HTMLDivElement>(null);
  const timer = useRef<any>();
  const trainCounter = useRef(0);

  useEffect(() => {
    if (!openGate.current) return;
    openGate.current = false;

    getStoreCode();
  });

  const getStoreCode = () => {
    if (!canUseDOM) return;

    const userPathList = window.location.pathname.split("/");
    const storeCode = userPathList[userPathList.length - 1].toLowerCase();

    getStoreDetails(storeCode);
  }

  const getStoreDetails = (storeCode: string) => {
    const currentStoreDetails = storeDetails.find(item => item.__editorItemTitle.toLowerCase().includes(storeCode));

    if (currentStoreDetails) {
      setStoreInfo(currentStoreDetails);

      if (currentStoreDetails.nearbyLocations) {
        getNearbyLocations(currentStoreDetails.nearbyLocations);
      } else {
        setNearbyLocations([]);
      }


      if (currentStoreDetails!.closed) {
        setStoreOpenStatus("tc");
      } else {
        determineOpen();
      }
    } else {
      setStoreInfo(blankStore);
    }
  }

  const getNearbyLocations = (nearbyLocations: string) => {
    const nlArray = nearbyLocations.split(", ");
    const tempNearbyLocations: Array<NearbyStoreObject> = [];

    nlArray.forEach(item => {
      const nearbyLocation = storeDetails.find(location => location.__editorItemTitle.toLowerCase() === item.toLowerCase());
      if (nearbyLocation) {
        tempNearbyLocations.push({
          __editorItemTitle: nearbyLocation.storeLocation,
          storeAddress: nearbyLocation.storeAddress,
          storeLink: nearbyLocation.storeURL
        })
      }
    });

    setNearbyLocations(tempNearbyLocations);
  }

  const getDayOfWeek = () => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date(Date.now()).getDay();
    return dayNames[today];
  }

  const determineOpen = () => {
    if (!canUseDOM) return;

    const today = getDayOfWeek();
    const domDays: Array<HTMLDivElement> = Array.from(document.querySelectorAll(".vtex-store-locator-0-x-hourRow"));

    if (domDays.length) {
      const todayDiv = domDays.find(item => item.innerText.includes(today))!;
      const todayOpen = todayDiv?.innerText.split("day:\n")[1].split(" - ")[0];
      const todayClose = todayDiv?.innerText.split(" - ")[1];

      const now = new Date(Date.now());
      const rightNowString = `${(now.getHours() < 11) ? now.getHours() : now.getHours() - 12}:${now.getMinutes()}${now.getHours() < 11 ? "am" : "pm"}`;

      if (!todayClose || todayOpen === "Closed") {
        setStoreOpenStatus("cc");
        return;
      }

      const openTimeInMs = getMS(todayOpen);
      const closeTimeInMs = getMS(todayClose);
      const timeNowInMs = getMS(rightNowString);

      const openSoonTime = openTimeInMs - oneHourInMs;
      const closingSoonTime = closeTimeInMs - oneHourInMs;

      if (timeNowInMs > openSoonTime && timeNowInMs < openTimeInMs) {
        setStoreOpenStatus("os");
        return;
      }

      if (timeNowInMs < closeTimeInMs && timeNowInMs > closingSoonTime) {
        setStoreOpenStatus("cs");
        return;
      }

      if (timeNowInMs < openTimeInMs || timeNowInMs > closeTimeInMs) {
        setStoreOpenStatus("cc");
        return;
      }

      setStoreOpenStatus("co");
    } else {
      // Needs a maximum number of checks fallback - LM
      setTimeout(() => determineOpen(), 1000);
    }
  }

  const getMS = (time: string) => {
    const isPM = (time: string) => time.toLowerCase().includes("am");

    // If PM add 12 hours.
    const hours = Number(time.split(":")[0]) + (isPM(time) ? 0 : 12);
    const minutes = Number(time.split(isPM(time) ? "am" : "pm")[0].split(":")[1]);

    const hoursMS = hours * 3.6e+6;
    const minutesMS = minutes * 60000;

    return hoursMS + minutesMS;
  }

  const updateTrainIndex = (direction: "left" | "right") => {
    const maximumIndex = storeInfo?.storeImages.length! - 1;

    if (direction === "left") {
      setTrainIndex(trainIndex - 1 < 0 ? maximumIndex : trainIndex - 1);
    }

    if (direction === "right") {
      setTrainIndex(trainIndex + 1 > maximumIndex ? 0 : trainIndex + 1);
    }
  }

  useEffect(() => {
    if (!tracks.current || !storeInfo) return;
    const trainStyles = getComputedStyle(tracks.current);

    const trainWidthInPx = Number(trainStyles.getPropertyValue("width").split("px")[0]);
    const borderWidthInPx = Number(trainStyles.getPropertyValue("border").split("px")[0]) * 2;
    const carWidth = trainWidthInPx - borderWidthInPx;

    setTrainPosition((carWidth * trainIndex) * -1);
  }, [trainIndex]);

  useEffect(() => {
    timer.current = setInterval(() => {
      // Hide this behind an observationIntersection() also - LM
      if (!pauseTrain) {
        trainCounter.current = trainCounter.current + 1;

        if (trainCounter.current <= 15) updateTrainIndex("right");
      }
    }, 3000);

    return () => clearInterval(timer.current);
  });

  const findStar = (list: any, listType: "string" | "object") => {
    if (!list) return false;

    if (listType === "string") return list.some((item: string) => item.includes("*"));
    if (listType === "object") return list.some((item: { __editorItemTitle: "string" }) => item.__editorItemTitle.includes("*"));
  }

  // useMemo() prevents re-render on setTrainIndex() - LM
  const StoreName = useMemo(() => () => children[0], []);
  const StoreAddress = useMemo(() => () => children[1], []);
  const StoreMap = useMemo(() => () => children[2], []);
  const StoreHours = useMemo(() => () => children[3], []);
  const StorePhoneNumber = useMemo(() => () => children[4], []);
  const SeasonalText = useMemo(() => () => <sup className={styles.seasonalText}><span className={styles.seasonalStar} aria-hidden="true">*</span> Seasonal Only</sup>, []);

  if (!storeInfo) return <></>

  if (storeInfo.__editorItemTitle === "null") return (
    <section aria-labelledby="about-store-title" className={styles.aboutLocationContainer}>
      <h2 id="about-store-title" className={styles.aboutStoreTitle}>Store Location Not Found</h2>
      <p className={styles.storeDescription}>Please check the link provided and try again.</p>
      <Link href="/stores" className={styles.heroCTALink}>Go to Store List</Link>
    </section>
  )

  return (
    <div className={styles.container} data-storecode={storeInfo.__editorItemTitle}>
      <section aria-label="Store Name and News" className={styles.heroContainer}>
        <picture>
          <source media="(min-width:1026px)" srcSet={storeInfo.hero.desktopSrc} type="image/jpeg" />
          <source media="(max-width:1025px)" srcSet={storeInfo.hero.mobileSrc} type="image/jpeg" />
          {/* @ts-ignore fetchpriority is not recognized - LM */}
          <img src={storeInfo.heroMobile} width={450} height={450} fetchpriority="high" loading="eager" alt="Outside of Erik's Store." className={styles.heroImage} />
        </picture>
        <div className={styles.heroTextContainer}>
          <div className={styles.storeNameContainer}>
            <StoreName />
          </div>
          <div className={styles.heroTextWrapper}>
            {(storeInfo.hero.subtitle || defaultHero.subtitle) &&
              <div className={styles.heroSubtitle}>{storeInfo.hero.subtitle || defaultHero.subtitle}</div>}
            {(storeInfo.hero.ctaText || defaultHero.ctaText) &&
              <Link href={storeInfo.hero.ctaLink || defaultHero.ctaLink} aria-label={storeInfo.hero.ctaAltText || defaultHero.ctaAltText} className={styles.heroCTALink}>{storeInfo.hero.ctaText || defaultHero.ctaText}</Link>}
          </div>
        </div>
      </section>

      <div className={styles.storeGrid} data-nearby-stores={!!nearbyLocations.length ? "true" : "false"}>
        <section aria-labelledby="store-info-title" className={styles.storeInfoContainer}>
          <h2 id="store-info-title" className={styles.storeInfoTitle}>Store Info</h2>
          <div className={styles.storeInfoWrapper}>
            <section aria-labelledby="store-address-title" className={styles.storeAddress}>
              <h3 id="store-address-title" className={styles.storeAddressTitle}>Store Address</h3>
              <StoreAddress />
              <Link href={storeInfo.storeDirectionsLink} target="_blank" rel="noreferrer" className={styles.storeDirectionsLink}>Get Directions</Link>
            </section>
            <section aria-labelledby="store-phone-title" className={styles.storePhone}>
              <h3 id="store-phone-title" className={styles.storePhoneTitle}>Phone Number</h3>
              <StorePhoneNumber />
            </section>
            <section aria-labelledby="store-hours-title" className={styles.storeHours}>
              <div className={styles.hoursTitleContainer}>
                <h3 id="store-hours-title" className={styles.storeHoursTitle}>Store Hours</h3>
                <div className={styles.storeOpenStatus} data-store-open-status={storeOpenStatus}>
                  {storeOpenStatus === "os" && `Opening Soon`}
                  {storeOpenStatus === "co" && `Currently OPEN`}
                  {storeOpenStatus === "cs" && `Closing Soon`}
                  {storeOpenStatus === "cc" && `Currently CLOSED`}
                  {storeOpenStatus === "tc" && `Temporarily CLOSED`}
                  {storeOpenStatus === "" && ``}
                </div>
              </div>
              <StoreHours />
            </section>
          </div>
        </section>

        <section aria-label="Map to store location." className={styles.mapContainer}>
          <StoreMap />
        </section>

        {/* Do not disply for Scottsdale location - LM */}
        {!!nearbyLocations.length &&
          <section aria-labelledby="nearby-stores-title" className={styles.nearbyStoresContainer}>
            <h2 id="nearby-stores-title" className={styles.nearbyStoresTitle}>Nearby Stores</h2>
            <ul className={styles.nearbyStoreslist}>
              {nearbyLocations.map(location => (
                <li key={location.storeLink} className={styles.nearbyStore}>
                  <div className={styles.nearbyStoreName}>{location.__editorItemTitle}</div>
                  <div className={styles.nearbyStoreAddress}>{location.storeAddress}</div>
                  <Link href={location.storeLink} aria-label={`${location.__editorItemTitle}'s store details`} className={styles.nearbyStoreLink}>Store Details</Link>
                </li>
              ))}
            </ul>
          </section>
        }
      </div>

      <section aria-labelledby="about-store-title" className={styles.aboutLocationContainer}>
        <h2 id="about-store-title" className={styles.aboutStoreTitle}>About the {storeInfo.storeLocation} Location</h2>
        <div dangerouslySetInnerHTML={{ __html: storeInfo.aboutHTML || "" }} className={styles.storeDescription} />
      </section>

      <div className={styles.servicesPhotosProducts}>
        <div className={styles.productsAndServices}>
          <section aria-labelledby="store-products-title" className={styles.storeProductsContainer}>
            <h2 id="store-products-title" className={styles.storeServicesTitle}>Store Products</h2>
            <ul className={styles.storeServicesList}>
              {storeInfo.storeProducts ?
                storeInfo.storeProducts.map((product, index) => (
                  <li key={`product-${index}`} className={styles.storeServicesItem}>
                    {product.__editorItemTitle}
                    {product.__editorItemTitle.includes("*") && <SeasonalText />}</li>
                )) :
                defaultProducts.map((product, index) => (
                  <li key={`product-${index}`} className={styles.storeServicesItem}>
                    {product}
                    {product.includes("*") && <SeasonalText />}</li>
                ))}
            </ul>
            {findStar(storeInfo?.storeProducts, "object") && <span aria-hidden="true"><SeasonalText /></span>}
            {!storeInfo.storeProducts && findStar(defaultProducts, "string") && <span aria-hidden="true"><SeasonalText /></span>}
          </section>

          <section aria-labelledby="store-services-title" className={styles.storeServicesContainer}>
            <h2 id="store-services-title" className={styles.storeServicesTitle}>Store Services</h2>
            <ul className={styles.storeServicesList}>
              {storeInfo.storeServices ?
                storeInfo.storeServices.map((service, index) => (
                  <li key={`service-${index}`} className={styles.storeServicesItem}>
                    {service.__editorItemTitle}
                    {service.__editorItemTitle.includes("*") && <SeasonalText />}</li>
                )) :
                defaultServices.map((service, index) => (
                  <li key={`service-${index}`} className={styles.storeServicesItem}>
                    {service}
                    {service.includes("*") && <SeasonalText />}</li>
                ))}
            </ul>
            {findStar(storeInfo?.storeServices, "object") && <span aria-hidden="true"><SeasonalText /></span>}
            {!storeInfo.storeServices && findStar(defaultServices, "string") && <span aria-hidden="true"><SeasonalText /></span>}
          </section>
        </div>

        <section aria-label="Carousel photos of location." onMouseEnter={() => setPauseTrain(true)} onMouseLeave={() => setPauseTrain(false)} className={styles.storeImagesSection}>
          <div ref={tracks} className={styles.tracks}>
            <div className={styles.train} style={{ transform: `translate(${trainPosition}px)` }}>
              {storeInfo.storeImages.map((image, index) => (
                <img key={`car-${index}`} src={image.src} alt={image.__editorItemTitle} width={400} height={300} loading="lazy" className={styles.car} />
              ))}
            </div>
            <div className={styles.dotsContainer}>
              {storeInfo.storeImages.map((dot, index) => (
                <button key={`dot-${index}`} onClick={() => setTrainIndex(index)} aria-label={`Go to ${dot.__editorItemTitle} photo.`} data-dot-index={index} data-active={trainIndex === index} className={styles.dot}></button>
              ))}
            </div>
            <div className={styles.buttonContainer}>
              <button onClick={() => updateTrainIndex("left")} data-point="left" className={styles.directionButton}>
                <img src="/arquivos/sm-caret.gif" alt="Navigate Carousel Left" className={styles.buttonImage} />
              </button>
              <button onClick={() => updateTrainIndex("right")} data-point="right" className={styles.directionButton}>
                <img src="/arquivos/sm-caret.gif" alt="Navigate Carousel Right" className={styles.buttonImage} />
              </button>
            </div>
          </div>
        </section>
      </div>

      <section aria-labelledby="reviews-title" className={styles.reviewsContainer}>
        <h2 id="reviews-title" className={styles.reviewsTitle}>{storeInfo.storeLocation} Reviews</h2>
        <iframe frameBorder={0} src={storeInfo.reviewsURL} className={styles.reviewsFrame} />
      </section>

      <section aria-labelledby="learn-more-title" data-expanded={seoExpanded} className={styles.learnMoreContainer}>
        <button onClick={() => setSEOExpanded(!seoExpanded)} aria-expanded={seoExpanded} aria-controls="learn-more-text" className={styles.learnMoreButton}>
          <h2 id="learn-more-title" className={styles.learnMoreTitle}>Learn more about our {storeInfo.storeLocation} location</h2>
          <img src="/arquivos/sm-caret.gif" alt="" className={styles.learnMoreButtonImage} />
        </button>
        <div id="learn-more-text" dangerouslySetInnerHTML={{ __html: storeInfo.seoHTML || defaultSEOHTML }} className={styles.learnMoreWindow}>
        </div>
      </section>
    </div >
  );
};

StoreInfo.schema = {
  title: "StoreInfo",
  description: "",
  type: "object",
  properties: {
    storeDetails: {
      title: "Store Details",
      type: "array",
      items: {
        properties: {
          __editorItemTitle: {
            title: "Store Code",
            type: "string"
          },
          closed: {
            title: "Temporarily Closed?",
            type: "boolean",
            default: false
          },
          storeLocation: {
            title: "Readable Name",
            type: "string",
            description: "Example: Burnsville, MN",
            default: ""
          },
          storeAddress: {
            title: "Physical Address",
            type: "string",
            description: "Example: 501 East County Road 42 Burnsville, MN, 55306",
            default: ""
          },
          storeURL: {
            title: "URL",
            type: "string",
            description: "Example: /store/burnsville-mn-55306/Burns",
            default: ""
          },
          nearbyLocations: {
            title: "Nearby Locations List",
            type: "string",
            description: "Comma sepparated list of store codes."
          },

          hero: {
            type: "object",
            properties: {
              desktopSrc: {
                title: "Hero Desktop",
                type: "string",
                description: "",
                default: "",
                widget: { "ui:widget": "image-uploader" }
              },
              mobileSrc: {
                title: "Hero Mobile",
                type: "string",
                description: "450px x 450px",
                default: "",
                widget: { "ui:widget": "image-uploader" }
              },
              subtitle: {
                title: "Subtitle Text",
                type: "string",
                description: "Overwrites Default if not blank.",
                default: "",
                widget: { "ui:widget": "textarea" }
              },
              ctaText: {
                title: "CTA Text",
                type: "string",
                description: "Overwrites Default if not blank.",
                default: ""
              },
              ctaAltText: {
                title: "CTA Link Description",
                type: "string",
                description: "For Screen Readers. Overwrites Default if not blank.",
                default: ""

              },
              ctaLink: {
                title: "CTA Link",
                type: "string",
                description: "Overwrites Default if not blank.",
                default: ""
              },
            }
          },
          aboutHTML: {
            title: "About Location",
            type: "string",
            description: "Accepts HTML. Will be displayed inside a <div> tag.",
            widget: { "ui:widget": "textarea" }
          },
          storeDirectionsLink: {
            title: "Directions Link",
            type: "string",
            description: "",
            default: "",
            widget: { "ui:widget": "textarea" }
          },
          storeServices: {
            title: "Services List",
            type: "array",
            description: "",
            items: {
              properties: {
                __editorItemTitle: {
                  title: "Service Provided",
                  type: "string",
                  widget: { "ui:widget": "textarea" },
                },
              }
            }
          },
          storeImages: {
            title: "Store Images",
            type: "array",
            description: "",
            items: {
              properties: {
                __editorItemTitle: {
                  title: "Alt Text",
                  type: "string",
                  description: "Required",
                  widget: { "ui:widget": "textarea" },
                },
                src: {
                  title: "Store Image",
                  type: "string",
                  widget: { "ui:widget": "image-uploader" },
                },
              }
            }
          },
          seoHTML: {
            title: "Custom Learn More",
            type: "string",
            description: "Overwrites default if not blank. Accepts HTML. Will be displayed inside a <div> tag.",
            widget: { "ui:widget": "textarea" }
          },
        }
      }
    },
    defaultHero: {
      type: "object",
      properties: {
        subtitle: {
          title: "Default Subtitle Text",
          type: "string",
          description: "",
          default: "",
          widget: { "ui:widget": "textarea" }
        },
        ctaText: {
          title: "Default CTA Text",
          type: "string",
          description: "",
          default: "",
          widget: { "ui:widget": "textarea" }
        },
        ctaAltText: {
          title: "Default CTA Link Description",
          type: "string",
          description: "For Screen Readers.",
          default: "",
          widget: { "ui:widget": "textarea" }

        },
        ctaLink: {
          title: "Default CTA Link",
          type: "string",
          description: "",
          default: "",
          widget: { "ui:widget": "textarea" }
        },
      },
    },
  }
};

export default StoreInfo;
