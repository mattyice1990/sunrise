# Week 2: Advanced Tracking Implementation
## Google Tag Manager & Facebook Pixel Setup

---

## 📋 OVERVIEW

Week 2 focuses on implementing advanced tracking tools that give you deeper insights into user behavior and advertising performance. These tools are optional but highly recommended if you plan to run paid advertising campaigns.

---

## 🏷️ GOOGLE TAG MANAGER (GTM)

**Status:** ⏳ Week 2 - Optional but Recommended  
**Difficulty:** Moderate  
**Setup Time:** 30-45 minutes

### What is Google Tag Manager?

Google Tag Manager is a free tool that lets you manage and deploy marketing tags (snippets of code or tracking pixels) on your website without modifying the code directly. Think of it as a "control panel" for all your tracking codes.

### Benefits:

1. **No Developer Needed** - Add/remove tracking codes yourself
2. **Test Before Publishing** - Preview changes before they go live
3. **Version Control** - Roll back changes if something goes wrong
4. **Advanced Tracking** - Track specific user actions:
   - Form submissions
   - Phone number clicks
   - Button clicks
   - PDF downloads
   - Video views
   - Scroll depth

### When You Need GTM:

- Running multiple marketing campaigns
- Need to track specific user interactions
- Want to test different tracking codes
- Plan to use multiple analytics platforms
- Need flexibility to add tags quickly

### Setup Instructions:

#### Step 1: Create GTM Account

1. Go to [tagmanager.google.com](https://tagmanager.google.com)
2. Click "Create Account"
3. Fill in:
   - **Account Name:** Sunrise Roofers LLC
   - **Country:** United States
   - **Container Name:** roofwithsunrise.com
   - **Target Platform:** Web
4. Click "Create" and accept Terms of Service

#### Step 2: Install GTM Code

GTM will provide two code snippets:

**Snippet 1 - Add to `<head>`:**
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->
```

**Snippet 2 - Add immediately after opening `<body>` tag:**
```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

#### Step 3: Migrate Google Analytics to GTM

1. In GTM, click "Add a new tag"
2. Name it "GA4 - All Pages"
3. Tag Type: Google Analytics > GA4 Configuration
4. Measurement ID: `G-TXS7NL5W52`
5. Triggering: All Pages
6. Save and Submit

#### Step 4: Set Up Event Tracking

**Track Phone Clicks:**
1. Tag Name: "Event - Phone Click"
2. Tag Type: GA4 Event
3. Event Name: `phone_click`
4. Configuration Tag: GA4 - All Pages
5. Trigger: Click - All Elements
6. Trigger fires on: Click URL contains `tel:`

**Track Contact Form Submissions:**
1. Tag Name: "Event - Contact Form Submit"
2. Tag Type: GA4 Event
3. Event Name: `form_submission`
4. Configuration Tag: GA4 - All Pages
5. Trigger: Form Submission

**Track Estimate Button Clicks:**
1. Tag Name: "Event - Estimate CTA"
2. Tag Type: GA4 Event
3. Event Name: `estimate_click`
4. Configuration Tag: GA4 - All Pages
5. Trigger: Click - All Elements with class containing `cta-button`

#### Step 5: Test & Publish

1. Click "Preview" in GTM
2. Enter your website URL
3. Test all tracking events
4. Click "Submit" when ready
5. Add Version Name: "Initial GTM Setup"
6. Publish

### Cost: FREE

---

## 📱 FACEBOOK PIXEL

**Status:** ⏳ Week 2 - Only if Running Facebook/Instagram Ads  
**Difficulty:** Easy  
**Setup Time:** 15-20 minutes

### What is Facebook Pixel?

The Facebook Pixel is a piece of code that tracks conversions from Facebook and Instagram ads, optimizes your campaigns, and builds audiences for future remarketing.

### When You Need It:

- ✅ Running Facebook or Instagram ads
- ✅ Want to retarget website visitors
- ✅ Need to track ad ROI
- ❌ NOT running Meta ads = Don't need it yet

### Benefits:

1. **Track Conversions** - See which ads generate leads
2. **Optimize Campaigns** - Facebook learns what works
3. **Retargeting** - Show ads to people who visited your site
4. **Lookalike Audiences** - Find similar customers
5. **Better ROI** - Stop wasting money on ads that don't work

### Setup Instructions:

#### Step 1: Create Facebook Pixel

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Click the "+" icon to create a pixel
3. Name it: "Sunrise Roofers LLC Website"
4. Enter website URL: `https://roofwithsunrise.com`
5. Click "Continue"

#### Step 2: Choose Installation Method

**Option A: Manual Installation (if not using GTM)**

Facebook will provide code like this:
```html
<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
<noscript>
  <img height="1" width="1" style="display:none"
       src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"/>
</noscript>
<!-- End Facebook Pixel Code -->
```

**Option B: Install via GTM (Recommended)**

1. In GTM, create new tag: "Facebook Pixel - Base Code"
2. Tag Type: Custom HTML
3. Paste Facebook Pixel code
4. Trigger: All Pages
5. Save

#### Step 3: Set Up Event Tracking

**Track Contact Form Submissions:**
```javascript
fbq('track', 'Lead', {
    content_name: 'Contact Form',
    content_category: 'Form Submission'
});
```

**Track Phone Clicks:**
```javascript
fbq('track', 'Contact', {
    content_name: 'Phone Click'
});
```

**Track Page Views on Key Pages:**
```javascript
// On Contact Page
fbq('track', 'ViewContent', {
    content_name: 'Contact Page',
    content_category: 'High Intent'
});
```

#### Step 4: Test Your Pixel

1. Install [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper) Chrome extension
2. Visit your website
3. Click the extension icon
4. Verify the pixel is firing correctly
5. Look for green checkmark

#### Step 5: Create Custom Conversions

1. In Events Manager, click "Custom Conversions"
2. Create conversions for:
   - Contact form submissions
   - Phone number clicks
   - Service page views
   - Estimate button clicks

### Cost: FREE (but you'll pay for ads)

---

## 🎯 CONVERSION VALUE OPTIMIZATION

### Assign Dollar Values to Actions

Help Facebook optimize for high-value leads:

```javascript
// High-value conversion (direct phone call)
fbq('track', 'Contact', {value: 500, currency: 'USD'});

// Medium-value (form submission)
fbq('track', 'Lead', {value: 250, currency: 'USD'});

// Low-value (page view)
fbq('track', 'ViewContent', {value: 50, currency: 'USD'});
```

### How to Determine Values:

1. **Average Job Value:** $8,500 (example)
2. **Lead-to-Customer Rate:** 20%
3. **Customer Lifetime Value:** $8,500
4. **Value Per Lead:** $8,500 × 20% = $1,700

Assign conservative values to guide Facebook's optimization.

---

## 📊 CAMPAIGN ATTRIBUTION

### Multi-Touch Attribution Setup

Track the customer journey across multiple touchpoints:

1. **First Touch:** Where did they first hear about you?
2. **Middle Touch:** What content did they consume?
3. **Last Touch:** What convinced them to convert?

**GTM Setup for Attribution:**
- Use UTM parameters in all marketing URLs
- Track scroll depth on key pages
- Monitor time on site
- Track return visits

**Example UTM Structure:**
```
https://roofwithsunrise.com/contact
?utm_source=facebook
&utm_medium=cpc
&utm_campaign=spring2025_roof_replacement
&utm_content=ad1_urgency
```

---

## 🔒 PRIVACY & COMPLIANCE

### Important Considerations:

1. **Privacy Policy Update**
   - Disclose use of cookies and tracking
   - Explain data collection practices
   - Link to Facebook and Google privacy policies

2. **Cookie Consent**
   - Consider adding cookie consent banner
   - Popular options:
     - Cookie Consent by Osano (free)
     - OneTrust (enterprise)
     - Cookiebot (paid)

3. **Data Retention**
   - Set data retention policies in GA4
   - Configure Facebook Pixel data retention
   - Follow GDPR/CCPA guidelines

---

## 🧪 TESTING CHECKLIST

Before launching, test everything:

### GTM Testing:
- [ ] Preview mode works
- [ ] All tags fire on correct pages
- [ ] No duplicate tags
- [ ] No JavaScript errors in console
- [ ] GA4 receiving data in real-time view

### Facebook Pixel Testing:
- [ ] Pixel Helper shows green checkmark
- [ ] PageView events firing
- [ ] Custom events triggering correctly
- [ ] Test conversions registering in Events Manager
- [ ] No errors in browser console

---

## 📈 EXPECTED RESULTS

### Week 1 (After GTM Installation):
- Detailed event tracking in GA4
- Better understanding of user behavior
- Identify high-performing pages

### Week 2-4 (After FB Pixel):
- Build remarketing audience (100+ visitors minimum)
- Track ad performance accurately
- Optimize campaigns for conversions

### Month 2-3:
- Create lookalike audiences
- Reduce cost per lead by 20-40%
- Improve conversion rates

---

## 🆘 TROUBLESHOOTING

### GTM Issues:

**Problem:** Tags not firing  
**Solution:** Check trigger configuration, use Preview mode to debug

**Problem:** Duplicate tracking (GA4 firing twice)  
**Solution:** Remove hardcoded GA4 from HTML after migrating to GTM

**Problem:** 404 errors for gtm.js  
**Solution:** Check firewall/ad blocker isn't blocking GTM

### Facebook Pixel Issues:

**Problem:** Pixel Helper shows errors  
**Solution:** Check for JavaScript syntax errors, ensure Pixel ID is correct

**Problem:** Events not showing in Events Manager  
**Solution:** Wait 20 minutes for data, check browser console for errors

**Problem:** Conversions not attributed to ads  
**Solution:** Verify pixel is on conversion pages, check attribution settings

---

## 💰 ESTIMATED COSTS

| Tool | Setup Cost | Monthly Cost | ROI Timeline |
|------|-----------|--------------|--------------|
| **Google Tag Manager** | $0 | $0 | Immediate (better data) |
| **Facebook Pixel** | $0 | $0* | 30-60 days |
| **Facebook Ads** | $0 | $500-2000 | 30-90 days |
| **Call Tracking** | $0 | $45-99 | 60 days |

*Pixel is free, but you pay for ad spend

---

## 🎓 LEARNING RESOURCES

### GTM Training:
- Google's GTM Fundamentals Course (free)
- Analytics Mania GTM Blog
- Measure School YouTube Channel

### Facebook Ads Training:
- Facebook Blueprint (free official training)
- Jon Loomer Digital (Facebook ads expert)
- Social Media Examiner

---

## ✅ NEXT STEPS

1. **Decide if you want GTM:**
   - Yes = Provides maximum flexibility
   - No = Current setup is sufficient for now

2. **Decide if you want Facebook Pixel:**
   - Running Meta ads? = Yes, install it
   - Not running ads yet? = Wait until you're ready

3. **Contact us with your decision**
   - We'll implement the tools you choose
   - Provide training on how to use them
   - Set up custom tracking for your goals

---

**Questions?** Reply with:
- Your GTM Container ID (if you created one)
- Your Facebook Pixel ID (if you created one)
- Any custom events you want to track

We'll handle the technical implementation!

---

**Last Updated:** October 15, 2025  
**Status:** Ready for Week 2 Implementation

