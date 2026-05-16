<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Restaurant } from '$lib/types';
	import L from 'leaflet';

	interface Props {
		restaurants: Restaurant[];
		userLocation?: [number, number] | null;
		onSelectRestaurant?: (restaurant: Restaurant) => void;
		onUserLocationChange?: (loc: [number, number]) => void;
	}

	let { restaurants, userLocation, onSelectRestaurant, onUserLocationChange }: Props = $props();

	let mapEl: HTMLDivElement;
	let map: L.Map | null = null;
	let markersLayer: L.LayerGroup | null = null;
	let userMarker: L.Marker | null = null;

	function makePin(color = '#10b981') {
		return L.divIcon({
			html: `<div style="
				background:${color};
				width:20px;height:20px;
				border-radius:50%;
				border:3px solid white;
				box-shadow:0 2px 6px rgba(0,0,0,.35);
				cursor:pointer;
			"></div>`,
			className: '',
			iconSize: [20, 20],
			iconAnchor: [10, 10]
		});
	}

	function renderMarkers() {
		if (!markersLayer) return;
		markersLayer.clearLayers();
		restaurants.forEach((r) => {
			const marker = L.marker([r.lat, r.lng], { icon: makePin() });
			marker.on('click', () => onSelectRestaurant?.(r));
			markersLayer!.addLayer(marker);
		});
	}

	onMount(() => {
		map = L.map(mapEl, { zoomControl: true }).setView([48.8566, 2.3522], 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			maxZoom: 19
		}).addTo(map);

		markersLayer = L.layerGroup().addTo(map);
		renderMarkers();

		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
				onUserLocationChange?.(loc);

				if (userMarker) userMarker.remove();
				userMarker = L.marker(loc, {
					icon: makePin('#3b82f6'),
					title: 'Votre position'
				})
					.addTo(map!)
					.bindPopup('<b>Vous êtes ici</b>');

				map!.setView(loc, 15);
			},
			() => {}
		);

		return () => {
			map?.remove();
		};
	});

	onDestroy(() => {
		map?.remove();
	});

	$effect(() => {
		const _ = restaurants;
		renderMarkers();
	});
</script>

<div bind:this={mapEl} class="w-full h-full z-0"></div>
