<template>
    <section class="portfolio_carousel">
        <div class="carousel-container">
            <button class="nav-arrow left">‹</button>

            <div class="carousel-track">
                <div
                    class="card"
                    v-for="(item, i) in images"
                    :key="i"
                    :data-index="i"
                >
                    <img :src="item" alt="" />
                </div>
            </div>

            <button class="nav-arrow right">›</button>
        </div>

        <div class="member-info">
            <h2 class="member-name" style="display: none">Name</h2>
            <p class="member-role" style="display: none">Role</p>
        </div>

        <div class="dots">
            <div
                class="dot"
                v-for="(_, i) in images"
                :key="i"
                :data-index="i"
            />
        </div>
    </section>
</template>

<script setup>
const images = [
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=3687...",
    "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=3870...",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900...",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900...",
    "https://images.unsplash.com/photo-1655249481446-25d575f1c054?w=900...",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80...",
];

useHead({
    script: [{ src: "/carousel.js", defer: true }],
});
</script>
