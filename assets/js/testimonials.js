/**
 * SkillWise Testimonials Module
 * Star rating and review slider functionality with strict TypeScript typing
 */
// ============================================================
// Constants
// ============================================================
const STAR_CLASS_MAP = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five'
};
const AUTO_SLIDE_INTERVAL = 3000;
// ============================================================
// DOM Element Accessors
// ============================================================
function getStars() {
    return document.getElementsByClassName('star');
}
function getOutputElement() {
    return document.getElementById('output');
}
function getRatingForm() {
    return document.getElementById('ratingForm');
}
function getPopupElement() {
    return document.getElementById('popup');
}
function getReviewInput() {
    return document.getElementById('reviewInput');
}
function getSlideButtons() {
    return document.querySelectorAll('.btn');
}
function getSlideRow() {
    return document.getElementById('slide-row');
}
function getMainElement() {
    return document.querySelector('main');
}
// ============================================================
// Star Rating Functions
// ============================================================
/**
 * Check if rating is valid StarRating type
 */
export function isValidRating(n) {
    return n >= 1 && n <= 5 && Number.isInteger(n);
}
/**
 * Get star class name for rating
 */
export function getStarClassName(rating) {
    return STAR_CLASS_MAP[rating];
}
/**
 * Remove all star styling classes
 */
export function removeStarStyles(stars) {
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        if (star !== undefined) {
            star.className = 'star';
        }
    }
}
/**
 * Apply star rating styling
 */
export function applyStarRating(stars, rating) {
    removeStarStyles(stars);
    const className = getStarClassName(rating);
    for (let i = 0; i < rating; i++) {
        const star = stars[i];
        if (star !== undefined) {
            star.className = `star ${className}`;
        }
    }
}
/**
 * Update rating output text
 */
export function updateRatingOutput(output, rating) {
    output.innerText = `Rating is: ${rating}/5`;
}
/**
 * Set rating (combined function for external use)
 */
export function setRating(rating, stars, output) {
    if (!isValidRating(rating)) {
        return;
    }
    applyStarRating(stars, rating);
    if (output !== null) {
        updateRatingOutput(output, rating);
    }
}
/**
 * gfg - Main rating update function (preserving original name for compatibility)
 */
export function gfg(n) {
    const stars = getStars();
    const output = getOutputElement();
    if (!isValidRating(n)) {
        return;
    }
    setRating(n, stars, output);
}
/**
 * remove - Remove star styling (preserving original name for compatibility)
 */
export function remove() {
    const stars = getStars();
    removeStarStyles(stars);
}
// ============================================================
// Rating Validation
// ============================================================
/**
 * Parse current rating from output text
 */
export function parseCurrentRating(outputText) {
    if (outputText === '' || outputText.trim() === '') {
        return 0;
    }
    const parts = outputText.split('/')[0];
    if (parts === undefined) {
        return 0;
    }
    const ratingParts = parts.split(': ')[1];
    if (ratingParts === undefined) {
        return 0;
    }
    const rating = parseInt(ratingParts, 10);
    return isNaN(rating) ? 0 : rating;
}
/**
 * Validate that at least 1 star is selected
 */
export function validateRating(output) {
    if (output === null) {
        return false;
    }
    const rating = parseCurrentRating(output.innerText);
    if (rating < 1) {
        gfg(1); // Select 1 star if no rating selected
        return true;
    }
    return rating >= 1;
}
// ============================================================
// Form Submission
// ============================================================
/**
 * Show success popup temporarily
 */
export function showSuccessPopup(popup, duration = 2000) {
    return new Promise((resolve) => {
        popup.style.display = 'block';
        setTimeout(() => {
            popup.style.display = 'none';
            resolve();
        }, duration);
    });
}
/**
 * Reset rating form
 */
export function resetRatingForm(stars, output, reviewInput) {
    removeStarStyles(stars);
    if (output !== null) {
        output.innerText = '';
    }
    if (reviewInput !== null) {
        reviewInput.value = '';
    }
}
// ============================================================
// Review Slider Functions
// ============================================================
/**
 * Create initial slide state
 */
export function createSlideState() {
    return {
        currentIndex: 0,
        intervalId: null
    };
}
/**
 * Calculate slide translation value
 */
export function calculateSlideTranslation(currentIndex, mainWidth) {
    return currentIndex * -mainWidth;
}
/**
 * Update slide position
 */
export function updateSlidePosition(slideRow, translateValue) {
    slideRow.style.transform = `translateX(${translateValue}px)`;
}
/**
 * Update button active states
 */
export function updateButtonActiveStates(buttons, currentIndex) {
    buttons.forEach((btn, index) => {
        btn.classList.toggle('active', index === currentIndex);
    });
}
/**
 * Update slide display
 */
export function updateSlide(slideRow, mainElement, buttons, currentIndex) {
    if (slideRow === null || mainElement === null) {
        return;
    }
    const mainWidth = mainElement.offsetWidth;
    const translateValue = calculateSlideTranslation(currentIndex, mainWidth);
    updateSlidePosition(slideRow, translateValue);
    updateButtonActiveStates(buttons, currentIndex);
}
/**
 * Get next slide index
 */
export function getNextSlideIndex(currentIndex, totalSlides) {
    return (currentIndex + 1) % totalSlides;
}
// ============================================================
// Initialization
// ============================================================
/**
 * Initialize star rating functionality
 */
export function initStarRating() {
    const form = getRatingForm();
    const output = getOutputElement();
    const popup = getPopupElement();
    const reviewInput = getReviewInput();
    const stars = getStars();
    if (form !== null) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateRating(output) && popup !== null) {
                void showSuccessPopup(popup).then(() => {
                    resetRatingForm(stars, output, reviewInput);
                });
            }
        });
    }
}
/**
 * Initialize review slider
 */
export function initReviewSlider() {
    const buttons = getSlideButtons();
    const slideRow = getSlideRow();
    const main = getMainElement();
    const state = createSlideState();
    // Set up button click handlers
    buttons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            state.currentIndex = index;
            updateSlide(slideRow, main, buttons, state.currentIndex);
        });
    });
    // Handle window resize
    window.addEventListener('resize', () => {
        updateSlide(slideRow, main, buttons, state.currentIndex);
    });
    // Start auto-slide
    state.intervalId = setInterval(() => {
        state.currentIndex = getNextSlideIndex(state.currentIndex, buttons.length);
        updateSlide(slideRow, main, buttons, state.currentIndex);
    }, AUTO_SLIDE_INTERVAL);
    return state;
}
/**
 * Initialize testimonials module
 */
export function initTestimonials() {
    initStarRating();
    initReviewSlider();
}
// Export constants for testing
export { STAR_CLASS_MAP, AUTO_SLIDE_INTERVAL };
