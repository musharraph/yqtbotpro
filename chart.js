$(document).ready(function() {
    // Create a guaranteed working chart
    if ($('#trading-chart').length) {
        // Clear any previous content
        $('#trading-chart').empty();
        
        // Set explicit dimensions and styling
        $('#trading-chart').css({
            'height': '400px',
            'width': '100%',
            'background-color': '#151515',
            'position': 'relative',
            'border-radius': '8px',
            'overflow': 'hidden',
            'box-shadow': 'inset 0 0 10px rgba(0,0,0,0.5)',
            'border': '1px solid #2a2a2a'
        });
        
        // Create canvas element with explicit dimensions
        const canvas = document.createElement('canvas');
        canvas.id = 'price-chart';
        $('#trading-chart').append(canvas);
        
        // Set canvas dimensions - CRITICAL for visibility
        canvas.width = $('#trading-chart').width();
        canvas.height = 400;
        
        // Access canvas context
        const ctx = canvas.getContext('2d');
        
        // Chart data
        let chartData = [];
        let currentPrice = 100;
        
        // Initialize with random data
        function initializeData() {
            chartData = [];
            currentPrice = getPairBasePrice();
            
            // Generate realistic looking price action
            for (let i = 0; i < 200; i++) {
            const open = currentPrice;
                const close = open + (Math.random() - 0.5) * currentPrice * 0.01;
                const high = Math.max(open, close) + Math.random() * currentPrice * 0.005;
                const low = Math.min(open, close) - Math.random() * currentPrice * 0.005;
                
                chartData.push({
                    time: Date.now() - (200 - i) * 1000,
                open: open,
                high: high,
                low: low,
                    close: close,
                    volume: Math.random() * 100 + 50
            });
            
            currentPrice = close;
        }
        }
        
        // Get base price for selected pair
        function getPairBasePrice() {
            const pair = $('#pair-select').val() || 'EUR/USD';
            
            if (pair.includes('BTC')) return 38000 + Math.random() * 1000;
            if (pair.includes('ETH')) return 2800 + Math.random() * 100;
            if (pair.includes('EUR/USD')) return 1.07 + Math.random() * 0.01;
            if (pair.includes('GBP/USD')) return 1.26 + Math.random() * 0.01;
            if (pair.includes('USD/JPY')) return 149 + Math.random() * 1;
            if (pair.includes('GOLD')) return 2300 + Math.random() * 50;
            
            return 100 + Math.random() * 10;
        }
        
        // Initialize data
        initializeData();
        
        // Draw function
        function drawChart() {
            // Clear canvas
            ctx.fillStyle = '#151515';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw grid
            drawGrid();
            
            // Find min and max for scaling
            let min = Infinity;
            let max = -Infinity;
            
            for (let i = 0; i < chartData.length; i++) {
                if (chartData[i].low < min) min = chartData[i].low;
                if (chartData[i].high > max) max = chartData[i].high;
            }
            
            const range = max - min;
            const padding = range * 0.1;
            min -= padding;
            max += padding;
            
            // Draw price scale
            drawPriceScale(min, max);
            
            // Scale factor
            const scaleY = (canvas.height - 30) / (max - min);
            
            // Width of each candle
            const candleWidth = Math.max(Math.floor(canvas.width / chartData.length), 2);
            const spacing = 1;
            
            // Draw candles
            for (let i = 0; i < chartData.length; i++) {
                const candle = chartData[i];
                const x = i * (candleWidth + spacing);
                
                // Calculate y coordinates (inverted for canvas)
                const yOpen = (canvas.height - 30) - (candle.open - min) * scaleY;
                const yClose = (canvas.height - 30) - (candle.close - min) * scaleY;
                const yHigh = (canvas.height - 30) - (candle.high - min) * scaleY;
                const yLow = (canvas.height - 30) - (candle.low - min) * scaleY;
                
                // Determine candle color
                const color = candle.close > candle.open ? '#26a69a' : '#ef5350';
                
                // Draw candle wick
                ctx.beginPath();
                ctx.moveTo(x + candleWidth / 2, yHigh);
                ctx.lineTo(x + candleWidth / 2, yLow);
                ctx.strokeStyle = color;
                ctx.stroke();
                
                // Draw candle body
                ctx.fillStyle = color;
                ctx.fillRect(x, Math.min(yOpen, yClose), candleWidth, Math.abs(yClose - yOpen) || 1);
            }
            
            // Draw active indicators
            drawIndicators(min, max, scaleY);
            
            // Draw current price
            drawCurrentPrice(min, max, scaleY);
            
            // Add this at the end of your drawChart function
            $('#chart-loading').fadeOut(500, function() {
                $(this).remove();
            });
        }
        
        // Draw grid
        function drawGrid() {
            ctx.strokeStyle = '#1e1e1e';
            ctx.lineWidth = 1;
            
            // Vertical grid
            for (let i = 0; i < canvas.width; i += 50) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height - 30);
                ctx.stroke();
            }
            
            // Horizontal grid
            for (let i = 0; i < canvas.height - 30; i += 50) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(canvas.width, i);
                ctx.stroke();
            }
        }
        
        // Draw price scale
        function drawPriceScale(min, max) {
            const range = max - min;
            const step = range / 5;
            
            ctx.fillStyle = '#aaa';
            ctx.font = '10px Arial';
            ctx.textAlign = 'right';
            
            for (let i = 0; i <= 5; i++) {
                const price = max - i * step;
                const y = (i * (canvas.height - 30) / 5);
                
                ctx.fillText(formatPrice(price), canvas.width - 5, y + 10);
            }
        }
        
        // Format price based on magnitude
        function formatPrice(price) {
            if (price >= 1000) return price.toFixed(2);
            if (price >= 100) return price.toFixed(2);
            if (price >= 10) return price.toFixed(3);
            if (price >= 1) return price.toFixed(4);
            return price.toFixed(5);
        }
        
        // Draw technical indicators
        function drawIndicators(min, max, scaleY) {
            $('.chart-indicators .btn.active').each(function() {
                const indicator = $(this).data('indicator');
                
                if (indicator === 'ma') {
                    drawMovingAverage(min, scaleY);
                }
            });
        }
        
        // Draw moving average
        function drawMovingAverage(min, scaleY) {
            // Calculate 20-period MA
            if (chartData.length < 20) return;
            
            const maData = [];
            
            for (let i = 19; i < chartData.length; i++) {
                let sum = 0;
                for (let j = 0; j < 20; j++) {
                    sum += chartData[i - j].close;
                }
                maData.push(sum / 20);
            }
            
            // Draw MA line
            ctx.beginPath();
            ctx.strokeStyle = '#2196F3';
            ctx.lineWidth = 2;
            
            for (let i = 0; i < maData.length; i++) {
                const x = (i + 19) * (Math.floor(canvas.width / chartData.length) + 1) + 
                          Math.floor(canvas.width / chartData.length) / 2;
                const y = (canvas.height - 30) - (maData[i] - min) * scaleY;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
            
            // Add MA label
            ctx.fillStyle = '#2196F3';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText('MA(20)', 10, 20);
        }
        
        // Draw current price line
        function drawCurrentPrice(min, max, scaleY) {
            if (chartData.length === 0) return;
            
            const lastPrice = chartData[chartData.length - 1].close;
            const y = (canvas.height - 30) - (lastPrice - min) * scaleY;
            
            // Draw price line
            ctx.beginPath();
            ctx.setLineDash([3, 3]);
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 1;
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Draw price label
            ctx.fillStyle = '#000';
            ctx.fillRect(canvas.width - 60, y - 10, 55, 20);
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(formatPrice(lastPrice), canvas.width - 10, y + 4);
        }
        
        // Draw chart initially
        drawChart();
        
        // Redraw on window resize
        $(window).resize(function() {
            canvas.width = $('#trading-chart').width();
            drawChart();
        });
        
        // Update chart with new data point every second
        setInterval(function() {
            if (chartData.length === 0) return;
            
            // Get the last price
            const lastCandle = chartData[chartData.length - 1];
            
            // Generate new price
            const open = lastCandle.close;
            const close = open + (Math.random() - 0.5) * open * 0.002;
            const high = Math.max(open, close) + Math.random() * open * 0.001;
            const low = Math.min(open, close) - Math.random() * open * 0.001;
            
            // Add new candle
            chartData.push({
                time: Date.now(),
                open: open,
                high: high,
                low: low,
                close: close,
                volume: Math.random() * 100 + 50
            });
            
            // Keep a fixed number of candles
            if (chartData.length > 200) {
                chartData.shift();
            }
            
            // Update the current price
            currentPrice = close;
            
            // Redraw chart
            drawChart();
        }, 1000);
        
        // Handle indicator buttons
        $('.chart-indicators .btn').on('click', function() {
            $(this).toggleClass('active');
            drawChart();
        });
        
        // Handle pair selection change
        $('#pair-select').on('change', function() {
            initializeData();
            drawChart();
        });
        
        // Log to confirm script executed
        console.log('Chart initialized successfully');
    }
}); 