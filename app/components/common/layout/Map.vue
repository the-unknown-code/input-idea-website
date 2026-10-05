<script setup lang="ts">

const $map = ref<HTMLElement>()

const mapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#ffff00' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#757575' }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#ffff00' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#ffff00' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#ffff00' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#181818' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#ffff00' }] },
  { featureType: 'poi.park', elementType: 'labels.text.stroke', stylers: [{ color: '#1b1b1b' }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#2c2c2c' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#ffff00' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#373737' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3c3c3c' }] },
  { featureType: 'road.highway.controlled_access', elementType: 'geometry', stylers: [{ color: '#4e4e4e' }] },
  { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#ffff00' }] },
  { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#ffff00' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#ffff00' }] },
]

const pinSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48"><path d="M18 1C8.6 1 1 8.6 1 18c0 12.2 17 29 17 29s17-16.8 17-29C35 8.6 27.4 1 18 1Z" fill="#ffff00" stroke="#212121" stroke-width="2"/><circle cx="18" cy="18" r="6" fill="#212121"/></svg>'

const address = 'Via del Chionso 28/a, Reggio Emilia, Italy'
const location = { lat: 44.7089564, lng: 10.6497168 }
let mapInitialized = false

const initMap = () => {
  if (mapInitialized || !$map.value || !window.google?.maps) return

  const map = new window.google.maps.Map($map.value, {
    center: location,
    zoom: 16,
    styles: mapStyles,
    disableDefaultUI: true,
    clickableIcons: false,
    gestureHandling: 'none',
    keyboardShortcuts: false,
  })

  new window.google.maps.Marker({
    map,
    position: location,
    title: address,
    icon: {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(pinSvg)}`,
      scaledSize: new window.google.maps.Size(36, 48),
      anchor: new window.google.maps.Point(18, 48),
    },
  })
  mapInitialized = true
}

onMounted(() => {
  window.addEventListener('google-maps-ready', initMap)
  initMap()
})

onUnmounted(() => {
  window.removeEventListener('google-maps-ready', initMap)
})
</script>

<template>
  <section class="layout-map">
    <h2>vieni a <b>conoscerci</b></h2>
    <div class="layout-map__content layout-grid">
      <div ref="$map"></div>
      <div>
        <div class="block">
          <a-link :href="'tel:+393274237102'">
            <p class="p-small">+39 327 4237102</p>
            <ui-arrow />
          </a-link>
        </div>
        <div class="block">
          <a-link :href="'mailto:info@inputidea.it'">
            <p class="p-small">info@inputidea.it</p>
            <ui-arrow />
          </a-link>
        </div>
        <div class="block">
          <p class="p-small">Via del Chionso 28/a<br />Reggio Emilia</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.layout-map {
  position: relative;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;

  &:deep(.ui-arrow) {
    path {
      fill: var(--darkgrey);
    }
  }

  &__content {
    >div {
      grid-column: -1 / 1;

      &:nth-child(1) {
        aspect-ratio: 16 / 12;
        border-radius: 16px;
        overflow: hidden;
      }

      &:nth-child(2) {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 8px;

        @include desktop {
          gap: 16px;
        }
      }

      @include desktop {
        &:nth-child(1) {
          grid-column: span 8;
        }

        &:nth-child(2) {
          grid-column: span 4;

        }
      }
    }

    .block {
      background-color: var(--yellow);
      color: var(--darkgrey);
      border-radius: 16px;
      padding: 16px;

      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      &:deep(.a-div) {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }

      @include desktop {
        &:nth-child(1) {
          height: auto;
        }

        &:nth-child(2) {
          padding-top: 64px;
          height: auto;
        }

        &:nth-child(3) {
          padding-top: 64px;
          height: auto;
          flex-grow: 1;
        }
      }
    }
  }
}
</style>
