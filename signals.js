$(document).ready(function() {
    let signalCooldown = false;

    // Signal generator functionality
    if ($('#generate-signal').length) {
        let signalInProgress = false;
        let countdownInterval;
        
        // Initialize signal history
        populateSignalHistory();
        
        // Initialize payout rate
        let payoutRate = 0.85; // 85% default payout
        
        // Investment amount change handler
        $('#investment-amount').on('input', function() {
            updateProfitCalculation();
        });
        
        // Platform select change handler
        $('#platform-select').on('change', function() {
            // Different platforms have different payout rates
            const platform = $(this).val();
            
            switch(platform) {
                case 'iqoption': payoutRate = 0.85; break;
                case 'olymptrade': payoutRate = 0.82; break;
                case 'quotex': payoutRate = 0.90; break;
                case 'binomo': payoutRate = 0.87; break;
                case 'expertoption': payoutRate = 0.89; break;
                case 'pocketoption': payoutRate = 0.86; break;
                default: payoutRate = 0.85;
            }
            
            updateProfitCalculation();
        });
        
        // Update profit calculation display
        function updateProfitCalculation() {
            const investmentAmount = parseFloat($('#investment-amount').val()) || 100;
            const potentialProfit = investmentAmount * payoutRate;
            const newBalance = investmentAmount + potentialProfit;
            
            $('#calc-investment').text('$' + investmentAmount.toFixed(2));
            $('#calc-payout').text((payoutRate * 100).toFixed(0) + '%');
            $('#calc-profit').text('$' + potentialProfit.toFixed(2));
            $('#calc-balance').text('$' + newBalance.toFixed(2));
        }
        
        // Initial calculation update
        updateProfitCalculation();
        
        // Signal generator button click
        $('#generate-signal').on('click', function() {
            const platform = $('#platform-select').val();
            const pair = $('#pair-select').val();
            const expiry = parseInt($('#expiry-select').val());
            const investmentAmount = parseFloat($('#investment-amount').val()) || 100;
            
            // Check for valid investment
            if (investmentAmount <= 0 || isNaN(investmentAmount)) {
                alert('Please enter a valid investment amount');
                return;
            }
            
            // Show loading animation
            $(this).find('span:first').hide();
            $(this).find('.spinner-border').removeClass('d-none');
            $(this).attr('disabled', true);
            
            // Simulate API call with timeout
            setTimeout(function() {
                // Generate signal with higher win probability
                const signal = Math.random() > 0.45 ? 'BUY' : 'SELL';
                const probability = Math.floor(Math.random() * 15) + 75; // 75% to 90%
                
                // Signal visualization on chart (from chart.js)
                if (typeof window.generateChartSignal === 'function') {
                    window.generateChartSignal(signal, pair, expiry);
                }
                
                // Update the result display
                const $signalResult = $('#signal-result');
                $signalResult.removeClass('d-none');
                
                // Update signal badge
                $signalResult.find('.signal-badge').removeClass('buy sell').addClass(signal.toLowerCase()).text(signal);
                
                // Update details
                $('#result-pair').text(pair);
                $('#result-probability').text(probability + '%');
                
                // Get a reference price from chart or default
                let entryPrice;
                if (window.currentPrice) {
                    entryPrice = window.currentPrice;
                } else {
                if (pair === 'EUR/USD') entryPrice = 1.0742;
                else if (pair === 'GBP/USD') entryPrice = 1.2665;
                else if (pair === 'BTC/USD') entryPrice = 38452.67;
                else if (pair === 'ETH/USD') entryPrice = 2843.12;
                else if (pair === 'GOLD') entryPrice = 2318.40;
                else entryPrice = 100.00;
                }
                
                $('#result-entry').text(formatPrice(entryPrice));
                $('#result-expiry').text(formatTime(expiry));
                
                // Show profit calculation
                $('#profit-calculation').removeClass('d-none');
                
                // Add countdown timer
                if ($('#signal-countdown').length === 0) {
                    $signalResult.after('<div id="signal-countdown" class="signal-countdown"></div>');
                }
                
                let countdown = expiry;
                updateCountdown(countdown);
                
                const countdownInterval = setInterval(function() {
                    countdown--;
                    updateCountdown(countdown);
                    
                    if (countdown <= 0) {
                        clearInterval(countdownInterval);
                        
                        // Determine if win (biased towards winning)
                        const isWin = Math.random() < 0.7; // 70% win rate
                        
                        // Update result display
                        if (isWin) {
                            // Show win notification
                            const profit = investmentAmount * payoutRate;
                            showWinNotification(profit.toFixed(2));
                        
                        // Update streak counter
                            const currentStreak = parseInt($('#streak-count').text()) || 0;
                            $('#streak-count').text(currentStreak + 1);
                        } else {
                            // Show loss notification
                            showLossNotification(investmentAmount.toFixed(2));
                            
                            // Reset streak counter
                            $('#streak-count').text('0');
                        }
                        
                        // Re-enable button
                        $('#generate-signal').attr('disabled', false);
                        $('#generate-signal').find('span:first').show();
                        $('#generate-signal').find('.spinner-border').addClass('d-none');
                        
                        // Add to history
                        addSignalToHistory(signal, pair, isWin);
                    }
                }, 1000);
            }, 1500);
        });
        
        // Format price based on asset
        function formatPrice(price) {
            if (price >= 1000) return price.toFixed(2);
            if (price >= 100) return price.toFixed(2);
            if (price >= 10) return price.toFixed(3);
            if (price >= 1) return price.toFixed(4);
            return price.toFixed(5);
        }
        
        // Format time display
        function formatTime(seconds) {
            if (seconds < 60) return seconds + ' sec';
            return Math.floor(seconds / 60) + ' min';
        }
        
        // Update countdown display
        function updateCountdown(seconds) {
            const $countdown = $('#signal-countdown');
            
            if (seconds > 10) {
                $countdown.html(`<div class="alert alert-info">Signal expires in: <strong>${seconds}</strong> seconds</div>`);
            } else if (seconds > 0) {
                $countdown.html(`<div class="alert alert-warning">Signal expires in: <strong>${seconds}</strong> seconds</div>`);
            } else {
                $countdown.html(`<div class="alert alert-success">Signal expired. Result shown below.</div>`);
                
                // Remove countdown message after 3 seconds
                setTimeout(function() {
                    $countdown.fadeOut(500, function() {
                        $(this).remove();
                    });
                }, 3000);
            }
        }
        
        // Show win notification
        function showWinNotification(profit) {
            const notification = $(`
                <div class="win-notification">
                    <div class="notification-header">
                        <i class="bi bi-trophy-fill"></i> SUCCESS!
                    </div>
                    <div class="notification-body">
                        <p>Your trade was successful!</p>
                        <p class="profit-amount">+$${profit}</p>
                    </div>
                </div>
            `);
            
            styleAndShowNotification(notification, 'rgba(38, 166, 154, 0.9)');
        }
        
        // Show loss notification
        function showLossNotification(amount) {
            const notification = $(`
                <div class="loss-notification">
                    <div class="notification-header">
                        <i class="bi bi-exclamation-triangle-fill"></i> TRADE EXPIRED
                    </div>
                    <div class="notification-body">
                        <p>Your trade was unsuccessful.</p>
                        <p class="loss-amount">-$${amount}</p>
                    </div>
                </div>
            `);
            
            styleAndShowNotification(notification, 'rgba(239, 83, 80, 0.9)');
        }
        
        // Style and show notification
        function styleAndShowNotification(notification, color) {
            notification.css({
                'position': 'fixed',
                'top': '-150px',
                'left': '50%',
                'transform': 'translateX(-50%)',
                'width': '300px',
                'background-color': color,
                'color': 'white',
                'border-radius': '8px',
                'box-shadow': '0 4px 15px rgba(0,0,0,0.3)',
                'z-index': '9999',
                'overflow': 'hidden'
            });
            
            notification.find('.notification-header').css({
                'padding': '12px 15px',
                'background-color': 'rgba(0,0,0,0.2)',
                'font-weight': 'bold',
                'text-align': 'center',
                'font-size': '16px'
            });
            
            notification.find('.notification-body').css({
                'padding': '15px',
                'text-align': 'center'
            });
            
            notification.find('.profit-amount, .loss-amount').css({
                'font-size': '24px',
                'font-weight': 'bold',
                'margin-top': '10px'
            });
            
            // Add to body and animate
            $('body').append(notification);
            notification.animate({top: '20px'}, 500).delay(4000).animate({top: '-150px'}, 500, function() {
                $(this).remove();
            });
        }
        
        // Add to signal history
        function addSignalToHistory(signal, pair, isWin) {
            const historyContainer = $('#signal-history');
            if (!historyContainer.length) return;
            
            // Create current time string
            const now = new Date();
            const timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                           now.getMinutes().toString().padStart(2, '0');
            
            // Create history item
            const historyItem = `
                <div class="history-item new-item">
                    <div class="history-signal ${signal.toLowerCase()}">${signal}</div>
                    <div class="history-details">
                        <div class="history-pair">${pair}</div>
                        <div class="history-time">${timeStr}</div>
                    </div>
                    <div class="history-result ${isWin ? 'win' : 'loss'}">${isWin ? 'WIN' : 'LOSS'}</div>
                </div>
            `;
            
            // Add to top of history
            historyContainer.prepend(historyItem);
            
            // If more than 5 items, remove the last one
            if (historyContainer.find('.history-item').length > 5) {
                historyContainer.find('.history-item:last').remove();
            }
        }
        
        // Platform change updates the interface
        $('#platform-select').on('change', function() {
            const platform = $(this).val();
            const platformIcon = $(this).find('option:selected').data('icon');
            
            // Update interface with selected platform
            $('.platform-name').text(platform.toUpperCase());
            
            if (platformIcon) {
                $('.platform-icon').attr('src', 'assets/images/platforms/' + platformIcon);
            }
        });
        
        // Trading pair change updates the chart
        $('#pair-select').on('change', function() {
            const pair = $(this).val();
            // In a real app, this would update chart data based on the selected pair
            // For this demo, we'll just show a notification
            
            $('#trading-chart').parent().append(
                `<div class="chart-overlay d-flex align-items-center justify-content-center">
                    <div class="spinner-border text-primary me-2" role="status"></div>
                    <span>Loading ${pair} chart data...</span>
                </div>`
            );
            
            // Add CSS for the overlay
            $('<style>')
                .prop('type', 'text/css')
                .html(`
                    .chart-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: rgba(30, 30, 30, 0.8);
                        z-index: 100;
                        color: var(--text-color);
                    }
                `)
                .appendTo('head');
            
            // Remove overlay after 2 seconds
            setTimeout(function() {
                $('.chart-overlay').fadeOut(300, function() {
                    $(this).remove();
                });
            }, 2000);
        });
    }
    
    // Function to populate signal history
    function populateSignalHistory() {
        const historyContainer = $('#signal-history');
        if (!historyContainer.length) return;
        
        historyContainer.empty();
        
        // Sample history data
        const historyData = [
            { signal: 'BUY', pair: 'EUR/USD', time: '13:45', result: 'win' },
            { signal: 'SELL', pair: 'GBP/USD', time: '13:30', result: 'win' },
            { signal: 'BUY', pair: 'GOLD', time: '13:15', result: 'loss' },
            { signal: 'SELL', pair: 'BTC/USD', time: '13:00', result: 'win' },
            { signal: 'BUY', pair: 'OTC EUR/USD', time: '12:45', result: 'win' }
        ];
        
        // Add history items to container
        historyData.forEach(item => {
            const historyItem = `
                <div class="history-item">
                    <div class="history-signal ${item.signal.toLowerCase()}">${item.signal}</div>
                    <div class="history-details">
                        <div class="history-pair">${item.pair}</div>
                        <div class="history-time">${item.time}</div>
                    </div>
                    <div class="history-result ${item.result}">${item.result.toUpperCase()}</div>
                </div>
            `;
            
            historyContainer.append(historyItem);
        });
    }
    
    // Initialize platform icons using Bootstrap icons
    function initPlatformIcons() {
        // Show selected platform icon
        function updatePlatformIcon() {
            const selectedOption = $('#platform-select option:selected');
            const iconClass = selectedOption.data('icon');
            const platformName = selectedOption.text();
            
            // Update or create the platform icon container
            if ($('.platform-icon-container').length) {
                $('.platform-icon-container').html(`
                    <i class="bi ${iconClass} platform-icon-bs"></i>
                    <span class="platform-name">${platformName}</span>
                `);
            } else {
                $('#platform-select').before(`
                    <div class="platform-icon-container d-flex align-items-center mb-2">
                        <i class="bi ${iconClass} platform-icon-bs"></i>
                        <span class="platform-name">${platformName}</span>
                    </div>
                `);
            }
        }
        
        // Initialize icon for current selection
        updatePlatformIcon();
        
        // Update when selection changes
        $('#platform-select').on('change', updatePlatformIcon);
    }

    // Call this on document ready
    if ($('#platform-select').length) {
        initPlatformIcons();
    }
}); 