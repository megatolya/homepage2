<template>
    <div :class="app.app">
        <div :class="app.content">
            <home-page v-if="page === 'home'"></home-page>
            <h5 v-if="page === 'error'">Error</h5>
        </div>
        <footer :class="app.footer">
            © Анатолий Островский, {{year}}
        </footer>
    </div>
</template>
<style module="app" src="./index.scss"></style>
<script src="./index.js"></script>
