<template>
    <header>
        <div class="gauche">
            <NuxtLink to="/" class="button_base">Lucas Bigeard</NuxtLink>
        </div>

        <nav class="droite">
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
        </nav>
    </header>
</template>
