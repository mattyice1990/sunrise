# 📧 Contact Form Email Setup Instructions

Your contact form has been set up with **Web3Forms** - a free, reliable email service for static websites.

## 🚀 **Quick Setup (5 minutes)**

### **Step 1: Get Your Free Access Key**

1. Go to: **https://web3forms.com**
2. Click **"Create Access Key"**
3. Enter your email: **sunriseroofer@outlook.com**
4. Click **"Get Started"**
5. Check your email for the access key (it will look like: `a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6`)

### **Step 2: Add the Access Key to Your Website**

1. Open `contact.html` in your editor
2. Find line 268 (search for `YOUR_ACCESS_KEY_HERE`)
3. Replace `YOUR_ACCESS_KEY_HERE` with your actual access key
4. Save the file

**Before:**
```html
<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
```

**After:**
```html
<input type="hidden" name="access_key" value="a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6">
```

### **Step 3: Test the Form**

1. Open your website locally or deploy to Vercel
2. Fill out the contact form
3. Click "Get Free Estimate"
4. You should receive an email at **sunriseroofer@outlook.com**

---

## ✨ **Features Included**

✅ **Free Forever** - No credit card required  
✅ **Unlimited Submissions** - Free plan has no limits  
✅ **Spam Protection** - Built-in honeypot trap  
✅ **Email Notifications** - Instant delivery to your inbox  
✅ **Success/Error Messages** - Beautiful user feedback  
✅ **Mobile Responsive** - Works on all devices  
✅ **No Backend Required** - Pure static HTML  

---

## 📧 **Email Format**

When someone submits the form, you'll receive an email with:

- **Subject:** "New Roofing Estimate Request - Sunrise Roofers"
- **From:** Sunrise Roofers Website
- **Contains:**
  - Full Name
  - Phone Number
  - Email Address
  - Property Address
  - Service Needed
  - Message/Project Details

---

## 🎨 **Form Behavior**

1. **User fills out form** → Clicks "Get Free Estimate"
2. **Button changes** → Shows "Sending..."
3. **Success** → Green message appears, form hides
4. **Error** → Red message with phone number fallback
5. **Email sent** → You receive notification instantly

---

## ⚙️ **Advanced Features (Optional)**

### **Add More Recipient Emails**

After getting your access key, log into Web3Forms dashboard to:
- Add multiple email recipients
- Set up auto-reply messages
- Customize email templates
- View submission history
- Download submissions as CSV

### **Custom Email Templates**

You can customize how the email looks by logging into the Web3Forms dashboard.

### **Webhook Integration**

Connect to Zapier, Make, or other automation tools for advanced workflows.

---

## 🔒 **Privacy & Security**

- ✅ GDPR Compliant
- ✅ SSL Encrypted submissions
- ✅ No data stored by Web3Forms (forwarded directly to your email)
- ✅ Honeypot spam protection included
- ✅ reCAPTCHA integration available (optional)

---

## 🆘 **Troubleshooting**

### **Form doesn't work**
- Make sure you replaced `YOUR_ACCESS_KEY_HERE` with your actual key
- Check that the email address in Web3Forms matches your account
- Verify your site is deployed (not just local file://)

### **Not receiving emails**
- Check spam/junk folder
- Verify email address in Web3Forms account
- Test with a different email service
- Make sure access key is correct

### **Getting errors**
- Check browser console for JavaScript errors
- Verify form fields have proper `name` attributes
- Test internet connection

---

## 📞 **Alternative: Direct Phone Contact**

The contact page also prominently displays:
- **Phone:** 520-668-6638
- **Email:** sunriseroofer@outlook.com

So even if the form has issues, customers can still reach you directly!

---

## 🔄 **After Setup**

Once you've added your access key:

```bash
# Commit and push changes
git add contact.html
git commit -m "Add working contact form with Web3Forms"
git push
```

Vercel will automatically deploy the updated form!

---

## 💡 **Pro Tips**

1. **Test the form** before announcing it to customers
2. **Set up email filters** to organize form submissions
3. **Respond quickly** - automated emails create trust
4. **Check Web3Forms dashboard** for submission analytics
5. **Keep access key private** - don't share it publicly

---

## 📊 **Need More Features?**

**Web3Forms Free Plan Includes:**
- Unlimited submissions
- Email notifications
- File uploads (up to 5MB)
- Basic customization

**Pro Plan ($5/month) Adds:**
- Custom email templates
- File attachments up to 50MB
- Webhook integration
- Priority support
- Remove Web3Forms branding

---

**Questions?** Contact Web3Forms support: support@web3forms.com

**Setup complete?** Test it and enjoy automatic email notifications! 🎉

