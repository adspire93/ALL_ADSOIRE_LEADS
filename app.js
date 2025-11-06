// ADSOIRE LEADS - Lead Management Dashboard
// Advanced Lead Management System with Category Filtering, Comments, Status Management

class LeadManagementSystem {
    constructor() {
        this.leads = [];
        this.filteredLeads = [];
        this.statusMap = new Map();
        this.commentsMap = new Map();
        this.currentView = 'grid';

        this.init();
    }

    async init() {
        this.showLoading();
        await this.loadLeadsData();
        this.loadPersistedData();
        this.setupEventListeners();
        this.populateCategories();
        this.renderLeads();
        this.updateStatistics();
        this.hideLoading();
    }

    async loadLeadsData() {
        try {
            const response = await fetch('leads_20251106_232708.json');
            const data = await response.json();
            this.leads = data.map((lead, index) => ({
                ...lead,
                id: `lead_${index}_${Date.now()}`
            }));
            this.filteredLeads = [...this.leads];
        } catch (error) {
            console.error('Error loading leads:', error);
            alert('Error loading leads data. Please ensure leads_20251106_232708.json is in the same directory.');
        }
    }

    loadPersistedData() {
        // Load status data from localStorage
        const savedStatus = localStorage.getItem('adsoire_lead_status');
        if (savedStatus) {
            this.statusMap = new Map(JSON.parse(savedStatus));
        }

        // Load comments data from localStorage
        const savedComments = localStorage.getItem('adsoire_lead_comments');
        if (savedComments) {
            this.commentsMap = new Map(JSON.parse(savedComments));
        }
    }

    saveStatusData() {
        localStorage.setItem('adsoire_lead_status', JSON.stringify([...this.statusMap]));
    }

    saveCommentsData() {
        localStorage.setItem('adsoire_lead_comments', JSON.stringify([...this.commentsMap]));
    }

    setupEventListeners() {
        // Search
        document.getElementById('searchInput').addEventListener('input', () => this.applyFilters());

        // Filters
        document.getElementById('categoryFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('statusFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('ratingFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('sortFilter').addEventListener('change', () => this.applyFilters());

        // Reset filters
        document.getElementById('resetFilters').addEventListener('click', () => this.resetFilters());

        // Export
        document.getElementById('exportBtn').addEventListener('click', () => this.exportToCSV());

        // Refresh
        document.getElementById('refreshBtn').addEventListener('click', () => this.refresh());

        // View toggle
        document.getElementById('gridViewBtn').addEventListener('click', () => this.switchView('grid'));
        document.getElementById('listViewBtn').addEventListener('click', () => this.switchView('list'));

        // Modal
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('leadModal').addEventListener('click', (e) => {
            if (e.target.id === 'leadModal') this.closeModal();
        });
    }

    populateCategories() {
        const categories = [...new Set(this.leads.map(lead => lead.category))].sort();
        const categoryFilter = document.getElementById('categoryFilter');

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = this.formatCategory(category);
            categoryFilter.appendChild(option);
        });
    }

    applyFilters() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const categoryFilter = document.getElementById('categoryFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        const ratingFilter = document.getElementById('ratingFilter').value;
        const sortFilter = document.getElementById('sortFilter').value;

        this.filteredLeads = this.leads.filter(lead => {
            // Search filter
            const matchesSearch = !searchTerm ||
                lead.business_name.toLowerCase().includes(searchTerm) ||
                lead.address.toLowerCase().includes(searchTerm) ||
                lead.phone.includes(searchTerm) ||
                (lead.search_keyword && lead.search_keyword.toLowerCase().includes(searchTerm));

            // Category filter
            const matchesCategory = categoryFilter === 'all' || lead.category === categoryFilter;

            // Status filter
            const leadStatus = this.statusMap.get(lead.id) || 'pending';
            const matchesStatus = statusFilter === 'all' || leadStatus === statusFilter;

            // Rating filter
            let matchesRating = true;
            if (ratingFilter !== 'all') {
                const minRating = parseFloat(ratingFilter);
                matchesRating = lead.rating >= minRating;
            }

            return matchesSearch && matchesCategory && matchesStatus && matchesRating;
        });

        // Apply sorting
        this.sortLeads(sortFilter);

        this.renderLeads();
        this.updateStatistics();
    }

    sortLeads(sortOption) {
        switch (sortOption) {
            case 'date_desc':
                this.filteredLeads.sort((a, b) => new Date(b.scraped_date) - new Date(a.scraped_date));
                break;
            case 'date_asc':
                this.filteredLeads.sort((a, b) => new Date(a.scraped_date) - new Date(b.scraped_date));
                break;
            case 'rating_desc':
                this.filteredLeads.sort((a, b) => b.rating - a.rating);
                break;
            case 'rating_asc':
                this.filteredLeads.sort((a, b) => a.rating - b.rating);
                break;
            case 'reviews_desc':
                this.filteredLeads.sort((a, b) => b.total_reviews - a.total_reviews);
                break;
            case 'name_asc':
                this.filteredLeads.sort((a, b) => a.business_name.localeCompare(b.business_name));
                break;
        }
    }

    resetFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('categoryFilter').value = 'all';
        document.getElementById('statusFilter').value = 'all';
        document.getElementById('ratingFilter').value = 'all';
        document.getElementById('sortFilter').value = 'date_desc';
        this.applyFilters();
    }

    renderLeads() {
        const container = document.getElementById('leadsContainer');
        const noResults = document.getElementById('noResults');
        const resultsCount = document.getElementById('resultsCount');

        container.innerHTML = '';

        if (this.filteredLeads.length === 0) {
            container.style.display = 'none';
            noResults.style.display = 'block';
            resultsCount.textContent = 'Showing 0 leads';
            return;
        }

        container.style.display = 'grid';
        noResults.style.display = 'none';
        resultsCount.textContent = `Showing ${this.filteredLeads.length} lead${this.filteredLeads.length !== 1 ? 's' : ''}`;

        this.filteredLeads.forEach(lead => {
            const card = this.createLeadCard(lead);
            container.appendChild(card);
        });
    }

    createLeadCard(lead) {
        const card = document.createElement('div');
        card.className = 'lead-card fade-in';

        const status = this.statusMap.get(lead.id) || 'pending';
        const comments = this.commentsMap.get(lead.id) || [];
        const stars = this.generateStars(lead.rating);

        card.innerHTML = `
            <div class="lead-card-header">
                <div class="lead-info">
                    <h3 class="business-name">${this.escapeHtml(lead.business_name)}</h3>
                    <span class="category-badge">${this.formatCategory(lead.category)}</span>
                    <div class="rating-section">
                        <span class="rating-stars">${stars}</span>
                        <span class="rating-value">${lead.rating}</span>
                        <span class="rating-reviews">(${lead.total_reviews} reviews)</span>
                    </div>
                </div>
            </div>

            <div class="lead-details">
                <div class="detail-item">
                    <i class="fas fa-phone"></i>
                    <span>${this.formatPhone(lead.phone)}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${this.truncateText(lead.address, 80)}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>Added: ${this.formatDate(lead.scraped_date)}</span>
                </div>
            </div>

            <div class="lead-actions">
                <button class="action-btn action-btn-call" onclick="leadSystem.callLead('${lead.phone}')">
                    <i class="fas fa-phone"></i> Call
                </button>
                <button class="action-btn action-btn-whatsapp" onclick="leadSystem.whatsappLead('${lead.phone}')">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </button>
                <button class="action-btn action-btn-maps" onclick="leadSystem.openMaps('${lead.google_maps_url}')">
                    <i class="fas fa-map"></i> Maps
                </button>
            </div>

            <div class="status-section">
                <label class="status-label">Lead Status</label>
                <select class="status-select status-${status}" onchange="leadSystem.updateStatus('${lead.id}', this.value)">
                    <option value="pending" ${status === 'pending' ? 'selected' : ''}>⏳ Pending</option>
                    <option value="contacted" ${status === 'contacted' ? 'selected' : ''}>📞 Contacted</option>
                    <option value="call_later" ${status === 'call_later' ? 'selected' : ''}>⏰ Call Later</option>
                    <option value="interested" ${status === 'interested' ? 'selected' : ''}>⭐ Interested</option>
                    <option value="not_interested" ${status === 'not_interested' ? 'selected' : ''}>❌ Not Interested</option>
                    <option value="proposal_sent" ${status === 'proposal_sent' ? 'selected' : ''}>📧 Proposal Sent</option>
                    <option value="negotiation" ${status === 'negotiation' ? 'selected' : ''}>💬 Negotiation</option>
                    <option value="converted" ${status === 'converted' ? 'selected' : ''}>✅ Converted</option>
                </select>
            </div>

            <div class="comments-section">
                <div class="comments-header">
                    <span class="comments-title">
                        <i class="fas fa-comments"></i> Comments
                        <span class="comments-count">${comments.length}</span>
                    </span>
                </div>
                <textarea class="comment-input" id="comment-input-${lead.id}" placeholder="Add a comment..."></textarea>
                <button class="add-comment-btn" onclick="leadSystem.addComment('${lead.id}')">
                    <i class="fas fa-plus"></i> Add Comment
                </button>
                ${comments.length > 0 ? `
                    <div class="comments-list" id="comments-${lead.id}">
                        ${comments.map((comment, index) => `
                            <div class="comment-item">
                                <p class="comment-text">${this.escapeHtml(comment.text)}</p>
                                <div class="comment-meta">
                                    <span class="comment-date">${this.formatDateTime(comment.timestamp)}</span>
                                    <button class="comment-delete" onclick="leadSystem.deleteComment('${lead.id}', ${index})">
                                        <i class="fas fa-trash"></i> Delete
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        return card;
    }

    updateStatus(leadId, newStatus) {
        this.statusMap.set(leadId, newStatus);
        this.saveStatusData();

        // Update the select element class
        const selectElement = event.target;
        selectElement.className = `status-select status-${newStatus}`;

        this.updateStatistics();

        // Show success notification
        this.showNotification('Status updated successfully!');
    }

    addComment(leadId) {
        const input = document.getElementById(`comment-input-${leadId}`);
        const commentText = input.value.trim();

        if (!commentText) {
            alert('Please enter a comment');
            return;
        }

        const comments = this.commentsMap.get(leadId) || [];
        comments.unshift({
            text: commentText,
            timestamp: new Date().toISOString()
        });

        this.commentsMap.set(leadId, comments);
        this.saveCommentsData();

        // Clear input
        input.value = '';

        // Re-render the lead card
        this.renderLeads();

        this.showNotification('Comment added successfully!');
    }

    deleteComment(leadId, commentIndex) {
        if (!confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        const comments = this.commentsMap.get(leadId) || [];
        comments.splice(commentIndex, 1);

        if (comments.length === 0) {
            this.commentsMap.delete(leadId);
        } else {
            this.commentsMap.set(leadId, comments);
        }

        this.saveCommentsData();
        this.renderLeads();

        this.showNotification('Comment deleted successfully!');
    }

    updateStatistics() {
        const total = this.leads.length;
        let contacted = 0;
        let interested = 0;
        let converted = 0;

        this.leads.forEach(lead => {
            const status = this.statusMap.get(lead.id) || 'pending';
            if (status === 'contacted' || status === 'call_later') contacted++;
            if (status === 'interested' || status === 'proposal_sent' || status === 'negotiation') interested++;
            if (status === 'converted') converted++;
        });

        document.getElementById('totalLeads').textContent = total;
        document.getElementById('contactedLeads').textContent = contacted;
        document.getElementById('interestedLeads').textContent = interested;
        document.getElementById('convertedLeads').textContent = converted;
    }

    switchView(view) {
        this.currentView = view;
        const container = document.getElementById('leadsContainer');
        const gridBtn = document.getElementById('gridViewBtn');
        const listBtn = document.getElementById('listViewBtn');

        if (view === 'grid') {
            container.classList.remove('list-view');
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        } else {
            container.classList.add('list-view');
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        }
    }

    callLead(phone) {
        const cleanPhone = phone.replace(/\s/g, '');
        window.location.href = `tel:${cleanPhone}`;
    }

    whatsappLead(phone) {
        const cleanPhone = phone.replace(/\s/g, '').replace(/^0/, '91');
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
    }

    openMaps(url) {
        window.open(url, '_blank');
    }

    exportToCSV() {
        const headers = [
            'Business Name',
            'Phone',
            'Address',
            'Rating',
            'Total Reviews',
            'Category',
            'Status',
            'Comments Count',
            'Google Maps URL',
            'Search Keyword',
            'Scraped Date'
        ];

        const rows = this.filteredLeads.map(lead => {
            const status = this.statusMap.get(lead.id) || 'pending';
            const comments = this.commentsMap.get(lead.id) || [];

            return [
                lead.business_name,
                lead.phone,
                lead.address,
                lead.rating,
                lead.total_reviews,
                this.formatCategory(lead.category),
                status,
                comments.length,
                lead.google_maps_url,
                lead.search_keyword,
                lead.scraped_date
            ];
        });

        let csvContent = headers.join(',') + '\n';
        rows.forEach(row => {
            const escapedRow = row.map(cell => {
                const cellStr = String(cell || '');
                if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                    return `"${cellStr.replace(/"/g, '""')}"`;
                }
                return cellStr;
            });
            csvContent += escapedRow.join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `adsoire_leads_export_${this.formatDateForFilename()}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification('Leads exported successfully!');
    }

    refresh() {
        this.showLoading();
        setTimeout(() => {
            this.applyFilters();
            this.hideLoading();
            this.showNotification('Dashboard refreshed!');
        }, 500);
    }

    showLoading() {
        document.getElementById('loadingSpinner').style.display = 'block';
        document.getElementById('leadsContainer').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loadingSpinner').style.display = 'none';
    }

    closeModal() {
        document.getElementById('leadModal').classList.remove('active');
    }

    showNotification(message) {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-weight: 600;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Utility functions
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '★';
        }
        if (hasHalfStar) {
            stars += '⯨';
        }
        while (stars.length < 5) {
            stars += '☆';
        }

        return stars;
    }

    formatCategory(category) {
        return category.replace(/_/g, ' ');
    }

    formatPhone(phone) {
        return phone || 'N/A';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDateForFilename() {
        const now = new Date();
        return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application
let leadSystem;

document.addEventListener('DOMContentLoaded', () => {
    leadSystem = new LeadManagementSystem();
});

// Add animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
