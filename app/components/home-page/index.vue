<template>
    <div :class="homePage.container">
        <header>
            Анатолий Островский
        </header>
        <img :class="homePage.me" src="./me.jpg"/>
        <h1>Веб разработчик</h1>
        <ul>
            <li v-for="link in links">
                <a :href="link">{{link}}</a>
            </li>
        </ul>
    </div>
</template>
<style module="homePage" src="./index.scss"/>
<script src="./index.js"/>
