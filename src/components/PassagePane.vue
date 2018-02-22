<template>
	<div class="wrap" v-if="$store.getters.selectedPlace">
		<div class="body">
			<md-card-header>
			  <div class="md-title">{{ selectedPlace["Place"] }}</div>
			  <!-- <div class="md-subhead">Passage</div> -->
			</md-card-header>
			<md-card-content v-html="$options.filters.markdown(selectedPlace['Comments'])">
			</md-card-content>
			<md-divider />
			<md-card-content class="content">
			  <md-tabs class="md-transparent" v-bind:md-dynamic-height="true" v-bind:md-active-tab="activeDetailTab">
			  	<md-tab id="tab-passages" md-label="Passages">
					 <div class="content">
						  <div class="passage" v-for="passage in parsedPassages">
						  	<div class="passage-text morality" v-bind:class="passage.morality">{{ passage.text }}</div>
							<div class="reference">({{ passage.pos }})</div>
						  </div>
					 </div>
			  	</md-tab>
			  	<md-tab id="tab-related" md-label="Related Locations">
			  		  <div class="passage" v-for="place in relatedPlaces">
			  		  	<div><a v-bind:href="'#' + place['Place']">{{place["Place"] }}</a></div>
			  		  	<div v-html="$options.filters.markdown(selectedPlace['Comments'])"></div>
			  		  </div>
			  	</md-tab>
			  </md-tabs>
			</md-card-content>
		</div>
		<md-card-actions>
			<md-button @click="$store.commit('setPassagePaneOpen', false)">Close</md-button>
		</md-card-actions>
	</div>
</template>

<script>
import marked from 'marked';

import placeData from '../data/places.csv'
export default {
	name: "PassagePane",
	computed: {
		selectedPlace() { return this.$store.getters.selectedPlace },
		activeDetailTab() { return this.$store.getters.activeDetailTab },
		parsedPassages() {
			// https://blog.mastykarz.nl/regular-expressions-in-javascript-dont-support-the-single-line-mode/
			// https://regex101.com/r/zACvGs/1
			const regex = new RegExp("\\\"([\\s\\S]*?)\\\"\\s+\\((.*?)\\)\\s+\\[(.*?)\\];?", "g")
			let match = null
			const passages = []

			while ( (match = regex.exec(this.selectedPlace["Content"])) !== null) {
				passages.push({
					text: match[1],
					pos: match[2],
					morality: match[3]
				})		
			}

			return passages
		},
		relatedPlaces() {
			return placeData
					.filter(place => place["Related"] === this.selectedPlace["Related"] && place["Place"] !== this.selectedPlace["Place"])
		}
	},
	filters: {
		markdown: value => marked(value)
	}
}
</script>

<style lang='scss' scoped>

.md-drawer {
	background: linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%), url(assets/ricepaper_v3_@2X.png) repeat;
}

.body {
	display: flex;
	flex-direction: column;
}

.md-tabs-content {
	height: 100%;
}

.wrap {
	display:flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
}

.content {
	overflow-y: auto;
	overflow-x: hidden;
}

.passage {
	margin-bottom: 1em;
}

.reference {
	text-align: right;
	font-style: italic;
}

.morality {
	border-left: solid 6px;
	padding-left: 0.5rem;

	&.positive {
	  border-color: #4169e1;
	}
	&.negative {
	  border-color: #b22222;
	}
	&.neutral {
		border-color: #555555;
	}

}

.passage-text {
	white-space: pre;
}
</style>