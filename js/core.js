/**
 * Author: Shadow Themes
 * Author URL: https://shadow-themes.com
 */
"use strict";

/* --- Anita Config --- */
const anita_config = {
    /* --- Header and Main Menu --- */

    // Main Menu config for quick and same result for all pages.
    // Use 'Label' : 'url' for menu items and 'Label' : { ... } for Submenus. Don't forget about commas after each item.
    main_menu: {
        'Portfolio': {
            'Video': 'video-showreels.html',
            'Drohnen-Fotografie': 'drohnen-fotografie.html',
            'Portraits': 'portrait-fotografie.html',
            'Panoramen': '360_grad_panoramen_mit_der_drohne.html',
            /* --- 'Zeitraffer': 'zeitraffer-die-schweiz-bei-nacht.html', --- */
            'Hoch- und Tiefbau': 'baustellen-fotografie.html',
            'Das Salzmehuus': 'salzmehuus-koelliken.html',
        },
        
        'Über mich': 'ueber-mich.html',
        'Kontakt': 'kontakt.html'
    },

    // Option to stick the header to the top of the page
    sticky_header: true,

    // Menu items appear delay in milliseconds
    fs_menu_delay: 100,

    /* --- Social Links --- */
    socials: {
        'facebook' : {
            'url': 'https://www.facebook.com/michael.mathias.kueng/',
            'label': 'Fb.'
        },
        'instagram' : {
            'url': 'https://www.instagram.com/michaelkueng/',
            'label': 'In.'
        },
        'vimeo' : {
            'url': 'https://vimeo.com/user10213120',
            'label': 'Vi.'
        },
        'youtube' : {
            'url': 'https://www.youtube.com/channel/UCmGIe_6FKyAjiBcT4hyYBsg',
            'label': 'Yt.'
        },
        
    },

    /* --- Content Features --- */
    // Page background Spotlight Effect
    spotlight: true,

    // Back to Top Button
    back2top: true,

    // Interractive Cursor
    int_cursor: true,

    /* --- Protection Options --- */
    // Right Click Protection
    disable_right_click: false,

    // Protect Images from Drag
    image_drag_protection: true,

    /* --- Localization --- */
    l10n: {
        // Footer Copyright string
        copyright: '<a href="mailto:kontakt@michaelkueng.ch">kontakt@michaelkueng.ch</a> | <a href="tel:0041788232359">+41 78 823 23 59</a> | <a href="https://wa.me/41788232359" target="_blank">Whatsapp</a>',

        // The message that appears when visitors try to open context menu
        rcp_message: 'Das Kontextmenü ist auf dieser Seite nicht verfügbar.',

        // The Button Label for Context Menu blocker
        rcp_button: 'Okay',

        // Back to Top Label
        b2t_label: 'Nach oben'
    }
}

/* --- Activate Preloader --- */
jQuery('body').append('<div class="anita-preloader-wrap"><div class="anita-preloader-spotlight anita-spotlight"></div></div>');
jQuery('body').addClass('is-loading');

/* --- Checking WebGL2 Availability --- */
function Anita_isWebGL2Available() {
	try {
		const canvas = document.createElement( 'canvas' );
		return !! ( window.WebGL2RenderingContext && canvas.getContext( 'webgl2' ) );
	} catch ( e ) {
		return false;
	}
}

/* --- Class: Pan Axis Class --- */
class Anita_PanAxis {
    constructor( sens ) {
        let this_class = this;
        this.xs = 0;
        this.xd = 0;
        this.ys = 0;
        this.yd = 0;
        this.ax = 0;
        this.sens = sens;

        document.addEventListener('touchstart', function(e) {
            this_class.xs = e.touches[0].clientX;
            this_class.ys = e.touches[0].clientY;
        }, false);

        document.addEventListener('touchmove', function(e) {
            if ( ! this_class.ax ) {
                // X
                if ( this_class.xs ) {
                    this_class.xd = this_class.xd + Math.abs( this_class.xs - e.touches[0].clientX );
                    this_class.xs = e.touches[0].clientX;
                }
                if ( this_class.ys ) {
                    this_class.yd = this_class.yd + Math.abs( this_class.ys - e.touches[0].clientY );
                    this_class.ys = e.touches[0].clientY;
                }

                // Check Axis
                if (this_class.xd > this_class.sens) {
                    this_class.ax = 'x';
				}
                if (this_class.yd > this_class.sens) {
                    this_class.ax = 'y';
				}
            }
        }, false);

        document.addEventListener('touchend', function(e) {
            // Reset Values
            this_class.xs = 0;
            this_class.xd = 0;
            this_class.ys = 0;
            this_class.yd = 0;
            this_class.ax = 0;
        }, false);
    }
    getAxis() {
        return this.ax;
    }
}
const anita_axis = new Anita_PanAxis( 10 );

/* --- Anita Clock --- */
class Anita_Clock {
	constructor(autoStart = true) {
		this.autoStart = autoStart;
		this.startTime = 0;
		this.oldTime = 0;
		this.elapsedTime = 0;
		this.running = false;
	}

	start() {
		this.startTime = this.now();
		this.oldTime = this.startTime;
		this.elapsedTime = 0;
		this.running = true;
	}

	stop() {
		this.getElapsedTime();
		this.running = false;
		this.autoStart = false;
	}

	getElapsedTime() {
		this.getDelta();
		return this.elapsedTime;
	}

	getDelta() {
		let diff = 0;

		if (this.autoStart && !this.running) {
			this.start();
			return 0;
		}

		if (this.running) {
			const newTime = this.now();
			diff = (newTime - this.oldTime) / 1000;
			this.oldTime = newTime;
			this.elapsedTime += diff;
		}

		return diff;
	}

    now() {
		return (typeof performance === 'undefined' ? Date : performance).now()
    }
}

/* --- Class: Lazy Loader --- */
class Anita_Lazy {
    constructor( options = {}) {
        let _self = this;
        this.items = new Array();
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
    			entries.forEach((entry) => {
    				if ( ! entry.isIntersecting ) {
    					return;
    				} else {
    					_self.preloadImage( entry.target );
    					_self.observer.unobserve( entry.target );
    				}
    			});
    		}, options);
        } else {
            this.observer = false;
        }
    }
    addItem( $el ) {
        let $item;
        if ($el instanceof jQuery) {
			$item = $el;
		} else {
			$item = jQuery($el);
		}
        if ( ! this.observer ) {
            $item.attr('src', $item.attr('data-src'));
        } else {
            $item.wrap('<div class="anita-lazy-wrapper"/>').removeClass('anita-lazy');
            if ( $item.attr('width') && $item.attr('height') ) {
                let r = $item.attr('height')/$item.attr('width'),
                    $p = $item.parent('.anita-lazy-wrapper');
                $p.height($p.width() * r);
            }
            this.observer.observe($item[0]);
        }
    }
    preloadImage( this_img ) {
        const src = this_img.getAttribute('data-src');
        if ( ! src ) {
			console.warn('Can not load image. No image src defined.');
			return;
		}
        let img = new Image();
        img.src = src;
        img.addEventListener('load', function(e) {
            this_img.src = src;
			jQuery(this_img).parent('.anita-lazy-wrapper').addClass('is-loaded').removeAttr('style');
            if ( jQuery(this_img).hasClass('anita-flat-carousel-image') && anita ) {
                anita.carousel.layout();
            }
            if ( jQuery(this_img).attr('data-id') && anita ) {
                anita.$el.brickwall[jQuery(this_img).attr('data-id')].layout();
            }
		});
    }
}

/* --- Class: Before and After --- */
class Anita_Before_After {
	constructor($obj) {
		if ($obj instanceof jQuery) {
			let this_class = this;
			this.$el = {
				$wrap: $obj,
				$before : jQuery('<div class="anita-before-after-img anita-before-img"/>').appendTo($obj),
				$after : jQuery('<div class="anita-before-after-img anita-after-img-wrap"/>').appendTo($obj),
                $divider : jQuery('<div class="anita-before-after-divider">\
                    <svg xmlns="http://www.w3.org/2000/svg" width="23.813" height="13.875" viewBox="0 0 23.813 13.875">\
                        <path d="M-5.062-15.937l1.125,1.125L-9.047-9.75H9.047L3.938-14.812l1.125-1.125,6.375,6.375L11.906-9l-.469.563L5.063-2.062,3.938-3.187,9.047-8.25H-9.047l5.109,5.063L-5.062-2.062l-6.375-6.375L-11.906-9l.469-.562Z" transform="translate(11.906 15.938)" fill="#fff"/>\
                    </svg>\
                </div>').appendTo($obj),
			};
			this.$el.$after.append(this_class.$el.$wrap.children('img').clone());
			this.offset = this.$el.$wrap.offset().left;
			this.size = this.$el.$wrap.width();
			this.current = 50;
			this.target = 50;
			this.isDown = false;

			this.$el.$before.css('background-image', 'url('+ this.$el.$wrap.attr('data-img-before') +')');
			this.$el.$after.children('img').wrap('<div class="anita-after-img"/>');
			this.$el.$after.children('.anita-after-img').css('background-image', 'url('+ this.$el.$wrap.attr('data-img-after') +')');

			// Mouse Events
			this.$el.$wrap.on('mousedown', function(e) {
				e.preventDefault();
				this_class.isDown = true;
			}).on('mousemove', function(e) {
				e.preventDefault();
				if (this_class.isDown) {
					let position = e.pageX - this_class.offset,
						newTarget = position/this_class.size;
					if (newTarget > 1) {
						newTarget = 1;
					}
					if (newTarget < 0) {
						newTarget = 0;
					}
					this_class.target = newTarget * 100;
				}
			}).on('mouseleave', function(e) {
				e.preventDefault();
				this_class.isDown = false;
			}).on('mouseup', function(e) {
				e.preventDefault();
				this_class.isDown = false;
			});

			// Touch Events
            this.$el.$wrap[0].addEventListener('touchstart', function(e) {
				this_class.isDown = true;
			}, false);
			this.$el.$wrap[0].addEventListener('touchmove', function(e) {
				let axis = anita_axis.getAxis();
                if ( 'x' == axis ) {
					e.preventDefault();
					if (this_class.isDown) {
						let position = e.touches[0].clientX - this_class.offset,
							newTarget = position/this_class.size;
						if (newTarget > 1) {
							newTarget = 1;
						}
						if (newTarget < 0) {
							newTarget = 0;
						}
						this_class.target = newTarget * 100;
					}
				}
			}, false);
			this.$el.$wrap[0].addEventListener('touchend', function(e) {
				this_class.isDown = false;
			}, false);

			// Window Events
			jQuery(window).on('resize', function() {
				this_class.layout();
				this_class.reset();
			}).on('load', function() {
				this_class.layout();
			});

			// Layout
			this.layout();

			// Run Animation
			this.requestAnimation();
		} else {
			return false;
		}
	}
	layout() {
		let this_class = this;
		this.offset = this.$el.$wrap.offset().left;
		this.size = this.$el.$wrap.width();
		this.$el.$after.children('.anita-after-img').width( this_class.$el.$wrap.width() ).height( this_class.$el.$wrap.height() );
	}
	reset() {
		this.current = 50;
		this.target = 50;
	}
	requestAnimation() {
		this.animation = requestAnimationFrame(() => this.animate());
	}
	animate() {
		this.current += ((this.target - this.current) * 0.1);
		this.$el.$after.css('width', parseFloat(this.current).toFixed(1) +'%');
		this.$el.$divider.css('left', parseFloat(this.current).toFixed(1) +'%');
		this.requestAnimation();
	}
}

/* --- Class: Anita (Core Class) --- */
class Anita {
    constructor ( cfg = false ) {
        let _self = this;

        // Default Option Values
        this.options = {
            logo_size: {
                w: 96,
                h: 40
            },
            // Header
            main_menu: false,
            sticky_header: true,
            fs_menu_delay: 100,

            // Content
            socials: false,
            spotlight: true,
            back2top: true,

            // Protection
            disable_right_click: true,
            image_drag_protection: true,

            // Interractive Cursor
            int_cursor: true,
            cursorHover: 'a, button, input[type="submit"], .anita-before-after, .anita-toggles-item--title, .anita-hover',
            cursorscrollEW: '.anita-scrollEW, .pswp__scroll-wrap, .owl-stage-outer',
            cursorscrollNS: '.anita-scrollNS',
            cursorFollow: '.anita-menu-toggler, .anita-back2top, .anita-socials-list a, .owl-dot, .anita-gallery-nav, .pswp__button',

            // Localization
            l10n: {
                copyright: '',
                rcp_message: 'Context menu is not allowed on this website',
                rcp_button: 'Got it!',
                b2t_label: 'Back to Top'
            }
		}

        // Apply Custom Config Values
        if ( cfg ) {
			for (const [key, value] of Object.entries(cfg)) {
				this.options[key] = value;
			}
		}

        // Detect Environment
        this.isTouchDevice = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
        this.iOSDevice = !!navigator.platform.match(/iPhone|iPod|iPad/);
        this.isFirefox = (navigator.userAgent.indexOf("Firefox") > -1) ? true : false;
        this.isChrome = (navigator.userAgent.indexOf("Chrome") > -1) ? true : false;

        // Anita Elements
        this.$el = {
            head: jQuery('head'),
            body: jQuery('body'),
            header: jQuery('header#anita-header'),
            nav: jQuery('nav.anita-nav'),
            main: jQuery('main.anita-main'),
            footer: jQuery('footer#anita-footer'),
            win: jQuery(window),
            brickwall: {}
        }

        // Define Links Exception
        this.linksException = [
            '.shadowcore-lightbox-link',
    		'.anita-lightbox-link',
    		'.comment-reply-link',
            '.anita-noanim-link'
        ];

        // Define Variables
        this.scrollLockPoint = jQuery(window).scrollTop();
        this.scrollLocked = false;

        this.init();
        this.init_page();

        // Back to Top
        if ( _self.options.back2top ) {
            _self.$el.b2t = jQuery('<a href="javascript:void(0)" class="anita-back2top"></a>')
                .appendTo(_self.$el.body)
                .wrap('<div class="anita-back2top-wrap">')
                .append('<span>' + _self.options.l10n.b2t_label + '</span>')
                .on('click', function(e) {
                    e.preventDefault();
                    jQuery('html, body').stop().animate( { scrollTop: 0 }, 500 );
                });
        }

        // Spotlight
        if ( _self.options.spotlight ) {
            _self.$el.body.append('<div class="anita-spotlight"/>');
        }

        // Events
        _self.$el.win.on('load', function() {
            _self.layout();
        }).on('resize', function() {
            _self.layout();
        }).on('scroll', function() {
            if ( _self.$el.win.scrollTop() > 40 ) {
                _self.$el.header.addClass('is-scrolled');
            } else {
                _self.$el.header.removeClass('is-scrolled');
            }
            if ( _self.scrollLocked ) {
                window.scrollTo({
                    top: _self.scrollLockPoint
                });
            } else {
                // Check Back 2 Top State
                if (_self.$el.b2t) {
                    if ( _self.$el.win.scrollTop() > window.innerHeight ) {
                        _self.$el.b2t.parent().addClass('is-visible');
                    } else {
                        _self.$el.b2t.parent().removeClass('is-visible');
                    }
                    if ( _self.$el.win.scrollTop() >= _self.maxScroll ) {
                        _self.$el.b2t.parent().addClass('is-fixed');
                    } else {
                        _self.$el.b2t.parent().removeClass('is-fixed');
                    }
                }
            }
        });

        // Keyboard Events
        jQuery(document).on('keyup', function(e) {
            if (e.keyCode == 27) {
                if ( _self.$el.body.hasClass('anita-show-menu') ) {
                    _self.scrollLocked = false;
                    _self.$el.body.removeClass('anita-show-menu');
                }
                if ( _self.$el.body.hasClass('anita-rcp-message-show') ) {
                    _self.$el.body.removeClass('anita-rcp-message-show');
                }
            }
        });
    }
    contentOrigin() {
        if ( this.$el.main.children('.anita-container').length ) {
            this.$el.main.children('.anita-container').css('transform-origin', '50% ' + (window.scrollY + 0.5 * window.innerHeight) + 'px');
        }
    }
    generateID() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
    inView( this_el ) {
		let rect = this_el.getBoundingClientRect()
		return (
			( rect.height > 0 || rect.width > 0) &&
			rect.bottom >= 0 &&
			rect.right >= 0 &&
			rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.left <= (window.innerWidth || document.documentElement.clientWidth)
		)
	}

    // Anita Init
    init() {
        let _self = this;

        // Max Scroll for Back to Top
        this.maxScroll = this.$el.body.height() - this.$el.footer.height() - this.$el.win.height();
        if (this.$el.b2t) {
            if (this.$el.win.scrollTop() >= this.maxScroll ) {
                this.$el.b2t.parent().addClass('is-fixed');
            }
            if ( this.$el.win.scrollTop() > window.innerHeight ) {
                this.$el.b2t.parent().addClass('is-visible');
            } else {
                this.$el.b2t.parent().removeClass('is-visible');
            }
        }

        // Right Click Protection
    	if ( _self.options.disable_right_click ) {
            // Append DOM
            _self.$el.body.append('\
            <div class="anita-rcp-message">\
                <div class="anita-rcpm-overlay"></div>\
                <div class="anita-rcpm-box">\
                    <p>'+ _self.options.l10n.rcp_message +'</p>\
                    <a href="#" class="anita-rcpm-close anita-button">'+ _self.options.l10n.rcp_button +'</a>\
                </div>\
            </div><!-- .anita-rcp-message -->');

            // Disable Context Menu
            jQuery(document).on('contextmenu', function (e) {
    			e.preventDefault();
    			if ( jQuery('.anita-rcp-message').length ) {
    				_self.$el.body.addClass('anita-rcp-message-show');
    			}
    		});
            if ( jQuery('.anita-rcp-message').length ) {
                jQuery('.anita-rcp-message').on('click', '.anita-rcpm-overlay, .anita-rcpm-box', function(e) {
                    e.preventDefault();
                    _self.$el.body.removeClass('anita-rcp-message-show');
                });
            }
    	}

    	// Image Drag Protection
    	if ( _self.options.image_drag_protection ) {
    		jQuery(document).on('mousedown', 'a', function (e) {
    			if ( jQuery(this).attr('href').indexOf('.png') || jQuery(this).attr('href').indexOf('.gif') || jQuery(this).attr('href').indexOf('.jpg') ) {
    				e.preventDefault();
    			}
    		});
    		jQuery(document).on('mousedown', 'img', function (e) {
    			e.preventDefault();
    		});
    	}

        // Header Options
        if ( _self.options.sticky_header ) {
            _self.$el.header.addClass('is-sticky');
        }


        // Set Retina Logo
        if ( jQuery('.anita-logo.is-retina').length ) {
            jQuery('.anita-logo.is-retina').each(function() {
                let $this = jQuery(this);
                $this.css({
                    'width' : $this.children('img').attr('width') ? (0.5 * $this.children('img').attr('width')) : _self.options.logo_size.w,
                    'height' : $this.children('img').attr('height') ? (0.5 * $this.children('img').attr('height')) : _self.options.logo_size.h,
                })
            });
        }

        // Main Menu Setup
        let anita_fullscreen_menu = function() {
            // Menu Numbers
            let count = 1;
            _self.$el.nav.children('ul.main-menu').children('li').each(function() {
                jQuery(this).addClass('is-hidden').children('a').prepend('<sup>'+ ( count < 10 ? '0' + count : count) +'.</sup>');
                count++;
            });

            // Sub-Menu Accordion
            if ( _self.$el.nav.find('.menu-item-has-children').length ) {
                _self.$el.nav.find('.menu-item-has-children').children('ul.sub-menu').slideUp(1);
                _self.$el.nav.on('click', '.menu-item-has-children > a', function(e) {
                    e.preventDefault();
                    jQuery(this).parent().toggleClass('is-open').children('ul.sub-menu').slideToggle(300);
                });
            }

            _self.$el.nav.show_menu = function() {
                // Show Menu Items Function
                let items_length = _self.$el.nav.children('ul.main-menu').children('li').length - 1;
                _self.$el.body.addClass('anita-show-menu');

                _self.scrollLockPoint = _self.$el.win.scrollTop();
                _self.scrollLocked = true;

                _self.$el.nav.children('ul.main-menu').children('li').each(function(i) {
                    let $this = jQuery(this);
                    setTimeout(function() {
                        $this.removeClass('is-hidden');
                        if ( i == items_length ) {
                            _self.$el.body.removeClass('is-locked');
                        }
                    }, i * _self.options.fs_menu_delay, $this);
                });
            }

            _self.$el.nav.hide_menu = function() {
                // Hide Menu Items Function
                let items_length = _self.$el.nav.children('ul.main-menu').children('li').length - 1;
                _self.scrollLocked = false;

                _self.$el.body.removeClass('is-locked');
                _self.$el.body.removeClass('anita-show-menu');
                _self.$el.nav.children('ul.main-menu').children('li').addClass('is-hidden');
            }

            // Menu Open/Close Event
            jQuery('.anita-menu-toggler').on('click', function() {
                _self.$el.body.addClass('is-locked');
                _self.contentOrigin();

                if (! _self.$el.body.hasClass('anita-show-menu') ) {
                    _self.$el.nav.show_menu();
                } else {
                    // Hide Items
                    _self.$el.nav.hide_menu();
                }
            });

            jQuery('.anita-menu-overlay').on('click', function() {
                _self.scrollLocked = false;
                _self.$el.body.removeClass('anita-show-menu');
            });
        }
        let anita_mobile_menu = function() {
            // Create Mobile Menu
            _self.$el.mobileMenu = jQuery('<div class="anita-mobile-menu-wrap anita-fullscreen-menu-wrap"/>').appendTo(_self.$el.body);
            _self.$el.mobileMenu.append(_self.$el.nav.clone());
            _self.$el.mobileMenuNav = _self.$el.mobileMenu.children('nav');
            _self.$el.mobileMenuNav.removeClass('anita-simple-nav');
            _self.$el.mobileMenu.append('<div class="anita-menu-overlay"></div>');

            // Items Counter
            _self.$el.mobileMenuNav.children('ul.main-menu').children('li').each(function(i) {
                i++;
                jQuery(this).addClass('is-hidden').children('a').prepend('<sup>'+ ( i < 10 ? '0' + i : i) +'.</sup>');
            });

            // Sub-Menu Accordion
            if ( _self.$el.mobileMenuNav.find('.menu-item-has-children').length ) {
                _self.$el.mobileMenuNav.find('.menu-item-has-children').children('ul.sub-menu').slideUp(1);
                _self.$el.mobileMenuNav.on('click', '.menu-item-has-children > a', function(e) {
                    e.preventDefault();
                    jQuery(this).parent().toggleClass('is-open').children('ul.sub-menu').slideToggle(300);
                });
            }

            // Show Hide Menu
            _self.$el.mobileMenuNav.show_menu = function() {
                // Show Menu Items Function
                let items_length = _self.$el.nav.children('ul.main-menu').children('li').length - 1;
                _self.$el.body.addClass('anita-show-menu');

                _self.scrollLockPoint = _self.$el.win.scrollTop();
                _self.scrollLocked = true;

                _self.$el.mobileMenuNav.children('ul.main-menu').children('li').each(function(i) {
                    let $this = jQuery(this);
                    setTimeout(function() {
                        $this.removeClass('is-hidden');
                        if ( i == items_length ) {
                            _self.$el.body.removeClass('is-locked');
                        }
                    }, i * _self.options.fs_menu_delay, $this);
                });
            }
            _self.$el.mobileMenuNav.hide_menu = function() {
                // Hide Menu Items Function
                let items_length = _self.$el.nav.children('ul.main-menu').children('li').length - 1;
                _self.scrollLocked = false;

                _self.$el.body.removeClass('is-locked');
                _self.$el.body.removeClass('anita-show-menu');
                _self.$el.mobileMenuNav.children('ul.main-menu').children('li').addClass('is-hidden');
            }

            // Mobile Menu Button
            _self.$el.header.find('.anita-menu-wrapper').append('<a href="#" class="anita-menu-toggler anita-mobile-menu-toggler"><i class="anita-menu-toggler-icon"></i></a>');
            _self.$el.header.on('click', '.anita-mobile-menu-toggler', function() {
                if (! _self.$el.body.hasClass('anita-show-menu') ) {
                    _self.$el.mobileMenuNav.show_menu();
                } else {
                    // Hide Items
                    _self.$el.mobileMenuNav.hide_menu();
                }
            });
        }

        // Create JS Menu
        let anita_js_menu = function() {
            if ( _self.options.main_menu !== null ) {
                let current_page = window.location.pathname.split("/").pop();
                if (current_page == '') {
                    current_page = 'index';
                }
                let $main_menu = jQuery('<ul class="main-menu"/>');
                let get_item = function(label, link) {
                    if ( link.indexOf(current_page) > -1 ) {
                        return jQuery('<li class="current-menu-item"><a href="'+ link +'">'+ label +'</a></li>');
                    } else {
                        return jQuery('<li><a href="'+ link +'">'+ label +'</a></li>');
                    }
                }
                let get_submenu = function(label, obj, $parent) {
                    let $li = jQuery('<li class="menu-item-has-children"/>').appendTo($parent);
                    $li.append('<a href="javascript:void(0)">' + label + '</a>');
                    let $submenu = jQuery('<ul class="sub-menu"/>').appendTo($li);

                    for ( const [label, link] of Object.entries(obj) ) {
                        if (typeof link === 'object') {
                            get_submenu(label, link, $submenu);
                        } else {
                            $submenu.append(get_item(label, link));
                        }
                    }
                }
                for ( const [label, link] of Object.entries(_self.options.main_menu) ) {
                    if (typeof link === 'object') {
                        get_submenu(label, link, $main_menu);
                    } else {
                        $main_menu.append(get_item(label, link));
                    }
                }

                // Set Current Menu Item
                if ( $main_menu.find('.current-menu-item').length ) {
                    $main_menu.find('.current-menu-item').each(function() {
                        jQuery(this).parents('li').addClass('current-menu-parent');
                    });
                }

                return $main_menu;
            } else {
                console.warn('No menu config found.');
            }
        }

        // Create JS Menu
        if ( _self.$el.nav.hasClass('anita-js-menu') ) {
            _self.$el.nav.append( anita_js_menu() );
        }

        // Setup Fullscreen Menu
        if ( ! _self.$el.nav.hasClass('anita-simple-nav') ) {
            anita_fullscreen_menu();
        } else {
            // Create Mobile Menu
            anita_mobile_menu();
        }

        // Social Links
        if ( jQuery('.anita-js-socials').length && _self.options.socials ) {
            jQuery('.anita-js-socials').each(function() {
                let $socials = jQuery('<ul class="anita-socials-list"/>').appendTo(this);
                for ( const [classname, item] of Object.entries(_self.options.socials) ) {
                    $socials.append('<li class="anita-socials--'+ classname +'"><a href="' + item.url + '">' + (item.label ? item.label : '') + '</a></li>');
                }
            });
        }

        // Copyright
        if ( jQuery('.anita-js-copyright').length ) {
            jQuery('.anita-js-copyright').each(function() {
                jQuery(this).html(_self.options.l10n.copyright);
            });
        }

        // PhotoSwipe Lightbox
        if ( jQuery('.anita-lightbox-link').length ) {
            if ( typeof PhotoSwipe !== 'function' ) {
                jQuery.getScript('js/lib/photoswipe.min.js').done(function() {
                    if ( _self.pswp ) {
                        _self.pswp.isReady = true;
                    }
                });
            }

            this.pswp = {
                isReady: typeof PhotoSwipe == 'function' ? true : false,
            	getMaxHeight : function() {
            		let maxHeight = _self.$el.win.height();
            		if ( jQuery('.pswp__caption').length ) {
            			maxHeight = maxHeight - jQuery('.pswp__caption').height();
            		}
            		if ( jQuery('.pswp__top-bar').length ) {
            			let $top_bar = jQuery('.pswp__top-bar'),
            				top_bar_height = $top_bar.height() + parseInt($top_bar.css('padding-top'), 10) + parseInt($top_bar.css('padding-bottom'), 10);

            			if ( jQuery('.pswp__caption').length ) {
            				maxHeight = maxHeight - top_bar_height;
            			} else {
            				maxHeight = maxHeight - top_bar_height*2;
            			}
            		}
            		return maxHeight;
            	},
            	// Resize Video
            	resizeVideo : function() {
            		let result = {};
            		if ( window.innerWidth/16 > this.getMaxHeight()/9 ) {
            			result.w = this.getMaxHeight() * 1.7778 * 0.8;
            			result.h = this.getMaxHeight() * 0.8;
            		} else {
            			result.w = window.innerWidth * 0.8;
            			result.h = window.innerWidth * 0.5625 * 0.8;
            		}
            		return result;
            	},
            	gallery : Array(),
            	dom : jQuery('\
            	<!-- Root element of PhotoSwipe. Must have class pswp. -->\
            	<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">\
            		<div class="pswp__bg"></div><!-- PSWP Background -->\
            		\
            		<div class="pswp__scroll-wrap">\
            			<div class="pswp__container">\
            				<div class="pswp__item"></div>\
            				<div class="pswp__item"></div>\
            				<div class="pswp__item"></div>\
            			</div><!-- .pswp__container -->\
            			\
            			<div class="pswp__ui pswp__ui--hidden">\
            				<div class="pswp__top-bar">\
            					<!--  Controls are self-explanatory. Order can be changed. -->\
            					<div class="pswp__counter"></div>\
            					\
            					<button class="pswp__button pswp__button--close anita-pswp-close" title="Close (Esc)">\
            						<i></i>\
            					</button>\
            					\
            					<div class="pswp__preloader">\
            						<div class="pswp__preloader__icn">\
            						  <div class="pswp__preloader__cut">\
            							<div class="pswp__preloader__donut"></div>\
            						  </div><!-- .pswp__preloader__cut -->\
            						</div><!-- .pswp__preloader__icn -->\
            					</div><!-- .pswp__preloader -->\
            				</div><!-- .pswp__top-bar -->\
            				\
            				<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">\
            					<div class="pswp__share-tooltip"></div>\
            				</div><!-- .pswp__share-modal -->\
            				\
            				<button class="pswp__button anita-pswp-nav anita-pswp-prev pswp__button--arrow--left" title="Previous (arrow left)"></button>\
            				<button class="pswp__button anita-pswp-nav anita-pswp-next pswp__button--arrow--right" title="Next (arrow right)"></button>\
            				\
            				<div class="pswp__caption">\
            					<div class="pswp__caption__center"></div>\
            				</div><!-- .pswp__caption -->\
            			</div><!-- .pswp__ui pswp__ui--hidden -->\
            		</div><!-- .pswp__scroll-wrap -->\
            	</div><!-- .pswp -->').appendTo( _self.$el.body )
            };

            _self.$el.body.on('click', '.pswp__scroll-wrap', function(e) {
                if ( _self.pswp.lightbox ) {
                    _self.pswp.lightbox.close();
                }
            });
            _self.$el.body.on('click', '.anita-pswp-image-wrap', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
            _self.$el.body.on('click', '.pswp__scroll-wrap button, .pswp__scroll-wrap a, .pswp__scroll-wrap img', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });

            jQuery(document).on('click', '.anita-lightbox-link', function(e) {
        		e.preventDefault();
                if (typeof PhotoSwipe == 'function') {
            		let $this = jQuery(this),
            			this_index = parseInt($this.attr('data-count'), 10),
            			this_gallery = $this.attr('data-gallery') ? $this.attr('data-gallery') : 'default',
            			this_options = {
            				index: this_index,
            				history: false,
            				bgOpacity: 0.9,
            				showHideOpacity: true,
            				getThumbBoundsFn: function(index) {
            					var pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
            						rect = $this[0].getBoundingClientRect();

            					return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            				},
            			};

            		_self.pswp.lightbox = new PhotoSwipe( _self.$el.body.find('.pswp')[0], PhotoSwipeUI_Default, _self.pswp.gallery[this_gallery], this_options );
            		_self.pswp.lightbox.init();

            		// Init video (if is video slide)
            		if ($this.attr('data-type') !== 'image') {
            			let $this_video = jQuery(_self.pswp.lightbox.container).find('[data-src="'+ $this.attr('href') +'"]');
            			$this_video.addClass('is-inview').width(_self.pswp.resizeVideo().w).height(_self.pswp.resizeVideo().h);
            			if ( 'video' == $this.attr('data-type') ) {
            				if ( $this_video.children('video').length ) {
            					$this_video.children('video').attr('autoplay', true);
            				}
            			} else {
            				if ( $this_video.children('iframe').length ) {
                                $this_video.children('iframe').attr('src', $this_video.attr('data-player-src')+'?controls=1&amp;loop=0&amp;autoplay=1&amp;muted=1');
            				}
            			}
            		}

            		// Check for videos in view
            		_self.pswp.lightbox.listen('resize', function() {
            			if ( jQuery(_self.pswp.lightbox.container).find('.anita-pswp-media--video').length ) {
            				jQuery(_self.pswp.lightbox.container).find('.anita-pswp-media--video').width(_self.pswp.resizeVideo().w).height(_self.pswp.resizeVideo().h);
            			}
            			if ( jQuery(_self.pswp.lightbox.container).find('.anita-pswp-media--iframe').length ) {
            				jQuery(_self.pswp.lightbox.container).find('.anita-pswp-media--iframe').width(_self.pswp.resizeVideo().w).height(_self.pswp.resizeVideo().h);
            			}
            		});

            		_self.pswp.lightbox.listen('beforeChange', function() {
                        // Self-hosted Video
            			if ( jQuery(_self.pswp.lightbox.container).find('.anita-pswp-media--video').length ) {
            				jQuery(_self.pswp.lightbox.container).find('.anita-pswp-media--video').width(_self.pswp.resizeVideo().w).height(_self.pswp.resizeVideo().h);
            				jQuery(_self.pswp.lightbox.container).find('.anita-pswp-media--video').each(function() {
            					if ( _self.inView( this ) ) {
            						jQuery(this).addClass('is-inview');
            						if ( jQuery(this).children('video').length ) {
            							jQuery(this).children('video')[0].play();
            						}
            					} else {
            						jQuery(this).removeClass('is-inview');
            						if ( jQuery(this).children('video').length ) {
            							jQuery(this).children('video')[0].pause();
            						}
            					}
            				});
            			}
                        // Embedded Video
            			if ( jQuery(_self.pswp.lightbox.container).find('.anita-pswp-media--iframe').length ) {
            				jQuery(_self.pswp.lightbox.container).find('.anita-pswp-media--iframe').width(_self.pswp.resizeVideo().w).height(_self.pswp.resizeVideo().h);
            				jQuery(_self.pswp.lightbox.container).find('.anita-pswp-media--iframe').each(function() {
            					let $this_video = jQuery(this);
            					if ( _self.inView( this ) ) {
            						$this_video.addClass('is-inview');
                                    $this_video.children('iframe').attr('src', $this_video.attr('data-player-src')+'?controls=1&amp;loop=0&amp;autoplay=1&amp;muted=1');
            					} else {
            						$this_video.removeClass('is-inview');
            						$this_video.children('iframe').attr( 'src', jQuery(this).attr('data-src') + '?controls=1&amp;loop=0' );
            					}
            				});
            			}
            		});

            		_self.pswp.lightbox.listen('close', function() {
            			// Close ligthbox
            			if ( jQuery(_self.pswp.lightbox.container).find('.anita-pswp-media--iframe').length ) {
            				jQuery(_self.pswp.lightbox.container).find('.anita-pswp-media--iframe').each(function() {
            					if ( jQuery(this).children('iframe').length ) {
            						jQuery(this).children('iframe').attr( 'src', jQuery(this).attr('data-src') + '?controls=1&amp;loop=0' );
            					}
            				});
            			}
            		});

            		_self.pswp.lightbox.listen('unbindEvents', function() {
            			// Unbind Events after close
            		});
            		_self.pswp.lightbox.listen('destroy', function() {
            			// Destroy after unbind close
            			if ( jQuery(_self.pswp.lightbox.container).find('.anita-pswp-media--video').length ) {
            				jQuery(_self.pswp.lightbox.container).find('.anita-pswp-media--video').each(function() {
            					if ( jQuery(this).children('video').length ) {
            						jQuery(this).children('video')[0].pause();
            					}
            				});
            			}
            		});
                } else {
                    console.warn('PhotoSwipe not loaded');
                }
        	});
        }

        // Interractive Cursor
        if ( _self.options.int_cursor ) {
            this.cursor = {
                $el: jQuery('<div class="anita-cursor"/>').appendTo( _self.$el.body ),
                position: {
                    x: window.innerWidth * 0.5,
                    y: window.innerHeight * 0.5,
                    lerpX: window.innerWidth * 0.5,
                    lerpY: window.innerHeight * 0.5,
                },
                isActive: false,
                isFixed: false,
                isTouch: false,
                timer: new Anita_Clock,
                prevTime: 0,
                init: function() {
                    let _cursor = this;

                    // Append UI
                    this.$el.append('<div class="anita-cursor--pointer"/></div>');
                    this.$el.append('<div class="anita-cursor--spiner"/>');
                    this.$el.append('<div class="anita-cursor--arrowsEW"/>');
                    this.$el.append('<div class="anita-cursor--arrowsNS"/>');

                    // Set cusror from previous page
                    if ( window.localStorage.getItem('anita_prev_cursor') !== null ) {
                        let prevCursor = JSON.parse(window.localStorage.getItem('anita_prev_cursor'));
                        if ( prevCursor.state === true ) {
                            _cursor.$el.addClass('is-init');
                            _cursor.isActive = true;
                            _cursor.position = prevCursor.position;
                        }
                    }

                    // Events
                    jQuery(document)
                    .on('touchstart', function(e) {
                        _cursor.isTouch = true;
                        _cursor.isActive = false;
                        _cursor.$el.removeClass('is-init');
                        cancelAnimationFrame( _cursor.anim );
                    })
                    .on('mouseenter', function(e) {
                        if ( ! _cursor.isTouch ) {
                            _cursor.isActive = true;
                            _cursor.position.x = e.clientX;
                            _cursor.position.y = e.clientY;
                            _cursor.$el.addClass('is-init');
                            _cursor.anim = requestAnimationFrame( () =>  _cursor.render() );
                        }
                    })
                    .on('mousemove', function(e) {
                        if (_cursor.isActive) {
                            _cursor.position.x = e.clientX;
                            _cursor.position.y = e.clientY;
                            if (!_cursor.$el.hasClass('is-init')) {
                                _cursor.$el.addClass('is-init');
                            }
                        }
                    })
                    .on('mouseleave', function(e) {
                        _cursor.$el.removeClass('is-init');
                        cancelAnimationFrame( _cursor.anim );
                    })
                    .on('mouseenter', _self.options.cursorHover, function() {
                        if (_cursor.isActive) {
                            _cursor.setState('is-hover');
                            jQuery(this).on('mouseleave', function() {
                                _cursor.unsetState('is-hover');
                            });
                        }
                    })
                    .on('mouseenter', _self.options.cursorscrollEW, function() {
                        if (_cursor.isActive) {
                            _cursor.setState('is-scrollEW');
                            jQuery(this).on('mouseleave', function() {
                                _cursor.unsetState('is-scrollEW');
                            });
                        }
                    })
                    .on('mouseenter', _self.options.cursorscrollNS, function() {
                        if (_cursor.isActive) {
                            _cursor.setState('is-scrollNS');
                            jQuery(this).on('mouseleave', function() {
                                _cursor.unsetState('is-scrollNS');
                            });
                        }
                    });

                    this.anim = requestAnimationFrame(() =>  this.render());
                },
                setState: function( state = '') {
                    this.$el.addClass(state);
                },
                unsetState: function( state = false) {
                    if (state) {
                        if ('all' == state) {
                            this.$el.removeAttr('class').addClass('anita-cursor is-init');
                        } else {
                            this.$el.removeClass(state);
                        }
                    }
                },
                render: function() {
                    if (this.isActive) {
                        let _cursor = this;
                        this.anim = requestAnimationFrame( () =>  this.render() );

                        const elapsedTime = this.timer.getElapsedTime();
                		const deltaTime = elapsedTime - this.prevTime;
                		this.prevTime = elapsedTime;

                        this.position.lerpX += (this.position.x - this.position.lerpX ) * 10 * deltaTime;
        				this.position.lerpY += (this.position.y - this.position.lerpY) * 10 * deltaTime;
                        this.$el.css('transform', 'translate('+ this.position.lerpX +'px, '+ this.position.lerpY +'px)');
                    }
                }
            }
            this.cursor.init();
        } else {
            this.cursor = false;
        }

        // Cursor Follow
        jQuery(document).on('mousemove', _self.options.cursorFollow, function(e) {
            if ( ! _self.isTouchDevice ) {
                let dim = this.getBoundingClientRect(),
                    x = e.clientX - dim.x - 0.5 * dim.width,
                    y = e.clientY - dim.y - 0.5 * dim.height;
                jQuery(this).css('transform', 'translate(' + (x * 0.33) + 'px, '+ (y * 0.33) +'px) scale(1.1)');
                jQuery(this).on('mouseleave', function() {
                    jQuery(this).removeAttr("style");
                });
            }
        });

        // Contact Form
        if ( jQuery('.anita-contact-form').length ) {
            jQuery('.anita-contact-form').each(function() {
                let $form = jQuery(this),
                    $response = $form.find('.anita-contact-form__response'),
                    formData,
                    flocker = {
            			field_changed:	 false,
            			field_interract: false,
            		};

                $form.on('keyup', 'input, textarea', function() {
                    flocker.field_interract = true;
                    $response.text('');
                });
                $form.on('change', 'input, textarea', function() {
                    flocker.field_changed = true;
                    $response.text('');
                });
                $form.on('touchenter', 'input, textarea', function() {
                    flocker.field_interract = true;
                    $response.text('');
                });
                $form.on('focus', 'input, textarea', function() {
                    flocker.field_interract = true;
                    $response.text('');
                });

                $form.on('submit', function(e) {
                    e.preventDefault();
                    if ( flocker.field_changed && flocker.field_interract ) {
                        // Send Contact Form
                        if ( _self.cursor ) {
                            $form.addClass('is-busy');
                            _self.cursor.setState('is-busy');
                        }
                        formData = $form.serialize();
                        jQuery.ajax({
    						type: 'POST',
    						url: $form.attr('action'),
    						data: formData
    					})
                        .done(function(response) {
    						$form.removeClass('is-busy');
                            if ( _self.cursor ) {
                                _self.cursor.unsetState('is-busy');
                            }
    						$response.empty().removeClass('anita-alert-danger').addClass('anita-alert-success');
    						$response.html('<span>' + response + '</span>');
    						$form.find('input:not([type="submit"]), textarea').val('');
    						flocker.field_changed = false;
                            flocker.field_interract = false;
    					})
    					.fail(function(data) {
                            $form.removeClass('is-busy');
                            if ( _self.cursor ) {
                                _self.cursor.unsetState('is-busy');
                            }
                            $response.empty().removeClass('anita-alert-success').addClass('anita-alert-danger');
    						$response.html('<span>' + data.responseText + '</span>');
                            $form.addClass('is-error');
                            setTimeout(function() {
                                $form.removeClass('is-error');
                            }, 500, $form);
                            flocker.field_changed = false;
                            flocker.field_interract = false;
    					});
                    } else {
                        // Fil by script detected
                        $response.text($form.attr('data-fill-error'));
                        $form.addClass('is-error');
                        setTimeout(function() {
                            $form.removeClass('is-error');
                        }, 500, $form);
                    }
                })
            });
        }

        // Preloader
        jQuery(document).ready(function() {
            _self.contentOrigin();
            setTimeout(function() {
                _self.$el.body.removeClass('is-loading');
                _self.$el.body.addClass('is-loaded');

                //  Animate on Scroll
                AOS.init({
                    once: true
                });
            }, 500);
        });

        // Link Click Event
        const anita_checkImageURL = function( url ) {
            return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
        }
        const anita_checkURL = function( $el ) {
            let this_href = $el.attr('href'),
                result = true;

			if ( this_href.indexOf('javascript') === 0 ) {
				result = false;
			} else if ( this_href == '#' ) {
				result = false;
			} else if ( $el.attr('target') && '_blank' == $this.attr('target') ) {
				result = false;
			} else if ( this_href.indexOf('elementor-action') > -1 ) {
				result = false;
			} else if ( $el.is('[download]') ) {
				result = false;
			} else if ( this_href.indexOf('tel:') > -1 || this_href.indexOf('mailto:') > -1 ) {
				result = false;
			} else if ( $el.attr('data-elementor-open-lightbox') == 'yes') {
                result = false;
            } else if ( $el.is('#cancel-comment-reply-link') ) {
				result = false;
			} else if ( anita_checkImageURL(this_href) ) {
                result = false;
            } else if ( this_href.indexOf('#') > -1 ) {
                if ($el[0].pathname == window.location.pathname &&
                    $el[0].protocol == window.location.protocol &&
                    $el[0].host == window.location.host) {
                    if ( _self.$el.main.find($el[0].hash).length ) {
                        let scrollPos = _self.$el.main.find($el[0].hash).offset().top - _self.$el.header.height() * 2;
                        _self.$el.body.addClass('is-locked');
                        if ( _self.cursor ) {
                            _self.cursor.setState('is-busy');
                        }
                        jQuery('html, body').stop().animate({scrollTop: scrollPos}, 300, function() {
                            _self.$el.body.removeClass('is-locked');
                            if ( _self.cursor ) {
                                _self.cursor.unsetState('is-busy');
                            }
                        });
                    }
                    return false;
                }
            } else {
                jQuery(_self.linksException).each(function() {
                    if ( $el.is(this) ) {
                        result = false;
                    }
                });
            }

            return result;
        }
        jQuery(document).on('click', 'a', function(e) {
            let $this = jQuery(this);
            if ( anita_checkURL( $this ) ) {
                e.preventDefault();
                // Check if Back From Album
                if ($this.hasClass('anita-albums-back')) {
                    window.localStorage.setItem('anita_back_from_album', true);
                }

                // Animation
                _self.contentOrigin();
                _self.$el.body.addClass('anita-unload');

                // Remember Cursor State
                if ( _self.cursor ) {
                    _self.cursor.unsetState('all');
                    _self.cursor.setState('is-busy');
                    let prevCursor = {
                        state: _self.cursor.isActive,
                        position: _self.cursor.position
                    }
                    window.localStorage.setItem('anita_prev_cursor', JSON.stringify(prevCursor));
                }

                // Go to URL
                setTimeout(function() {
                    window.location = $this.attr('href');
                }, 500, $this);
            }
        });

        // Firefox Back Button Fix
        window.onunload = function(){};

        // Safari Back Button Fix
        jQuery(window).on('pageshow', function(event) {
            if ( _self.$el.body.hasClass('anita-unload') ) {
        		_self.$el.body.removeClass('anita-unload');
        	}
            if ( _self.$el.body.hasClass('anita-show-menu') ) {
        		_self.$el.body.removeClass('anita-show-menu');
        	}
        });
    }

    // Anita Init Page
    init_page() {
        let _self = this;

        // Check for Scrolled Header
        if ( _self.$el.win.scrollTop() > 40) {
            _self.$el.header.addClass('is-scrolled');
        } else {
            _self.$el.header.removeClass('is-scrolled');
        }

        // Album Listing URL
        if ( _self.$el.main.find('.anita-albums-listing').length ) {
            window.localStorage.setItem('anita_listing_url', window.location.href);
        }
        if (_self.$el.main.find('.anita-albums-back').length) {
            _self.$el.main.find('.anita-albums-back').each(function() {
                let $this = jQuery(this);
                if ( $this.attr('href') == '#') {
                    if ( window.localStorage.getItem('anita_listing_url') !== null ) {
                        jQuery('.anita-albums-back').attr('href', window.localStorage.getItem('anita_listing_url'));
                    } else {
                        jQuery('.anita-albums-back').remove();
                    }
                }
            });
        }

        // Change all # to void(0)
    	jQuery('a[href="#"]').each(function() {
    		jQuery(this).attr('href', 'javascript:void(0)');
    	});

        // Anita Lazy Loading
        if ( jQuery('.anita-lazy').length ) {
            if ( ! _self.lazyLoader ) {
                _self.lazyLoader = new Anita_Lazy();
            }
            jQuery('.anita-lazy').each(function() {
                _self.lazyLoader.addItem(this);
            });
        }

        // Item Background
    	if (jQuery('.anita-data-background[data-src]:not(.is-loaded)').length) {
    		jQuery('.anita-data-background[data-src]:not(.is-loaded)').each(function() {
                let $this = jQuery(this);
                $this.css('background-image', 'url('+ $this.attr('data-src') +')').addClass('is-loaded');
    		});
    	}

        // Page Background
    	if (jQuery('.anita-page-background[data-src]:not(.is-loaded)').length) {
    		jQuery('.anita-page-background[data-src]:not(.is-loaded)').each(function() {
                let $this = jQuery(this);
                if ($this.hasClass('is-video')) {
                    $this.append('<video src="'+ $this.attr('data-src') +'" webkit-playsinline="true" playsinline="true" muted autoplay loop/>').addClass('is-loaded');
                } else {
                    $this.css('background-image', 'url('+ $this.attr('data-src') +')').addClass('is-loaded');
                }
    			if ($this.attr('data-opacity')) {
                    if ( $this.hasClass('is-video') && _self.isChrome ) {
                        let op = $this.attr('data-opacity'),
                            f = 2.5;
                        if ( op < 0.1 ) {
                            f = 4;
                        }
                        let nOp = f * (1 - op) * op;
                        if (nOp < op) {
                            nOp = op;
                        }
                        if ( op > 0 ) {
                            $this.css('opacity', nOp);
                        } else {
                            $this.css('opacity', jQuery(this).attr('data-opacity'));
                        }
                    } else {
                        $this.css('opacity', jQuery(this).attr('data-opacity'));
                    }
                }
    		});
    	}

        // Inline Opacity
    	if (jQuery('[data-opacity]:not(.is-loaded)').length) {
    		jQuery('[data-opacity]').each(function() {
    			jQuery(this).css( 'opacity', jQuery(this).attr('data-opacity') ).addClass('is-loaded');
    		});
    	}

        // Form Fields
        jQuery('input:not(.is-init):not([type="submit"]):not([type="reset"]):not([type="button"]), textarea:not(.is-init)').each(function() {
            let $this = jQuery(this);
            $this.addClass('is-init').wrap('<div class="anita-input-wrap"/>');
            let $parent = $this.parent('.anita-input-wrap');
            if ($this.attr('placeholder')) {
                $this.before('<span class="anita-input-label">'+ $this.attr('placeholder') +'</span>').attr('placeholder', '');
            }
            if ( $this.val() !== '') {
                $parent.addClass('is-valued');
            } else {
                $parent.removeClass('is-valued');
            }
            $this.on('focus', function(){
                $parent.addClass('is-focus');
                $parent.addClass('is-valued');
            }).on('blur', function() {
                $parent.removeClass('is-focus');
                if ( $this.val() !== '') {
                    $parent.addClass('is-valued');
                } else {
                    $parent.removeClass('is-valued');
                }
            }).on('keyUp', function() {

            });
        });

        // Price Item Cents
        if ( jQuery('.anita-price-item--price').length ) {
            jQuery('.anita-price-item--price').each(function() {
                let $this = jQuery(this);
                if ( ! $this.children().length && $this.text().indexOf('.') ) {
                    let text = $this.text().split('.');
                    if ( text.length == 2 ) {
                        $this.html(text[0] + '.<sup>' + text[1] + '</sup>');
                    }
                }
            });
        }

        // Toggles Element
        if ( jQuery('.anita-toggles-item:not(.is-init)').length ) {
            jQuery('.anita-toggles-item:not(.is-init)').each(function() {
                let $this = jQuery(this);
                $this.addClass('is-init');
                $this.children('.anita-toggles-item--content').slideUp(1);
                $this.on('click', '.anita-toggles-item--title', function() {
                    jQuery(this).toggleClass('is-active');
                    $this.children('.anita-toggles-item--content').slideToggle(300);
                });
            });
        }

        // Counter
        if ( jQuery('.anita-counter:not(.is-init)').length ) {
            _self.counter_count = function( $this ) {
                let $counter = $this.children('.anita-counter-number');
                $this.addClass('is-done');
                $counter.prop('Counter', 0).animate({
                    Counter: $counter.text()
                }, {
                    duration: parseInt($this.attr('data-delay'), 10),
                    easing: 'swing',
                    step: function (now) {
                        $counter.text(Math.ceil(now));
                    }
                });
            }
            _self.counter_observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!jQuery(entry.target).hasClass('is-done')) {
                        if(entry.isIntersecting) {
                            jQuery(entry.target).addClass('is-done');
                            _self.counter_count(jQuery(entry.target));
                            _self.counter_observer.unobserve(entry.target);
                        }
                    }
                });
            });
            jQuery('.anita-counter:not(.is-init)').each(function() {
                let $this = jQuery(this);
                $this.addClass('is-init');

                if ('IntersectionObserver' in window) {
                    _self.counter_observer.observe(this);
                } else {
                    _self.counter_count( $this );
                }
            });
        }

        // OWL Carousel
        if ( jQuery('.anita-owl-container:not(.is-init)').length ) {
            let anita_owl_defaults = {
                loop: true,
                center: false,
                nav: false,
                dots: true,
                dotsEach: true,
                autoHeight: true,
                autoplay: false,
                responsive: {
					0: {
						items: 1,
						margin: 20,
					},
					740: {
						items: 2,
						margin: 30,
					},
                    960: {
                        items: 3,
						margin: 30,
                    },
					1200: {
						items: 3,
						margin: 40,
					}
				},
            }
            let anita_init_owl = function() {
                jQuery('.anita-owl-container:not(.is-init)').each(function() {
                    let $this = jQuery(this),
                        this_options = anita_owl_defaults;

                    if ( $this.attr('data-options') ) {
                        for (const [key, value] of Object.entries($this.data('options'))) {
    						this_options[key] = value;
    					}
                    }
                    $this.owlCarousel(this_options);
                });
            }
            if ( typeof jQuery.fn.owlCarousel == "undefined" ) {
                jQuery.getScript('js/lib/owl.carousel.min.js').done(function() {
                    anita_init_owl();
                });
            } else {
                anita_init_owl();
            }
        }

        // Testimonials
        if ( jQuery('.anita-testimonials-grid:not(.is-init):not(.disable-hovers)').length ) {
            jQuery('.anita-testimonials-grid:not(.is-init)').each(function() {
                let $this = jQuery(this);
                $this.addClass('is-init');
                $this.on('mouseenter', '.anita-testimonials-item', function() {
                    if ( ! _self.isTouchDevice ) {
                        $this.addClass('is-hover');
                        jQuery(this).addClass('is-hover');
                    }
                }).on('mouseleave', '.anita-testimonials-item', function() {
                    $this.removeClass('is-hover');
                    jQuery(this).removeClass('is-hover');
                })
            });
        }

        // Grid Works Fade on Hover
        if ( jQuery('.anita-item-fade-hover:not(.is-init)').length ) {
            jQuery('.anita-item-fade-hover:not(.is-init)').each(function() {
                let $this = jQuery(this);
                $this.addClass('is-init');
                $this.children().children().on('mouseenter', function() {
                    if ( ! _self.isTouchDevice ) {
                        $this.addClass('is-hover');
                        jQuery(this).addClass('is-hover');
                    }
                }).on('mouseleave', function() {
                    $this.removeClass('is-hover');
                    jQuery(this).removeClass('is-hover');
                })
            });
        }

        // Masonry Grid
        if ( jQuery('.anita-masonry:not(.brickwall-grid)').length ) {
            let anita_init_brickwall = function() {
                jQuery('.anita-masonry:not(.brickwall-grid)').each(function() {
                    let this_id = _self.generateID()
                    _self.$el.brickwall[this_id] = new Anita_BrickWall( jQuery(this) );
                    jQuery(this).find('img').attr('data-id', this_id);
                });
            }
            if ( typeof Anita_BrickWall !== 'function' ) {
                jQuery.getScript('js/anita-brickwall.js').done(function() {
                    anita_init_brickwall();
                });
            } else {
                anita_init_brickwall();
            }
        }

        // Justified Grid
        if ( jQuery('.anita-justified-grid:not(.is-init)').length ) {
            let anita_justified_defaults = {
                rowHeight : 320,
                captions: false,
                lastRow : 'nojustify',
                margins : 20
            };
            let anita_init_justified = function() {
                jQuery('.anita-justified-grid:not(.is-init)').each(function() {
                    let $this = jQuery(this);
                    $this.justifiedGallery(anita_justified_defaults).addClass('is-init');
                    if ($this.hasClass('anita-justified-zoom-hover')) {
                        $this.on('mouseenter', 'a', function() {
                            if ( ! _self.isTouchDevice ) {
                                $this.addClass('is-hovered');
                                jQuery(this).addClass('is-hovered');
                            }
                        }).on('mouseleave', 'a', function() {
                            jQuery(this).removeClass('is-hovered');
                        }).on('mouseleave', function() {
                            $this.removeClass('is-hovered');
                        });
                    }
                });
            }
            if ( typeof jQuery.fn.justifiedGallery == "undefined" ) {
                jQuery.getScript('js/lib/jquery.justifiedGallery.min.js').done(function() {
                    anita_init_justified();
                });
            } else {
                anita_init_justified();
            }
        }

        // Init PSWP Galleries
        if ( jQuery('.anita-lightbox-link').length ) {
            _self.pswp.gallery = Array();
            jQuery('.anita-lightbox-link').each(function() {
                let $this = jQuery(this),
                    this_item = {},
                    this_gallery = $this.attr('data-gallery') ? $this.attr('data-gallery') : 'default';

                // Get Slide Type
                if ( $this.attr('data-type') && $this.attr( 'data-type' ) !== 'image' ) {
        			// Video Slide
        			if ( 'video' == $this.attr('data-type') ) {
        				this_item.html = '\
        				<div class="anita-pswp-media--video" data-src="' + $this.attr('href') + '">\
        					<video src="' + $this.attr('href') + '" controls webkit-playsinline="true" playsinline="true"></video>\
        				</div>';
        			} else {
                        let this_type, this_link;
                        if ( $this.attr('href').indexOf('imeo.com') > 0 ) {
                            let href_split = $this.attr('href').split('/');
                            this_type = 'vimeo';
                            this_link = 'https://player.vimeo.com/video/' + (href_split[href_split.length - 1].length ? href_split[href_split.length - 1] : href_split[href_split.length - 2]);
                        } else if ( $this.attr('href').indexOf('outu') > 0 ) {
                            this_type = 'youtube';
                            let href_split;
                            if ($this.attr('href').indexOf('v=') > 0){
                                href_split = $this.attr('href').split('v=');
                            } else {
                                href_split = $this.attr('href').split('/');
                            }
                            let this_vid = href_split[href_split.length - 1].length ? href_split[href_split.length - 1] : href_split[href_split.length - 2];
                            if ( this_vid.indexOf('?') ) {
                                this_vid = this_vid.split('?')[0];
                            }
                            if ( this_vid.indexOf('&') ) {
                                this_vid = this_vid.split('&')[0];
                            }
                            this_link = 'https://www.youtube.com/embed/' + this_vid;
                        }
        				this_item.html = '\
        				<div class="anita-pswp-media--iframe" data-player-src="'+ this_link +'" data-src="' + $this.attr('href') + '" data-type="' + this_type + '">\
        					<iframe src="' + this_link + '?controls=1&amp;loop=0"></iframe>\
        				</div>';
        			}
        		} else {
        			// Image Slide
        			if ( $this.attr('data-size') ) {
        				let item_size = $this.attr('data-size').split('x');
        				this_item.w = item_size[0];
        				this_item.h = item_size[1];
        			} else {
                        if ( $this.children('img').attr('width'))
                            this_item.w = $this.children('img').attr('width');
                        if ( $this.children('img').attr('height'))
                            this_item.w = $this.children('img').attr('height');
                    }
        			this_item.src = $this.attr('href');
        		}

                // Get Slide Caption
                if ( $this.attr('data-caption') ) {
        			this_item.title = $this.attr('data-caption');
        		} else if ( $this.attr('title') ) {
                    this_item.title = $this.attr('title');
                }

                // Insert Item to Gallery
                if ( _self.pswp.gallery[this_gallery] ) {
        			_self.pswp.gallery[this_gallery].push(this_item);
        		} else {
        			_self.pswp.gallery[this_gallery] = [];
        			_self.pswp.gallery[this_gallery].push(this_item);
        		}

                // Update Index
                $this.attr('data-count', _self.pswp.gallery[this_gallery].length - 1);
            });
        }

        // Before After
        if ( jQuery('.anita-before-after:not(.is-init)').length ) {
            jQuery('.anita-before-after:not(.is-init)').each(function() {
                jQuery(this).addClass('is-init');
                new Anita_Before_After(jQuery(this));
            });
        }

        // GL Carousel
        if ( jQuery('.anita-gl-carousel-gallery').length ) {
            if ( typeof Anita_GL_Carousel !== 'function' ) {
                jQuery.getScript('js/anita-gl-carousel.js');
            }
        }

        // Roll Carousel
        if ( jQuery('.anita-gl-roll-gallery').length ) {
            if ( typeof Anita_GL_Roll !== 'function' ) {
                jQuery.getScript('js/anita-gl-roll.js');
            }
        }

        // GL Sider
        if ( jQuery('.anita-gl-slider-gallery').length ) {
            if ( typeof Anita_GL_Slider !== 'function' ) {
                jQuery.getScript('js/anita-gl-slider.js');
            }
        }

        // Flat Carousel
        if ( jQuery('.anita-flat-carousel:not(.is-init)').length ) {
            let anita_flat_carousel_init = function() {
                jQuery('.anita-flat-carousel:not(.is-init)').each(function() {
                    let $this = jQuery(this);
                    let options = {
                        'size' : parseFloat($this.attr('data-size') ? $this.attr('data-size') : 0.5, 10),
                        'spacing' : $this.attr('data-spacing') ? $this.attr('data-spacing') : 40,
                    }
                    $this.addClass('is-init');
                    $this.find('img').addClass('anita-flat-carousel-image');
                    _self.carousel = new Anita_Carousel( $this, options );
                });
            }
            if ( typeof Anita_Carousel !== 'function' ) {
                jQuery.getScript('js/anita-carousel.js').done(function() {
                    anita_flat_carousel_init();
                });
            } else {
                anita_flat_carousel_init();
            }
        }

        // Next Album Link
        if ( jQuery('.anita-next-album-wrap').length ) {
            jQuery('.anita-next-album-wrap').on('mouseenter', 'a', function() {
                if ( ! _self.isTouchDevice ) {
                    jQuery(this).next('.anita-page-background').addClass('is-hover');
                }
            }).on('mouseleave', 'a', function() {
                jQuery(this).next('.anita-page-background').removeClass('is-hover');
            });
        }
    }

    // Anita Layout
    layout() {
        let _self = this;

        // Refresh AOS
        AOS.refreshHard();

        // Footer Position
        if ( this.options.back2top ) {
            this.maxScroll = this.$el.body.height() - this.$el.footer.height() - this.$el.win.height();
            if (this.$el.b2t && this.$el.win.scrollTop() >= this.maxScroll ) {
                this.$el.b2t.parent().addClass('is-fixed');
            }
            if ( this.$el.win.scrollTop() > window.innerHeight ) {
                this.$el.b2t.parent().addClass('is-visible');
            } else {
                this.$el.b2t.parent().removeClass('is-visible');
            }
        }

        // Dropdown Menu Position
        if ( _self.$el.nav.hasClass('anita-simple-nav') ) {
            _self.$el.nav.find('.anita-menu-offset').removeClass('anita-menu-offset');
            _self.$el.nav.find('.sub-menu').each(function() {
                var $this = jQuery(this),
                    this_left = $this.offset().left,
                    this_left_full = $this.offset().left + $this.width() + parseInt($this.css('padding-left'), 10) + parseInt($this.css('padding-right'), 10);

        		if ( this_left_full > (window.innerWidth - 20) ) {
        			$this.addClass('anita-menu-offset');
        		}
            });
        }

        // Min Height
        _self.$el.main.removeClass('anita-min-content').css('min-height', '0');
        _self.$el.footer.removeClass('is-sticky');
        let minHeight = _self.$el.win.height();
        if ( _self.$el.body.hasClass('admin-bar') ) {
            minHeight = minHeight - jQuery('#wpadminbar').height();
        }
        if ( _self.$el.footer.length ) {
            minHeight = minHeight - _self.$el.footer.height();
        }
        if ( _self.$el.main.height() < minHeight ) {
            if ( _self.$el.footer.length ) {
                minHeight = minHeight + _self.$el.footer.height();
            }
            _self.$el.main.addClass('anita-min-content').css('min-height', minHeight);
            _self.$el.footer.addClass('is-sticky');
        }
    }
}

/* --- Activate Anita Core --- */
let anita = new Anita( anita_config );
