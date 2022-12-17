<template>

	<Head>
		<Title>Calvish Guild</Title>
		<!-- <Meta name="description" content="Description here" /> -->
		<Meta name="twitter:title" content="Calvish Guild" />
		<Meta name="og:type" content="website" />
		<Meta name="og:title" content="Calvish Guild" />
		<!-- <Meta name="og:description" content="สมุดจดการบ้านของห้อง 6/1" /> -->
		<!-- <Meta name="twitter:description" content="สมุดจดการบ้านของห้อง 6/1" /> -->
	</Head>
	<!-- <div class="min-h-screen bg-[#1A202C]"> -->
	<!-- <div> -->
	<div class="fixed min-h-screen w-full bg-black" />
	<div class="fixed min-h-screen w-full bg-gradient-to-b from-black to-purple-900/30" />

	<div class="flex flex-col lg:flex-row relative min-h-screen p-4 pt-10 sm:p-10 text-slate-200">
		<TheNav class="lg:sticky top-10 lg:mr-8 z-20" />
		<div class="relative lg:hidden h-1 w-12 mx-auto my-10 bg-emerald-500 rounded z-10" />
		<div class="relative flex-grow z-10">
			<slot />
		</div>
		<Banner class="hidden sm:block sm:fixed top-80 right-10 -translate-x-1/2 scale-[2] brightness-[0.25] blur-sm" />

	</div>
	<div class="hidden lg:block lg:fixed bottom-0 h-32 w-full bg-gradient-to-t from-black/40 to-transparent z-10" />
</template>