<template>
  <div class="title-screen">
    <TitleScreenLogo />
  </div>
</template>

<script>
import TitleScreenLogo from "components/ui/TitleScreenLogo.vue";

export default {
  components: { TitleScreenLogo },

  data() {
    return {};
  },
}
</script>

<style scoped>
div.title-screen {
  height: 100%;
  width: 100%;
  background-color: red;
  background-image: url("cockpit.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

h1 {
  font-size: 8em;
  text-align: center;
  text-transform: uppercase;

  animation: gradient 15s ease infinite;

  /* background: -webkit-linear-gradient(#eee, #333); */
  /* background: radial-gradient(#e66465, #9198e5); */
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;

  /* background-size: 100%; */
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  /*text-stroke: #000;
  text-stroke-width: 2px;
  -webkit-text-stroke: #000;
  -webkit-text-stroke-width: 2px;*/
}

@keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}

div.overlay {
  font-family: monospace;
  height: calc(100vh - 32px);
  width: 100vw;
  padding: 1em;
  background-color: black;
  color: white;
  position: absolute;
}
div.overlay.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
