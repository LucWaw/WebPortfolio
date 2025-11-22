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
                    <div class="calc"></div>
                    <div class="infos">
                        <img
                            class="logo_gitplatform"
                            src="/images/GitHub.svg"
                            alt="Logo de gitlab ou github en fonction de la plateforme"
                        />
                        <div class="text">
                            <h3>Nom du projet</h3>
                            <p>
                                List de commit : Lorem ipsum dolor sit amet,
                                consectetur adipiscing elit, sed do eiusmod
                                tempor incididunt ut labore et dolore magna
                                aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation ullamco laboris nisi ut aliquip ex
                                ea commodo consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum
                                dolore eu fugiat n
                            </p>
                        </div>
                    </div>

                    <img :src="item" alt="" />
                </div>
            </div>

            <button class="nav-arrow right">›</button>
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
    "https://cdn.pixabay.com/photo/2016/03/18/15/02/ufo-1265186_1280.jpg",
    "https://cdn.pixabay.com/photo/2017/02/11/10/33/spaceship-2057420_1280.jpg",
    "https://cdn.pixabay.com/photo/2024/03/13/19/06/ai-generated-8631634_1280.jpg",
    "https://cdn.pixabay.com/photo/2021/02/27/18/29/fantasy-6055404_1280.jpg",
    "https://cdn.pixabay.com/photo/2024/07/30/17/40/ai-generated-8932783_1280.jpg",
    "https://cdn.pixabay.com/photo/2020/03/09/15/59/scifi-4916165_1280.jpg",
];

import { onMounted } from "vue";

onMounted(() => {
    useHead({
        script: [{ src: "/carousel.js", defer: true }],
    });
});
</script>
