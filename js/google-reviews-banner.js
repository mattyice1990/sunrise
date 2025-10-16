// Google Reviews Banner - Vanilla JavaScript
class GoogleReviewsBanner {
  constructor() {
    this.reviews = [];
    this.loading = true;
    this.error = null;
    this.container = null;
    
    // Mock data for fallback
    this.mockReviews = [
      {
        author_name: "Maria G.",
        rating: 5,
        text: "Sunrise Roofers replaced our tile roof and the results are outstanding. Professional crew, fair pricing, and they cleaned up everything perfectly. Highly recommend!",
        time: Date.now() / 1000 - 86400 * 5,
        profile_photo_url: ""
      },
      {
        author_name: "John D.",
        rating: 5,
        text: "After monsoon damage, they came out the same day for an emergency repair. Fast, reliable, and honest. These are the roofers you want on your side.",
        time: Date.now() / 1000 - 86400 * 12,
        profile_photo_url: ""
      },
      {
        author_name: "Sandra L.",
        rating: 5,
        text: "Complete roof replacement done in 3 days. Great communication throughout the process. The quality of work exceeded our expectations.",
        time: Date.now() / 1000 - 86400 * 20,
        profile_photo_url: ""
      },
      {
        author_name: "Robert K.",
        rating: 5,
        text: "Metal roof installation was flawless. They answered all my questions and finished ahead of schedule. My cooling bills have already dropped significantly.",
        time: Date.now() / 1000 - 86400 * 30,
        profile_photo_url: ""
      },
      {
        author_name: "Jennifer M.",
        rating: 5,
        text: "Honest assessment, fair price, and quality work. They replaced our aging shingle roof with beautiful architectural shingles. Couldn't be happier!",
        time: Date.now() / 1000 - 86400 * 45,
        profile_photo_url: ""
      },
      {
        author_name: "David H.",
        rating: 5,
        text: "Best roofing company in Southern Arizona! From inspection to completion, everything was professional and seamless. Highly recommended!",
        time: Date.now() / 1000 - 86400 * 60,
        profile_photo_url: ""
      }
    ];
  }

  async init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container with id "${containerId}" not found`);
      return;
    }

    await this.fetchReviews();
    this.render();
  }

  async fetchReviews() {
    try {
      const response = await fetch('/api/reviews');
      
      const data = await response.json();
      
      if (!response.ok) {
        // Log detailed error information
        console.error('API Error Details:', data);
        throw new Error(data.message || data.error || 'Failed to fetch reviews');
      }
      
      if (data.reviews && data.reviews.length > 0) {
        // Filter for 5-star reviews only
        this.reviews = data.reviews.filter(review => review.rating === 5);
        console.log(`Loaded ${this.reviews.length} five-star reviews from Google`);
      } else {
        console.warn('No reviews returned from API, using fallback reviews');
      }
      
      this.loading = false;
    } catch (err) {
      this.error = err.message;
      this.loading = false;
      this.reviews = this.mockReviews;
      console.error('Review fetch error:', err.message);
      console.log('Using fallback reviews');
    }
  }

  formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  createStars(rating) {
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
      starsHtml += `<svg class="review-star" viewBox="0 0 24 24" fill="${i < rating ? '#FFD700' : '#E0E0E0'}" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>`;
    }
    return starsHtml;
  }

  createReviewCard(review) {
    const initial = review.author_name.charAt(0).toUpperCase();
    const truncatedText = review.text.length > 180 
      ? review.text.substring(0, 180) + '...' 
      : review.text;

    return `
      <div class="google-review-card">
        <div class="review-card-header">
          <div class="review-avatar">${initial}</div>
          <div class="review-author-info">
            <div class="review-author-name">${review.author_name}</div>
            <div class="review-stars-inline">
              ${this.createStars(review.rating)}
            </div>
          </div>
        </div>
        <p class="review-card-text">${truncatedText}</p>
        <div class="review-card-date">${this.formatDate(review.time)}</div>
      </div>
    `;
  }

  render() {
    const displayReviews = this.reviews.length > 0 ? this.reviews : this.mockReviews;
    
    // Duplicate reviews for seamless infinite scroll
    const allReviews = [...displayReviews, ...displayReviews];
    
    const html = `
      <div class="google-reviews-banner">
        ${this.error ? `
          <div class="reviews-notice">
            Using demo reviews
          </div>
        ` : ''}

        <div class="google-reviews-track-container">
          <div class="google-reviews-track">
            ${allReviews.map(review => this.createReviewCard(review)).join('')}
          </div>
        </div>
        
        <div class="google-reviews-header" style="margin-top: 30px;">
          <img 
            src="images/Logo-google-icon-PNG.png" 
            alt="Google"
            class="google-logo"
            style="height: 24px; width: auto;"
          />
          <span class="google-reviews-title">5-Star Reviews</span>
        </div>

        <div class="reviews-banner-footer">
          <div class="reviews-banner-footer-left">
            <a href="https://www.bbb.org/us/az/tucson/profile/roofing-contractors/sunrise-roofers-llc-1286-20125900" target="_blank" rel="noopener noreferrer" class="bbb-banner-link">
              <img src="images/BBB Accredited Business Logo.svg" alt="Better Business Bureau A+ Rating" class="bbb-banner-logo">
            </a>
          </div>
          <div class="reviews-banner-footer-right">
            <a href="https://g.page/r/CejoKf8VIfQnEBM/review" target="_blank" rel="noopener noreferrer" class="leave-review-btn">
              <svg viewBox="0 0 24 24" fill="currentColor" class="google-icon-small">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Leave a Review
            </a>
          </div>
        </div>
      </div>
    `;
    
    this.container.innerHTML = html;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const reviewsBanner = new GoogleReviewsBanner();
  reviewsBanner.init('google-reviews-container');
});

