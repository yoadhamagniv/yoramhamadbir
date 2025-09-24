# User Tracking System Documentation
**Complete Guide to Website Analytics and User Behavior Tracking**

---

## 🎯 OVERVIEW

The website includes a comprehensive tracking system that monitors user interactions and automatically logs them to Google Sheets for analysis. This system helps understand customer behavior, optimize conversion rates, and improve the user experience.

---

## 📊 WHAT IS TRACKED

### Primary Actions
1. **Phone Clicks** (`click_tel`)
   - Every click on phone number (052-8665271)
   - Tracked from: Header, footer, buttons, inline text links
   - Includes source location (header, footer, contact page, etc.)

2. **WhatsApp Clicks** (`whatsapp_click`)
   - Floating WhatsApp button clicks
   - WhatsApp links in contact sections
   - Includes pre-filled message context
   - Tracks source page and location

3. **Form Submissions** (`form_submit`)
   - Contact form submissions (both homepage and contact page)
   - Includes form validation success/failure
   - Captures submitted data (with user consent)

4. **Email Clicks** (`click_email`)
   - Clicks on email addresses
   - mailto: link interactions
   - Source tracking included

### Secondary Actions
5. **Service Interest** (`service_card_click`)
   - Clicks on service cards/descriptions
   - Specific service type identification
   - Helps identify most popular services

6. **Navigation Tracking** (`nav_link_click`)
   - Page-to-page navigation
   - Menu item popularity
   - User flow analysis

7. **Call-to-Action Performance** (`hero_cta_click`)
   - Main call-to-action button clicks
   - A/B testing capabilities
   - Conversion funnel analysis

### Error Tracking
8. **Form Errors** (`form_error`)
   - Form validation failures
   - Technical submission errors
   - User experience issues

9. **JavaScript Errors** (`js_error`)
   - Technical website errors
   - Browser compatibility issues
   - Performance problems

---

## 🔧 TECHNICAL IMPLEMENTATION

### Data Collection Method
```javascript
// Every trackable element has data attributes:
<a href="tel:0528665271"
   data-track="click_tel"
   data-source="header">
   Call Now
</a>

// JavaScript captures these clicks:
element.addEventListener('click', handleTrackableClick);
```

### Data Structure
Each tracked event includes:
- **Event Type:** What action was performed
- **Timestamp:** When it occurred
- **Source Page:** Which page the user was on
- **Source Location:** Specific location on page (header, footer, etc.)
- **Service/Data:** Additional context (which service, error details, etc.)
- **User Session Info:** Browser, device type, etc. (if enabled)

---

## 📈 GOOGLE SHEETS INTEGRATION

### Setup Requirements
1. **Google Apps Script Web App**
   ```javascript
   // Handles both form submissions and tracking data
   function doPost(e) { /* Form submissions */ }
   function doGet(e) { /* Tracking events */ }
   ```

2. **Google Sheets Structure**

   **Sheet 1: "Leads" (Form Submissions)**
   - Column A: Timestamp
   - Column B: Full Name
   - Column C: Phone
   - Column D: Email
   - Column E: Service Type
   - Column F: Source Page
   - Column G: Additional Data

   **Sheet 2: "Activity" (User Tracking)**
   - Column A: Timestamp
   - Column B: Event Type
   - Column C: Source Page
   - Column D: Source Location
   - Column E: Service/Additional Data
   - Column F: User Agent (optional)

### Data Flow
```
User Action → JavaScript Event → Google Apps Script → Google Sheets Row
```

### Real-Time Updates
- Events are sent immediately when they occur
- No data buffering or delayed sending
- Each action creates a new row in the appropriate sheet

---

## 📋 EVENT DETAILS

### Phone Clicks (`click_tel`)
**Triggers when:** User clicks any phone number link
**Data captured:**
- Source location: "header", "footer", "contact", "pricing", etc.
- Page: Current page name
- Time: Exact timestamp

**Example tracking:**
```
Event: click_tel
Source: header
Page: /services.html
Time: 2024-12-23 14:30:15
```

### WhatsApp Clicks (`whatsapp_click`)
**Triggers when:** User clicks WhatsApp button or link
**Data captured:**
- Source location: "float", "contact", "footer", etc.
- Message context: Which pre-filled message
- Page: Current page

**Example tracking:**
```
Event: whatsapp_click
Source: float
Page: /pricing.html
Data: "pricing inquiry"
Time: 2024-12-23 14:32:22
```

### Form Submissions (`form_submit`)
**Triggers when:** User successfully submits contact form
**Data captured:**
- All form fields (with consent)
- Submission success/failure
- Validation errors if any

**Example tracking:**
```
Event: form_submit
Data: {name: "John Doe", phone: "052-123-4567", service: "mosquitoes"}
Page: /contact.html
Time: 2024-12-23 14:35:10
```

### Service Interest (`service_card_click`)
**Triggers when:** User clicks on service cards or service-related content
**Data captured:**
- Specific service: "mosquitoes", "termites", "bedbugs", etc.
- Source location: "homepage", "services-page", "pricing"
- Interest level indication

**Example tracking:**
```
Event: service_card_click
Service: termites
Source: homepage
Page: /index.html
Time: 2024-12-23 14:28:45
```

---

## 📊 ANALYTICS & REPORTING

### Key Metrics to Monitor

1. **Conversion Funnel**
   - Page views → Service interest → Contact actions
   - Identify drop-off points
   - Optimize weak conversion steps

2. **Popular Services**
   - Most clicked service cards
   - Form submission service types
   - Seasonal trends

3. **Contact Method Preferences**
   - Phone vs WhatsApp vs Email vs Form
   - Source page effectiveness
   - Time-of-day patterns

4. **User Journey Analysis**
   - Entry pages
   - Navigation patterns
   - Exit points

### Google Sheets Formulas for Analysis

**Total Phone Clicks:**
```
=COUNTIF(Activity!B:B,"click_tel")
```

**Most Popular Service:**
```
=MODE(Activity!E:E)
```

**Conversion Rate (Form submissions / Total visitors):**
```
=COUNTIF(Activity!B:B,"form_submit")/COUNTA(Activity!B:B)*100
```

**Daily Activity Summary:**
```
=QUERY(Activity!A:E,"SELECT A,B,count(B) WHERE A >= date '2024-12-01' GROUP BY A,B ORDER BY A DESC")
```

---

## 🔒 PRIVACY & COMPLIANCE

### GDPR Compliance
- **Cookie consent required** before tracking starts
- **Clear disclosure** of data collection
- **Opt-out capability** available
- **Data retention limits** (suggested: 2 years)

### User Consent Flow
1. User visits website
2. Cookie banner appears
3. No tracking until consent given
4. After consent: Full tracking enabled
5. Consent stored in localStorage

### Data Security
- **HTTPS only** for all data transmission
- **Google Sheets access control** properly configured
- **No sensitive data** in tracking (no passwords, payment info)
- **Anonymization** of IP addresses (if implemented)

---

## 🛠️ SETUP INSTRUCTIONS

### Step 1: Google Apps Script Setup
1. Go to [script.google.com](https://script.google.com)
2. Create new project
3. Copy the provided script code
4. Deploy as Web App
5. Copy the Web App URL

### Step 2: Website Configuration
1. Edit `js/main.js`
2. Replace placeholder URL with actual Google Apps Script URL:
   ```javascript
   googleSheetsUrl: 'YOUR_ACTUAL_URL_HERE'
   ```

### Step 3: Google Sheets Preparation
1. Open the target Google Sheet
2. Create "Leads" and "Activity" sheets if not present
3. Set up column headers as specified
4. Configure access permissions for the Apps Script

### Step 4: Testing
1. Test form submission
2. Test phone click tracking
3. Test WhatsApp button
4. Verify data appears in Google Sheets
5. Check tracking in browser console

---

## 🔍 TROUBLESHOOTING

### Common Issues

**No data appearing in sheets:**
- Check Google Apps Script permissions
- Verify Web App URL is correct
- Check browser console for errors
- Confirm sheets are properly named

**Form submissions not working:**
- Verify form field names match script
- Check required field validation
- Test with browser dev tools network tab

**Tracking events not firing:**
- Check cookie consent is given
- Verify data-track attributes are present
- Check JavaScript console for errors

**CORS errors:**
- Ensure Google Apps Script is deployed correctly
- Check "Anyone" access permission is set

### Debugging Tools

**Browser Console:**
```javascript
// Check if tracking is enabled
console.log(YoramHamadbir.trackingEnabled);

// Manually trigger tracking event
YoramHamadbir.trackEvent('test_event', {data: 'test'});
```

**Google Apps Script Logs:**
- Check execution logs for errors
- Monitor API quotas and limits
- Review function execution history

---

## 📈 ADVANCED FEATURES

### Heatmap Integration (Future)
- Click heatmaps showing user interaction patterns
- Scroll depth tracking
- Mouse movement analysis

### A/B Testing Capability
- Test different call-to-action texts
- Compare page layouts
- Optimize conversion elements

### Real-Time Dashboard
- Live visitor counter
- Current activity feed
- Instant conversion notifications

### Enhanced Analytics
- User session recording
- Funnel visualization
- Cohort analysis
- Revenue attribution

---

## 📞 BUSINESS INSIGHTS

### Using Tracking Data for Business Decisions

1. **Service Optimization**
   - Focus marketing on most popular services
   - Develop new services based on interest
   - Adjust pricing based on demand

2. **Website Improvements**
   - Optimize high-traffic pages
   - Fix problematic user flows
   - Improve conversion bottlenecks

3. **Marketing Strategy**
   - Focus on highest-converting traffic sources
   - Optimize ad spend based on user behavior
   - Create targeted campaigns for specific services

4. **Customer Service**
   - Identify peak contact times
   - Prepare for seasonal demand
   - Improve response based on preferred contact methods

---

## 🎯 SUCCESS METRICS

### Key Performance Indicators (KPIs)

1. **Contact Rate:** % of visitors who make contact
2. **Service Interest:** Most viewed/clicked services
3. **Channel Preference:** Phone vs WhatsApp vs Email vs Form
4. **User Flow:** Typical navigation patterns
5. **Bounce Rate:** Single-page session percentage
6. **Peak Hours:** When users are most active

### Monthly Reporting Template

**Traffic Summary:**
- Total page views
- Unique visitors
- Average session duration

**Interaction Summary:**
- Phone clicks: X
- WhatsApp clicks: X
- Form submissions: X
- Email clicks: X

**Service Interest:**
- Top 3 most clicked services
- Seasonal trends
- Geographic patterns (if available)

**Conversion Analysis:**
- Visitor-to-contact conversion rate
- Most effective pages for conversions
- Drop-off points in user journey

---

**Document Created:** September 2025
**Last Updated:** September 2025
**Version:** 1.0