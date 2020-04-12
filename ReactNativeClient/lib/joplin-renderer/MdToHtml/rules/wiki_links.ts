const regex = /\[\[([\w\s/]+)(\|([\w\s/]+))?\]\]/;

function installRule(markdownIt: any) {
	// parser
	markdownIt.inline.ruler.push('wiki_links', (state: any, silent: boolean) => {
		const match = regex.exec(state.src.slice(state.pos));
		if (!match) return false;

		state.pos += match[0].length;
		if (!silent) {
			const token = state.push('wiki_links', '', 0);
			token.meta = { match: match };
		}
		return true;
	});

	// renderer
	markdownIt.renderer.rules.wiki_links = (tokens: any[], idx: number) => {
		const token = tokens[idx];
		const match = token.meta.match;
		const isSplit = !!match[3];
		const label = isSplit ? match[3] : match[1];
		const note = match[1];
		return `<a href="joplin://by_title?${encodeURIComponent(
			note
		)}">${label}</a>`;
	};
}

export default function() {
	return (markdownIt: any) => {
		installRule(markdownIt);
	};
}
