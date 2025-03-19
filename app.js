$(document).ready(function() {
    // Check for trading chart
    if ($('#trading-chart').length && typeof LightweightCharts === 'undefined') {
        console.error('LightweightCharts library not loaded!');
        $('#trading-chart').html(`
            <div class="alert alert-warning m-3">
                <i class="bi bi-exclamation-triangle-fill"></i> 
                Chart library not loaded. Please check your internet connection or try reloading the page.
            </div>
        `);
    }
    
    // Handle sidebar navigation
    $('.sidebar-menu .nav-link').on('click', function(e) {
        e.preventDefault();
        
        // Update active state
        $('.sidebar-menu .nav-link').removeClass('active');
        $(this).addClass('active');
        
        // Get the page to show
        const page = $(this).data('page');
        
        // Update page title
        $('.top-bar h2').text($(this).text().trim());
        
        // Hide all content sections and show the selected one
        $('.content-section').hide();
        $(`#${page}-section`).fadeIn();
        
        // If on mobile, hide sidebar after selection
        if ($(window).width() < 992) {
            $('.sidebar').removeClass('show');
        }
    });
    
    // Initialize the dashboard as the active page
    $('.sidebar-menu .nav-link[data-page="dashboard"]').click();
    
    // Check if Lightweight Charts is loaded properly
    setTimeout(function() {
        if ($('#trading-chart').is(':empty')) {
            $('#trading-chart').html(`
                <div class="alert alert-warning m-3">
                    <i class="bi bi-exclamation-triangle-fill"></i> 
                    Chart failed to load. Using fallback display.
                </div>
                <div class="text-center p-4">
                    <div class="spinner-border text-primary" role="status"></div>
                </div>
            `);
        }
    }, 2000);
    
    // Add this script to dashboard.html
    console.log('YQT BOT PRO initialized successfully');
}); 