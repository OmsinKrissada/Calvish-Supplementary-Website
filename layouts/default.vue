<template>

	<Head>
		<Title>Calvish Guild</Title>
		<Meta name="description" content="Description here" />
		<Meta name="twitter:title" content="HW Tracker | Beta" />
		<Meta name="og:type" content="website" />
		<Meta name="og:title" content="HW Tracker | Beta" />
		<Meta name="og:description" content="สมุดจดการบ้านของห้อง 6/1" />
		<Meta name="twitter:description" content="สมุดจดการบ้านของห้อง 6/1" />
	</Head>
	<!-- <div class="min-h-screen bg-[#1A202C]"> -->
	<!-- <div> -->
	<div class="flex flex-col lg:flex-row relative min-h-screen p-4 sm:p-10 bg-[hsl(0,0%,5%)] text-slate-200">
		<TheNav class="lg:sticky top-10 z-20" />
		<div class="relative lg:hidden h-1 w-12 mx-auto my-10 bg-emerald-500 rounded z-10" />
		<div class="relative flex-grow z-10">
			<slot />
		</div>
		<Banner class="hidden sm:block sm:fixed top-80 right-10 -translate-x-1/2 scale-[2] brightness-[0.25] blur-sm" />

	</div>
</template>