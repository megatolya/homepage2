<template>
    <div :class="homePage.container">
        <header>
            Анатолий Островский
        </header>
        <img :class="homePage.me" src="./me.jpg"/>
        <h1>Веб разработчик</h1>
        <ul :class="homePage.links">
            <li v-for="link in links">
                <a :href="link">{{link}}</a>
            </li>
        </ul>
        <br/>
        <iframe
            width="100%"
            height="166"
            scrolling="no"
            frameborder="no"
            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/319822638&amp;color=%23000000&amp;auto_play=false&amp;hide_related=false&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false&amp;show_teaser=true"
        ></iframe>
    </div>
</template>
<style module="homePage" src="./index.scss"/>
<script src="./index.js"/>
