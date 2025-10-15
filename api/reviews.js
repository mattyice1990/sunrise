// Vercel Serverless Function to fetch Google Reviews
// This keeps your API key secure on the server side

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const PLACE_ID = 'ChIJHXIqAP-aBkER6Ogp_xUh9Cc';
  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ 
      error: 'API key not configured',
      message: 'Please add GOOGLE_PLACES_API_KEY to your environment variables'
    });
  }

  try {
    // Fetch reviews from Google Places API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Google API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google API error: ${data.status}`);
    }

    // Return only the reviews
    return res.status(200).json({
      reviews: data.result.reviews || [],
      rating: data.result.rating || 5.0
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch reviews',
      message: error.message 
    });
  }
}

