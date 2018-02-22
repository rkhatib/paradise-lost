<template>

  <div class="app">
    <Map class="map"></Map>
    <div class="overlay">
      <md-card class="menu-button">
        <md-button class="md-icon-button" @click="mainPaneOpen = true">
                <md-icon md-src="assets/ic_menu_black_48px.svg" />
        </md-button>
      </md-card>
      <md-drawer md-permanent="card" class="controls" :md-active.sync="mainPaneOpen">
        <MainPane />
       <!--  <md-card-actions>
          <md-button @click="showAbout = true">About the Project</md-button>
        </md-card-actions> -->
      </md-drawer>
      <md-drawer class="md-right" :md-active.sync="passagePaneOpen">
        <PassagePane />
      </md-drawer>
      <!-- <PassagePane class="passage-pane" v-if="$store.getters.passagePaneOpen && $store.getters.selectedPlace" /> -->
    </div>

    <md-dialog :md-active.sync="showAbout">
        <md-dialog-title>Preferences</md-dialog-title>

        <md-tabs md-dynamic-height>
          <md-tab md-label="General">
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam mollitia dolorum dolores quae commodi impedit possimus qui, atque at voluptates cupiditate. Neque quae culpa suscipit praesentium inventore ducimus ipsa aut.</p>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam mollitia dolorum dolores quae commodi impedit possimus qui, atque at voluptates cupiditate. Neque quae culpa suscipit praesentium inventore ducimus ipsa aut.</p>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam mollitia dolorum dolores quae commodi impedit possimus qui, atque at voluptates cupiditate. Neque quae culpa suscipit praesentium inventore ducimus ipsa aut.</p>
          </md-tab>

          <md-tab md-label="Activity">
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam mollitia dolorum dolores quae commodi impedit possimus qui, atque at voluptates cupiditate. Neque quae culpa suscipit praesentium inventore ducimus ipsa aut.</p>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam mollitia dolorum dolores quae commodi impedit possimus qui, atque at voluptates cupiditate. Neque quae culpa suscipit praesentium inventore ducimus ipsa aut.</p>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam mollitia dolorum dolores quae commodi impedit possimus qui, atque at voluptates cupiditate. Neque quae culpa suscipit praesentium inventore ducimus ipsa aut.</p>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam mollitia dolorum dolores quae commodi impedit possimus qui, atque at voluptates cupiditate. Neque quae culpa suscipit praesentium inventore ducimus ipsa aut.</p>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam mollitia dolorum dolores quae commodi impedit possimus qui, atque at voluptates cupiditate. Neque quae culpa suscipit praesentium inventore ducimus ipsa aut.</p>
          </md-tab>

          <md-tab md-label="Account">
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam mollitia dolorum dolores quae commodi impedit possimus qui, atque at voluptates cupiditate. Neque quae culpa suscipit praesentium inventore ducimus ipsa aut.</p>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam mollitia dolorum dolores quae commodi impedit possimus qui, atque at voluptates cupiditate. Neque quae culpa suscipit praesentium inventore ducimus ipsa aut.</p>
          </md-tab>
        </md-tabs>

        <md-dialog-actions>
          <md-button class="md-primary" @click="showAbout = false">Close</md-button>
          <md-button class="md-primary" @click="showAbout = false">Save</md-button>
        </md-dialog-actions>
      </md-dialog>

  </div>

</template>

<script>

import Map from './Map.vue'
import PassagePane from './PassagePane.vue'
import MainPane from './MainPane.vue'

export default {
  name: "app",
  data: () => ({
    mainPaneOpen: false,
    showAbout: false
  }),
  components: {
    Map, PassagePane, MainPane
  },
  computed: {
    passagePaneOpen: {
      get() { return this.$store.getters.passagePaneOpen },
      set(value) { this.$store.commit('setPassagePaneOpen', value) }
    },
    selectedPlace() { return this.$store.getters.selectedPlace },
  },
  watch: {
    '$route'(to, from) {
      console.log(to) 
    },
    selectedPlace(place) {
      if (!place) {
        this.$store.commit('setPassagePaneOpen', false)
      }
    }
  }
  // created() {
  //   this.$store.dispatch('loadMapConfig')
  // },
};
</script>

<style lang='scss'>

@import url(https://fonts.googleapis.com/css?family=Playfair%20Display:bold,black);
@import url(https://fonts.googleapis.com/css?family=Lato:bold,black,regular);
@import 'node_modules/vue-material/src/components/MDLayout/mixins';

html, body, .app { height: 100%; margin: 0;}

body {
  display: flex;
  flex-flow: column wrap;
  background-color: grey;

  --md-theme-default-background: rgba(0, 0, 0, 0);
}

.app, .map, .overlay {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.app {
  position: relative;
  font-family: "Lato", "Roboto", sans-serif;
  text-shadow:0 0 1px transparent;
  text-rendering: optimizeLegibility;
}

h1, h2, h3, h4, h5, h6, .md-title {
  color: #993333;
  font-family: "Playfair Display";
}

.md-title {
  font-size: 1.8em;
  font-weight: bold;
}

.map {
  z-index: 1;
}

.overlay {
  z-index: 2;
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  pointer-events: none;

  align-items: flex-start;
  /*justify-content: space-between;*/

  > * {
    pointer-events: auto;
  }
}

.menu-button {
  @include md-layout-small-and-up {
    display: none;
  }

  margin: 0.5rem;

  .md-icon-button {
    margin: 0;
  }
}

.controls {
  /*margin: 1rem;*/
  width: auto;

  h1, h2 {
    font-size: 1vw;
  }
}

.passage-pane {
  margin: 1rem;
  width: 33vw;
}
</style>