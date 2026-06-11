
    // Custom cursor
    const cursor = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX - 6 + 'px';
      cursor.style.top = mouseY - 6 + 'px';
      cursorRing.style.left = mouseX - 18 + 'px';
      cursorRing.style.top = mouseY - 18 + 'px';
    });

    document.querySelectorAll('a, button, select').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        cursorRing.style.transform = 'scale(1.5)';
        cursorRing.style.opacity = '1';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorRing.style.transform = 'scale(1)';
        cursorRing.style.opacity = '0.5';
      });
    });

    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, 80 * (entry.target.dataset.delay || 0));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el, i) => {
      observer.observe(el);
    });

    // Stagger siblings
    document.querySelectorAll('.projects-grid, .blog-grid, .moments-grid, .japan-grid, .content-platforms, .resources-grid, .about-skills').forEach(grid => {
      grid.querySelectorAll('.reveal').forEach((child, i) => {
        child.dataset.delay = i;
        child.style.transitionDelay = (i * 0.08) + 's';
      });
    });
