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
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const data = await response.json();
      
      if (data.reviews && data.reviews.length > 0) {
        // Filter for 5-star reviews only
        this.reviews = data.reviews.filter(review => review.rating === 5);
      }
      
      this.loading = false;
    } catch (err) {
      this.error = err.message;
      this.loading = false;
      this.reviews = this.mockReviews;
      console.warn('Using fallback reviews:', err.message);
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
        <div class="google-reviews-header">
          <img 
            src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
            alt="Google"
            class="google-logo"
          />
          <span class="google-reviews-title">5-Star Reviews</span>
        </div>
        
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

