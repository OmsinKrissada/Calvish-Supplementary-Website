import { dev } from '$app/environment';

export async function load({ url, getClientAddress, isDataRequest, isSubRequest, platform }) {
	if (dev) return;
	fetch(`http://ip-api.com/json/${getClientAddress()}?fields=66846719`).then(res => res.json()).then(async ipData => {
		const body = {
			content: `--------------------------\nComing from \`${getClientAddress()}\` to ${url.pathname}\nAddress Info: \`\`\`json\n${JSON.stringify(ipData, null, '    ')}\`\`\`\n`
		};
		const res = await fetch('https://discord.com/api/webhooks/1142337339209809920/xrH2LhO9GKrI_ZOOiNzlZd2UAA-lkrK1kwqkdm8TuONli3dBEkvLyZGmU5bsATQkwOwT', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
	});
};