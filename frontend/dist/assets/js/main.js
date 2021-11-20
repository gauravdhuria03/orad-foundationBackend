

(function($) {

   'use strict'


/*------------------------------------------------------------------------------*/
/* Preloader
/*------------------------------------------------------------------------------*/
    // makes sure the whole site is loaded
 $(window).on("load",function() {
        // will first fade out the loading animation
  //   $("#preloader").fadeOut();
        // will fade out the whole DIV that covers the website.
    // $("#status").fadeOut(9000);
})

$(document).on('click','#site-navigation',function(){

// if($("#menu").is(":visible")){
//     console.log("hiddeee");
//     $("#menu").hide();    
//     return false;
// } else{    
//     console.log("show");
//     $("#menu").show();

// }
});
/*------------------------------------------------------------------------------*/
/* TopSearch
/*------------------------------------------------------------------------------*/

    jQuery(".ttm-header-search-link a").on('click',function(){
        jQuery(".ttm-search-overlay").addClass('st-show');
        jQuery(".ttm-search-overlay").addClass('st-prevent-scroll');
        jQuery(".field.searchform-s").focus();return!1
    });

    jQuery(".ttm-search-overlay").on('click',function(){
        jQuery(".ttm-search-overlay").removeClass('st-show');
        jQuery(".ttm-search-overlay").removeClass('st-prevent-scroll');return!1
    });

    jQuery('.ttm-site-searchform').on('click',function(event){event.stopPropagation()});
   

/*------------------------------------------------------------------------------*/
/* Fbar-btn
/*------------------------------------------------------------------------------*/
 
    // Right btn click event
   
    jQuery('.ttm-fbar-close, .ttm-fbar-btn > a.ttm-fbar-btn-link, .ttm-float-overlay').on('click',function(){
        jQuery('.ttm-fbar-box-w').toggleClass('animated');
        jQuery('a.ttm-fbar-btn-link').toggleClass('ttm-close-icon');
    });


/*------------------------------------------------------------------------------*/
/* Fixed-header
/*------------------------------------------------------------------------------*/

    $(window).scroll(function(){
        if ( matchMedia( 'only screen and (min-width: 1200px)' ).matches ) 
        {
            if ($(window).scrollTop() >= 50 ) {
                $('.ttm-stickable-header').addClass('fixed-header');
                $('.ttm-stickable-header').addClass('visible-title');
            }
            else {

                $('.ttm-stickable-header').removeClass('fixed-header');
                $('ttm-stickable-header').removeClass('visible-title');
                }
        }
    });


/*------------------------------------------------------------------------------*/
/* Menu
/*------------------------------------------------------------------------------*/

    $('ul li:has(ul)').addClass('has-submenu');
    $('ul li ul').addClass('sub-menu');


    $("ul.dropdown li").on({

        mouseover: function(){
           $(this).addClass("hover");
        },  
        mouseout: function(){
           $(this).removeClass("hover");
        }, 

    });
    
    var $menu = $('#menu'), $menulink = $('#menu-toggle-form'), $menuTrigger = $('.has-submenu > a');
    $menulink.on('click',function (e) {
       
        $menulink.toggleClass('active');
        $menu.toggleClass('active');
    });

    $menuTrigger.on('click',function (e) {
        e.preventDefault();
        var t = $(this);
        t.toggleClass('active').next('ul').toggleClass('active');
    });

    $('ul li:has(ul)');


    $(window).load(function() {

        if ( matchMedia( 'only screen and (min-width: 1200px)' ).matches ) 
            {
                $('.header.ttm-header-style-02 .site-header-menu').addClass('ttm-bgcolor-darkgrey');
                
            }

        jQuery(window).resize(function() {

            var retina = window.devicePixelRatio > 1 ? true : false;


            if ( matchMedia( 'only screen and (min-width: 1200px)' ).matches ) {
               
                $('.header.ttm-header-style-02 .site-header-menu').addClass('ttm-bgcolor-darkgrey');
            }

            else {

               $('.header.ttm-header-style-02 .site-header-menu').removeClass('ttm-bgcolor-darkgrey');

            }

        });
    });


    $(window).scroll(function(){

        if ( matchMedia( 'only screen and (min-width: 1200px)' ).matches ) 
        {
            if ($(window).scrollTop() >= 50 ) {

                $('.ttm-stickable-header').addClass('fixed-header');
                $('.header.ttm-header-style-classic-overlay .ttm-stickable-header').addClass('fixed-header').find('img').attr({src:'./images/logo-white.png'});;

            }
            else {

                $('.ttm-stickable-header').removeClass('fixed-header');
                $('.header.ttm-header-style-classic-overlay .ttm-stickable-header').removeClass('fixed-header').find('img').attr({src:'./images/logo-img.png'});;

            }
        }
    });



    $(window).load(function() {

        if ( matchMedia( 'only screen and (min-width: 1200px)' ).matches ) 
            {
                $('.header.ttm-header-style-classic-overlay').find('img').attr({src:'./images/logo-img.png'});
            }

    });

    jQuery(window).resize(function() {

        var retina = window.devicePixelRatio > 1 ? true : false;

        if ( matchMedia( 'only screen and (max-width: 1200px)' ).matches ) {
           
            $('.header.ttm-header-style-classic-overlay').find('img').attr({src:'./images/logo-white.png'});  
        }

        else {

           $('.header.ttm-header-style-classic-overlay').find('img').attr({src:'./images/logo-img.png'}); 
        }

    });

    function delmont_menuhover_item() {
        
        var tm_menu_item,tm_leftmenu,tm_menu_width,tm_parentli_width;
        var tm_sepline=jQuery(".ttm-sepline");
        var active_item=jQuery("#site-header-menu #site-navigation ul.dropdown, #site-header-menu #site-navigation .menu > ul li.active").children('.active');

        if(active_item.length!=0){

            tm_sepline.width(active_item.width()).css({left:active_item.position().left,opacity:1}).data("origLeft",tm_sepline.position().left).data("origWidth",tm_sepline.width())
        }
        else{

            tm_sepline.css('opacity',0)
        }
        jQuery("#site-header-menu #site-navigation .menu ul.dropdown > li").children("a").hover(function(){

            tm_menu_item=jQuery(this);
            tm_leftmenu=tm_menu_item.parent().position().left;
            tm_menu_width=tm_menu_item.parent().width();
            tm_sepline.stop().animate({left:tm_leftmenu,width:tm_menu_width,opacity:1})
        },
        function(){tm_sepline.stop().animate({left:tm_sepline.data("origLeft"),width:tm_sepline.data("origWidth")});

        if(active_item.length==0){tm_sepline.stop().animate({opacity:0})}});

        jQuery("#site-header-menu #site-navigation div.menu ul ul > li, #site-header-menu #site-navigation .menu ul.dropdown li ul.sub-menu > li").children("a").hover(function(){

            tm_menu_item=jQuery(this);
            tm_leftmenu=tm_menu_item.parent('.has-submenu').closest("li").left;
            tm_menu_width=tm_menu_item.parent().closest(".menu ul:not(.children,.sub-menu)>li ").width();tm_sepline.stop().animate({

                left:tm_leftmenu,width:tm_menu_width,opacity:1})
        },
        function(){tm_sepline.stop().animate({left:tm_sepline.data("origLeft"),width:tm_sepline.data("origWidth")});
        if(active_item.length==0){tm_sepline.stop().animate({opacity:0})}}
            )}

        jQuery("header:not(.ttm-header-style-classic-overlay) #site-header-menu #site-navigation .menu > ul").append("<li class='ttm-sepline'><span class='sep-img'></span></li>");delmont_menuhover_item()


/*------------------------------------------------------------------------------*/
/* Animation on scroll: Number rotator
/*------------------------------------------------------------------------------*/
    
    $("[data-appear-animation]").each(function() {
        var self      = $(this);
        var animation = self.data("appear-animation");
        var delay     = (self.data("appear-animation-delay") ? self.data("appear-animation-delay") : 0);
        
        if( $(window).width() > 959 ) {
            self.html('0');
            self.waypoint(function(direction) {
                if( !self.hasClass('completed') ){
                    var from     = self.data('from');
                    var to       = self.data('to');
                    var interval = self.data('interval');
                    self.numinate({
                        format: '%counter%',
                        from: from,
                        to: to,
                        runningInterval: 2000,
                        stepUnit: interval,
                        onComplete: function(elem) {
                            self.addClass('completed');
                        }
                    });
                }
            }, { offset:'85%' });
        } else {
            if( animation == 'animateWidth' ) {
                self.css('width', self.data("width"));
            }
        }
    });


   
/*------------------------------------------------------------------------------*/
/* Skillbar
/*------------------------------------------------------------------------------*/

jQuery('.progress').each(function(){
    jQuery(this).find('.progress-bar').animate({
        width:jQuery(this).attr('data-value')
    },6000);
});


/*------------------------------------------------------------------------------*/
/* Tab
/*------------------------------------------------------------------------------*/ 

$(document).find('.ttm-tabs').each(function() {
    $(this).children('.content-tab').children().hide();
    $(this).children('.content-tab').children().first().show();
    $(this).find('.tabs').children('li').on('click', function(e) {  
        var liActive = $(this).index(),
            contentActive = $(this).siblings().removeClass('active').parents('.ttm-tabs').children('.content-tab').children().eq(liActive);
        contentActive.addClass('active').fadeIn('slow');
        contentActive.siblings().removeClass('active');
        $(this).addClass('active').parents('.ttm-tabs').children('.content-tab').children().eq(liActive).siblings().hide();
        e.preventDefault();
    });
});
jQuery( window ).load(function() 
   { 
    jQuery(document).find('.tabs').children('li').on('click', function(e) {  
   
    var liActive = jQuery(this).index(),
        contentActive = jQuery(this).siblings().removeClass('active').parents('.ttm-tabs').children('.content-tab').children().eq(liActive);
    contentActive.addClass('active').fadeIn('slow');
    contentActive.siblings().removeClass('active');
    jQuery(this).addClass('active').parents('.ttm-tabs').children('.content-tab').children().eq(liActive).siblings().hide();
    e.preventDefault();
});
});


/*------------------------------------------------------------------------------*/
/* Accordion
/*------------------------------------------------------------------------------*/

/*https://www.antimath.info/jquery/quick-and-simple-jquery-accordion/*/
$(document).find('.toggle').find('.toggle-content').css('display','none');
$(document).find('.toggle').eq(0).addClass('active').find('.toggle-content').css('display','block');
$(document).on('click', '.accordion .toggle-title',function(){
 
    $(this).siblings('.toggle-content').slideToggle('fast');
    $(this).parent().toggleClass('active');
    $(this).parent().siblings().children('.toggle-content:visible').slideUp('fast');
    $(this).parent().siblings().children('.toggle-content:visible').parent().removeClass('active');
});


/*------------------------------------------------------------------------------*/
/* twentytwenty[data-orientation]
/*------------------------------------------------------------------------------*/

$(function(){
      $(".twentytwenty-container[data-orientation!='vertical']").twentytwenty({default_offset_pct: 0.7});
      $(".twentytwenty-container[data-orientation='vertical']").twentytwenty({default_offset_pct: 0.3, orientation: 'vertical'});
    });


/*------------------------------------------------------------------------------*/
/* Isotope
/*------------------------------------------------------------------------------*/

    var $container = $('#isotopeContainer');

    // filter items when filter link is clicked
    $('#filters a').click(function(){
      var selector = $(this).attr('data-filter');
      $container.isotope({ filter: selector });
      return false;
    });

    var $optionSets = $('#filters li'),
        $optionLinks = $optionSets.find('a');

        $optionLinks.click(function(){
            var $this = $(this);
            // don't proceed if already selected
            if ( $this.hasClass('selected') ) {
              return false;
            }
            var $optionSet = $this.parents('#filters');
            $optionSet.find('.selected').removeClass('selected');
            $this.addClass('selected');

            // make option object dynamically, i.e. { filter: '.my-filter-class' }
            var options = {},
                key = $optionSet.attr('data-option-key'),
                value = $this.attr('data-option-value');
            // parse 'false' as false boolean
            value = value === 'false' ? false : value;
            options[ key ] = value;
            if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
              // changes in layout modes need extra logic
              changeLayoutMode( $this, options )
            } else {
              // otherwise, apply new options
              $container.isotope( options );
            }

            return false;
        });


    
/*------------------------------------------------------------------------------*/
/* Prettyphoto
/*------------------------------------------------------------------------------*/
$(function (jQuery) {

     // Normal link
    jQuery('a[href*=".jpg"], a[href*=".jpeg"], a[href*=".png"], a[href*=".gif"]').each(function(){
        if( jQuery(this).attr('target')!='_blank' && !jQuery(this).hasClass('prettyphoto') && !jQuery(this).hasClass('modula-lightbox') ){
            var attr = $(this).attr('data-gal');
            if (typeof attr !== typeof undefined && attr !== false && attr!='prettyPhoto' ) {
                jQuery(this).attr('data-rel','prettyPhoto');
            }
        }
    });     

    jQuery('a[data-gal^="prettyPhoto"]').prettyPhoto();
    jQuery('a.ttm_prettyphoto').prettyPhoto();
    jQuery('a[data-gal^="prettyPhoto"]').prettyPhoto();
    jQuery("a[data-gal^='prettyPhoto']").prettyPhoto({hook: 'data-gal'})

});
    

/*------------------------------------------------------------------------------*/
/* owlCarousel
/*------------------------------------------------------------------------------*/

// ===== Testimonial slide ==== 

    $(".testimonial-slide").owlCarousel({  
        loop:true,
        margin:0,
        smartSpeed: 3000,
        nav: $('.testimonial-slide').data('nav'),
        dots: $('.testimonial-slide').data('dots'), 
        autoplay: $('.testimonial-slide').data('auto'),
        responsive:{
            0:{
                items:1,
            },
            600:{
                items:1,
            },
            1000:{
                items: $('.testimonial-slide').data('item')
            }
        }
    });


// ===== Blog slide ==== 

    $(".blog-slide").owlCarousel({  
        autoplay: false,
        loop:true,
        margin:0,
        nav: $('.blog-slide').data('nav'),
        dots: $('.blog-slide').data('dots'),                     
        smartSpeed: 3000,
        responsive:{
            0:{
                items:1,
            },
            600:{
                items:2,
            },
            1000:{
                items: $('.blog-slide').data('item')
            }
        }
    });


// ===== Post slide ==== 

    $(".post-slide").owlCarousel({  
        loop:true,
        margin:0,
        nav: $('.post-slide').data('nav'),
        dots: $('.post-slide').data('dots'),                     
        autoplay: $('.post-slide').data('auto'),
        smartSpeed: 3000,
        responsive:{
            0:{
                items:1,
            },
            575:{
                items:2,
            },
            767:{
                items:3,
            },
            1000:{
                items: $('.post-slide').data('item')
            }
        }
    });


// ===== Team slide ==== 

    $(".team-slide").owlCarousel({  
        loop:true,
        margin:0,
        nav: $('.team-slide').data('nav'),
        dots: $('.team-slide').data('dots'),                     
        autoplay: $('.team-slide').data('auto'),
        smartSpeed: 3000,
        responsive:{
            0:{
                items:1,
            },
            480:{
                items:2,
            },
            768:{
                items:3
            },
            1200:{
                items: $('.team-slide').data('item')
            }
        }
    });


// ===== Clients-logo ==== 

$(".clients-slide").owlCarousel({ 
    margin: 0,
    loop:true,
    nav: $('.clients-slide').data('nav'),
    dots: $('.clients-slide').data('dots'),                     
    autoplay: $('.clients-slide').data('auto'),
    smartSpeed: 3000,
    responsive:{
        0:{
            items:1
        },
        480:{
            items:2
        },
        768:{
            items:4
        },
        992:{
            items: $('.clients-slide').data('item')
        }
    }    
});


// ===== Portfolio-slide ==== 

$(".portfolio-slide").owlCarousel({ 
    margin: 0,
    loop:true,
    nav: $('.portfolio-slide').data('nav'),
    dots: $('.portfolio-slide').data('dots'),                     
    autoplay: $('.portfolio-slide').data('auto'),
    smartSpeed: 3000,
    responsive:{
        0:{
            items:1
        },
        480:{
            items:2
        },
        991:{
            items:3
        },
        1000:{
           items: $('.portfolio-slide').data('item')
        }
    }    
});

// ===== Portfolio-img-slide ==== 

$(".portfolio-img-slide").owlCarousel({ 
    margin: 0,
    loop:true,
    nav: $('.portfolio-img-slide').data('nav'),
    dots: $('.portfolio-img-slide').data('dots'),                     
    autoplay: $('.portfolio-img-slide').data('auto'),
    smartSpeed: 3000,
    responsive:{
        0:{
            items:1
        },
        480:{
            items:2
        },
        991:{
            items:3
        },
        1000:{
           items: $('.portfolio-img-slide').data('item')
        }
    }    
});


jQuery( window ).load(function($) 
{    
    if( jQuery('body').hasClass('ttm-one-page-site') ){
        var sections = jQuery('.ttm-row, #tm-header-slider'),
        nav          = jQuery('.ttm-header-wrap, .menu'),
        nav_height   = jQuery('#site-navigation').data('sticky-height')-1;
        
        jQuery(window).on('scroll', function () {
                if( jQuery('body').scrollTop() < 5 ){
                    nav.find('a').parent().removeClass('active');  
                }                          
                var cur_pos = jQuery(this).scrollTop(); 
                sections.each(function() {
                    var top = jQuery(this).offset().top - (nav_height+1),
                    bottom = top + jQuery(this).outerHeight(); 
                    if (cur_pos >= top && cur_pos <= bottom) {                        
                        if( typeof jQuery(this) != 'undefined' && typeof jQuery(this).attr('id')!='undefined' && jQuery(this).attr('id')!='' ){
                            var mainThis = jQuery(this);                            
                            nav.find('a').removeClass('active');                       
                            jQuery(this).addClass('active');
                            var arr = mainThis.attr('id');                          
                            
                            // Applying active class
                            nav.find('a').parent().removeClass('active');
                            nav.find('a').each(function(){
                                var menuAttr = jQuery(this).attr('href').split('#')[1];                     
                                if( menuAttr == arr ){
                                    jQuery(this).parent().addClass('active');
                                }
                            })
                        }
                    }
                });
            //}
        });
        
        nav.find('a').on('click', function () {
            var $el = jQuery(this), 
            id = $el.attr('href');
            var arr=id.split('#')[1];     
            jQuery('html, body').animate({
                scrollTop: jQuery('#'+ arr).offset().top - nav_height
            }, 500);  
            return false;
        });
        
    }
    
} ); // END of  document.ready


/*------------------------------------------------------------------------------*/
/* Back to top
/*------------------------------------------------------------------------------*/

// ===== Scroll to Top ==== 
jQuery('#totop').hide();

jQuery(window).scroll(function() {
    "use strict";
    if (jQuery(this).scrollTop() >= 100) {        // If page is scrolled more than 50px
        jQuery('#totop').fadeIn(200);    // Fade in the arrow
        jQuery('#totop').addClass('top-visible');
    } else {
        jQuery('#totop').fadeOut(200);   // Else fade out the arrow
        jQuery('#totop').removeClass('top-visible');
    }
});

jQuery('#totop').click(function() {      // When arrow is clicked
    jQuery('body,html').animate({
        scrollTop : 0                       // Scroll to top of body
    }, 500);
    return false;
});


 $(function() {

    });

})(jQuery);