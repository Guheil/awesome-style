(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});

  const prettyRouteEntries = Object.freeze([
    { actualPath: "/src/pages/home", prettyPath: "/home" },
    { actualPath: "/src/pages/about", prettyPath: "/about" },
    { actualPath: "/src/pages/events", prettyPath: "/events" },
    {
      actualPath: "/src/pages/team-building",
      prettyPath: "/team-building",
    },
    {
      actualPath: "/src/pages/day-tour-packages",
      prettyPath: "/day-tour-packages",
    },
    { actualPath: "/src/pages/rooms", prettyPath: "/rooms" },
    { actualPath: "/src/pages/dining", prettyPath: "/dining" },
    { actualPath: "/src/pages/restaurant", prettyPath: "/restaurant" },
    { actualPath: "/src/pages/cafe", prettyPath: "/cafe" },
    { actualPath: "/src/pages/bar", prettyPath: "/bar" },
    { actualPath: "/src/pages/breakfast", prettyPath: "/breakfast" },
    { actualPath: "/src/pages/spa", prettyPath: "/spa" },
    { actualPath: "/src/pages/services", prettyPath: "/services" },
    { actualPath: "/src/pages/gallery", prettyPath: "/gallery" },
    { actualPath: "/src/pages/blogs-news", prettyPath: "/blogs-news" },
    {
      actualPath: "/src/pages/blog-detail",
      prettyPath: "/blog-detail",
    },
    {
      actualPath: "/src/pages/seaside-retreat",
      prettyPath: "/seaside-retreat",
    },
    { actualPath: "/src/pages/contact", prettyPath: "/contact" },
  ]);

  const prettyRoutesByActualPath = new Map(
    prettyRouteEntries.map(function (route) {
      return [route.actualPath, route];
    }),
  );

  const prettyRoutesByPrettyPath = new Map(
    prettyRouteEntries.map(function (route) {
      return [route.prettyPath, route];
    }),
  );

  function normalizePathname(pathname) {
    if (!pathname) {
      return "/";
    }

    const normalizedPath = pathname.replace(/\/+/g, "/");

    if (normalizedPath.length > 1 && normalizedPath.endsWith("/")) {
      return normalizedPath.slice(0, -1);
    }

    return normalizedPath;
  }

  function getPrettyRoute(pathname) {
    const normalizedPath = normalizePathname(pathname);

    return (
      prettyRoutesByActualPath.get(normalizedPath) ||
      prettyRoutesByPrettyPath.get(normalizedPath) ||
      null
    );
  }

  function ensurePrettyRouteBase(route) {
    if (!route || window.location.protocol === "file:" || !document.head) {
      return;
    }

    let base = document.querySelector("base[data-pretty-route-base='true']");

    if (!base) {
      base = document.createElement("base");
      base.dataset.prettyRouteBase = "true";
      document.head.appendChild(base);
    }

    base.setAttribute("href", route.actualPath);
  }

  function initPrettyRoutes() {
    return;
  }

  app.routes = {
    ensurePrettyRouteBase,
    getPrettyRoute,
    initPrettyRoutes,
    normalizePathname,
    prettyRouteEntries,
  };
})();
