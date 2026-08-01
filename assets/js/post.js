/* ==========================================================================
   JavaScript for Post Reader Page (post.html)
   Fetches full post content by ID from Dev.to API & renders Markdown safely
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  const postHeader = document.getElementById('postHeader');
  const postBody = document.getElementById('postBody');
  const postFooter = document.getElementById('postFooter');
  const metaTitle = document.getElementById('postMetaTitle');
  const metaDesc = document.getElementById('postMetaDescription');

  if (!postId) {
    window.location.href = 'blog.html';
    return;
  }

  fetch(`https://dev.to/api/articles/${postId}`)
    .then(response => {
      if (!response.ok) throw new Error('Artigo não encontrado');
      return response.json();
    })
    .then(article => {
      // Atualizar títulos e SEO
      document.title = `${article.title} | Blog Patrik Rufino`;
      if (metaTitle) metaTitle.setAttribute('content', article.title);
      if (metaDesc) metaDesc.setAttribute('content', article.description || '');

      const date = new Date(article.published_at || article.published_timestamp).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      // Render Header
      postHeader.innerHTML = `
        <div class="post-meta">
          <span>${date}</span>
          <span>&bull;</span>
          <span>${article.reading_time_minutes} min de leitura</span>
          <span>&bull;</span>
          <span>Por ${article.user ? article.user.name : 'Patrik Rufino'}</span>
        </div>
        <h1 class="post-main-title">${article.title}</h1>
      `;

      // Render Capa se houver
      let coverHtml = '';
      if (article.cover_image) {
        coverHtml = `<img src="${article.cover_image}" alt="${article.title}" class="post-cover-img">`;
      }

      // Renderizar o conteúdo em HTML limpo usando Marked.js
      let articleContentHtml = '';
      if (article.body_markdown) {
        articleContentHtml = typeof marked !== 'undefined' ? marked.parse(article.body_markdown) : article.body_html;
      } else if (article.body_html) {
        articleContentHtml = article.body_html;
      } else {
        articleContentHtml = `<p>${article.description}</p>`;
      }

      postBody.innerHTML = coverHtml + articleContentHtml;

      // Render Footer (Tags & Original Link)
      const tags = (article.tags || article.tag_list || []);
      const tagsHtml = tags.map(t => `<span class="blog-tag">#${t}</span>`).join(' ');

      postFooter.innerHTML = `
        <div class="blog-tags">
          ${tagsHtml}
        </div>
        <div style="font-size: 0.875rem; color: var(--text-muted);">
          Artigo publicado originalmente no <a href="${article.url}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-primary); text-decoration: underline;">Dev.to</a>.
        </div>
      `;
    })
    .catch(err => {
      console.error(err);
      if (postBody) {
        postBody.innerHTML = `
          <div style="text-align: center; padding: 4rem 1rem;">
            <h2>Ops! Artigo não localizado.</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">Não conseguimos carregar este artigo ou ele foi removido.</p>
            <a href="blog.html" class="btn btn-primary">Voltar para a lista de artigos</a>
          </div>
        `;
      }
    });
});
