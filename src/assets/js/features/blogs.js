(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  app.features = app.features || {};
  const BLOG_INDEX_PAGE_SIZE = 4;

  function getBlogData() {
    return app.data && app.data.blogs ? app.data.blogs : null;
  }

  function getPosts() {
    const data = getBlogData();
    return data && Array.isArray(data.posts) ? data.posts : [];
  }

  function getPostBySlug(slug) {
    return getPosts().find(function (post) {
      return post.slug === slug;
    });
  }

  function getDetailHref(post) {
    const data = getBlogData();
    const baseHref = data ? data.detailPageHref : "../blog-detail/";

    return `${baseHref}?slug=${encodeURIComponent(post.slug)}`;
  }

  function getSlugFromLocation() {
    const params = new URLSearchParams(window.location.search);
    return (
      params.get("slug") ||
      document.body.getAttribute("data-blog-slug") ||
      "seaside-retreat"
    );
  }

  function decodeHtml(html) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
  }

  function renderPostCard(post, isFeatured) {
    const cardClass = isFeatured
      ? "blog-card blog-card--featured"
      : "blog-card";
    const detailHref = getDetailHref(post);

    return `
      <article class="${cardClass}">
        <a class="blog-card-media" href="${detailHref}">
          <img src="${post.image}" alt="${post.imageAlt || ""}" loading="${isFeatured ? "eager" : "lazy"}" />
        </a>
        <div class="blog-card-copy">
          <h3><a href="${detailHref}">${post.title}</a></h3>
          <time datetime="${post.dateTime}">${post.dateLabel}</time>
          <p>${post.excerpt}</p>
          <a class="blog-read-more" href="${detailHref}">read more</a>
        </div>
      </article>
    `;
  }

  function renderFeaturedNews(post) {
    const detailHref = getDetailHref(post);

    return `
      <article class="blog-featured-card">
        <a class="blog-featured-media" href="${detailHref}">
          <img src="${post.image}" alt="${post.imageAlt || ""}" loading="eager" />
        </a>
        <div class="blog-featured-copy">
          <p class="blog-featured-label">Featured News</p>
          <h3><a href="${detailHref}">${post.title}</a></h3>
          <time datetime="${post.dateTime}">${post.dateLabel}</time>
          <p>${post.excerpt}</p>
          <a class="blog-read-more" href="${detailHref}">read more</a>
        </div>
      </article>
    `;
  }

  function getBlogIndexPosts(posts, featuredPost) {
    return posts.filter(function (post) {
      return !featuredPost || post.slug !== featuredPost.slug;
    });
  }

  function getPageFromUrl(totalPages) {
    const params = new URLSearchParams(window.location.search);
    const requestedPage = Number.parseInt(params.get("page"), 10);

    if (!Number.isFinite(requestedPage)) {
      return 1;
    }

    return Math.min(Math.max(requestedPage, 1), totalPages);
  }

  function setPageInUrl(page) {
    const url = new URL(window.location.href);

    if (page <= 1) {
      url.searchParams.delete("page");
    } else {
      url.searchParams.set("page", String(page));
    }

    window.history.pushState({ blogPage: page }, "", url);
  }

  function renderPagination(pagination, currentPage, totalPages) {
    if (!pagination || totalPages <= 1) {
      if (pagination) {
        pagination.hidden = true;
        pagination.innerHTML = "";
      }
      return;
    }

    const pageButtons = Array.from({ length: totalPages }, function (_, index) {
      const page = index + 1;
      const currentAttr = page === currentPage ? ' aria-current="page"' : "";
      return `<button class="blog-pagination-button" type="button" data-blog-page="${page}"${currentAttr}>${page}</button>`;
    }).join("");

    pagination.hidden = false;
    pagination.innerHTML = `
      <span>Page ${currentPage} of ${totalPages}</span>
      <button class="blog-pagination-button" type="button" data-blog-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>Previous</button>
      ${pageButtons}
      <button class="blog-pagination-button" type="button" data-blog-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""}>Next</button>
    `;
  }

  function renderBlogIndex() {
    const list = document.querySelector("[data-blog-list]");
    const featured = document.querySelector("[data-blog-featured]");
    const pagination = document.querySelector("[data-blog-pagination]");
    if (!list) {
      return;
    }

    const posts = getPosts();
    const featuredPost =
      posts.find(function (post) {
        return post.featured;
      }) || posts[0];

    const indexPosts = getBlogIndexPosts(posts, featuredPost);
    const totalPages = Math.max(
      Math.ceil(indexPosts.length / BLOG_INDEX_PAGE_SIZE),
      1,
    );
    const currentPage = getPageFromUrl(totalPages);
    const showFeatured = currentPage === 1;
    const pageStart = (currentPage - 1) * BLOG_INDEX_PAGE_SIZE;
    const visiblePosts = indexPosts.slice(
      pageStart,
      pageStart + BLOG_INDEX_PAGE_SIZE,
    );

    if (featured) {
      featured.hidden = !showFeatured;
      featured.innerHTML =
        showFeatured && featuredPost ? renderFeaturedNews(featuredPost) : "";
    }

    list.hidden = visiblePosts.length === 0;
    list.innerHTML = visiblePosts
      .map(function (post) {
        return renderPostCard(post, false);
      })
      .join("");

    renderPagination(pagination, currentPage, totalPages);
  }

  function handlePaginationClick(event) {
    const button = event.target.closest("[data-blog-page]");
    if (!button || button.disabled) {
      return;
    }

    const page = Number.parseInt(button.dataset.blogPage, 10);
    if (!Number.isFinite(page)) {
      return;
    }

    setPageInUrl(page);
    renderBlogIndex();
  }

  function renderBlocks(post) {
    return post.body
      .map(function (block) {
        const tagName = block.type || "p";
        return `<${tagName}>${block.html}</${tagName}>`;
      })
      .join("");
  }

  function setHtml(selector, html) {
    document.querySelectorAll(selector).forEach(function (element) {
      element.innerHTML = html;
    });
  }

  function setText(selector, text) {
    document.querySelectorAll(selector).forEach(function (element) {
      element.textContent = text;
    });
  }

  function renderRelatedPosts(post) {
    const relatedGrid = document.querySelector("[data-blog-related]");
    if (!relatedGrid) {
      return;
    }

    const relatedPosts = (post.relatedSlugs || [])
      .map(getPostBySlug)
      .filter(Boolean);

    relatedGrid.innerHTML = relatedPosts
      .map(function (relatedPost) {
        return renderPostCard(relatedPost, false);
      })
      .join("");
  }

  function renderBlogDetail() {
    const detailPage = document.querySelector("[data-blog-detail]");
    if (!detailPage) {
      return;
    }

    const post = getPostBySlug(getSlugFromLocation()) || getPosts()[0];
    if (!post) {
      return;
    }

    document.title = post.seoTitle || `${decodeHtml(post.title)} | Awesome Hotel`;
    setHtml("[data-blog-title]", post.title);
    setText("[data-blog-date]", post.dateLabel);

    document.querySelectorAll("[data-blog-date]").forEach(function (element) {
      element.setAttribute("datetime", post.dateTime);
    });

    document.querySelectorAll("[data-blog-image]").forEach(function (image) {
      image.setAttribute("src", post.image);
      image.setAttribute("alt", post.imageAlt || "");
    });

    const heroImage = document.querySelector("[data-blog-hero-image]");
    if (heroImage) {
      const data = getBlogData();
      heroImage.setAttribute("src", data ? data.heroImage : post.image);
    }

    const body = document.querySelector("[data-blog-body]");
    if (body) {
      body.innerHTML = renderBlocks(post);
    }

    renderRelatedPosts(post);
  }

  function init() {
    renderBlogIndex();
    renderBlogDetail();

    const pagination = document.querySelector("[data-blog-pagination]");
    if (pagination) {
      pagination.addEventListener("click", handlePaginationClick);
      window.addEventListener("popstate", renderBlogIndex);
    }
  }

  app.features.blogs = {
    init,
  };
})();
