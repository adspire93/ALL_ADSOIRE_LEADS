# 🚀 ADSOIRE LEADS - Advanced Lead Management Dashboard

A world-class, feature-rich lead management dashboard designed for digital marketing agencies to efficiently manage, track, and convert leads.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎯 Core Features

- **📊 Real-time Statistics Dashboard**
  - Total leads count
  - Contacted leads tracking
  - Interested leads monitoring
  - Converted leads analytics

- **🔍 Advanced Filtering System**
  - Search across business names, addresses, and phone numbers
  - Category-based filtering (Real Estate, Healthcare, Finance, Tech, Automotive, Education, etc.)
  - Status-based filtering (8 different statuses)
  - Rating-based filtering (All, 4+, 4.5+, 5 stars)
  - Multi-criteria sorting (Date, Rating, Reviews, Name)

- **📝 Status Management**
  - ⏳ Pending
  - 📞 Contacted
  - ⏰ Call Later
  - ⭐ Interested
  - ❌ Not Interested
  - 📧 Proposal Sent
  - 💬 Negotiation
  - ✅ Converted

- **💬 Comments System**
  - Add unlimited comments per lead
  - Timestamped comments
  - Delete comments functionality
  - Comment counter badge

- **📱 Quick Actions**
  - Direct call functionality
  - WhatsApp integration
  - Google Maps integration
  - Responsive action buttons

- **💾 Data Persistence**
  - All status changes saved to localStorage
  - Comments saved across sessions
  - Automatic data recovery on refresh

- **📤 Export Functionality**
  - Export filtered leads to CSV
  - Includes all lead data, status, and comment counts
  - Timestamped filename

- **🎨 Modern UI/UX**
  - Beautiful gradient design
  - Card-based layout
  - Grid and List view options
  - Fully responsive (Desktop, Tablet, Mobile)
  - Smooth animations and transitions
  - Toast notifications

### 🎁 Additional Features

- **Lead Information Display**
  - Business name
  - Category badge
  - Star ratings with visual representation
  - Total reviews count
  - Phone number
  - Full address
  - Google Maps URL
  - Scraped date

- **Smart Sorting**
  - Latest first / Oldest first
  - Highest rating / Lowest rating
  - Most reviews
  - Alphabetical by name

- **Visual Indicators**
  - Color-coded status badges
  - Status-specific dropdown colors
  - Interactive hover effects
  - Loading spinner

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, but recommended)

### Installation

1. Clone or download this repository
2. Ensure all files are in the same directory:
   ```
   ├── index.html
   ├── styles.css
   ├── app.js
   ├── leads_20251106_232708.json
   └── README.md
   ```

### Running the Dashboard

#### Option 1: Using Python (Recommended)

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open `http://localhost:8000` in your browser.

#### Option 2: Using Node.js

```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server
```

Then open `http://localhost:8080` in your browser.

#### Option 3: Using VS Code

Install the "Live Server" extension and click "Go Live" in the bottom right corner.

#### Option 4: Direct File Opening

Simply double-click `index.html` (may have CORS issues with some browsers).

## 📖 How to Use

### 1. Dashboard Overview

Upon loading, you'll see:
- Header with export and refresh buttons
- Four statistics cards showing your lead metrics
- Advanced filter panel
- Grid/List view toggle
- Lead cards with all information

### 2. Filtering Leads

**Search**: Type in the search box to filter by business name, address, or phone number.

**Category Filter**: Select a specific business category from the dropdown.

**Status Filter**: Filter leads by their current status.

**Rating Filter**: Show only leads with specific rating thresholds.

**Sort**: Choose how to sort your leads (date, rating, reviews, name).

**Reset Filters**: Click the reset button to clear all filters.

### 3. Managing Lead Status

Each lead card has a status dropdown with 8 options:
1. Select the appropriate status from the dropdown
2. The status updates automatically
3. Statistics update in real-time
4. Changes are saved to localStorage

### 4. Adding Comments

1. Type your comment in the text area on any lead card
2. Click "Add Comment"
3. Comment appears with timestamp
4. Comments persist across sessions

### 5. Quick Actions

- **Call**: Click to initiate a phone call (mobile devices)
- **WhatsApp**: Opens WhatsApp chat with the lead's phone number
- **Maps**: Opens Google Maps location in new tab

### 6. Exporting Data

1. Apply desired filters
2. Click "Export CSV" in the header
3. CSV file downloads with all filtered lead data

### 7. View Options

Toggle between:
- **Grid View**: Cards displayed in a responsive grid
- **List View**: Cards displayed in a single column

## 🎨 Customization

### Changing Colors

Edit `styles.css` and modify the CSS variables in `:root`:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --danger-color: #ef4444;
    --info-color: #3b82f6;
}
```

### Adding New Status Options

Edit `app.js` and add new options in the `createLeadCard` method:

```javascript
<option value="your_status">Your Status Label</option>
```

Don't forget to add corresponding CSS class in `styles.css`.

### Modifying Statistics

Edit the `updateStatistics` method in `app.js` to track different metrics.

## 📊 Data Format

The dashboard expects JSON data in this format:

```json
[
  {
    "business_name": "Business Name",
    "phone": "1234567890",
    "address": "Full Address",
    "rating": 4.5,
    "total_reviews": 100,
    "google_maps_url": "https://maps.google.com/?cid=...",
    "place_id": "ChIJ...",
    "category": "Category_Name",
    "search_keyword": "keyword",
    "scraped_date": "2025-11-06 23:25:57"
  }
]
```

## 🔧 Browser Support

- Chrome (recommended) - Latest
- Firefox - Latest
- Safari - Latest
- Edge - Latest
- Mobile browsers - iOS Safari, Chrome Mobile

## 💾 Data Storage

- **Status Data**: Stored in `localStorage` as `adsoire_lead_status`
- **Comments Data**: Stored in `localStorage` as `adsoire_lead_comments`
- Data persists until localStorage is cleared
- No backend required

## 🐛 Troubleshooting

**Issue**: Leads not loading
- **Solution**: Ensure `leads_20251106_232708.json` is in the same directory as `index.html`
- Check browser console for errors

**Issue**: Status not saving
- **Solution**: Ensure localStorage is enabled in your browser
- Check if you're using private/incognito mode

**Issue**: Export not working
- **Solution**: Check if your browser blocks downloads
- Ensure popup blocker is disabled

**Issue**: Responsive design issues
- **Solution**: Clear browser cache and hard reload (Ctrl+Shift+R)

## 🚀 Future Enhancements

Potential features for future versions:
- Backend integration for multi-user support
- Email integration
- Task reminders and follow-ups
- Lead scoring algorithm
- Activity timeline
- Bulk actions
- Advanced analytics and charts
- Email templates
- SMS integration
- Team collaboration features

## 📝 License

MIT License - Feel free to use and modify for your needs.

## 👨‍💻 Author

ADSOIRE - Digital Marketing Agency

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for Inter font family
- Inspired by modern CRM systems

---

**Need Help?** Open an issue or contact support.

**Enjoy managing your leads efficiently with ADSOIRE LEADS! 🎉**
