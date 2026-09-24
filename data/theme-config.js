/**
 * =========================================================
 * THEME CONFIGURATION
 * Chỉ chứa cấu hình giao diện.
 * Không chứa dữ liệu cưới.
 * =========================================================
 */

const ThemeConfig = Object.freeze({

    colors: {
    primary: "#5C735C",
    secondary: "#F7F8F3",
    accent: "#D9C18D",
    text: "#35443A",
    white: "#FFFFFF",

    countdown: "#596A55",
    gallery: "#B2C0AD"
},

    borderRadius: {
        small: 12,
        medium: 20,
        large: 32
    },

    animation: {
        duration: 600,
        easing: "ease"
    },

    opening: {
        enableFadeOut: true
    },

    hero: {
        mode: "photo", // "photo" | "floral"
        enablePetals: true
    },

    music: {
        autoplay: true,
        showControl: true
    },

    gallery: {
        layout: "masonry", // "masonry" | "grid" | "slider"
        lazyLoad: true
    }

});
