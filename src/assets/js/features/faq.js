(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  const features = (app.features = app.features || {});

  function closeFaqItem(details) {
    const content = details.querySelector("p");
    if (!content) {
      return;
    }

    if (details.faqTimer) {
      window.clearTimeout(details.faqTimer);
    }

    content.style.maxHeight = `${content.scrollHeight}px`;
    window.requestAnimationFrame(function () {
      details.classList.remove("is-open");
      content.style.maxHeight = "0px";
    });

    details.faqTimer = window.setTimeout(function () {
      details.open = false;
      details.faqTimer = null;
    }, 340);
  }

  function openFaqItem(details) {
    const content = details.querySelector("p");
    if (!content) {
      return;
    }

    if (details.faqTimer) {
      window.clearTimeout(details.faqTimer);
      details.faqTimer = null;
    }

    details.open = true;
    details.classList.add("is-open");
    content.style.maxHeight = "0px";

    window.requestAnimationFrame(function () {
      content.style.maxHeight = `${content.scrollHeight}px`;
    });
  }

  function init() {
    const faqGroups = Array.from(document.querySelectorAll(".events-page-faq"));
    if (faqGroups.length === 0) {
      return;
    }

    faqGroups.forEach(function (group) {
      const faqItems = Array.from(group.querySelectorAll("details"));
      faqItems.forEach(function (details) {
        const summary = details.querySelector("summary");
        const content = details.querySelector("p");
        if (!summary || !content) {
          return;
        }

        details.open = false;
        details.classList.remove("is-open");
        content.style.maxHeight = "0px";

        summary.addEventListener("click", function (event) {
          event.preventDefault();

          if (details.classList.contains("is-open")) {
            closeFaqItem(details);
            return;
          }

          faqItems.forEach(function (item) {
            if (item !== details && item.classList.contains("is-open")) {
              closeFaqItem(item);
            }
          });

          openFaqItem(details);
        });
      });
    });
  }

  features.faq = {
    init,
  };
})();
