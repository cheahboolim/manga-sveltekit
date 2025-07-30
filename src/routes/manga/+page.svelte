<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData; // This prop receives the return value from server actions

	// --- THE CRITICAL FIX ---
	// Use a reactive declaration ($:) to destructure the data prop.
	// This ensures these variables automatically update whenever 'data' changes.
	$: ({ manga, count, tags } = data);

	let selectedIds: string[] = [];
	let editingId: string | null = null;
	let newTitle = '';

	// This reactive block handles clearing selections when the data reloads after any action
	$: if (manga) {
		selectedIds = [];
		editingId = null;
	}

	// This reactive block shows a feedback message after a form action (delete/update) completes.
	// This is the idiomatic SvelteKit way to handle action results.
	$: if (form?.message) {
		alert(form.message); // You can replace this with a toast notification
	}

	function toggleSelectAll() {
		if (selectedIds.length === manga.length) {
			selectedIds = [];
		} else {
			selectedIds = manga.map((p) => p.id);
		}
	}

	function startEditing(post: (typeof manga)[0]) {
		editingId = post.id;
		newTitle = post.title;
	}

	function cancelEditing() {
		editingId = null;
	}
</script>

<svelte:head>
	<title>Manga Management</title>
</svelte:head>

<div class="container">
	<h1>Manga Post Management</h1>

	<div class="filter-bar">
		<!-- This form uses a standard GET request. SvelteKit automatically handles it -->
		<!-- by re-running `load` when the form is submitted. No custom JS needed. -->
		<form class="search-form" method="GET">
			<input
				type="search"
				name="search"
				placeholder="Search by title..."
				value={$page.url.searchParams.get('search') || ''}
			/>
			<select name="tag" on:change={(e) => e.currentTarget.form?.requestSubmit()}>
				<option value="">All Tags</option>
				{#each tags as tag}
					<option value={tag.id} selected={$page.url.searchParams.get('tag') === tag.id.toString()}>
						{tag.name}
					</option>
				{/each}
			</select>
			<button type="submit">Filter</button>
		</form>

		{#if selectedIds.length > 0}
			<!-- By just using `use:enhance`, SvelteKit automatically handles the form submission -->
			<!-- via JavaScript, runs the action, and reloads the data from `load` on success. -->
			<form method="POST" action="?/deleteSelected" use:enhance>
				<input type="hidden" name="selectedIds" value={selectedIds.join(',')} />
				<button type="submit" class="bulk-delete-btn">
					Delete Selected ({selectedIds.length})
				</button>
			</form>
		{/if}
	</div>

	<div class="table-container">
		<table>
			<thead>
				<tr>
					<th>
						<input
							type="checkbox"
							on:change={toggleSelectAll}
							checked={manga?.length > 0 && selectedIds.length === manga.length}
						/>
					</th>
					<th>Thumbnail</th>
					<th>Title</th>
					<th colspan="2" class="actions-header">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each manga as post (post.id)}
					<tr>
						<td><input type="checkbox" bind:group={selectedIds} value={post.id} /></td>
						<td>
							{#if post.feature_image_url}
								<img
									src={post.feature_image_url}
									alt="Cover for {post.title}"
									class="thumbnail"
									loading="lazy"
								/>
							{:else}
								<div class="thumbnail-placeholder">No Image</div>
							{/if}
						</td>
						<td class="title-cell">
							{#if editingId === post.id}
								<form method="POST" action="?/updatePost" use:enhance class="edit-form">
									<input type="hidden" name="id" value={post.id} />
									<input type="text" name="title" bind:value={newTitle} />
									<button type="submit">Save</button>
									<button type="button" class="cancel-btn" on:click={cancelEditing}>Cancel</button>
								</form>
							{:else}
								{post.title}
							{/if}
						</td>
						<td class="action-cell">
							<button class="edit-btn" on:click={() => startEditing(post)} disabled={editingId !== null}>
								Edit
							</button>
						</td>
						<td class="action-cell">
							<form method="POST" action="?/deletePost" use:enhance>
								<input type="hidden" name="id" value={post.id} />
								<button type="submit" class="delete-btn">Delete</button>
							</form>
						</td>
					</tr>
				{:else}
					<tr><td colspan="5" class="no-results">No manga posts found.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="pagination">
		<span class="total-count">Total Posts: {count}</span>
		<div class="page-controls">
			{#if data.page > 1}
				<a href="?page={data.page - 1}&{$page.url.searchParams.toString()}">« Previous</a>
			{/if}
			<span class="current-page">Page {data.page}</span>
			{#if data.page * data.limit < count}
				<a href="?page={data.page + 1}&{$page.url.searchParams.toString()}">Next »</a>
			{/if}
		</div>
	</div>
</div>

<!-- Styles are unchanged -->
<style>
	:root {
		--bg-primary: #1a1a1a;
		--bg-secondary: #242424;
		--bg-tertiary: #333333;
		--text-primary: #f0f0f0;
		--text-secondary: #b3b3b3;
		--border-color: #444;
		--accent-color: #6a8dff;
		--delete-color: #ff5252;
		--delete-hover: #ff1744;
	}
	.container {
		max-width: 1200px;
		margin: 2rem auto;
		padding: 1rem;
		color: var(--text-primary);
		background-color: var(--bg-primary);
	}
	h1 {
		color: var(--text-primary);
		margin-bottom: 1.5rem;
	}
	.filter-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
	}
	.search-form {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}
	input[type='search'],
	select,
	input[type='text'] {
		background-color: var(--bg-secondary);
		color: var(--text-primary);
		border: 1px solid var(--border-color);
		padding: 0.6rem 0.8rem;
		border-radius: 4px;
	}
	input:focus,
	select:focus {
		outline: none;
		border-color: var(--accent-color);
	}
	button {
		padding: 0.6rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		border: none;
		background-color: var(--accent-color);
		color: white;
		font-weight: 500;
		transition: background-color 0.2s ease;
	}
	button:hover {
		background-color: #5577ee;
	}
	button:disabled {
		background-color: var(--bg-tertiary);
		cursor: not-allowed;
	}
	.delete-btn,
	.bulk-delete-btn {
		background-color: var(--delete-color);
	}
	.delete-btn:hover,
	.bulk-delete-btn:hover {
		background-color: var(--delete-hover);
	}
	.cancel-btn,
	.edit-btn {
		background-color: var(--bg-tertiary);
	}
	.cancel-btn:hover,
	.edit-btn:hover {
		background-color: var(--border-color);
	}
	.table-container {
		overflow-x: auto;
		background-color: var(--bg-secondary);
		border-radius: 4px;
	}
	table {
		width: 100%;
		border-collapse: collapse;
	}
	th,
	td {
		padding: 1rem;
		text-align: left;
		border-bottom: 1px solid var(--border-color);
		vertical-align: middle;
	}
	th {
		background-color: var(--bg-tertiary);
		font-weight: 600;
	}
	tbody tr:hover {
		background-color: var(--bg-tertiary);
	}
	td.no-results {
		text-align: center;
		padding: 2rem;
		color: var(--text-secondary);
	}
	td.title-cell {
		min-width: 250px;
	}
	.actions-header {
		text-align: center;
	}
	td.action-cell {
		text-align: center;
		width: 80px;
	}
	.thumbnail {
		width: 50px;
		height: 70px;
		object-fit: cover;
		border-radius: 2px;
		background-color: var(--bg-tertiary);
	}
	.thumbnail-placeholder {
		width: 50px;
		height: 70px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--bg-tertiary);
		font-size: 0.7rem;
		color: var(--text-secondary);
		border-radius: 2px;
	}
	input[type='checkbox'] {
		width: 18px;
		height: 18px;
		accent-color: var(--accent-color);
	}
	.edit-form {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}
	.pagination {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1.5rem;
		color: var(--text-secondary);
	}
	.pagination a {
		color: var(--accent-color);
		text-decoration: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		transition: background-color 0.2s ease;
	}
	.pagination a:hover {
		background-color: var(--bg-secondary);
	}
	.page-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
</style>