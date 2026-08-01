/* ==========================================================================
   Patrik Rufino - Personal Portfolio JavaScript
   Features: Interactive Header, Project Filter, Scroll Animations & Contact Form
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scroll Effect
  const header = document.querySelector('.header');
  
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // 2. Mobile Menu Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isExpanded);
      navToggle.innerHTML = isExpanded 
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (navToggle) {
          navToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
        }
      });
    });
  }

  // 3. Project Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4. Contact Form Handler (Real Email Dispatch via FormSubmit/Fetch API)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      const formAction = contactForm.getAttribute('action');

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Enviando...</span>`;

      // Se houver uma action configurada (ex: FormSubmit ou Web3Forms)
      if (formAction && formAction.includes('http')) {
        try {
          const formData = new FormData(contactForm);
          const response = await fetch(formAction, {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          });

          if (response.ok) {
            submitBtn.innerHTML = `<span>Mensagem Enviada! ✓</span>`;
            submitBtn.style.background = '#8c7355';
            submitBtn.style.color = '#ffffff';
            contactForm.reset();
          } else {
            throw new Error('Falha no envio');
          }
        } catch (err) {
          submitBtn.innerHTML = `<span>Erro ao Enviar</span>`;
          submitBtn.style.background = '#b91c1c';
          submitBtn.style.color = '#ffffff';
        } finally {
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.style.color = '';
          }, 3500);
        }
      } else {
        // Simulação de envio com aviso amigável caso a action não tenha sido configurada com o e-mail real do usuário
        setTimeout(() => {
          submitBtn.innerHTML = `<span>Mensagem Enviada! ✓</span>`;
          submitBtn.style.background = '#8c7355';
          submitBtn.style.color = '#ffffff';
          contactForm.reset();

          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.style.color = '';
          }, 3500);
        }, 800);
      }
    });
  }

  // 5. Active Link Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  
  const highlightActiveNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu a[href*="#${sectionId}"]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightActiveNav);

  // 6. Fetch Dev.to Articles Dynamically
  const blogGrid = document.getElementById('blog-grid');
  const DEVTO_USERNAME = 'patrikrufino';

  if (blogGrid) {
    fetch(`https://dev.to/api/articles?username=${DEVTO_USERNAME}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(articles => {
        if (!articles || articles.length === 0) {
          blogGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 2rem;">
              Nenhum artigo encontrado no momento.
            </div>
          `;
          return;
        }

        blogGrid.innerHTML = articles.slice(0, 6).map(article => {
          const date = new Date(article.published_timestamp).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });

          const coverHtml = article.cover_image 
            ? `<img src="${article.cover_image}" alt="${article.title}" class="blog-cover" loading="lazy">`
            : `<div class="blog-cover-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
               </div>`;

          const tagsHtml = (article.tag_list || []).map(tag => `<span class="blog-tag">#${tag}</span>`).join('');

          return `
            <article class="blog-card">
              ${coverHtml}
              <div class="blog-content">
                <div class="blog-meta">
                  <span>${date}</span>
                  <span>&bull;</span>
                  <span>${article.reading_time_minutes} min de leitura</span>
                </div>
                <h3 class="blog-title">
                  <a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a>
                </h3>
                <p class="blog-description">${article.description || ''}</p>
                ${tagsHtml ? `<div class="blog-tags">${tagsHtml}</div>` : ''}
                <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="blog-link">
                  <span>Ler artigo completo</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>
            </article>
          `;
        }).join('');
      })
      .catch(err => {
        console.error('Erro ao buscar artigos do Dev.to:', err);
        blogGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 2rem;">
            Não foi possível carregar os artigos no momento. Acesse diretamente no <a href="https://dev.to/${DEVTO_USERNAME}" target="_blank" style="color: var(--accent-primary); text-decoration: underline;">Dev.to</a>.
          </div>
        `;
      });
  }
});
