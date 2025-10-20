/**
 * Dynamic Blog Post Loader
 * Loads blog posts from blog-posts.json and renders them as article cards
 */

(function() {
    'use strict';

    // Format date to human-readable format
    function formatDate(dateString) {
        // Parse the date string and create a local date to avoid timezone issues
        const [year, month, day] = dateString.split('-');
        const date = new Date(year, month - 1, day); // month is 0-indexed
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Create an article card element
    function createArticleCard(post) {
        const formattedDate = formatDate(post.date);
        
        return `
            <article style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); transition: transform 0.3s ease, box-shadow 0.3s ease;">
                <a href="/blog/${post.slug}/" style="text-decoration: none; color: inherit; display: block;">
                    <div style="position: relative; overflow: hidden; height: 220px;">
                        <img src="${post.image}" 
                             alt="${post.imageAlt}" 
                             style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;"
                             onmouseover="this.style.transform='scale(1.05)'"
                             onmouseout="this.style.transform='scale(1)'">
                        <div style="position: absolute; top: 15px; left: 15px; background: #F5A623; color: white; padding: 5px 15px; border-radius: 20px; font-family: 'Oswald', sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${post.category}
                        </div>
                    </div>
                    <div style="padding: 30px;">
                        <h3 style="font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: #1A1A1A; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; line-height: 1.2;">
                            ${post.title}
                        </h3>
                        <p style="color: #999; font-size: 13px; margin-bottom: 15px; font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${formattedDate} · ${post.readTime}
                        </p>
                        <p style="font-size: 16px; line-height: 1.7; color: #666; margin-bottom: 20px;">
                            ${post.excerpt}
                        </p>
                        <span style="font-family: 'Oswald', sans-serif; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #F5A623; display: inline-flex; align-items: center; gap: 8px;">
                            Read Article <span style="font-size: 16px;">→</span>
                        </span>
                    </div>
                </a>
            </article>
        `;
    }

    // Load and render blog posts
    async function loadBlogPosts() {
        try {
            const response = await fetch('/blog/blog-posts.json');
            if (!response.ok) {
                throw new Error('Failed to load blog posts');
            }
            
            const posts = await response.json();
            
            // Get the container element
            const container = document.getElementById('blog-posts-container');
            if (!container) {
                console.error('Blog posts container not found');
                return;
            }
            
            // Filter featured posts (or show all)
            const featuredPosts = posts.filter(post => post.featured);
            const postsToShow = featuredPosts.length > 0 ? featuredPosts : posts;
            
            // Sort by date (newest first)
            postsToShow.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Generate HTML for all posts
            const postsHTML = postsToShow.map(post => createArticleCard(post)).join('');
            
            // Insert into container
            container.innerHTML = postsHTML;
            
        } catch (error) {
            console.error('Error loading blog posts:', error);
            
            // Fallback: show error message to user
            const container = document.getElementById('blog-posts-container');
            if (container) {
                container.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">
                        <p>Unable to load blog posts. Please try refreshing the page.</p>
                    </div>
                `;
            }
        }
    }

    // Load posts when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadBlogPosts);
    } else {
        loadBlogPosts();
    }
})();

