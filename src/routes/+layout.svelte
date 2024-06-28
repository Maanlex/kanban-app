<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';
	import '../app.postcss';
	import {Toast} from '@svelte-kit/svelte-toast';

</script>

<div class="flex flex-col min-h-screen">
	<NavBar/>
	<div class="mt-14">
		<slot />
	</div>
	
</div>
<Toast position="bottom-right"/>
