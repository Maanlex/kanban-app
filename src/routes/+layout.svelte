<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';
	import '../app.postcss';

</script>

<div class="flex flex-col min-h-screen">
	<NavBar/>
	<slot />
</div>
	
