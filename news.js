$(document).ready(function() {
    if ($('#news-container').length) {
        // Add breaking news after 20 seconds
        setTimeout(function() {
            // Create breaking news element
            const breakingNews = $(`
                <div class="news-item breaking-news">
                    <div class="breaking-badge">BREAKING</div>
                    <div class="news-time">Just now</div>
                    <div class="news-title">Major central bank announces unexpected rate decision</div>
                    <div class="d-flex align-items-center">
                        <span class="news-source">Financial Times</span>
                        <span class="news-impact high">HIGH IMPACT</span>
                    </div>
                </div>
            `);
            
            // Style the breaking news
            breakingNews.css({
                'border-left': '3px solid #dc3545',
                'background-color': 'rgba(220, 53, 69, 0.1)',
                'animation': 'pulse 2s infinite'
            });
            
            breakingNews.find('.breaking-badge').css({
                'background-color': '#dc3545',
                'color': 'white',
                'display': 'inline-block',
                'padding': '2px 8px',
                'border-radius': '4px',
                'font-weight': 'bold',
                'font-size': '0.7rem',
                'margin-bottom': '5px'
            });
            
            // Add sound effect
            const audio = new Audio('data:audio/mpeg;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uSwAAAAAABLBQAAAL6QWzzMGABEARDGOAAIBjHZdmABAMdcdcAAgGOyOuABBkAeBiAM/AHUAfh+Hwfh8Pw/D6H8Pw+j8P4/j+P5fF8vi+X7/lIIVQKoNmAUaQzILFOl1lVWsyU6Xa7JGrf9bu91ltttl0ul0utra2trrbbJzpdZIIvmSCJJBEkQRJEESRJIkkSSSJJJJJJIkkkSSP/////////4kkj////////////8Pt3//////////jGMYxjGMY/xjGMYxjGMYxjf/jGMYxjGMYxjGMYxjGMYxjGMYxjGMYxjGMYxjGMYxj/GMYAHMM4GA2WXUzAYDaZdOzAYDaZdOzAYDaZdOzAYDaZdOzAYDcZdtmA0G6y7bMBdNxl22YDQbrLtk3DQcDLuGg4GXcNBwMu4aDAaDgZdw0GAy7hoMBl3DQYDLuGgwGXjB4KfhT8KwVgrBUFIKQ3EYKgUgpBSCkNwUB8Nh+Gw+GsPhqGwahqGoahqGoahqGoahqGoahqGwahsGobBqGwahsGobBqGwahsGobBqGwahsGobBqGwahsGobBqGwahsGobBqGwahsGobBqGwahs=');
            audio.volume = 0.3;
            audio.play().catch(e => console.log('Audio playback error:', e));
            
            // Add to the top of the news container
            $('#news-container').prepend(breakingNews);
            
            // Show a notification
            $('<div class="alert alert-danger breaking-alert">Breaking News Alert!</div>')
                .css({
                    'position': 'fixed',
                    'top': '20px',
                    'right': '20px',
                    'z-index': '9999',
                    'opacity': 0,
                    'box-shadow': '0 4px 10px rgba(0,0,0,0.3)'
                })
                .appendTo('body')
                .animate({opacity: 1}, 300)
                .delay(3000)
                .animate({opacity: 0}, 300, function() {
                    $(this).remove();
                });
        }, 20000);
    }
}); 