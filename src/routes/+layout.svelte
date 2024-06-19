<script lang="ts">
	import { AppBar, AppLayout, Card, Button, NavItem, Tooltip, settings } from 'svelte-ux';

	import { page } from '$app/stores';
	import '../app.postcss';

</script>

<div class="flex flex-col min-h-screen">
	<slot />
</div>
	
