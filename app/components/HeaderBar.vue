<template>
    <header>
        <div class="left">
            <NuxtLink to="/" class="button_base">Lucas Bigeard</NuxtLink>
        </div>

        <div class="nav">
            <ul>
                <li>
                    <NuxtLink :to="{ path: '/', hash: '#about' }" class="button"
                        >À propos</NuxtLink
                    >
                </li>
                <li>
                    <NuxtLink to="/portfolio" class="button_page"
                        >Projets par technologies</NuxtLink
                    >
                </li>
            </ul>
        </div>
        <div class="right"></div>
    </header>
</template>
