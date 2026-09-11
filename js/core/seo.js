export function injectSchema(page, data) {
  const site = data.site;
  const person = {
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.name,
    url: site.url,
    image: `${site.url}/${site.ogImage}`,
    jobTitle: site.title,
    email: site.email,
    telephone: site.phone,
    address: { "@type": "PostalAddress", addressRegion: "Western Province", addressCountry: "LK" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "University of Westminster" },
    knowsAbout: site.knowsAbout,
    sameAs: site.socials.map((item) => item.href)
  };

  const images = [];
  const collect = (items = []) => {
    items.forEach((item) => {
      if (item.image) {
        images.push({
          "@type": "ImageObject",
          contentUrl: `${site.url}/${item.image.split("/").map(encodeURIComponent).join("/")}`,
          description: item.imageAlt || item.title || item.name,
          width: item.width,
          height: item.height
        });
      }
    });
  };
  collect(data.apps.items);
  collect(data.projects.items);
  collect(data.linkedin.items);
  collect(data.credentials.certifications);
  collect(data.credentials.achievements);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        name: `${site.name} — Atlas`,
        url: site.url,
        inLanguage: "en",
        publisher: { "@id": `${site.url}/#person` }
      },
      {
        "@type": "WebPage",
        name: document.title,
        url: window.location.href.split("#")[0],
        isPartOf: { "@id": `${site.url}/#website` },
        about: { "@id": `${site.url}/#person` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          contentUrl: `${site.url}/${site.ogImage}`,
          width: 512,
          height: 512
        }
      },
      ...images.slice(0, 24)
    ]
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(graph);
  document.head.appendChild(script);
}
