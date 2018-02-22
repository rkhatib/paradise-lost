import Vue from "vue"
import Vuex from "vuex"
import VueResource from 'vue-resource'

import mapConfig from '../data/map-config.json'
import placeData from '../data/places.csv'

Vue.use(Vuex)
Vue.use(VueResource)

export default new Vuex.Store({
    state: {
        baseLayer: null,
        overlayMap: null,
        overlayMapOpacity: 0.75,
        markerType: 'pin',

        selectedPlace: null,
        passagePaneOpen: false,
        activeDetailTab: "tab-passages",
        showGenesis: false
    },
    getters: {
        baseLayer: state => state.baseLayer || mapConfig.baseLayers[0],
        overlayMap: state => state.overlayMap || mapConfig.overlayMaps[0],

        markerType: state => state.markerType,

        selectedPlace: state => {
        	return state.selectedPlace || placeData.find((place) => place["Place"] === state.route.hash.substring(1))
        },
        passagePaneOpen: state => state.passagePaneOpen,
        activeDetailTab: state => state.activeDetailTab,
        showGenesis: state => state.showGenesis,

        overlayMapOpacity: state => state.overlayMapOpacity
    },
    mutations: {
    	setBaseLayer: (state, layerID) => state.baseLayer = layerID,
    	setOverlayMap: (state, mapID) => state.overlayMap = mapID,
        setMarkerType: (state, type) => state.markerType = type,

    	setSelectedPlace: (state, place) => state.selectedPlace = place,
    	setPassagePaneOpen: (state, open) => state.passagePaneOpen = open,
        setActiveDetailTab: (state, id) => state.activeDetailTab = id,
    	setShowGenesis: (state, show) => state.showGenesis = show,

    	setOverlayMapOpacity: (state, opacity) => state.overlayMapOpacity = opacity

    },
    actions: {
    	unselectPlace: (context) => {
    		context.commit('setSelectedPlace', null)
    		context.commit('setPassagePaneOpen', false)
    	},
        showPassages: (context) => {
            context.commit('setPassagePaneOpen', true)
            context.commit('setActiveDetailTab', "tab-passages")
        },
        showRelated: (context) => {
            context.commit('setPassagePaneOpen', true)
            context.commit('setActiveDetailTab', "tab-related")
        }
    }
})