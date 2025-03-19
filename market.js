$(document).ready(function() {
    // Market data handling
    if ($('#market-tickers').length) {
        // Sample market data with more fields
        const marketData = [
            { symbol: 'BTC/USD', name: 'Bitcoin', price: 38452.67, change: 2.35, volume: '2.8B', high: 39100.50, low: 37950.20 },
            { symbol: 'EUR/USD', name: 'Euro', price: 1.0742, change: -0.23, volume: '1.5B', high: 1.0768, low: 1.0712 },
            { symbol: 'GBP/USD', name: 'British Pound', price: 1.2665, change: -0.45, volume: '980M', high: 1.2730, low: 1.2649 },
            { symbol: 'USD/JPY', name: 'Japanese Yen', price: 149.27, change: 0.89, volume: '1.2B', high: 149.65, low: 148.80 },
            { symbol: 'GOLD', name: 'Gold', price: 2318.40, change: 0.67, volume: '850M', high: 2325.30, low: 2305.70 },
            { symbol: 'OTC EUR/USD', name: 'OTC Euro', price: 1.0738, change: -0.15, volume: '750M', high: 1.0755, low: 1.0722 }
        ];
        
        // Populate market tickers
        populateMarketTickers(marketData);
        
        // Update prices with random changes every 3 seconds
        setInterval(function() {
            updateMarketPrices(marketData);
        }, 3000);
        
        // Also populate the market news
        if ($('#news-container').length) {
            populateMarketNews();
        }
    }
    
    // Function to populate market tickers with enhanced data
    function populateMarketTickers(data) {
        const container = $('#market-tickers');
        container.empty();
        
        data.forEach(item => {
            const changeClass = item.change >= 0 ? 'positive' : 'negative';
            const changeSign = item.change >= 0 ? '+' : '';
            
            const tickerHtml = `
                <div class="col-md-4 col-sm-6">
                    <div class="market-ticker">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <div class="ticker-name">${item.name}</div>
                                <div class="ticker-symbol text-muted">${item.symbol}</div>
                            </div>
                            <div class="text-end">
                                <div class="ticker-price">${formatPrice(item.price)}</div>
                                <div class="ticker-change ${changeClass}">${changeSign}${item.change.toFixed(2)}%</div>
                            </div>
                        </div>
                        <div class="market-stats">
                            <div class="stat-item">
                                <div class="stat-label">24h High</div>
                                <div class="stat-value">${formatPrice(item.high)}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">24h Low</div>
                                <div class="stat-value">${formatPrice(item.low)}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">Volume</div>
                                <div class="stat-value">${item.volume}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            container.append(tickerHtml);
        });
    }
    
    // Function to update market prices with random changes
    function updateMarketPrices(data) {
        data.forEach(item => {
            // Generate random price movement (small percentage change)
            const movement = (Math.random() - 0.5) * 0.5; // -0.25% to +0.25%
            item.price = item.price * (1 + movement / 100);
            
            // Update high/low
            if (item.price > item.high) item.high = item.price;
            if (item.price < item.low) item.low = item.price;
            
            // Update change percentage (slowly reverts to mean)
            item.change = item.change * 0.95 + movement * 0.75;
            
            // Random volume change
            const volumeChange = ['', '', '', '+100M', '-50M', '+200M', '-100M'];
            if (Math.random() < 0.1) { // 10% chance to update volume
                const randomIndex = Math.floor(Math.random() * volumeChange.length);
                if (volumeChange[randomIndex]) {
                    // Parse current volume
                    const currentVal = parseFloat(item.volume.replace(/[BM]/g, ''));
                    const changeVal = parseFloat(volumeChange[randomIndex]);
                    
                    let unit = 'M';
                    if (item.volume.includes('B')) unit = 'B';
                    
                    let newVal = currentVal;
                    if (unit === 'B') newVal = currentVal + changeVal/1000;
                    else newVal = currentVal + changeVal/1000;
                    
                    if (newVal < 0) newVal = 0.1;
                    item.volume = newVal.toFixed(1) + unit;
                }
            }
        });
        
        // Repopulate with updated data
        populateMarketTickers(data);
    }
    
    // Helper function to format price based on value
    function formatPrice(price) {
        if (price >= 1000) return price.toFixed(2);
        if (price >= 100) return price.toFixed(2);
        if (price >= 10) return price.toFixed(3);
        if (price >= 1) return price.toFixed(4);
        return price.toFixed(5);
    }
    
    // Function to populate market news
    function populateMarketNews() {
        const newsContainer = $('#news-container');
        newsContainer.empty();
        
        // Sample news data
        const newsData = [
            {
                time: '12:45',
                title: 'Fed signals rate cuts may begin in September',
                source: 'Reuters',
                impact: 'high'
            },
            {
                time: '11:32',
                title: 'ECB holds interest rates steady as inflation concerns persist',
                source: 'Bloomberg',
                impact: 'medium'
            },
            {
                time: '10:15',
                title: 'Bitcoin surpasses $38,000 as institutional interest grows',
                source: 'CoinDesk',
                impact: 'medium'
            },
            {
                time: '09:30',
                title: 'US jobless claims fall to 243,000, beating expectations',
                source: 'MarketWatch',
                impact: 'high'
            },
            {
                time: '08:45',
                title: 'Oil prices stabilize after OPEC+ meeting',
                source: 'CNBC',
                impact: 'low'
            }
        ];
        
        // Add news items to container
        newsData.forEach(news => {
            const newsItem = `
                <div class="news-item">
                    <div class="news-time">${news.time}</div>
                    <div class="news-title">${news.title}</div>
                    <div class="d-flex align-items-center">
                        <span class="news-source">${news.source}</span>
                        <span class="news-impact ${news.impact}">${news.impact.toUpperCase()}</span>
                    </div>
                </div>
            `;
            
            newsContainer.append(newsItem);
        });
        
        // Add a "breaking news" animation after 10 seconds
        setTimeout(function() {
            const breakingNews = {
                time: 'BREAKING',
                title: 'Major tech company announces surprise acquisition, markets react',
                source: 'Financial Times',
                impact: 'high'
            };
            
            const breakingNewsItem = `
                <div class="news-item breaking" style="background-color: rgba(220, 53, 69, 0.1); animation: pulse 2s infinite;">
                    <div class="news-time" style="color: var(--danger-color); font-weight: bold;">${breakingNews.time}</div>
                    <div class="news-title">${breakingNews.title}</div>
                    <div class="d-flex align-items-center">
                        <span class="news-source">${breakingNews.source}</span>
                        <span class="news-impact ${breakingNews.impact}">${breakingNews.impact.toUpperCase()}</span>
                    </div>
                </div>
            `;
            
            newsContainer.prepend(breakingNewsItem);
            
            // Add pulse animation
            $('<style>')
                .prop('type', 'text/css')
                .html(`
                    @keyframes pulse {
                        0% { opacity: 1; }
                        50% { opacity: 0.8; }
                        100% { opacity: 1; }
                    }
                `)
                .appendTo('head');
        }, 10000);
    }
}); 