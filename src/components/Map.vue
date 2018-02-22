<template>
  <div>
    <div id="leaflet"></div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet-providers'
import 'leaflet.markercluster'
import 'Leaflet.vector-markers'

import MapPopup from './MapPopup.vue'
import Vue from 'Vue'

import dataGenesis from '../data/MappableGenesis_2018.csv' 
import placeData from '../data/places.csv'

import * as d3 from 'd3'
import { arc, pie } from 'd3-shape'

import marked from 'marked';

export default {
  components: { MapPopup },
  data: () => ({
    moralityColors: {
      good: "#4169e1",
      bad: "#b22222",
      neutral: "#555555",
      genesis: "green"
    }
  }),
  computed: {
    baseLayer() { return this.$store.getters.baseLayer },
    overlayMap() { return this.$store.getters.overlayMap },
    overlayMapOpacity() { return this.$store.getters.overlayMapOpacity },
    showGenesis() { return this.$store.getters.showGenesis },
    selectedPlace() { return this.$store.getters.selectedPlace },
    markerType() { return this.$store.getters.markerType }
  },
  watch: {
    baseLayer: {
      immediate: true,
      handler(newBaseLayer) {
        if (!newBaseLayer || !this.map) return
        this.setBaseLayer(newBaseLayer.id)
      }
    },
    overlayMap: {
      immediate: true,
      handler(newOverlayMap) {
        if (!newOverlayMap || !this.map) return
        this.setOverlayMap(newOverlayMap)
      }
    },
    markerType: {
      handler(newType) {
        this.addMarkers(newType)
      }
    },
    overlayMapOpacity: {
      handler(newOpacity) {
        this.currentOverlayMap && this.currentOverlayMap.setOpacity(newOpacity)
      }
    },
    showGenesis: {
      handler(showGenesis) {
        this.toggleGenesisMarkers(showGenesis)
      }
    },
    selectedPlace: {
      handler(place) {
        if (place) {
          this.resetRelated()
          this.selectPlaceOnMap(place)
        } else {
          this.unselectMarker()
        }
      }
    }
  },
  created() {

    this.resetRelated = function () {
      this.currentMarkers.eachLayer((marker) => marker._icon.classList.remove("related", "unrelated"))
    }

    this.unselectMarker = function () {
      this.map.closePopup()
      this.selectedMarker.unbindPopup()
      this.resetRelated()
      this.selectedMarker = null
    }

    this.selectPlaceOnMap = function(place) {
      this.selectedMarker = this.currentMarkers.getLayers().find((layer) =>  layer.options.title === place["Place"])
      // const markerLatLng = marker.getLatLng()
      // const [offsetLat, offsetLng] = marker.options.icon.options.popupAnchor
      // const popupLatLng = [markerLatLng.lat - offsetLat, markerLatLng.lat - offsetLng]
      // console.log(markerLatLng)
      // console.log(popupLatLng)
      // const popup = L.popup().setContent(this.makePopup(place))
      // marker
      // //popup.openOn(this.map)
      this.selectedMarker.bindPopup(this.makePopup(place))
      this.selectedMarker.openPopup()

      if (place["Related"]) {
        this.currentMarkers.eachLayer((marker) => {
          if (marker.options.place["Related"] === place["Related"]) {
            marker._icon.classList.add("related")
          } else {
            marker._icon.classList.add("unrelated")
          }
        })
      }
    }

    this.setBaseLayer = function(id) {
      this.currentBaseLayer && this.map.removeLayer(this.currentBaseLayer)
      this.currentBaseLayer = L.tileLayer.provider(id).addTo(this.map).bringToBack()
    }

    this.setOverlayMap = function(overlayMap) {
      this.currentOverlayMap && this.map.removeLayer(this.currentOverlayMap)
      this.currentOverlayMap = L.tileLayer(overlayMap.url, {
        maxZoom: 19,
        //opacity: app.currentOverlayOpacity,
        className: 'tile-layer'
      }).addTo(this.map).setOpacity(this.overlayMapOpacity).bringToFront()

      this.map.flyToBounds(overlayMap.bounds)

      //this.map.flyToBounds(this.currentOverlayMap.getBounds())
    }

    this.getMoralityProportions = function(markers) {
      const good = markers.reduce((sum, marker) =>  marker.options.morality === "good" ? sum + marker.options.weight : sum, 1)
      const bad = markers.reduce((sum, marker) =>  marker.options.morality === "bad" ? sum + marker.options.weight : sum, 1)
      const neutral = markers.reduce((sum, marker) =>  marker.options.morality === "neutral" ? sum + marker.options.weight : sum, 1)

      const max_weight = markers.reduce((max, marker) => Math.max(max, marker.options.weight), 0)
      const cumulated_weight = markers.reduce((weight, marker) => weight + marker.options.weight, 0)

      const total = good + bad + neutral
      return {
        good: good/total,
        bad: bad/total,
        neutral: neutral/total
      }
    }

    this.getIconSize = (length) => 30 + length

    this.makePopup = (place) => {
      const PopupComp = Vue.extend(MapPopup)
      const popup = new PopupComp({})
      popup.name = place["Place"]
      popup.comments = place["Comments"]
      popup.$store = this.$store
      popup.$on('opendetail', () => this.$store.dispatch('showPassages'))
      popup.$on('openrelated', () => this.$store.dispatch('showRelated'))
      popup.$mount()
      return popup.$el
    }

    this.addMarkers = (type) => {
      this.currentMarkers && this.map.removeLayer(this.currentMarkers)
      // this.currentMarkers = new L.MarkerClusterGroup({
      //   zoomToBoundsOnClick: false,
      //   maxClusterRadius: 35,
      //   disableClusteringAtZoom: 8,
      //   iconCreateFunction: (cluster) => {
      //     const markers = cluster.getAllChildMarkers()
      //     const proportions = this.getMoralityProportions(markers);
      //     const radius = this.getIconSize(markers.length)

      //     return L.divIcon({ html: 
      //       '<div position="relative">' + 
      //         '<div class="circ" style="position: absolute; opacity:' + proportions["good"] + ';background-color:' + this.moralityColors['good'] + ';width:'+radius+'px;height:'+radius+'px;">' + markers.length + '</div>' +
      //         '<div class="circ" style="position: absolute; opacity:' + proportions["bad"] + ';background-color:' + this.moralityColors['bad'] + ';width:'+radius+'px;height:'+radius+'px;">' + markers.length + '</div>' +
      //         '<div class="circ" style="position: absolute; opacity:' + proportions["neutral"] + ';background-color:' + this.moralityColors['neutral'] + ';width:'+radius+'px;height:'+radius+'px;">' + markers.length + '</div>' +
      //       '</div>'
      //       , iconSize: L.point(radius, radius) })
      //   }
      // })

      this.currentMarkers = L.featureGroup()


      const addPlaceMarkers = (data, morality) => {

        data.forEach(place =>  {
          const m = {}
          m[place["Postive"]] = "good"
          m[place["Negative"]] = "bad"
          m[place["Neutral"]] = "neutral"

          const max = Object.keys(m).reduce((max, key) => {return `${Math.max(max, key)}`}, 0)


          const moralityColors = this.moralityColors
          const scaleForWeight = (size, weight) => size + parseInt(weight) * 3 

          const iconFunctions = {
            "pie": function() {
              const good = parseInt(place["Postive"])
              const bad = parseInt(place["Negative"])
              const neutral = parseInt(place["Neutral"])

              const weight = good + bad + neutral


              const w = scaleForWeight(27, weight)
              const h = w

              const piedata = [good, bad, neutral]

              const color = d3.scaleOrdinal()
              //.domain(piedata)
              .range([moralityColors["good"], moralityColors["bad"], moralityColors["neutral"]]);

              const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

               const svg2 = d3.select(svg)
                            .attr('width', w)
                            .attr('height', h)
                            .append('g')
                            .attr('transform', `translate(${w / 2},${h / 2} )`)

              const theArc = arc()
                              .innerRadius(w / 2)
                              .outerRadius(0)

              const thePie = pie()
                            .value((d) => d)
                            .sort(null)

              const path = svg2.selectAll('path')
                            .data(thePie(piedata))
                            .enter()
                            .append('path')
                            .attr('d', theArc)
                            .attr('fill', (d, i) => color(i))
              // // https://css-tricks.com/creating-vue-js-component-instances-programmatically/

              const iconOptions = {
                iconSize: [ w, h ],
                className: 'vector-marker',
                extraIconClasses: 'pie-marker-icon',
                extraDivClasses: 'pie-marker',
                html: `
                <div style="position: relative;"><div style="position: absolute; width: ${w}px; height: ${h}px; top: 0; left: 0;">${(new window.XMLSerializer()).serializeToString(svg)}</div></div>`
              }

              //
              
              return L.divIcon(iconOptions)
            },
            "pin": function() {

              const good = parseInt(place["Postive"])
              const bad = parseInt(place["Negative"])
              const neutral = parseInt(place["Neutral"])

              const weight = good + bad + neutral



              const w = scaleForWeight(40, weight)
              const h = w

              const piedata = [good / weight, bad / weight, neutral / weight]

              const iconOptions = {
                iconSize: [ w, h ],
                iconAnchor: [ 15, 50 ],
                popupAnchor: [ 2, -40 ],
                shadowAnchor: [ 39, 45 ],
                shadowSize: [ w + 4, h + 4 ],
                className: 'vector-marker',
                prefix: 'fa',
                spinClass: 'fa-spin',
                extraIconClasses: '',
                extraDivClasses: '',
                icon: 'home',
                markerColor: 'blue',
                iconColor: 'white',
                viewBox: `0 0 ${w} ${h}`,
                html: `
                <div style="position: relative;"><svg width="${w}px" height="${h}px" viewbox="0 0 50 50">
                <path style="fill: white;}; opacity: 1;" d="M16,1c-8.285,0,-15,6.656,-15,14.865c0,8.211,15,35.135,15,35.135c0,0,15,-26.924,15,-35.135c0,-8.209,-6.718,-14.865,-15,-14.865l0,0z" />
                  <path style="fill: ${moralityColors['good']}; opacity: ${piedata[0]};" d="M16,1c-8.285,0,-15,6.656,-15,14.865c0,8.211,15,35.135,15,35.135c0,0,15,-26.924,15,-35.135c0,-8.209,-6.718,-14.865,-15,-14.865l0,0z" />
                  <path style="fill: ${moralityColors['bad']}; opacity: ${piedata[1]};" d="M16,1c-8.285,0,-15,6.656,-15,14.865c0,8.211,15,35.135,15,35.135c0,0,15,-26.924,15,-35.135c0,-8.209,-6.718,-14.865,-15,-14.865l0,0z" />
                  <path style="fill: ${moralityColors['neutral']}; opacity: ${piedata[2]};" d="M16,1c-8.285,0,-15,6.656,-15,14.865c0,8.211,15,35.135,15,35.135c0,0,15,-26.924,15,-35.135c0,-8.209,-6.718,-14.865,-15,-14.865l0,0z" />
                  
                </svg></div>`
              }

              return L.divIcon(iconOptions)
            }
          }


        

          L.marker([place["Latitude"], place["Longitude"]], {
            icon: iconFunctions[this.markerType](),
            opacity: 0.9,
            //fillOpacity: 0.8,
            fillColor: this.moralityColors[morality],
            color: this.moralityColors[morality],
            weight: parseInt(place["Weight"]),
            morality: morality,
            title: place["Place"],
            place: place
          })
          .bindTooltip(place["Place"])
          //.on('popupopen', () => this.$store.commit('setSelectedPlace', {place: place, router: this.$router}))
          .on('click', () => this.$router.push({hash: place["Place"]}))
          .on('mouseover', (e) => e.target.setZIndexOffset(1000) )
          .on('mouseout', (e) => e.target.setZIndexOffset(0) )
          //.on('popupclose', () => this.$store.dispatch('unselectPlace', this.$router))
          //.on('popupclose', () => this.$router.push({hash: ""}))
          .addTo(this.currentMarkers)
          })
      }

      // addPlaceMarkers(dataPositive, "good")
      // addPlaceMarkers(dataNegative, "bad")
      // addPlaceMarkers(dataNeutral, "neutral")

      addPlaceMarkers(placeData, "good")


      this.map
        .addLayer(this.currentMarkers)
        //.setMaxBounds(this.currentMarkers.getBounds())
    }

    this.toggleGenesisMarkers = (show) => {
      if (show == false && this.genesisMarkers) {
        this.map.removeLayer(this.genesisMarkers)
        this.genesisMarkers = null
      } else if (show == true) {
        this.genesisMarkers = new L.MarkerClusterGroup({
          zoomToBoundsOnClick: false,
          maxClusterRadius: 35,
          disableClusteringAtZoom: 8,
          //showCoverageOnHover: false,
          iconCreateFunction: (cluster) => {
            const markers = cluster.getAllChildMarkers()

            //var radius = Math.min(width, height) / 2;
            var radius = this.getIconSize(markers.length)

            return L.divIcon({html: '<div class="circ" style="opacity: 0.75; background-color:' + this.moralityColors['genesis'] + ';width:'+radius+'px;height:'+radius+'px;">' + markers.length + '</div>', iconSize: L.point(radius,radius) })
          }
        })

        dataGenesis.forEach((place) => {
          const icon = L.VectorMarkers.icon({
            markerColor: this.moralityColors['genesis']
          })


          L.marker([place["Latitude"], place["Longitude"]], {
            title: place["Place"],
            opacity: 0.85,
            morality: "genesis",
            weight: 1,
            icon: icon
          })
          .bindTooltip(place["Place"])
          .bindPopup((marker) => this.makePopup(marker, place) )
          .on('click', () => this.$store.commit('setSelectedPlace', place))
          .addTo(this.genesisMarkers)
        })

        this.genesisMarkers.addTo(this.map)
      }
    }
  },
  mounted() {
    this.map = L.map('leaflet', {zoomControl: false, maxZoom: 18}).setView([32.738, 36.560], 4)
      .on('click', () => this.$router.push({hash: ""}))
    L.control.zoom({position: 'bottomleft'}).addTo(this.map)
    this.setBaseLayer(this.baseLayer.id)
    this.setOverlayMap(this.overlayMap)
    this.addMarkers(this.markerType)
    this.toggleGenesisMarkers(this.showGenesis)

    if (this.selectedPlace) {
      this.selectPlaceOnMap(this.selectedPlace)
    }
  }
};
</script>

<style lang='scss' scoped>

  @import 'node_modules/leaflet/dist/leaflet';
  @import 'node_modules/leaflet.markercluster/dist/MarkerCluster';
  @import 'node_modules/leaflet.markercluster/dist/MarkerCluster.Default';
  /*@import 'node_modules/Leaflet.vector-markers/dist/leaflet-vector-markers';*/


  #leaflet {
     width: 100%;
    height: 100%;
  }

  .leaflet-popup-content-wrapper {
    font: inherit;
    background: url(assets/paper_fibers_@2X.png) repeat;
  }

  .circ {
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: bold;
    color: white;
  }

  .leaflet-div-icon {
    border: none;
    background-color: transparent;
  }

  .vector-marker {
    transition: transform 1s ease-out;
  }

  .vector-marker svg {
    transition: opacity 0.7s ease-out, transform 0.7s ease-out;
  }

  .vector-marker path {
    stroke: none;
  }

  .related svg {
    transform: scale(1.5);

  }

  .unrelated svg {
    transform: scale(0.75);
    opacity: 0.55;
  }

</style>