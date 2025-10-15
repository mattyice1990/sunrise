// Vercel Serverless Function to fetch Google Reviews
// This keeps your API key secure on the server side

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const PLACE_ID = 'ChIJHXIqAP-aBkER6Ogp_xUh9Cc';
  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

  // Debug: Check if API key exists (without exposing it)
  if (!API_KEY) {
    return res.status(500).json({ 
      error: 'API key not configured',
      message: 'GOOGLE_PLACES_API_KEY environment variable is not set in Vercel',
      debug: 'Check Vercel Dashboard > Settings > Environment Variables'
    });
  }

  try {
    // Construct the URL
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${API_KEY}`;
    
    // Fetch reviews from Google Places API
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google API HTTP Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    // Check for API errors
    if (data.status === 'REQUEST_DENIED') {
      return res.status(500).json({
        error: 'Google API Request Denied',
        message: 'The API key may not have Places API enabled',
        googleError: data.error_message || 'Enable Google Places API at https://console.cloud.google.com',
        status: data.status
      });
    }

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return res.status(500).json({
        error: 'Google API Error',
        message: data.error_message || `API returned status: ${data.status}`,
        status: data.status
      });
    }

    // Return the reviews
    return res.status(200).json({
      reviews: data.result?.reviews || [],
      rating: data.result?.rating || 5.0,
      totalReviews: data.result?.user_ratings_total || 0,
      status: 'success'
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: error.message,
      type: error.name
    });
  }
}

