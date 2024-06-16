<script>
	import ErrorText from '$lib/components/ErrorText.svelte';
	import { page } from '$app/stores';
</script>

{#if $page.error?.message === 'Not Found'}
	<div class="text-center text-2xl">404 | Page Not Found</div>
{:else if $page.error?.message}
	<ErrorText text="Error: {$page.error?.message}" />
	<p>Please ping @omsin.zip on Discord if this keeps happening.</p>
{/if}
