<template>
    <div>
        <NuxtRouteAnnouncer />
        <HeaderBar />
        <NuxtPage />
        <hr />
        <FooterBar />
    </div>
</template>
<style>
@import "@/assets/style.css";

hr {
    margin-top: 60px;
    margin-bottom: 60px;
    border: none;
    width: 100%;
    height: 1px;
    background-color: #cdd5df;
}
</style>
