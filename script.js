/**
 * =========================================================
 * MAIN SCRIPT
 * Website Wedding Invitation
 * =========================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {

    checkConfiguration();

    applyTheme();

    initializeDeviceNotice();

    renderOpening();

    initializeOpeningPreload();

    renderHero();

    initHeroTextReveal();

    renderInvitation();
    
    renderCouple();

    initCoupleAnimation();

    renderFamily();

    initializeCountdown();

    initCountdownTextReveal();
    
    renderCeremony();

    initCeremonyTextReveal();

    initCeremonyAnimation();

    initializeRSVP();

    initializeWishes();

    
    /* ======================================================
       OPENING & MUSIC
       Khởi tạo trước Gallery để một lỗi ở Gallery
       không làm mất chức năng MỞ THIỆP.
    ====================================================== */

    initializeMusicPlayer();

    initializeOpening();


    /* ======================================================
       GALLERY
       Khởi tạo sau cùng.
    ====================================================== */

    renderGallery();

    initGalleryAnimation();

    initClosingGallery();

    initializeFallingPetals();

    initGlobalTextReveal();

    initRSVPTextReveal();

    initWishesTextReveal();

    initGiftTextReveal();

    initFooterTextReveal();
}

function checkConfiguration() {

    if (typeof SiteConfig === 'undefined') {
        console.error('Không tìm thấy SiteConfig');
        return;
    }

    if (typeof ThemeConfig === 'undefined') {
        console.error('Không tìm thấy ThemeConfig');
        return;
    }

    if (typeof WeddingData === 'undefined') {
        console.error('Không tìm thấy WeddingData');
        return;
    }

    console.log('✓ Configuration Loaded');
}

function applyTheme() {

    const root = document.documentElement;

    root.style.setProperty('--color-primary',ThemeConfig.colors.primary);

    root.style.setProperty('--color-secondary',ThemeConfig.colors.secondary);

    root.style.setProperty('--color-accent',ThemeConfig.colors.accent);

    root.style.setProperty('--color-text',ThemeConfig.colors.text);

    root.style.setProperty('--color-white',ThemeConfig.colors.white);

    root.style.setProperty('--color-countdown',ThemeConfig.colors.countdown);

    root.style.setProperty('--color-gallery',ThemeConfig.colors.gallery);

}


/* ==========================================================
   DEVICE NOTICE
   Hiển thị trên desktop / tablet
========================================================== */

function initializeDeviceNotice() {

    const notice = document.querySelector("#deviceNotice");
    const continueButton =
        document.querySelector("#deviceNoticeContinue");

    const groomName =
        document.querySelector("#deviceNoticeGroom");

    const brideName =
        document.querySelector("#deviceNoticeBride");

    if (!notice || !continueButton) {
        return;
    }

    /*
     * Chỉ hiển thị trên màn hình lớn hơn 768px.
     * Điện thoại sẽ đi thẳng vào Opening hiện tại.
     */
    if (window.innerWidth <= 768) {
        return;
    }

    /*
     * Lấy tên từ WeddingData.shortName
     */
    if (typeof WeddingData !== "undefined") {

        if (groomName) {
            groomName.textContent =
                WeddingData.groom.shortName || "";
        }

        if (brideName) {
            brideName.textContent =
                WeddingData.bride.shortName || "";
        }
    }

    /*
     * Hiển thị notice
     */
    notice.classList.add("show");
    notice.setAttribute("aria-hidden", "false");

    document.body.classList.add("device-notice-open");

    /*
     * Tiếp tục → đóng notice
     * Opening hiện tại vẫn giữ nguyên.
     */
    continueButton.addEventListener("click", () => {

        notice.classList.remove("show");
        notice.setAttribute("aria-hidden", "true");

        document.body.classList.remove("device-notice-open");

        setTimeout(() => {
            notice.remove();
        }, 500);

    });

}


/* ==========================================================
   OPENING
========================================================== */

function renderOpening() {

    const opening = document.querySelector("#opening");

    if (!opening) return;

    const background = opening.querySelector(".opening-background");
    const name = opening.querySelector(".opening-name");
    const date = opening.querySelector(".opening-date");
    const button = opening.querySelector(".opening-button");

    if (!background || !name || !date || !button) {
        console.error("Opening: thiếu phần tử HTML.");
        return;
    }

    background.style.backgroundImage =
        WeddingData.opening.background
            ? `url("${WeddingData.opening.background}")`
            : "none";

    name.innerHTML =
        `${WeddingData.groom.fullName}<br>&<br>${WeddingData.bride.fullName}`;

    date.textContent =
        `${WeddingData.wedding.day} • ${WeddingData.wedding.month} • ${WeddingData.wedding.year}`;

    button.textContent = WeddingData.opening.buttonText;
}

function initializeOpening() {

    const opening = document.querySelector("#opening");
    const button = document.querySelector("#openInvitation");

    if (!opening || !button) return;

    button.addEventListener("click", () => {

        const player = document.querySelector("#musicPlayer");

        if (player && player.audio) {

            player.classList.add("show");

            player.audio.play()
                .then(() => {

                    player.classList.add("playing");

                    const musicButton =
                        document.querySelector("#musicToggle");

                    if (musicButton) {
                        musicButton.setAttribute(
                            "aria-pressed",
                            "true"
                        );
                    }

                })
                .catch((error) => {

                    console.warn(
                        "Không thể phát nhạc:",
                        error
                    );

                });

        }

window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant"
});

const floralTransition =
    document.querySelector(".floral-transition");

opening.classList.add("opening-hide");

if (floralTransition) {

    /* Hiện hai cánh hoa khi Opening bắt đầu biến mất */
    floralTransition.classList.add("is-visible");

    /* Cho browser render CLOSED STATE trước */
    requestAnimationFrame(() => {

        requestAnimationFrame(() => {
            floralTransition.classList.add("is-opening");
        });

    });

    /* Sau khi hoa mở xong mới bỏ Opening */
   setTimeout(() => {

    opening.remove();

    floralTransition.classList.add("is-done");

}, 2200);

} else {

    setTimeout(() => {
        opening.remove();
    }, 800);

}

    });

}


/* ==========================================================
   MUSIC PLAYER
========================================================== */

function initializeMusicPlayer() {

    const player = document.querySelector("#musicPlayer");
    const button = document.querySelector("#musicToggle");

    if (!player || !button) return;

    // Tạo audio từ dữ liệu WeddingData
    const audio = new Audio(WeddingData.music.src);

    audio.loop = WeddingData.music.loop ?? true;
    audio.preload = "auto";

    // Lưu audio vào player để có thể dùng lại nếu cần
    player.audio = audio;

    // Trạng thái Music Player
    function updatePlayerState(isPlaying) {

        player.classList.toggle("playing", isPlaying);

        button.setAttribute(
            "aria-pressed",
            isPlaying ? "true" : "false"
        );

    }

    // Nút bật / tắt nhạc
    button.addEventListener("click", () => {

        if (audio.paused) {

            audio.play()
                .then(() => {
                    updatePlayerState(true);
                })
                .catch((error) => {
                    console.warn("Không thể phát nhạc:", error);
                });

        } else {

            audio.pause();
            updatePlayerState(false);

        }

    });

    // Nếu nhạc kết thúc
    audio.addEventListener("ended", () => {
        updatePlayerState(false);
    });

}

/* ==========================================================
   HERO
========================================================== */

function renderHero() {

    const hero = document.querySelector("#hero");

    if (!hero) return;

    const monogram = hero.querySelector(".hero-monogram");
    const image = hero.querySelector(".hero-photo-image");
    const name = hero.querySelector(".hero-name");
    const date = hero.querySelector(".hero-date");
    const quote = hero.querySelector(".hero-quote");

    if (!monogram || !image || !name || !date || !quote) {
        console.error("Hero: thiếu phần tử HTML.");
        return;
    }

    // Ảnh Hero
    image.src = WeddingData.hero.image || "";
    image.alt = `${WeddingData.groom.fullName} & ${WeddingData.bride.fullName}`;

    // Monogram (tạm thời lấy từ data)
    monogram.textContent = WeddingData.wedding.monogram;

    // Tên
    name.innerHTML =
        `${WeddingData.groom.fullName}<br>&<br>${WeddingData.bride.fullName}`;

    // Ngày
    date.textContent =
        `${WeddingData.wedding.weekday} • ${WeddingData.wedding.day} • ${WeddingData.wedding.month} • ${WeddingData.wedding.year}`;

    // Quote
    quote.textContent = WeddingData.wedding.quote;

}

/* ==========================================================
   INVITATION
========================================================== */

function renderInvitation() {

    const invitation = document.getElementById("invitation");

    if (!invitation || typeof WeddingData === "undefined") {
        return;
    }

    const data = WeddingData.invitation;

    if (!data) {
        return;
    }

    const title = invitation.querySelector(".invitation-title");
    const message = invitation.querySelector(".invitation-message");
    const invite = invitation.querySelector(".invitation-invite");

    if (title) {
        title.innerHTML =
            (data.title || "").replace(/\n/g, "<br>");
    }

    if (message) {
        message.textContent = data.message || "";
    }

    if (invite) {
        invite.textContent = data.invite || "";
    }

}


/* ==========================================================
   COUPLE
========================================================== */

function renderCouple() {

    const brideAvatar = document.getElementById("bride-avatar");
    const brideName = document.getElementById("bride-name");

    const groomAvatar = document.getElementById("groom-avatar");
    const groomName = document.getElementById("groom-name");

    if (!brideAvatar || !brideName || !groomAvatar || !groomName) {
        return;
    }

    brideAvatar.src = WeddingData.bride.avatar;
    brideName.textContent = WeddingData.bride.fullName;

    groomAvatar.src = WeddingData.groom.avatar;
    groomName.textContent = WeddingData.groom.fullName;
}

function renderFamily() {
    const familySection = document.getElementById("family");

    if (!familySection || typeof WeddingData === "undefined") {
        return;
    }

    const brideFamily = familySection.querySelector("#bride-family");
    const groomFamily = familySection.querySelector("#groom-family");

    if (!brideFamily || !groomFamily) {
        return;
    }

    const bride = WeddingData.bride || {};
    const groom = WeddingData.groom || {};

    const brideFather = brideFamily.querySelector("#bride-father");
    const brideMother = brideFamily.querySelector("#bride-mother");

    const groomFather = groomFamily.querySelector("#groom-father");
    const groomMother = groomFamily.querySelector("#groom-mother");

    if (brideFather) {
        brideFather.innerHTML = `<span class="family-role">Bố</span><span class="family-name">${bride.father || ""}</span>`;
    }

    if (brideMother) {
        brideMother.innerHTML = `<span class="family-role">Mẹ</span><span class="family-name">${bride.mother || ""}</span>`;
    }

    if (groomFather) {
        groomFather.innerHTML = `<span class="family-role">Bố</span><span class="family-name">${groom.father || ""}</span>`;
    }

    if (groomMother) {
        groomMother.innerHTML = `<span class="family-role">Mẹ</span><span class="family-name">${groom.mother || ""}</span>`;
    }
}



function initCoupleAnimation() {

    const couple = document.getElementById("couple");

    if (!couple) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    couple.classList.add("is-visible");

                    observer.unobserve(couple);
                }

            });

        },
        {
    threshold: 0.5
    
        }
    );

    observer.observe(couple);
}

/* ==========================================================
   CEREMONY — RENDER WEDDING INFORMATION
========================================================== */

function renderCeremony() {

    const ceremonySection = document.getElementById("ceremony");

    if (!ceremonySection) {
        return;
    }

    const ceremonyData = WeddingData.ceremony;

    if (!ceremonyData) {
        return;
    }


    /* ======================================================
       HIỂN THỊ TEXT THEO DATA-CEREMONY
    ====================================================== */

    const ceremonyElements =
        ceremonySection.querySelectorAll("[data-ceremony]");

    ceremonyElements.forEach((element) => {

        const path =
            element.getAttribute("data-ceremony");

        const value =
            getCeremonyValue(ceremonyData, path);

        element.textContent =
            value || "";

    });


    /* ======================================================
       GOOGLE MAPS
    ====================================================== */

    const mapElements =
        ceremonySection.querySelectorAll("[data-ceremony-map]");

    mapElements.forEach((element) => {

        const path =
            element.getAttribute("data-ceremony-map");

        const value =
            getCeremonyValue(ceremonyData, path);

        if (value) {

            element.href = value;

            element.style.display = "inline-flex";

        } else {

            element.removeAttribute("href");

            element.style.display = "none";

        }

    });

}


/* ==========================================================
   CEREMONY — CARD REVEAL ANIMATION
========================================================== */

function initCeremonyAnimation() {

    const ceremonySection =
        document.getElementById("ceremony");

    if (!ceremonySection) {
        return;
    }

    const cards =
        ceremonySection.querySelectorAll(
            ".ceremony-ritual-card"
        );

    if (!cards.length) {
        return;
    }

    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "is-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.18
            }
        );

    cards.forEach((card) => {

        observer.observe(card);

    });

}

/* ==========================================================
   CEREMONY — TEXT REVEAL
   Text xuất hiện trước ritual card
========================================================== */

function initCeremonyTextReveal() {

    const ceremony =
        document.getElementById("ceremony");

    if (!ceremony) {
        return;
    }

    const groups =
        ceremony.querySelectorAll(
            ".ceremony-group"
        );

    if (!groups.length) {
        return;
    }

    const revealTargets = [];

    groups.forEach((group) => {

        const targets =
            group.querySelectorAll(
                ".ceremony-party-title, " +
                ".ceremony-detail, " +
                ".ceremony-location-title, " +
                ".ceremony-location-address, " +
                ".ceremony-map-button"
            );

        targets.forEach((element) => {
            revealTargets.push(element);
        });

    });

    const heading =
        ceremony.querySelector(
            ".ceremony-heading"
        );

    if (heading) {
        revealTargets.unshift(heading);
    }

    revealTargets.forEach((element) => {

        element.classList.add(
            "ceremony-text-reveal"
        );

    });

    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add(
                        "ceremony-text-visible"
                    );

                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -35px 0px"
            }
        );

    revealTargets.forEach((element) => {
        observer.observe(element);
    });

}

/* ==========================================================
   GET CEREMONY DATA
   Ví dụ:
   brideParty.address
   groomParty.map
========================================================== */

function getCeremonyValue(data, path) {

    if (!data || !path) {
        return "";
    }

    const parts =
        path.split(".");

    let current =
        data;

    for (const part of parts) {

        if (
            current === null ||
            current === undefined
        ) {
            return "";
        }

        current =
            current[part];

    }

    return current ?? "";
}


/* ==========================================================
   GALLERY — RENDER & AUTO DETECT IMAGE RATIO
   Tự tạo bitmap vừa đủ cho web để tránh browser phải
   raster lại ảnh gốc quá lớn khi scroll quay lại.
========================================================== */

function renderGallery() {

    const gallerySection =
        document.getElementById("gallery");

    const galleryGrid =
        document.getElementById("galleryGrid");

    if (!gallerySection || !galleryGrid) {
        return;
    }

    const galleryData =
        WeddingData.gallery;

    if (
        !Array.isArray(galleryData) ||
        galleryData.length === 0
    ) {
        return;
    }

    galleryGrid.innerHTML = "";

    /*
     * ======================================================
     * GALLERY IMAGE
     *
     * Dùng trực tiếp ảnh gốc.
     *
     * Không Canvas.
     * Không resize.
     * Không JPEG-compress.
     * Không tạo Blob URL.
     *
     * Ảnh được giữ trong DOM để browser có thể
     * dùng lại resource khi scroll lên / xuống.
     * ======================================================
     */

    galleryData.forEach(
        (imageSource, index) => {

            if (!imageSource) {
                return;
            }

            const item =
                document.createElement("div");

            item.className =
                "gallery-item";

            const image =
                document.createElement("img");

            image.alt =
                `Khoảnh khắc ${index + 1}`;

            /*
             * Lazy để browser không tải toàn bộ Gallery
             * ngay từ lúc mở website.
             *
             * Khi người dùng tiến gần Gallery,
             * browser sẽ tự lấy ảnh.
             *
             * Resource sau khi đã tải vẫn nằm trong
             * browser cache nếu còn khả dụng.
             */
            image.loading =
                "lazy";

            image.decoding =
                "async";

            /*
             * Lấy đúng tỷ lệ từ ảnh gốc.
             */
            const applyImageRatio = () => {

                const width =
                    image.naturalWidth;

                const height =
                    image.naturalHeight;

                if (
                    !width ||
                    !height
                ) {
                    return;
                }

                const ratio =
                    width / height;

                item.style.aspectRatio =
                    `${width} / ${height}`;

                if (ratio < 0.88) {

                    item.classList.add(
                        "is-vertical"
                    );

                } else if (ratio > 1.12) {

                    item.classList.add(
                        "is-horizontal"
                    );

                } else {

                    item.classList.add(
                        "is-square"
                    );

                }

            };

            /*
             * Gán trực tiếp ảnh gốc.
             */
            image.src =
                imageSource;

            /*
             * Nếu browser đã có ảnh trong cache,
             * lấy ratio ngay.
             */
            if (image.complete) {

                applyImageRatio();

            } else {

                image.addEventListener(
                    "load",
                    applyImageRatio,
                    {
                        once: true
                    }
                );

            }

            item.appendChild(
                image
            );

            galleryGrid.appendChild(
                item
            );

        }
    );

}



/* ==========================================================
   COUNTDOWN
========================================================== */

function initializeCountdown() {

    const countdownSection = document.getElementById("countdown");

    if (!countdownSection) {
        return;
    }

    const wedding = WeddingData.wedding;

    if (
        !wedding ||
        !wedding.year ||
        !wedding.month ||
        !wedding.day
    ) {
        return;
    }

    const groomCeremony = WeddingData.ceremony.groomCeremony;

const [day, month, year] = groomCeremony.date
    .match(/(\d{2})\.(\d{2})\.(\d{4})/)
    .slice(1)
    .map(Number);

const [hour, minute] = groomCeremony.time
    .split(":")
    .map(Number);

const targetDate = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    0
);

    const daysElement = document.getElementById("countdown-days");
    const hoursElement = document.getElementById("countdown-hours");
    const minutesElement = document.getElementById("countdown-minutes");
    const secondsElement = document.getElementById("countdown-seconds");

    if (
        !daysElement ||
        !hoursElement ||
        !minutesElement ||
        !secondsElement
    ) {
        return;
    }

    function updateCountdown() {

        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();

        if (difference <= 0) {

            daysElement.textContent = "00";
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            secondsElement.textContent = "00";

            return;
        }

        const totalSeconds = Math.floor(
            difference / 1000
        );

        const days = Math.floor(
            totalSeconds / 86400
        );

        const hours = Math.floor(
            (totalSeconds % 86400) / 3600
        );

        const minutes = Math.floor(
            (totalSeconds % 3600) / 60
        );

        const seconds =
            totalSeconds % 60;

        daysElement.textContent =
            String(days).padStart(2, "0");

        hoursElement.textContent =
            String(hours).padStart(2, "0");

        minutesElement.textContent =
            String(minutes).padStart(2, "0");

        secondsElement.textContent =
            String(seconds).padStart(2, "0");
    }

    updateCountdown();

    setInterval(
        updateCountdown,
        1000
    );
}

/* ==========================================================
   COUNTDOWN — TEXT REVEAL
========================================================== */

function initCountdownTextReveal() {

    const countdown = document.querySelector("#countdown");

    if (!countdown) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        countdown.classList.add("countdown-text-visible");
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) return;

                countdown.classList.add("countdown-text-visible");

                observer.unobserve(countdown);

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    observer.observe(countdown);
}

/* ==========================================================
   GALLERY — EDITORIAL REVEAL
========================================================== */
function initGalleryAnimation() {

    const gallery =
        document.getElementById("gallery");

    if (!gallery) {
        return;
    }

    const items =
        gallery.querySelectorAll(
            ".gallery-item"
        );

    if (!items.length) {
        return;
    }

    let galleryFinished = false;

    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const item =
                        entry.target;

                    const image =
                        item.querySelector("img");

                    const index =
                        Number(
                            item.dataset.galleryIndex || 0
                        );

                    /*
                       Gallery đã hoàn tất trước đó →
                       không chạy animation lại.
                    */
                    if (galleryFinished) {
                        item.classList.add(
                            "is-visible"
                        );

                        observer.unobserve(item);
                        return;
                    }

                    /*
                       Mỗi ảnh vẫn giữ nguyên nhịp
                       animation hiện tại.
                    */
                    const reveal = () => {

                        const delay =
                            Math.min(
                                index * 90,
                                420
                            );

                        setTimeout(() => {

                            item.classList.add(
                                "is-visible"
                            );

                        }, delay);

                    };

                    /*
                       Ảnh chưa sẵn sàng →
                       chờ decode xong rồi mới reveal.
                    */
                    if (!image) {

                        reveal();

                    } else {

                        const decodePromise =
                            typeof image.decode === "function"
                                ? image.decode()
                                : Promise.resolve();

                        decodePromise
                            .then(reveal)
                            .catch(reveal);

                    }

                    observer.unobserve(item);

                });

            },
            {
                threshold: 0.14
            }
        );


    items.forEach(
        (item, index) => {

            item.dataset.galleryIndex =
                index;

            observer.observe(item);

        }
    );


    /*
       Sau khi toàn bộ ảnh đã reveal,
       khóa Gallery ở trạng thái ổn định.

       Không thay đổi layout.
       Không thay đổi animation lần đầu.
       Chỉ ngăn browser chạy lại trạng thái
       chuyển động khi quay lại Gallery.
    */
    const freezeGallery = () => {

        if (galleryFinished) {
            return;
        }

        const visibleItems =
            gallery.querySelectorAll(
                ".gallery-item.is-visible"
            );

        if (
            visibleItems.length ===
            items.length
        ) {

            galleryFinished = true;

            gallery.classList.add(
                "gallery-frozen"
            );

        }

    };


    /*
       Kiểm tra sau khi nhịp animation cuối
       đã hoàn tất.
    */
    const freezeTimer =
        setInterval(() => {

            freezeGallery();

            if (galleryFinished) {
                clearInterval(
                    freezeTimer
                );
            }

        }, 100);


}


/* ==========================================================
   CLOSING GALLERY
   Infinite horizontal gallery
========================================================== */
function initClosingGallery() {

    const track =
        document.getElementById(
            "closingGalleryTrack"
        );

    const section =
        document.getElementById(
            "closing-gallery"
        );

    const wishes =
        document.getElementById(
            "wishes"
        );

    if (!track || !section) {
        return;
    }

    const closingImages =
        WeddingData.closingGallery;

    if (
        !Array.isArray(closingImages) ||
        closingImages.length === 0
    ) {
        console.warn(
            "Closing Gallery: chưa có ảnh."
        );

        return;
    }

    /*
     * ======================================================
     * PRELOAD
     *
     * Chỉ tải ảnh trước khi người dùng đi tới
     * Closing Gallery.
     *
     * Không tạo DOM.
     * Không tạo layout.
     * Không bật animation.
     * ======================================================
     */

    let preloadStarted = false;
    let initialized = false;

    const preloadImages = () => {

        if (preloadStarted) {
            return;
        }

        preloadStarted = true;

        closingImages.forEach(
            (imageSource) => {

                if (!imageSource) {
                    return;
                }

                const image =
                    new Image();

                image.decoding =
                    "async";

                image.src =
                    imageSource;

            }
        );

    };

    /*
     * ======================================================
     * INITIALIZE
     *
     * Chỉ tạo DOM khi Closing Gallery thực sự
     * sắp xuất hiện.
     * ======================================================
     */

    const initializeGallery = () => {

        if (initialized) {
            return;
        }

        initialized = true;

        /*
         * Tạo 2 bộ ảnh giống nhau
         * để giữ infinite loop.
         */
        const imageSets = [
            closingImages,
            closingImages
        ];

        imageSets.forEach(
            (imageSet, setIndex) => {

                imageSet.forEach(
                    (imageSource, index) => {

                        if (!imageSource) {
                            return;
                        }

                        const item =
                            document.createElement(
                                "div"
                            );

                        item.className =
                            "closing-gallery-item";

                        const image =
                            document.createElement(
                                "img"
                            );

                        image.src =
                            imageSource;

                        image.alt =
                            setIndex === 0
                                ? `Khoảnh khắc đáng nhớ ${index + 1}`
                                : "";

                        image.decoding =
                            "async";

                        /*
                         * Không dùng lazy cho bộ thứ hai.
                         *
                         * Cả hai bộ đều dùng chung resource
                         * đã được preload ở phía trên.
                         *
                         * Tránh browser trì hoãn ảnh trong
                         * lúc animation đang chạy.
                         */
                        image.loading =
                            "eager";

                        if (setIndex === 1) {

                            item.setAttribute(
                                "aria-hidden",
                                "true"
                            );

                        }

                        item.appendChild(
                            image
                        );

                        track.appendChild(
                            item
                        );

                    }
                );

            }
        );

        /*
         * Cho browser có một nhịp render layout
         * rồi mới bật animation.
         *
         * KHÔNG chờ Promise.all().
         * KHÔNG chờ toàn bộ ảnh decode.
         */
        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                track.classList.add(
                    "is-loaded"
                );

            });

        });

    };

    /*
     * ======================================================
     * PRELOAD KHI ĐANG Ở WISHES
     *
     * Wishes nằm ngay trước Closing Gallery.
     *
     * Vì vậy ảnh được tải nền trước khi người dùng
     * thực sự nhìn thấy Closing Gallery.
     *
     * Không tải ngay từ lúc mở website.
     * ======================================================
     */

    if (wishes) {

        const wishesObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            preloadImages();

                            wishesObserver.unobserve(
                                wishes
                            );

                        }
                    );

                },
                {
                    rootMargin:
                        "800px 0px 800px 0px",
                    threshold: 0
                }
            );

        wishesObserver.observe(
            wishes
        );

    } else {

        /*
         * Fallback an toàn nếu HTML không có Wishes.
         * Vẫn không tạo gallery DOM ở page load.
         */
        preloadImages();

    }

    /*
     * ======================================================
     * SHOW CLOSING GALLERY
     *
     * Khi section tiến gần viewport,
     * tạo DOM và chạy animation ngay.
     *
     * Không chờ ảnh load/decode.
     * ======================================================
     */

    const sectionObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        /*
                         * Nếu người dùng scroll rất nhanh,
                         * preload có thể chưa hoàn thành.
                         *
                         * Vẫn initialize ngay để không tạo
                         * màn hình trắng chờ Promise.
                         */
                        initializeGallery();

                        sectionObserver.unobserve(
                            section
                        );

                    }
                );

            },
            {
                rootMargin:
                    "300px 0px 300px 0px",
                threshold: 0
            }
        );

    sectionObserver.observe(
        section
    );

}


/* ==========================================================
   RSVP
========================================================== */

function initializeRSVP() {

    const form =
        document.getElementById("rsvpForm");

    const guests =
        document.getElementById("rsvpGuests");

    const guestCount =
        document.getElementById("rsvpGuestCount");

    const minusButton =
        document.getElementById("rsvpMinus");

    const plusButton =
        document.getElementById("rsvpPlus");

    const status =
        document.getElementById("rsvpStatus");


    if (
        !form ||
        !guests ||
        !guestCount ||
        !minusButton ||
        !plusButton ||
        !status
    ) {
        return;
    }


    /* ======================================================
       DEFAULT
    ====================================================== */

    let count = 1;
    let isSubmitting = false;

    guests.hidden = true;

    guestCount.textContent = count;


    /* ======================================================
       ATTENDANCE
    ====================================================== */

    const attendanceInputs =
        form.querySelectorAll(
            'input[name="attendance"]'
        );


    attendanceInputs.forEach((input) => {

        input.addEventListener(
            "change",
            () => {

                if (input.value === "yes") {

                    guests.hidden = false;

                } else if (input.value === "no") {

                    guests.hidden = true;

                }

            }
        );

    });


    /* ======================================================
       MINUS
    ====================================================== */

    minusButton.addEventListener(
        "click",
        () => {

            if (count > 1) {

                count--;

                guestCount.textContent =
                    count;

            }

        }
    );


    /* ======================================================
       PLUS
    ====================================================== */

    plusButton.addEventListener(
        "click",
        () => {

            if (count < 5) {

                count++;

                guestCount.textContent =
                    count;

            }

        }
    );


    /* ======================================================
   SUBMIT
====================================================== */

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const nameInput =
            form.querySelector(
                'input[name="name"]'
            );

        const attendanceInput =
            form.querySelector(
                'input[name="attendance"]:checked'
            );


        if (
            !nameInput ||
            !attendanceInput
        ) {
            return;
        }


        const name =
            nameInput.value.trim();

        const attendance =
            attendanceInput.value;


        if (!name) {
            return;
        }


        const formData =
            new URLSearchParams();

        formData.append(
          "type",
          "rsvp"
        );

        formData.append(
            "name",
            name
        );


        formData.append(
            "attendance",
            attendance
        );


        formData.append(
            "guests",
            attendance === "yes"
                ? count
                : ""
        );


        status.classList.remove(
            "is-success",
            "is-error"
        );


        if (isSubmitting) {
    return;
}

const submitButton =
    document.getElementById("rsvpSubmit");

isSubmitting = true;

if (submitButton) {
    submitButton.disabled = true;
}
        

        try {

            await fetch(
                RSVPConfig.endpoint,
                {
                    method: "POST",

                    mode: "no-cors",

                    body: formData
                }
            );


            /*
               Google Apps Script nhận dữ liệu
               nhưng trình duyệt không cho website
               đọc response vì CORS.

               Vì vậy không dùng response.json()
               ở đây.
            */

            status.textContent =
                "Cảm ơn bạn đã phản hồi ❤️";

            status.classList.add(
                "is-success"
            );
            if (submitButton) {
    submitButton.disabled = false;
}

isSubmitting = false;
            
        } catch (error) {

            console.error(
                "RSVP error:",
                error
            );


            status.textContent =
                "Đã có lỗi xảy ra. Vui lòng thử lại.";

            status.classList.add(
                "is-error"
            )

            if (submitButton) {
            submitButton.disabled = false;
}
            isSubmitting = false;
        }

    }
);

}

/* ==========================================================
   GIFT & WISHES — DATA BINDING
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

        const footerNames =
        document.getElementById("footerNames");

    const footerDate =
        document.getElementById("footerDate");

    if (footerNames && typeof WeddingData !== "undefined") {
        const brideName =
            WeddingData.bride.shortName ||
            WeddingData.bride.fullName;

        const groomName =
            WeddingData.groom.shortName ||
            WeddingData.groom.fullName;

        footerNames.textContent =
            `${brideName} & ${groomName}`;
    }

    if (footerDate && typeof WeddingData !== "undefined") {
        const day = WeddingData.wedding.day;
        const month = WeddingData.wedding.month;
        const year = WeddingData.wedding.year;

        footerDate.textContent =
            `${day} • ${month} • ${year}`;
    }

    if (typeof GIFT_WISHES_DATA === "undefined") {
        console.warn("GIFT_WISHES_DATA is not available.");
        return;
    }

    const data = GIFT_WISHES_DATA;


    // =========================
    // GIFT
    // =========================

    document.getElementById("giftMessage").textContent =
        data.gift.message;

    document.getElementById("giftInvitation").textContent =
        data.gift.invitation;

    document.getElementById("giftOpenMessage").textContent =
        data.gift.openMessage;

    // QR CÔ DÂU
    const giftQrBride =
        document.getElementById("giftQrBride");

    if (giftQrBride) {
        giftQrBride.src =
            data.gift.bride.qr;
    }

    // QR CHÚ RỂ
    const giftQrGroom =
        document.getElementById("giftQrGroom");

    if (giftQrGroom) {
        giftQrGroom.src =
            data.gift.groom.qr;
    }

    // NHÃN QR
    const giftBrideTitle =
        document.getElementById("giftBrideTitle");

    if (giftBrideTitle) {
        giftBrideTitle.textContent = "CÔ DÂU";
    }

    const giftGroomTitle =
        document.getElementById("giftGroomTitle");

    if (giftGroomTitle) {
        giftGroomTitle.textContent = "CHÚ RỂ";
    }

    
    // =========================
    // WISHES
    // =========================

    document.getElementById("wishesTitle").textContent =
        data.wishes.title;

    document.getElementById("wishesDescription").textContent =
        data.wishes.description;
    
    document.getElementById("wishesEmpty").textContent =
        data.wishes.emptyMessage;

    document.getElementById("wishName").placeholder =
    data.wishes.namePlaceholder;

    document.getElementById("wishMessage").placeholder =
    data.wishes.messagePlaceholder;

    document.getElementById("wishesSubmit").textContent =
    data.wishes.submitText;
});

/* ==========================================================
   GIFT — OPEN / CLOSE QR
========================================================== */

const giftTrigger = document.getElementById("giftTrigger");
const giftDetails = document.getElementById("giftDetails");

if (giftTrigger && giftDetails) {

    giftTrigger.addEventListener("click", () => {

        const isOpen =
            giftTrigger.getAttribute("aria-expanded") === "true";

        if (isOpen) {

            giftDetails.classList.remove("is-visible");

            giftTrigger.setAttribute(
                "aria-expanded",
                "false"
            );

            setTimeout(() => {
                giftDetails.hidden = true;
            }, 450);

        } else {

            giftDetails.hidden = false;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {

                    giftDetails.classList.add(
                        "is-visible"
                    );

                });
            });

            giftTrigger.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    });

}



/* ==========================================================
   WISHES — SUBMIT
========================================================== */

function formatWishTime(time) {
    if (!time) {
        return "";
    }

    const date = new Date(time);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).replace(",", " ·");
}

function initializeWishes() {

    const form =
        document.getElementById("wishesForm");

    const status =
        document.getElementById("wishesStatus");

    let isSubmitting = false;

    if (!form || !status) {
        return;
    }


    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            if (isSubmitting) {
    return;
}

const nameInput =
    document.getElementById("wishName");

            const messageInput =
                document.getElementById("wishMessage");


            if (
                !nameInput ||
                !messageInput
            ) {
                return;
            }


            const name =
                nameInput.value.trim();

            const message =
                messageInput.value.trim();


            if (!name || !message) {
    return;
}

isSubmitting = true;


            const formData =
                new URLSearchParams();


            formData.append(
                "type",
                "wish"
            );

            formData.append(
                "name",
                name
            );

            formData.append(
                "message",
                message
            );


            status.classList.remove(
                "is-success",
                "is-error"
            );


            try {

                await fetch(
                    RSVPConfig.endpoint,
                    {
                        method: "POST",

                        mode: "no-cors",

                        body: formData
                    }
                );


                status.textContent =
                    "Cảm ơn bạn đã gửi lời chúc ❤️";

                status.classList.add(
                    "is-success"
                );


                form.reset();

                status.scrollIntoView({
                behavior: "smooth",
                block: "center"
              });
                
const newWish = {
    name: name,
    message: message,
    time: new Date().toISOString()
};

const wishesList = document.getElementById("wishesList");
const wishesEmpty = document.getElementById("wishesEmpty");

if (wishesList && wishesEmpty) {
    wishesEmpty.hidden = true;

const item = document.createElement("article");
item.className = "wish-item";

const avatar = document.createElement("span");
avatar.className = "wish-avatar";

const avatarImage = document.createElement("img");
avatarImage.src =
    "assets/icons/decorative/Asset%20%20(2).svg";
avatarImage.alt = "";

avatar.appendChild(avatarImage);

const header = document.createElement("div");
header.className = "wish-header";

const nameWrap = document.createElement("div");
nameWrap.className = "wish-name-wrap";

const nameElement = document.createElement("p");
nameElement.className = "wish-name";
nameElement.textContent = newWish.name;

const timeElement = document.createElement("p");
timeElement.className = "wish-time";
timeElement.textContent =
    formatWishTime(newWish.time);

nameWrap.appendChild(nameElement);
nameWrap.appendChild(timeElement);

const heart = document.createElement("span");
heart.className = "wish-heart";
heart.textContent = "♡";
heart.setAttribute(
    "aria-hidden",
    "true"
);

header.appendChild(nameWrap);
header.appendChild(heart);

const messageElement = document.createElement("p");
messageElement.className = "wish-message";
messageElement.textContent = newWish.message;

item.appendChild(avatar);
item.appendChild(header);
item.appendChild(messageElement);

wishesList.insertBefore(
    item,
    wishesList.querySelector(".wish-item")
);

    
}

            } catch (error) {

                console.error(
                    "Wishes error:",
                    error
                );


                status.textContent =
                    "Đã có lỗi xảy ra. Vui lòng thử lại.";

                status.classList.add(
                    "is-error"
                );

            }

        }
    );

}


/* ==========================================================
   WISHES — LOAD GUESTBOOK
========================================================== */
function createWishFlower(index) {

    const flower = document.createElement("div");

    flower.className =
        "wish-flower-gap flower-" +
        ((index % 6) + 1);

    flower.setAttribute(
        "aria-hidden",
        "true"
    );

    return flower;
}
async function loadWishes() {
    
   const wishesMore =
    document.getElementById("wishesMore");
    
    const wishesList =
        document.getElementById("wishesList");

    const wishesEmpty =
        document.getElementById("wishesEmpty");

    if (!wishesList || !wishesEmpty) {
        return;
    }

    try {

        const response =
            await fetch(
                RSVPConfig.endpoint
            );

        const wishes =
            await response.json();

      /* Xóa danh sách cũ trước khi render lại */
wishesList
    .querySelectorAll(
        ".wish-item, .wish-flower-gap"
    )
    .forEach((item) => {
        item.remove();
    });

        if (
            !Array.isArray(wishes) ||
            wishes.length === 0
        ) {

            wishesEmpty.hidden = false;

            return;

        }

        wishesEmpty.hidden = true;

        /* Mới nhất lên đầu */
const latestWishes =
    [...wishes].reverse();

/* Chỉ hiển thị 5 lời chúc */
const visibleWishes =
    latestWishes.slice(0, 5);
let visibleCount = 5;
/* Hiển thị nút "XEM THÊM" nếu còn lời chúc */
if (wishesMore) {
    wishesMore.hidden =
        latestWishes.length <= 5;
}

if (wishesMore) {
    wishesMore.onclick = () => {
     wishesList
    .querySelectorAll(
        ".wish-item, .wish-flower-gap"
    )
    .forEach((item) => {
        item.remove();
    });

       visibleCount = Math.min(
    visibleCount + 5,
    latestWishes.length
);

latestWishes
    .slice(0, visibleCount)
    .forEach((wish) => {
            const item =
                document.createElement("article");

            item.className =
                "wish-item";

            const avatar =
                document.createElement("span");

            avatar.className =
                "wish-avatar";

            const avatarImage =
                document.createElement("img");

            avatarImage.src =
                "assets/icons/decorative/Asset%20%20(2).svg";

            avatarImage.alt = "";

            avatar.appendChild(
                avatarImage
            );

            const header =
                document.createElement("div");

            header.className =
                "wish-header";

            const nameWrap =
                document.createElement("div");

            nameWrap.className =
                "wish-name-wrap";

            const nameElement =
                document.createElement("p");

            nameElement.className =
                "wish-name";

            nameElement.textContent =
                wish.name;

            const timeElement =
                document.createElement("p");

            timeElement.className =
                "wish-time";

            timeElement.textContent =
                formatWishTime(wish.time);

            nameWrap.appendChild(
                nameElement
            );

            nameWrap.appendChild(
                timeElement
            );

            const heart =
                document.createElement("span");

            heart.className =
                "wish-heart";

            heart.textContent =
                "♡";

            heart.setAttribute(
                "aria-hidden",
                "true"
            );

            header.appendChild(
                nameWrap
            );

            header.appendChild(
                heart
            );

            const messageElement =
                document.createElement("p");

            messageElement.className =
    "wish-message";

messageElement.textContent = wish.message;

         item.appendChild(
    avatar
);

item.appendChild(
    header
);

item.appendChild(
    messageElement
);

wishesList.appendChild(
    item
);

const flower =
    createWishFlower(
        wishesList.querySelectorAll(".wish-item").length - 1
    );

wishesList.appendChild(
    flower
);
        });

        wishesMore.hidden = true;
    };
}
        
        
        visibleWishes.forEach((wish) => {

            const item =
                document.createElement("article");

            item.className =
                "wish-item";

            const avatar =
                document.createElement("span");

            avatar.className =
                "wish-avatar";

            const avatarImage =
                document.createElement("img");

            avatarImage.src =
                "assets/icons/decorative/Asset%20%20(2).svg";

            avatarImage.alt = "";

            avatar.appendChild(
                avatarImage
            );

            const header =
    document.createElement("div");
header.className =
    "wish-header";

const nameWrap =
    document.createElement("div");
nameWrap.className =
    "wish-name-wrap";

const name =
    document.createElement("p");
name.className =
    "wish-name";
name.textContent =
    wish.name;

const time =
    document.createElement("p");
time.className =
    "wish-time";
time.textContent =
    formatWishTime(wish.time);

nameWrap.appendChild(name);
nameWrap.appendChild(time);

const heart =
    document.createElement("span");
heart.className =
    "wish-heart";
heart.textContent =
    "♡";
heart.setAttribute(
    "aria-hidden",
    "true"
);

header.appendChild(nameWrap);
header.appendChild(heart);

const message =
    document.createElement("p");
message.className =
    "wish-message";

message.textContent = wish.message;

item.appendChild(avatar);
item.appendChild(header);
item.appendChild(message);

wishesList.appendChild(item);

const flower =
    createWishFlower(
        wishesList.querySelectorAll(".wish-item").length - 1
    );

wishesList.appendChild(flower);
if (wishesMore) {
    wishesMore.hidden =
        visibleCount >= latestWishes.length;
}
        });

    } catch (error) {

        console.error(
            "Load wishes error:",
            error
        );

    }

}

loadWishes();






/* ==========================================================
   FALLING PETALS — SOFT
   CÁNH HOA
========================================================== */

function initializeFallingPetals() {

    const container =
        document.getElementById("petals-container");

    if (!container) {
        return;
    }

    const isMobile =
        window.innerWidth <= 480;

    const maxPetals =
        isMobile ? 12 : 18;

    function createPetal() {

        if (
            container.children.length >= maxPetals
        ) {
            return;
        }

        const petal =
            document.createElement("span");

        petal.className =
            "falling-petal";

        /* ------------------------------------------
           SIZE
        ------------------------------------------ */

        const size =
            isMobile
                ? Math.random() * 3 + 6
                : Math.random() * 4 + 7;

        petal.style.width =
            `${size}px`;

        petal.style.height =
            `${size * 1.35}px`;


        /* ------------------------------------------
           POSITION
        ------------------------------------------ */

        petal.style.left =
            `${Math.random() * 100}%`;


        /* ------------------------------------------
           MOVEMENT
        ------------------------------------------ */

        const driftX =
            (Math.random() - 0.5) * 180;

        const rotation =
            (Math.random() - 0.5) * 720;


        petal.style.setProperty(
            "--drift-x",
            `${driftX}px`
        );

        petal.style.setProperty(
            "--rotation",
            `${rotation}deg`
        );


        /* ------------------------------------------
           TIMING
        ------------------------------------------ */

        const fallDuration =
            Math.random() * 7 + 10;

        const swayDuration =
            Math.random() * 2 + 3;

        const delay =
            Math.random() * 2;


        petal.style.setProperty(
            "--fall-duration",
            `${fallDuration}s`
        );

        petal.style.setProperty(
            "--sway-duration",
            `${swayDuration}s`
        );

        petal.style.animationDelay =
            `${delay}s, 0s`;


        container.appendChild(petal);


        /* ------------------------------------------
           CLEAN UP
        ------------------------------------------ */

        setTimeout(() => {

            petal.remove();

        }, (fallDuration + delay) * 1000 + 500);

    }


    /* ------------------------------------------
       INITIAL PETALS
    ------------------------------------------ */

    for (
        let i = 0;
        i < maxPetals;
        i++
    ) {

        setTimeout(
            createPetal,
            Math.random() * 5000
        );

    }


    /* ------------------------------------------
       CONTINUOUS FLOW
    ------------------------------------------ */

    setInterval(() => {

        if (
            container.children.length <
            maxPetals
        ) {

            createPetal();

        }

    }, 1800);

}


/* ==========================================================
   OPENING PRELOAD
   Chỉ chuẩn bị các ảnh quan trọng trước khi mở thiệp.
   Không can thiệp Gallery hoặc các section khác.
========================================================== */

function initializeOpeningPreload() {
    
    const openingStartTime = performance.now();
    const MIN_OPENING_TIME = 3000;
    const opening = document.querySelector("#opening");
    const button = document.querySelector("#openInvitation");

    if (!opening || !button) {
        return;
    }

    const content =
        opening.querySelector(".opening-content");

    if (!content) {
        return;
    }
    
   const status =
    document.createElement("p");

status.className =
    "opening-loading-status";

status.textContent =
    "Đang chuẩn bị thiệp";

const dots =
    document.createElement("span");

dots.className =
    "opening-loading-dots";

dots.textContent =
    "";

status.appendChild(dots);

content.insertBefore(status, button);

let dotStep = 0;

const dotTimer =
    setInterval(() => {

        dotStep =
            (dotStep + 1) % 4;

        dots.textContent =
            ".".repeat(dotStep);

    }, 450);

button.disabled = true;
    button.setAttribute(
        "aria-disabled",
        "true"
    );

    button.textContent =
        "ĐANG CHUẨN BỊ...";


    const criticalImages = [
        WeddingData.opening.background,
        WeddingData.hero.image,
        WeddingData.groom.avatar,
        WeddingData.bride.avatar
    ].filter(Boolean);

const galleryImages =
    Array.isArray(WeddingData.gallery)
        ? WeddingData.gallery.filter(Boolean)
        : [];
    
    const preloadImage = (src) => {

    return new Promise((resolve) => {

        const image = new Image();

        image.onload = () => {

            /*
               Tải xong chưa đồng nghĩa bitmap đã
               decode xong. Chờ decode nếu browser hỗ trợ.
            */
            if (typeof image.decode === "function") {

                image.decode()
                    .catch(() => {})
                    .finally(resolve);

            } else {

                resolve();

            }

        };

        image.onerror = resolve;

        image.src = src;

    });

};

/*
   Gallery được preload song song trong background.

   KHÔNG đưa galleryImages vào Promise.all bên dưới,
   để người dùng không phải chờ toàn bộ Gallery
   mới được bấm MỞ THIỆP.
*/
galleryImages.forEach((src) => {
    preloadImage(src);
});
    
    Promise.all(
    criticalImages.map(preloadImage)
).then(() => {

    const elapsed =
        performance.now() -
        openingStartTime;

    const remaining =
        Math.max(
            0,
            MIN_OPENING_TIME - elapsed
        );

    setTimeout(() => {

    clearInterval(dotTimer);

    status.firstChild.textContent =
        "Thiệp đã sẵn sàng ♡";

    status.classList.add(
        "is-ready"
    );

        button.disabled = false;

        button.removeAttribute(
            "aria-disabled"
        );

        button.textContent =
            WeddingData.opening.buttonText ||
            "MỞ THIỆP";

    }, remaining);

});

}


/* ==========================================================
   HERO — TEXT REVEAL
   Animation bắt đầu sau khi Opening đóng
   Thứ tự:
   Monogram → Name → Date → Quote
========================================================== */

function initHeroTextReveal() {

    const hero =
        document.getElementById("hero");

    if (!hero) {
        return;
    }

    const textElements =
        hero.querySelectorAll(
            ".hero-monogram, " +
            ".hero-name, " +
            ".hero-date, " +
            ".hero-quote"
        );

    if (!textElements.length) {
        return;
    }


    /*
       Hero chưa animation ngay khi JS khởi tạo.

       Chờ Opening đóng xong rồi mới bắt đầu.
    */

    const startReveal = () => {

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                hero.classList.add(
                    "hero-text-visible"
                );

            });

        });

    };


    /*
       Opening tồn tại → chờ nó biến mất.
    */

    const opening =
        document.getElementById("opening");

    if (opening) {

        const openingObserver =
            new MutationObserver(() => {

                if (
                    !document.body.contains(opening)
                ) {

                    openingObserver.disconnect();

                    startReveal();

                }

            });

        openingObserver.observe(
            opening.parentNode,
            {
                childList: true
            }
        );

    } else {

        /*
           Nếu Opening không tồn tại,
           Hero chạy ngay.
        */

        startReveal();

    }

}


/* ==========================================================
   GLOBAL TEXT REVEAL — FINAL POLISH
   Reveal text khi người dùng scroll tới
   Chỉ dùng cho phần chưa có animation riêng
========================================================== */

function initGlobalTextReveal() {

    const textElements =
        document.querySelectorAll(
            "section h1, " +
            "section h2, " +
            "section h3, " +
            "section h4, " +
            "section p, " +
            "section li, " +
            "section small, " +
            "section figcaption, " +
            "section blockquote"
        );

    if (!textElements.length) {
        return;
    }


    /* ------------------------------------------------------
       LOẠI TRỪ CÁC PHẦN ĐÃ CÓ / SẼ CÓ ANIMATION RIÊNG
    ------------------------------------------------------ */

    const excludedSelectors = [

        /* Opening */
        "#opening",

        /* Hero — dùng animation riêng */
        "#hero",

        /* Couple — giữ animation card hiện tại */
        "#couple .couple-card",

        /* Ceremony — sẽ làm sequence riêng */
        "#ceremony",

        /* Gallery — tuyệt đối không đụng animation ảnh */
        "#gallery .gallery-item",

        /* RSVP — sẽ làm sequence riêng */
        "#rsvp",

        /* Wishes — sẽ làm sequence riêng */
        "#wishes",

        /* Những phần đã có hệ thống animation riêng */
        ".global-text-reveal",
        ".fade-in"

    ];


    const shouldExclude =
        (element) => {

            return excludedSelectors.some(
                (selector) =>
                    element.matches(selector) ||
                    element.closest(selector)
            );

        };


    /* ------------------------------------------------------
       CHỈ GIỮ ELEMENT THỰC SỰ CÓ TEXT
    ------------------------------------------------------ */

    const candidates =
        Array.from(textElements)
            .filter((element) => {

                if (shouldExclude(element)) {
                    return false;
                }

                const text =
                    element.textContent.trim();

                return text.length > 0;

            });


    if (!candidates.length) {
        return;
    }


    /* ------------------------------------------------------
       GÁN CLASS
       Delay chỉ tạo nhịp nhẹ giữa các text gần nhau
    ------------------------------------------------------ */

    candidates.forEach(
        (element, index) => {

            element.classList.add(
                "global-text-reveal"
            );

            const position =
                index % 4;

            if (position === 1) {

                element.dataset.textDelay =
                    "1";

            }

            else if (position === 2) {

                element.dataset.textDelay =
                    "2";

            }

            else if (position === 3) {

                element.dataset.textDelay =
                    "3";

            }

        }
    );


    /* ------------------------------------------------------
       INTERSECTION OBSERVER

       Scroll tới đâu → text hiện tới đó
       Mỗi text chỉ chạy một lần
    ------------------------------------------------------ */

    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "is-text-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }
                );

            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -40px 0px"
            }
        );


    candidates.forEach(
        (element) => {

            observer.observe(element);

        }
    );

}


/* ==========================================================
   RSVP — TEXT REVEAL
========================================================== */

function initRSVPTextReveal() {

    const rsvp = document.querySelector("#rsvp");

    if (!rsvp) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        rsvp.classList.add("rsvp-text-visible");
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) return;

                rsvp.classList.add("rsvp-text-visible");

                observer.unobserve(rsvp);

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    observer.observe(rsvp);
}

/* ==========================================================
   WISHES — TEXT REVEAL
========================================================== */

function initWishesTextReveal() {

    const wishes = document.querySelector("#wishes");

    if (!wishes) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        wishes.classList.add("wishes-text-visible");

        wishes
            .querySelectorAll(".wish-item")
            .forEach((item) => {
                item.classList.add("wish-item-visible");
            });

        return;
    }

    /* ------------------------------------------------------
       WISHES SECTION
    ------------------------------------------------------ */

    const wishesObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) return;

                wishes.classList.add("wishes-text-visible");

                wishesObserver.unobserve(wishes);

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    wishesObserver.observe(wishes);


    /* ------------------------------------------------------
       DYNAMIC WISH ITEMS
    ------------------------------------------------------ */

    const observeWishItems = () => {

        const wishItems = wishes.querySelectorAll(
            ".wish-item:not([data-wish-animation-ready])"
        );

        if (!wishItems.length) return;

        const wishItemObserver = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("wish-item-visible");

                    wishItemObserver.unobserve(entry.target);

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -30px 0px"
            }
        );

        wishItems.forEach((item) => {

            item.dataset.wishAnimationReady = "true";

            wishItemObserver.observe(item);

        });

    };


    /* Observe items already present */
    observeWishItems();


    /* Watch items loaded dynamically */
    const wishesList = wishes.querySelector(".wishes-list");

    if (!wishesList) return;

    const mutationObserver = new MutationObserver(() => {
        observeWishItems();
    });

    mutationObserver.observe(wishesList, {
        childList: true,
        subtree: true
    });

}


/* ==========================================================
   GIFT — TEXT REVEAL
========================================================== */

function initGiftTextReveal() {

    const gift = document.querySelector("#gift");

    if (!gift) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gift.classList.add("gift-text-visible");
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) return;

                gift.classList.add("gift-text-visible");

                observer.unobserve(gift);

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    observer.observe(gift);
}


/* ==========================================================
   FOOTER — TEXT REVEAL
========================================================== */

function initFooterTextReveal() {

    const footer = document.querySelector("footer");

    if (!footer) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        footer.classList.add("footer-text-visible");
        return;
    }

   const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            footer.classList.add("footer-text-visible");
            observer.unobserve(footer);
        });
    },
    {
        threshold: 0.7,
        rootMargin: "0px"
    }
); 

    observer.observe(footer);
}
