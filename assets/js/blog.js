/* ==========================================================================
   JavaScript for Blog Listing Page (blog.html)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const blogGrid = document.getElementById('blogListingGrid');
  const searchInput = document.getElementById('blogSearchInput');
  const DEVTO_USERNAME = 'patrikrufino';
  let allArticles = [];

  const renderArticles = (articlesToRender) => {
    if (!articlesToRender || articlesToRender.length === 0) {
      blogGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 3rem 1rem;">
          Nenhum artigo encontrado com esse termo.
        </div>
      `;
      return;
    }

    blogGrid.innerHTML = articlesToRender.map(article => {
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
              <a href="post.html?id=${article.id}">${article.title}</a>
            </h3>
            <p class="blog-description">${article.description || ''}</p>
            ${tagsHtml ? `<div class="blog-tags">${tagsHtml}</div>` : ''}
            <a href="post.html?id=${article.id}" class="blog-link">
              <span>Ler artigo completo</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
        </article>
      `;
    }).join('');
  };

  if (blogGrid) {
    fetch(`https://dev.to/api/articles?username=${DEVTO_USERNAME}`)
      .then(response => {
        if (!response.ok) throw new Error('Erro na requisição');
        return response.json();
      })
      .then(articles => {
        allArticles = articles;
        renderArticles(allArticles);
      })
      .catch(err => {
        console.error(err);
        blogGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 3rem;">
            Não foi possível carregar os artigos no momento.
          </div>
        `;
      });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const filtered = allArticles.filter(art => {
        const titleMatch = art.title.toLowerCase().includes(term);
        const descMatch = (art.description || '').toLowerCase().includes(term);
        const tagMatch = (art.tag_list || []).some(t => t.toLowerCase().includes(term));
        return titleMatch || descMatch || tagMatch;
      });
      renderArticles(filtered);
    });
  }
});
