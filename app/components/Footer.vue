<template>
    <footer>
        <div class="downloads">
            <a href="/files/CV_Lucas_Bigeard_2025.pdf" class="cv" download
                >Télécharger CV</a
            >
            <a href="/files/Lettre_de_recommandation.pdf" download
                >Télécharger lettre de recommandation</a
            >
        </div>
        <div class="networks">
            <h1>Réseaux</h1>
            <div class="logo-links">
                <a href="https://www.linkedin.com/in/lucas-bigeard">
                    <NuxtImg src="/images/Linkedin.svg" alt="HTML tutorial"
                /></a>
                <a href="https://github.com/LucWaw?tab=repositories">
                    <NuxtImg src="/images/Github-black.svg" alt="HTML tutorial"
                /></a>
                <a href="https://gitlab.com/users/LBigeard/projects">
                    <NuxtImg src="/images/Gitlab-black.svg" alt="HTML tutorial"
                /></a>
            </div>
        </div>
    </footer>
</template>

<style scoped>
footer {
    align-items: center;
    display: flex;
    justify-content: space-around;
    padding-bottom: 60px;
}

footer .contacts h1 {
    margin-bottom: 23px;
}

footer .contacts {
    align-items: center;
    display: flex;
    flex-direction: column;
}

footer .downloads {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 23px;
}

footer .downloads .cv {
    font-family: Roboto;
    font-style: normal;
    font-weight: 300;
    font-size: 35px;
    color: red;
}

footer .networks {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 23px;
}

footer .logo-links {
    align-items: center;
    display: flex;
    flex-direction: row;
    gap: 15px;
}

@media screen and (max-width: 996px) {
    footer {
        flex-direction: column;
        gap: 40px;
        justify-content: center;
    }

    footer .downloads .cv {
        font-size: 28px;
    }

    footer .logo-links img {
        width: 32px;
    }
}
</style>
