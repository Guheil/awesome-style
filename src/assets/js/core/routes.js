(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});

  const prettyRouteEntries = Object.freeze([
    { actualPath: "/src/pages/index.html", prettyPath: "/home" },
    { actualPath: "/src/pages/about.html", prettyPath: "/about" },
    { actualPath: "/src/pages/events.html", prettyPath: "/events" },
    {
      actualPath: "/src/pages/team-building.html",
      prettyPath: "/team-building",
    },
    {
      actualPath: "/src/pages/day-tour-packages.html",
      prettyPath: "/day-tour-packages",
    },
    { actualPath: "/src/pages/rooms.html", prettyPath: "/rooms" },
    { actualPath: "/src/pages/dining.html", prettyPath: "/dining" },
    { actualPath: "/src/pages/restaurant.html", prettyPath: "/restaurant" },
    { actualPath: "/src/pages/cafe.html", prettyPath: "/cafe" },
    { actualPath: "/src/pages/bar.html", prettyPath: "/bar" },
    { actualPath: "/src/pages/breakfast.html", prettyPath: "/breakfast" },
    { actualPath: "/src/pages/spa.html", prettyPath: "/spa" },
    { actualPath: "/src/pages/services.html", prettyPath: "/services" },
    { actualPath: "/src/pages/gallery.html", prettyPath: "/gallery" },
    { actualPath: "/src/pages/contact.html", prettyPath: "/contact" },
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
    if (
      window.location.protocol === "file:" ||
      !window.history ||
      typeof window.history.replaceState !== "function"
    ) {
      return;
    }

    const route = getPrettyRoute(window.location.pathname);

    if (!route) {
      return;
    }

    ensurePrettyRouteBase(route);

    const currentUrl = `${normalizePathname(window.location.pathname)}${window.location.search}${window.location.hash}`;
    const prettyUrl = `${route.prettyPath}${window.location.search}${window.location.hash}`;

    if (currentUrl !== prettyUrl) {
      window.history.replaceState(null, "", prettyUrl);
    }
  }

  app.routes = {
    ensurePrettyRouteBase,
    getPrettyRoute,
    initPrettyRoutes,
    normalizePathname,
    prettyRouteEntries,
  };
})();
