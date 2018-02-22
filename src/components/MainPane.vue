<template>
	<md-card-content class="main">
	  <div class="title">
	    <div class="line-1">Moralized Geography</div>
	    <div class="line-2">
	      <div class="heading-line"/>
	      <div class="heading-of">of</div>
	      <div class="heading-line"/>
	    </div>
	    <div class="line-3">Paradise Lost</div>
	  </div>
	  <md-divider></md-divider>

	  
	  
	  		<md-list class="transparent md-dense">
	  		  <md-list-item class="inset" md-expand :md-expanded.sync="expandBaseMaps">
	  		    <span class="md-list-item-text">Base Maps</span>
	  		    <md-list slot="md-expand" class="md-dense transparent">
	  		      <md-list-item class="inset selectable" v-bind:class="{ selected: $store.getters.baseLayer.id == baseLayer.id }" v-for="(baseLayer, index) in mapConfig.baseLayers" @click="$store.commit('setBaseLayer', baseLayer)">
	  		      	<span>{{ baseLayer.name }}</span>
	  						<md-icon>✓</md-icon>
	  		      </md-list-item>
	  		    </md-list>
	  		  </md-list-item>
	  		  <md-list-item class="inset" md-expand :md-expanded.sync="expandOverlayMaps">
	  		    <span class="md-list-item-text">Rectified Maps</span>
	  		    <md-list slot="md-expand" class="md-dense transparent">
	  		      <md-list-item class="inset selectable" v-bind:class="{ selected: $store.getters.overlayMap.id == overlayMap.id }" v-for="overlayMap in mapConfig.overlayMaps" @click="$store.commit('setOverlayMap', overlayMap)">
	  		      	<span>{{ overlayMap.name }}</span>
	  		      	<md-icon>✓</md-icon>
	  		      </md-list-item>
	  		      <md-list-item>
	  		        <input type="range" v-model="overlayMapOpacity" min="0" max="1" step="0.01"> {{ Math.round(overlayMapOpacity * 100) }}%
	  		      </md-list-item>
	  		    </md-list>
	  		  </md-list-item>
	  		  <md-list-item class="genesis inset">
	  		  	<span>Genesis</span>
	  		  	<md-switch v-model="showGenesis" />
	  		  </md-list-item>
	  		  <md-list-item class="inset"  md-expand :md-expanded.sync="expandMarkerOptions">
	  					<span class="md-list-item-text">Marker Types</span>
	  					<md-list slot="md-expand" class="md-dense transparent">
	  						<md-list-item>
	  							<md-radio v-model="markerType" value="pie">Pie Charts</md-radio>
	  						</md-list-item>
	  						<md-list-item>
	  							<md-radio v-model="markerType" value="pin">Pins</md-radio>
	  						</md-list-item>
	  					</md-list>
	  		  </md-list-item>
	  		</md-list>
	</md-card-content>
</template>

<script>

import mapConfig from '../data/map-config.json'

export default {
	name: "MainPane",
	data: () => ({
	  expandBaseMaps: true,
	  expandOverlayMaps: true,
	  expandMarkerOptions: false,
	  expandMainMenu: false
	}),
	computed: {
		mapConfig() { return mapConfig },
		overlayMapOpacity: {
		  get() { return this.$store.getters.overlayMapOpacity },
		  set(value) { this.$store.commit('setOverlayMapOpacity', value) }
		},
		showGenesis: {
		  get() { return this.$store.getters.showGenesis },
		  set(value) { this.$store.commit('setShowGenesis', value) }
		},
		markerType: {
			get() { return this.$store.getters.markerType },
			set(value) { this.$store.commit('setMarkerType', value) }
		}
	}
}
</script>

<style lang='scss' scoped>

.main {
	background: url(assets/paper_fibers_@2X.png) repeat;
	height: 100%;
}

.md-list.transparent {
	background-color: rgba(0, 0, 0, 0);
}

.md-list-item.genesis {
	align-items: space-between;
}

.inset .md-list-item-content {
	padding-left: 2em;
}

.md-list-item-expand {
	border-top: 0;
}

.selectable {
	align-items: space-between;

	&.selected .md-list-item-container {
		font-weight: bold;
	}

	.md-icon {
		display: none;
	}

	&.selected .md-icon {
		display: inline-flex;
	}
}

.title {
  display: flex;
  align-items: center;
  flex-direction: column;

  font-family: "Playfair Display", "Lato", sans-serif;
  font-weight: bold;
  text-transform: uppercase;

  color: #993333;

  padding-bottom: 1rem;


  .line-1 {
    font-size: 16px;
    line-height: 15px;
  }

  .line-2 {
    display: flex;
    flex-direction: row;
    width: 100%;
    line-height: 12px;
    font-size: 12px;
    align-items: center;

    .heading-line {
      flex: 1;
      background-color: #993333;
      height: 5px;
    }

    .heading-of {
      padding: 0 5px 0 5px;
    }
  }

  .line-3 {
    font-size: 26px;
  }

}
</style>